export default function Button({
  children,
  variant = "primary",
  size = "normal",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  className = "",
  style = {},
  ...props
}) {
  const getVariantClass = () => {
    switch (variant) {
      case "secondary":
        return "btn-secondary";
      case "outline":
        return "btn-outline";
      case "danger":
        return "btn-danger";
      default:
        return "";
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case "small":
        return "btn-size-small";
      case "large":
        return "btn-size-large";
      default:
        return "";
    }
  };

  const buttonClass =
    `btn ${getVariantClass()} ${getSizeClass()} ${loading ? "btn-loading" : ""} ${className}`.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClass}
      style={style}
      {...props}
    >
      {loading && <div className="btn-loading-spinner" />}
      {children}
    </button>
  );
}
