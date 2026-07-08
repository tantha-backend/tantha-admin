import { Loader2 } from "lucide-react";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = "",
  ...props
}) => {
  const variants = {
    primary: "bg-pink-600 hover:bg-pink-500 text-white",
    secondary:
      "border border-zinc-800 bg-zinc-950 text-white hover:border-pink-500 hover:text-pink-400",
    danger: "border border-red-500/20 text-red-400 hover:bg-red-500/10",
    ghost: "text-zinc-400 hover:bg-zinc-900 hover:text-white",
    outline:
      "border border-zinc-800 bg-transparent text-white hover:border-zinc-600",
    success: "bg-green-600 text-white hover:bg-green-500",
  };

  const sizes = {
    sm: "h-9 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-5 text-base",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
        variants[variant] || variants.primary
      } ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
};

export default Button;
