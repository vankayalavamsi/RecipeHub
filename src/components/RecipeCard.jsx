import { Link } from "react-router-dom";
import { Heart, Clock } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import Rating from "./Rating";

export default function RecipeCard({ recipe }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(recipe.id);

  return (
    <article className="recipe-card">
      <Link to={`/recipe/${recipe.id}`} className="recipe-card-image">
        {recipe.image ? (
          <img src={recipe.image} alt={recipe.name} />
        ) : (
          <div className="recipe-card-emoji">{recipe.emoji}</div>
        )}
      </Link>

      <button
        className={"heart-btn" + (fav ? " active" : "")}
        onClick={() => toggleFavorite(recipe)}
        aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart size={18} fill={fav ? "currentColor" : "none"} />
      </button>

      <div className="recipe-card-body">
        <h3>
          <Link to={`/recipe/${recipe.id}`}>{recipe.name}</Link>
        </h3>
        <div className="recipe-card-meta">
          <Rating value={recipe.rating} />
          <span>
            <Clock size={14} /> {recipe.cookTime} min
          </span>
        </div>
        <p className="recipe-card-tags">
          {recipe.cuisine} • {recipe.mealType}
        </p>
      </div>
    </article>
  );
}