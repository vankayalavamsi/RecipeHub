import { useSearchParams } from "react-router-dom";
import { searchRecipes } from "../services/recipeApi";
import { useRecipes } from "../hooks/useRecipes";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import RecipeCard from "../components/RecipeCard";
import Loading from "../components/Loading";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") || "";
  const filters = {
    cuisine: searchParams.get("cuisine") || "",
    diet: searchParams.get("diet") || "",
    time: searchParams.get("time") || "",
  };
  const hasActiveFilters = Boolean(filters.cuisine || filters.diet || filters.time);

  const { recipes, loading, error, reload } = useRecipes(
    () => searchRecipes(query, filters),
    [query, filters.cuisine, filters.diet, filters.time]
  );

  const handleFilterChange = (name, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(name, value);
    else next.delete(name);
    setSearchParams(next);
  };

  const clearFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("cuisine");
    next.delete("diet");
    next.delete("time");
    setSearchParams(next);
  };

  return (
    <main className="container section">
      <h1>Search Recipes</h1>
      <SearchBar key={query} initialValue={query} />

      <FilterBar
        filters={filters}
        onChange={handleFilterChange}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {loading && <Loading />}

      {error && (
        <div className="empty-state">
          <span className="empty-emoji">😕</span>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button className="btn" onClick={reload}>Try Again</button>
        </div>
      )}

      {!loading && !error && recipes.length === 0 && (
        <div className="empty-state">
          <span className="empty-emoji">🔎</span>
          <h2>No recipes found</h2>
          <p>
            {hasActiveFilters
              ? "Try removing a filter or searching for something else."
              : `Nothing matched “${query}”. Try searching for something else.`}
          </p>
          {hasActiveFilters && (
            <button className="btn" onClick={clearFilters}>Clear Filters</button>
          )}
        </div>
      )}

      {!loading && !error && recipes.length > 0 && (
        <>
          <p className="results-count">
            {recipes.length} recipe{recipes.length !== 1 && "s"} found
            {query && <> for “{query}”</>}
          </p>
          <div className="recipe-grid">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}