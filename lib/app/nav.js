'use client';
import { forwardRef, useMemo } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { schoolsTarget, withoutSchools } from './paths.js';

export const Link = forwardRef(function SchoolsLink({ href, ...rest }, ref) {
  return <RouterLink ref={ref} to={schoolsTarget(href)} {...rest} />;
});

export function useRouter() {
  const navigate = useNavigate();
  return useMemo(() => ({
    push: (href) => navigate(schoolsTarget(href)),
    replace: (href) => navigate(schoolsTarget(href), { replace: true }),
    prefetch: () => {},
    back: () => navigate(-1),
    refresh: () => window.location.reload(),
  }), [navigate]);
}

export function usePathname() {
  return withoutSchools(useLocation().pathname);
}
