export default function FullPageLoader() {
  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
      style={{ transition: "opacity 0.1s ease-in-out" }}
    >
      <div className="animate-slow-pulse">
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          className="animate-spin-slow"
          // Ensure the SVG is centered in its container for the rotation effect
          style={{ display: "block", margin: "auto" }}
        >
          <defs>
            <linearGradient
              id="loaderGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="45"
            strokeWidth="10"
            stroke="url(#loaderGradient)"
            fill="none"
            strokeDasharray="25"
          />
        </svg>
      </div>
    </div>
  );
}
