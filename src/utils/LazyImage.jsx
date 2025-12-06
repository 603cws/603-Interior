import { useState } from "react";

const LazyImage = ({
  src,
  alt,
  className = "",
  fallback = "/images/fallback.png",
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full">
      {loading && !error && (
        <div className="absolute inset-0 bg-gray-300 rounded"></div>
      )}
      <img
        src={error ? fallback : src}
        alt={alt}
        className={`${className} ${
          loading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
    </div>
  );
};

export default LazyImage;
