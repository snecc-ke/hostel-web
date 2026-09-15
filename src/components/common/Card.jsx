import React from 'react';

function Card({ children, className = '', hover = false, padding = 'p-6' }) {
  return (
    <div className={`
      bg-white rounded-xl shadow-sm border border-slate-200
      ${hover ? 'hover:shadow-md transition-shadow cursor-pointer' : ''}
      ${padding}
      ${className}
    `}>
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className = '' }) {
  return (
    <div className={`pb-4 mb-4 border-b border-slate-200 ${className}`}>
      {children}
    </div>
  );
};

Card.Body = function CardBody({ children, className = '' }) {
  return <div className={className}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div className={`pt-4 mt-4 border-t border-slate-200 ${className}`}>
      {children}
    </div>
  );
};

export default Card;