import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import RecipeCard from "../components/RecipeCard";

export default function Favorites() {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <main className="container section empty-state">
        <span className="empty-emoji">❤️</span>
        <h1>No favorites yet</h1>
        <p>Save recipes you love and they'll appear here.</p>
        <Link to="/" className="btn">Browse Recipes</Link>
      </main>
    );
  }

  return (
    <main className="container section">
      <h1>My Favorites ❤️</h1>
      <p className="results-count">
        {favorites.length} saved recipe{favorites.length !== 1 && "s"}
      </p>
      <div className="recipe-grid">
        {favorites.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </main>
  );
}