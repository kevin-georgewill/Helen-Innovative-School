import express from 'express';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(root, '.env.local') });
const app = express();
const PORT = Number(process.env.PORT) || 3000;
const BEARILLY_URL = process.env.BEARILLY_URL || '';
const BEARILLY_API_KEY = process.env.BEARILLY_API_KEY || '';
const COOKIE_OPTIONS = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' };
const SESSION_COOKIE = 'bearilly_session';
const SCHOOL_COOKIE = 'bearilly_school_id';
const EXPIRES_COOKIE = 'bearilly_session_exp';
const BLOCKED = ['/api/v1/billing', '/api/v1/integration', '/api/v1/connect'];

app.disable('x-powered-by');
app.set('trust proxy', true);
app.use(express.raw({ type: '*/*', limit: '25mb' }));

function cookies(req) {
  return Object.fromEntries(String(req.headers.cookie || '').split(';').map((part) => {
    const index = part.indexOf('=');
    if (index < 0) return ['', ''];
    const key = part.slice(0, index).trim();
    try { return [key, decodeURIComponent(part.slice(index + 1).trim())]; } catch { return [key, '']; }
  }).filter(([key]) => key));
}

function setSession(res, data, schoolId) {
  const expires = new Date(data.expires_at || Date.now() + 14 * 60_000).getTime();
  const maxAge = Math.max(60, Math.floor((new Date(data.session_expires_at || data.expires_at || Date.now() + 14 * 60_000).getTime() - Date.now()) / 1000));
  for (const [name, value] of [[SESSION_COOKIE, data.token], [SCHOOL_COOKIE, schoolId], [EXPIRES_COOKIE, String(expires)]]) {
    res.cookie(name, value, { ...COOKIE_OPTIONS, maxAge: maxAge * 1000 });
  }
}

function clearSession(res) {
  for (const name of [SESSION_COOKIE, SCHOOL_COOKIE, EXPIRES_COOKIE]) res.clearCookie(name, COOKIE_OPTIONS);
}

function bearillyBase(req) {
  const base = new URL(BEARILLY_URL);
  const labels = base.hostname.split('.');
  if (base.hostname.endsWith('.vercel.app') && labels.length >= 4) base.hostname = labels.slice(1).join('.');
  if (base.hostname.toLowerCase().replace(/^www\./, '') === req.hostname.toLowerCase().replace(/^www\./, '')) throw new Error('BEARILLY_URL points to this website.');
  return base;
}

app.post('/api/bearilly-login', async (req, res) => {
  let credentials;
  try { credentials = JSON.parse(Buffer.from(req.body || '').toString('utf8')); } catch { credentials = null; }
  const { email, password } = credentials || {};
  if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) return res.status(400).json({ error: 'Enter your email and password.' });
  if (!BEARILLY_URL || !BEARILLY_API_KEY) return res.status(500).json({ error: 'Bearilly server configuration is missing.' });
  try {
    const base = bearillyBase(req);
    const upstream = await fetch(new URL('/api/v1/integration/session', base), { method: 'POST', headers: { 'x-bearilly-key': BEARILLY_API_KEY, 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ email: email.trim(), password }) });
    const result = await upstream.json().catch(() => null);
    if (!upstream.ok || !result?.data?.token || !result.data.school_id) return res.status(upstream.status || 502).json({ error: result?.error?.message || 'Email or password is incorrect.' });
    if (result.data.role !== 'student') return res.status(403).json({ error: { code: 'STAFF_USE_BEARILLY', message: 'Teachers and school admins sign in on the staff website.', url: new URL('/login', base).toString() } });
    setSession(res, result.data, result.data.school_id);
    return res.json({ data: { ok: true, role: result.data.role } });
  } catch (error) {
    console.error('[bearilly-login] could not sign in:', error);
    return res.status(502).json({ error: 'Could not sign you in. Please try again.' });
  }
});

app.delete('/api/bearilly-login', (req, res) => { clearSession(res); res.json({ data: { ok: true } }); });
app.put('/api/bearilly-login', async (req, res) => {
  const stored = cookies(req);
  if (!stored[SESSION_COOKIE] || !stored[SCHOOL_COOKIE]) return res.status(401).json({ error: 'Please sign in again.' });
  try {
    const base = bearillyBase(req);
    const response = await fetch(new URL('/api/v1/integration/session/renew', base), { method: 'POST', headers: { 'x-bearilly-session': stored[SESSION_COOKIE], 'x-bearilly-origin-school': stored[SCHOOL_COOKIE], 'x-bearilly-host': req.hostname, 'Content-Type': 'application/json', Accept: 'application/json' }, body: '{}' });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.data?.token) {
      if (response.status === 401 || response.status === 403) clearSession(res);
      return res.status(response.status === 401 || response.status === 403 ? 401 : 502).json({ error: 'Could not refresh your sign-in. Please try again.' });
    }
    setSession(res, result.data, stored[SCHOOL_COOKIE]);
    return res.json({ data: { ok: true } });
  } catch (error) {
    console.error('[bearilly-login] could not renew the session:', error);
    return res.status(502).json({ error: 'Could not refresh your sign-in. Please try again.' });
  }
});

