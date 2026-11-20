import React, { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';

export default forwardRef(function NextLinkCompat({ href, ...props }, ref) {
  return React.createElement(RouterLink, { ...props, ref, to: href });
});
