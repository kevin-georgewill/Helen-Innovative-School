'use client';
export { useParams } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';

export function usePathname() {
  return useLocation().pathname;
}

export function useRouter() {
  const navigate = useNavigate();
  return {
    push: (href) => navigate(href),
    replace: (href) => navigate(href, { replace: true }),
    back: () => navigate(-1),
    refresh: () => window.location.reload(),
  };
}

export function notFound() {
  throw new Error('Page not found');
}

export function redirect(path) {
  window.location.replace(path);
  return null;
}

export const permanentRedirect = redirect;
export function useSearchParams() {
  return new URLSearchParams(useLocation().search);
}
