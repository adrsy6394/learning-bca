// src/components/ui/input.jsx
import React from "react";
import clsx from "clsx";

// Reusable input with forwarded ref and combined utility classes
const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref} // allow parent to access DOM node
      className={clsx(
        // base styles: full width, rounded, border, padding, shadow, handle dark mode text
        "w-full rounded-md border border-gray-400 bg-white px-3 py-2 text-sm dark:text-gray-500 shadow-md",
        // placeholder styling and focus ring/border
        "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        className // allow overriding/extension from caller
      )}
      {...props} // spread remaining input props (type, value, onChange, etc.)
    />
  );
});

Input.displayName = "Input";

export default Input;
