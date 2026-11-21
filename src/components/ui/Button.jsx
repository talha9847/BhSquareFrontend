import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary: "crm-btn--primary",
  secondary: "crm-btn--secondary",
  ghost: "crm-btn--ghost",
  danger: "crm-btn--danger",
  success: "crm-btn--success",
  warning: "crm-btn--warning",
  dark: "crm-btn--dark",
};

const SIZES = {
  sm: "crm-btn--sm",
  md: "",
  lg: "crm-btn--lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  block = false,
  loading = false,
  icon: Icon,
  trailingIcon: TrailingIcon,
  className = "",
  children,
  disabled,
  type = "button",
  ...rest
}) {
  return (
    <button
      type={type}
      className={[
        "crm-btn",
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        block ? "crm-btn--block" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <Loader2 className="crm-btn-spinner" size={16} aria-hidden="true" />
      ) : (
        Icon && <Icon size={16} aria-hidden="true" />
      )}
      {children && <span className="crm-btn-label">{children}</span>}
      {!loading && TrailingIcon && (
        <TrailingIcon size={16} aria-hidden="true" />
      )}
    </button>
  );
}

export function IconButton({
  icon: Icon,
  label,
  variant = "ghost",
  size = "md",
  className = "",
  disabled,
  type = "button",
  ...rest
}) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={[
        "crm-icon-button",
        `crm-icon-button--${variant}`,
        size === "sm" ? "crm-icon-button--sm" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled}
      {...rest}
    >
      <Icon size={size === "sm" ? 14 : 16} aria-hidden="true" />
    </button>
  );
}
