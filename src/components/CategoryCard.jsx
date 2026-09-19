import { Link } from "react-router-dom";

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/search?q=${encodeURIComponent(category.name)}`}
      className="category-card"
    >
      <span className="category-emoji">{category.emoji}</span>
      {category.name}
    </Link>
  );
}