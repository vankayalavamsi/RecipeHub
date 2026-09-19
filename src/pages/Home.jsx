import { Link } from "react-router-dom";
import { getPopularRecipes } from "../services/recipeApi";
import { useRecipes } from "../hooks/useRecipes";
import { categories } from "../data/categories";
import SearchBar from "../components/SearchBar";
import RecipeCard from "../components/RecipeCard";
import CategoryCard from "../components/CategoryCard";
import Loading from "../components/Loading";

const POPULAR_SEARCHES = ["Chicken", "Pasta", "Pizza", "Cake"];

export default function Home() {
  const { recipes, loading, error, reload } = useRecipes(getPopularRecipes);

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>
            Cook Something <span className="highlight">Amazing</span> Today
          </h1>
          <p>Discover recipes made for every craving.</p>
          <SearchBar placeholder="What do you want to cook?" />
          <div className="hero-popular">
            <span>Popular:</span>
            {POPULAR_SEARCHES.map((term) => (
              <Link key={term} to={`/search?q=${encodeURIComponent(term)}`}>
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container section">
        <h2>Browse Categories</h2>
        <div className="category-grid">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="container section">
        <h2>🔥 Popular Recipes</h2>

        {loading && <Loading />}

        {error && (
          <div className="empty-state">
            <span className="empty-emoji">😕</span>
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <button className="btn" onClick={reload}>Try Again</button>
          </div>
        )}

        {!loading && !error && (
          <div className="recipe-grid">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}