app.use('/api/v1', async (req, res) => {
  const pathname = req.originalUrl.split('?')[0];
  if (BLOCKED.some((prefix) => pathname === prefix || pathname.startsWith(prefix + '/'))) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Not found' } });
  if (!BEARILLY_URL) return res.status(500).json({ error: { code: 'NOT_CONFIGURED', message: 'This website is not connected to its learning service yet.' } });
  let base;
  try { base = bearillyBase(req); } catch (error) { console.error('[bearilly-proxy]', error); return res.status(500).json({ error: { code: 'NOT_CONFIGURED', message: 'This website is not connected correctly.' } }); }
  const publicTenant = req.method === 'GET' && pathname === '/api/v1/tenant';
  const publicCertificate = req.method === 'GET' && /^\/api\/v1\/certificates\/verify\/[^/]+$/.test(pathname);
  const publicRegistration = req.method === 'POST' && ['/api/v1/auth/register', '/api/v1/auth/forgot-password', '/api/v1/auth/reset-password'].includes(pathname);
  const url = new URL(req.originalUrl, base);
  const headers = new Headers({ Accept: 'application/json' });
  const stored = cookies(req);
  let token = stored[SESSION_COOKIE];
  let schoolId = stored[SCHOOL_COOKIE];
  let fresh = null;
  if (publicTenant || publicCertificate) {
    headers.set('x-bearilly-host', req.hostname);
    if (publicTenant) url.searchParams.set('host', req.hostname);
  } else if (publicRegistration) {
    const tenantUrl = new URL('/api/v1/tenant', base);
    tenantUrl.searchParams.set('host', req.hostname);
    const tenantResponse = await fetch(tenantUrl, { headers: { Accept: 'application/json', 'x-bearilly-host': req.hostname } });
    const tenant = await tenantResponse.json().catch(() => null);
    if (!tenantResponse.ok || !tenant?.data?.school?.id) return res.status(403).json({ error: { code: 'ORIGIN_NOT_VERIFIED', message: 'This website is not verified for student sign-up.' } });
    headers.set('x-bearilly-origin-school', tenant.data.school.id);
    headers.set('x-bearilly-host', req.hostname);
  } else {
    if (!token || !schoolId) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Sign in with your school account first.' } });
    const expires = Number(stored[EXPIRES_COOKIE]);
    if (!Number.isFinite(expires) || expires - Date.now() < 5 * 60_000) {
      try {
        const renewed = await fetch(new URL('/api/v1/integration/session/renew', base), { method: 'POST', headers: { 'x-bearilly-session': token, 'x-bearilly-origin-school': schoolId, 'x-bearilly-host': req.hostname, 'Content-Type': 'application/json', Accept: 'application/json' }, body: '{}' });
        const result = await renewed.json().catch(() => null);
        if (renewed.ok && result?.data?.token) { fresh = result.data; token = fresh.token; }
        else if (renewed.status === 401 || renewed.status === 403) { clearSession(res); return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Please sign in again.' } }); }
      } catch (error) { console.error('[bearilly-proxy] session renewal failed:', error); }
    }
    headers.set('x-bearilly-session', token);
    headers.set('x-bearilly-origin-school', schoolId);
    headers.set('x-bearilly-host', req.hostname);
  }
  if (req.headers['content-type']) headers.set('content-type', req.headers['content-type']);
  const init = { method: req.method, headers, ...(req.method === 'GET' || req.method === 'HEAD' ? {} : { body: req.body || Buffer.alloc(0) }) };
  try {
    const upstream = await fetch(url, init);
    const body = Buffer.from(await upstream.arrayBuffer());
    res.status(upstream.status);
    res.set('Content-Type', upstream.headers.get('content-type') || 'application/json');
    res.set('Cache-Control', 'no-store');
    const disposition = upstream.headers.get('content-disposition');
    if (disposition) res.set('Content-Disposition', disposition);
    if (fresh) setSession(res, fresh, schoolId);
    return res.send(body);
  } catch (error) {
    console.error('[bearilly-proxy] request failed:', error);
    return res.status(502).json({ error: { code: 'NETWORK', message: 'Could not reach the server. Please try again.' } });
  }
});

if (process.env.NODE_ENV === 'production') {
  const dist = path.join(root, 'dist');
  app.use(express.static(path.join(root, 'public')));
  app.use(express.static(dist, { index: false }));
  app.get('*splat', (req, res) => res.sendFile(path.join(dist, 'index.html')));
  app.listen(PORT, () => console.log(`Buildgram Node website listening on port ${PORT}`));
} else {
  const vite = await createViteServer({ configFile: path.join(root, 'buildgram-node/vite.config.mjs'), server: { middlewareMode: true }, appType: 'spa' });
  app.use(express.static(path.join(root, 'public')));
  app.use(vite.middlewares);
  app.listen(PORT, () => console.log(`Buildgram Node website listening on port ${PORT}`));
}
