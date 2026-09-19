import { useEffect, useState } from "react";
import { getRecipeById } from "../services/recipeApi";

export function useRecipes(fetcher, deps = []) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetcher()
      .then((data) => { if (active) setRecipes(data); })
      .catch((err) => { if (active) setError(err.message || "Something went wrong"); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [...deps, tick]);

  return { recipes, loading, error, reload: () => setTick((t) => t + 1) };
}

export function useRecipe(id) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    getRecipeById(id)
      .then((data) => { if (active) setRecipe(data); })
      .catch((err) => { if (active) setError(err.message || "Something went wrong"); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [id]);

  return { recipe, loading, error };
}