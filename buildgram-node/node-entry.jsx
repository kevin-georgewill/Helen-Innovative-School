'use client';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppProviders from '../components/app/AppProviders.jsx';
import StudentShell from '../components/app/StudentShell.jsx';
import '../styles/tokens.css';
import '../styles/app.css';
import '../styles/get-app.css';

const appPages = import.meta.glob('../app/**/page.{js,jsx,ts,tsx}', { eager: true });
const schoolPages = import.meta.glob('../school-site/**/page.{js,jsx,ts,tsx}', { eager: true });
const schoolLayouts = import.meta.glob('../school-site/app/layout.{js,jsx,ts,tsx}', { eager: true });

function routeFor(file) {
  const relative = file.replace(/^(?:\.\.\/|\.\/)?(?:app|school-site\/app)\//, '').replace(/\/page\.(?:js|jsx|ts|tsx)$/, '');
  const segments = relative.split('/').filter((part) => !/^\([^)]*\)$/.test(part));
  if (!segments.length) return '/';
  return '/' + segments.map((part) => part.startsWith('[[...') ? '*' : part.startsWith('[...') ? '*' : part.replace(/^\[|\]$/g, '')).join('/');
}

const studentRoutes = ['/home', '/learn', '/lesson', '/tasks', '/quiz', '/bear', '/me', '/play', '/notifications'];
function isStudentRoute(path) {
  return studentRoutes.some((prefix) => path === prefix || path.startsWith(prefix + '/'));
}

function RouteView({ page: Page, student, chrome: Chrome }) {
  const content = <Page />;
  const withChrome = Chrome ? <Chrome>{content}</Chrome> : content;
  return student ? <StudentShell>{withChrome}</StudentShell> : withChrome;
}

function App() {
  const pageEntries = [...Object.entries(appPages), ...Object.entries(schoolPages)]
    .map(([file, module]) => ({ path: routeFor(file), Page: module.default, student: file.includes('/(student)/') }))
    .filter((entry) => typeof entry.Page === 'function')
    .filter((entry) => !entry.path.includes('*') || entry.path.endsWith('*'));
  const Chrome = schoolLayouts['../school-site/app/layout.js']?.default;
  return <Routes>{pageEntries.map(({ path, Page, student }) => <Route key={path} path={path} element={<RouteView page={Page} student={student || isStudentRoute(path)} chrome={Chrome} />} />)}<Route path="*" element={<Navigate to="/login" replace />} /></Routes>;
}

createRoot(document.getElementById('root')).render(<AppProviders><BrowserRouter><App /></BrowserRouter></AppProviders>);
