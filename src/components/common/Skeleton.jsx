import React from 'react';

function Skeleton({ className = '', variant = 'text' }) {
  const variants = {
    text: 'h-4 rounded',
    title: 'h-6 rounded',
    avatar: 'rounded-full',
    card: 'rounded-xl',
    image: 'rounded-lg',
  };

  return (
    <div className={`
      bg-slate-200 animate-pulse
      ${variants[variant]}
      ${className}
    `} />
  );
}

export default Skeleton;