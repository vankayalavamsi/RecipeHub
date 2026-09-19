import { getExploreSections } from "../services/recipeApi";
import { useRecipes } from "../hooks/useRecipes";
import RecipeCard from "../components/RecipeCard";
import Loading from "../components/Loading";

const SECTIONS = [
  { key: "trending", title: "🔥 Trending Today" },
  { key: "quick", title: "⚡ Quick & Easy" },
  { key: "healthy", title: "🥗 Healthy Recipes" },
  { key: "indian", title: "🌶️ Indian Favorites" },
  { key: "sweets", title: "🍰 Sweet Treats" },
];

export default function Explore() {
  const { recipes: sections, loading, error, reload } = useRecipes(getExploreSections);

  return (
    <main className="container section">
      <h1>Explore Recipes</h1>
      <p className="results-count">Handpicked collections for every mood.</p>

      {loading && <Loading />}

      {error && (
        <div className="empty-state">
          <span className="empty-emoji">😕</span>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button className="btn" onClick={reload}>Try Again</button>
        </div>
      )}

      {!loading && !error &&
        SECTIONS.map(({ key, title }) => {
          const sectionRecipes = sections[key];
          if (!sectionRecipes || sectionRecipes.length === 0) return null;

          return (
            <section key={key} className="explore-section">
              <h2>{title}</h2>
              <div className="card-row">
                {sectionRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </section>
          );
        })}
    </main>
  );
}