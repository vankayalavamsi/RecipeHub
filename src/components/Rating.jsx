import { Star } from "lucide-react";

export default function Rating({ value, size = 14, showValue = true }) {
  const percent = Math.min(100, Math.max(0, (value / 5) * 100));
  const stars = Array.from({ length: 5 }, (_, i) => (
    <Star key={i} size={size} fill="currentColor" />
  ));

  return (
    <span className="rating" role="img" aria-label={`Rated ${value} out of 5`}>
      <span className="rating-stars">
        <span className="rating-stars-bg">{stars}</span>
        <span className="rating-stars-fill" style={{ width: `${percent}%` }}>
          {stars}
        </span>
      </span>
      {showValue && <span className="rating-value">{Number(value).toFixed(1)}</span>}
    </span>
  );
}