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

  const getSizeStyle = () => {
    switch (size) {
      case "small":
        return { padding: "0.5rem 1rem", fontSize: "0.875rem" };
      case "large":
        return { padding: "1rem 2rem", fontSize: "1.125rem" };
      default:
        return {};
    }
  };

  const buttonStyle = {
    ...getSizeStyle(),
    ...style,
    ...(loading && { cursor: "not-allowed", opacity: 0.7 })
  };

  const buttonClass = `${getVariantClass()} ${className}`.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClass}
      style={buttonStyle}
      {...props}
    >
      {loading && (
        <div
          style={{
            width: "1rem",
            height: "1rem",
            border: "2px solid transparent",
            borderTop: "2px solid currentColor",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginRight: "0.5rem"
          }}
        />
      )}
      {children}
    </button>
  );
}
