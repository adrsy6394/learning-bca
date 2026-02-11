import React from 'react';

// Simple card container with padding, shadow, and rounded corners
export function Card({ children, className = '', ...props }) {
  return (
    <div className={`bg-white rounded-xl shadow p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

// Header section inside the card, usually for title or top content
export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

// Title element for the card, styled as a heading
export function CardTitle({ children, className = '', ...props }) {
  return (
    <h3 className={`text-lg font-semibold ${className}`} {...props}>
      {children}
    </h3>
  );
}

// Subtitle or description text under the title
export function CardDescription({ children, className = '', ...props }) {
  return (
    <p className={`text-sm text-gray-500 ${className}`} {...props}>
      {children}
    </p>
  );
}

// Main content area of the card
export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
