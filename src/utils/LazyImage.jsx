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
    <div className={`relative ${className}`}>
      {loading && !error && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse rounded"></div>
      )}
      <img
        src={error ? fallback : src}
        alt={alt}
        className={`w-full h-full object-cover ${
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
