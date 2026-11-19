import React, { Suspense } from 'react';

export default function dynamic(loader) {
  const LazyComponent = React.lazy(loader);
  return function DynamicComponent(props) {
    return React.createElement(Suspense, { fallback: null }, React.createElement(LazyComponent, props));
  };
}
