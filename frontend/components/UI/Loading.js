export default function Loading({ message = "Loading...", size = "normal" }) {
  const spinnerSize = size === "small" ? "1rem" : size === "large" ? "3rem" : "2rem";
  const textSize = size === "small" ? "0.875rem" : size === "large" ? "1.25rem" : "1rem";

  return (
    <div className="loading" style={{ padding: size === "small" ? "1rem" : "2rem" }}>
      <div
        className="loading-spinner"
        style={{
          width: spinnerSize,
          height: spinnerSize,
          marginRight: "1rem"
        }}
      ></div>
      <span style={{ fontSize: textSize, color: "#6c757d" }}>
        {message}
      </span>
    </div>
  );
}
