export default function Loading({ message = "Loading...", size = "normal" }) {
  const getSizeClass = () => {
    switch (size) {
      case "small":
        return "loading-small";
      case "large":
        return "loading-large";
      default:
        return "";
    }
  };

  const getTextSizeClass = () => {
    switch (size) {
      case "small":
        return "loading-text-small";
      case "large":
        return "loading-text-large";
      default:
        return "loading-text-normal";
    }
  };

  return (
    <div className={`loading ${getSizeClass()}`}>
      <div className="loading-spinner"></div>
      <span className={getTextSizeClass()}>{message}</span>
    </div>
  );
}
