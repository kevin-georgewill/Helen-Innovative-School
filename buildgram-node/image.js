import React from 'react';

export default function ImageCompat({ priority, ...props }) {
  return React.createElement('img', props);
}
