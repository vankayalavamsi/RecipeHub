import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChefHat, Clock, Heart, Users } from "lucide-react";
import { useRecipe } from "../hooks/useRecipes";
import { useFavorites } from "../context/FavoritesContext";
import Rating from "../components/Rating";
import Loading from "../components/Loading";

export default function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipe, loading, error } = useRecipe(id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [checkedIngredients, setCheckedIngredients] = useState({});

  const goBack = () => {

    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const toggleIngredient = (index) => {
    setCheckedIngredients((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (loading) return <Loading message="Loading recipe..." />;

  if (error || !recipe) {
    return (
      <main className="container section empty-state">
        <span className="empty-emoji">🍽️</span>
        <h1>Recipe not found</h1>
        <p>{error || "This recipe may have been removed."}</p>
        <button className="btn" onClick={goBack}>← Go Back</button>
      </main>
    );
  }

  const fav = isFavorite(recipe.id);
  const checkedCount = Object.values(checkedIngredients).filter(Boolean).length;

  return (
    <main className="container section">
      <button className="back-btn" onClick={goBack}>
        <ArrowLeft size={18} /> Back
      </button>

      <div className="details-layout">
        <div className="details-image">
          {recipe.image ? (
            <img src={recipe.image} alt={recipe.name} />
          ) : (
            <div className="details-emoji">{recipe.emoji}</div>
          )}
        </div>

        <div className="details-info">
          <div className="details-title">
            <h1>{recipe.name}</h1>
            <button
              className={"heart-btn large" + (fav ? " active" : "")}
              onClick={() => toggleFavorite(recipe)}
              aria-label={fav ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart size={22} fill={fav ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="details-meta">
            <Rating value={recipe.rating} size={16} />
            <span><Clock size={16} /> {recipe.cookTime} min</span>
            <span><Users size={16} /> {recipe.servings} servings</span>
            <span><ChefHat size={16} /> {recipe.difficulty}</span>
          </div>

          <div className="details-badges">
            <span className="badge">{recipe.cuisine}</span>
            <span className="badge">{recipe.mealType}</span>
            {recipe.diet.map((d) => (
              <span key={d} className="badge badge-green">{d}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="details-sections">
        <section>
          <h2>
            Ingredients
            <span className="ingredient-progress">
              {checkedCount}/{recipe.ingredients.length} ready
            </span>
          </h2>
          <ul className="ingredients-list">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                <label className={"ingredient-item" + (checkedIngredients[index] ? " checked" : "")}>
                  <input
                    type="checkbox"
                    checked={Boolean(checkedIngredients[index])}
                    onChange={() => toggleIngredient(index)}
                  />
                  <span className="ingredient-name">{ingredient.name}</span>
                  <span className="ingredient-amount">{ingredient.amount}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Cooking Instructions</h2>
          <ol className="instructions-list">
            {recipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}