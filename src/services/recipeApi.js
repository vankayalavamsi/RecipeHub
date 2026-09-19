import { recipes } from "../data/recipes";
const API = "https://www.themealdb.com/api/json/v1/1";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const TIME_RANGES = {
  "under-15": (t) => t < 15,
  "15-30": (t) => t >= 15 && t <= 30,
  "30-60": (t) => t > 30 && t <= 60,
  "60-plus": (t) => t > 60,
};

const MEAT_WORDS = [
  "chicken", "beef", "pork", "lamb", "goat", "mutton", "fish", "salmon",
  "tuna", "shrimp", "prawn", "crab", "lobster", "bacon", "sausage", "ham",
  "turkey", "duck", "anchovy", "sardine", "chorizo", "steak", "mince",
];
const DAIRY_WORDS = [
  "milk", "butter", "cheese", "cream", "yogurt", "yoghurt", "ghee",
  "honey", "egg", "mayonnaise",
];
const GLUTEN_WORDS = [
  "flour", "wheat", "bread", "pasta", "noodle", "soy sauce", "barley",
  "rye", "breadcrumb", "tortilla",
];

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("API request failed");
  return res.json();
}

function hasWord(text, word) {
  return new RegExp(`\\b${word}\\b`).test(text);
}

function hashId(id) {
  const s = String(id);
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

function inferDiet(ingredients) {
  const names = ingredients.map((i) => i.name.toLowerCase()).join(" ");
  const hasMeat = MEAT_WORDS.some((w) => hasWord(names, w));
  const hasAnimal = hasMeat || DAIRY_WORDS.some((w) => hasWord(names, w));
  const hasGluten = GLUTEN_WORDS.some((w) => hasWord(names, w));

  const diet = [];
  if (!hasMeat) diet.push("Vegetarian");
  if (!hasAnimal) diet.push("Vegan");
  if (!hasGluten) diet.push("Gluten Free");
  return diet;
}

const CATEGORY_MAP = {
  Breakfast: "Breakfast",
  Dessert: "Dessert",
  Side: "Snack",
  Starter: "Snack",
};

function mealTypeFromCategory(category) {
  return CATEGORY_MAP[category] || "Main";
}

function splitSteps(text) {
  if (!text) return [];
  let steps = text
    .split(/\r?\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3);
  if (steps.length <= 1) {
    steps = (steps[0] || text)
      .match(/[^.!?\n]+[.!?]+/g)
      ?.map((s) => s.trim())
      .filter((s) => s.length > 3) || [];
  }
  return steps;
}
function mapMeal(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const name = (meal[`strIngredient${i}`] || "").trim();
    if (!name) continue;
    const amount = (meal[`strMeasure${i}`] || "").trim();
    ingredients.push({ name, amount: amount || "as needed" });
  }

  const tags = (meal.strTags || "")
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  const h = hashId(meal.idMeal);
  const cookTime = [15, 20, 25, 30, 35, 40, 45, 50, 60][h % 9];

  return {
    id: String(meal.idMeal),
    name: meal.strMeal,
    emoji: "🍽️",
    image: meal.strMealThumb || "",
    rating: Math.round((4.2 + (h % 8) / 10) * 10) / 10,
    cookTime,
    servings: 2 + (h % 4),
    difficulty: cookTime < 25 ? "Easy" : cookTime < 45 ? "Medium" : "Hard",
    cuisine: meal.strArea || "International",
    mealType: mealTypeFromCategory(meal.strCategory),
    diet: inferDiet(ingredients),
    tags: [...tags, (meal.strCategory || "").toLowerCase()].filter(Boolean),
    ingredients,
    instructions: splitSteps(meal.strInstructions),
  };
}

function applyFilters(list, filters) {
  let results = list;
  if (filters.cuisine) {
    results = results.filter((r) => r.cuisine === filters.cuisine);
  }
  if (filters.diet) {
    results = results.filter((r) => r.diet.includes(filters.diet));
  }
  if (filters.time && TIME_RANGES[filters.time]) {
    results = results.filter((r) => TIME_RANGES[filters.time](r.cookTime));
  }
  return results;
}

function searchLocal(q) {
  const query = q.toLowerCase();
  return recipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(query) ||
      recipe.cuisine.toLowerCase().includes(query) ||
      recipe.mealType.toLowerCase().includes(query) ||
      recipe.tags.some((tag) => tag.includes(query)) ||
      recipe.ingredients.some((ing) => ing.name.toLowerCase().includes(query))
  );
}

export async function getPopularRecipes() {
  try {
    const batches = await Promise.all(
      ["chicken", "pasta", "cake", "curry"].map((term) =>
        fetchJson(`${API}/search.php?s=${term}`)
          .then((d) => (d.meals || []).slice(0, 2).map(mapMeal))
          .catch(() => [])
      )
    );
    const seen = new Set();
    const results = [];
    for (const r of batches.flat()) {
      if (!seen.has(r.id)) {
        seen.add(r.id);
        results.push(r);
      }
    }
    if (results.length >= 4) return results;
  } catch {
  }
  return [...recipes].sort((a, b) => b.rating - a.rating);
}

export async function searchRecipes(query, filters = {}) {
  await delay(200);
  const q = query.trim();
  let results;

  if (q) {
    try {
      const data = await fetchJson(
        `${API}/search.php?s=${encodeURIComponent(q)}`
      );
      results = (data.meals || []).map(mapMeal);
    } catch {
  
      results = searchLocal(q);
    }
  } else if (filters.cuisine) {
  
    try {
      const data = await fetchJson(
        `${API}/filter.php?a=${encodeURIComponent(filters.cuisine)}`
      );
      const stubs = (data.meals || []).slice(0, 12);
      const detailed = await Promise.all(
        stubs.map((stub) =>
          fetchJson(`${API}/lookup.php?i=${stub.idMeal}`)
            .then((d) => d.meals && d.meals[0])
            .catch(() => null)
        )
      );
      results = detailed.filter(Boolean).map(mapMeal);
    } catch {
      results = recipes.filter((r) => r.cuisine === filters.cuisine);
    }
  } else {
    results = [...recipes];
  }

  return applyFilters(results, filters);
}

export async function getRecipeById(id) {
  const local = recipes.find((r) => r.id === id);
  if (local) return local;

  try {
    const data = await fetchJson(`${API}/lookup.php?i=${id}`);
    return data.meals ? mapMeal(data.meals[0]) : null;
  } catch {
    return null;
  }
}

export async function getExploreSections() {
  await delay(600);

  const byRating = [...recipes].sort((a, b) => b.rating - a.rating);

  return {
    trending: byRating.slice(0, 4),
    quick: recipes
      .filter((r) => r.cookTime <= 30)
      .sort((a, b) => a.cookTime - b.cookTime),
    healthy: recipes.filter(
      (r) =>
        r.tags.includes("healthy") ||
        r.diet.includes("Vegetarian") ||
        r.diet.includes("Vegan")
    ),
    indian: recipes.filter((r) => r.cuisine === "Indian"),
    sweets: recipes.filter(
      (r) =>
        r.mealType === "Dessert" ||
        r.tags.includes("sweet") ||
        r.tags.includes("baking")
    ),
  };
}