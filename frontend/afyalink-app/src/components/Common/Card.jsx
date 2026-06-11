import React from 'react';

const Card = ({ children, className = '', hover = true, padding = 'md' }) => {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${hover ? 'hover:shadow-md transition-all' : ''} ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;