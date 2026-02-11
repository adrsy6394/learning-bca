import React from "react";

// Reusable button with variant support
export default function Button({
  children,
  variant = "default", // style variant: "default" or "outline"
  className = "", // additional classes from parent
  ...props
}) {
  // common base styles for all variants
  const baseClasses =
    "px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";

  // variant-specific styles
  const variants = {
    default:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    outline:
      "border border-white text-white hover:bg-white hover:text-indigo-600 focus:ring-white",
  };

  // merge base, variant, and any extra classes
  const combinedClasses = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    // spread other props (e.g., onClick, disabled)
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
