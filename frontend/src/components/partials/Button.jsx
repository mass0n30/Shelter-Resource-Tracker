


export default function Button({ children, variant = "primary", size = "md", className, ...props }) {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variantClasses = {
    primary: "z-1 bg-white text-foreground border rounded-lg px-3 py-1 shadow-sm hover:shadow-md transition",
    outline: "z-1 border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}