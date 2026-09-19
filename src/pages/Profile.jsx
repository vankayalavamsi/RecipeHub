import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";

const PREFERENCE_OPTIONS = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "indian", label: "Indian cuisine" },
  { id: "quick", label: "Under 30 minutes" },
];

export default function Profile() {
  const { favorites, clearFavorites } = useFavorites();

  const [name, setName] = useState(
    () => localStorage.getItem("profileName") || "Home Chef"
  );
  const [preferences, setPreferences] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("preferences")) || {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("profileName", name);
  }, [name]);

  useEffect(() => {
    localStorage.setItem("preferences", JSON.stringify(preferences));
  }, [preferences]);

  const cuisineCounts = {};
  favorites.forEach((r) => {
    cuisineCounts[r.cuisine] = (cuisineCounts[r.cuisine] || 0) + 1;
  });
  const topCuisine =
    Object.entries(cuisineCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  const handleClearFavorites = () => {
    if (favorites.length === 0) return;
    if (window.confirm(`Remove all ${favorites.length} saved recipes?`)) {
      clearFavorites();
    }
  };

  const handleReset = () => {
    setName("Home Chef");
    setPreferences({});
  };

  const initial = name.trim().charAt(0).toUpperCase() || "🍳";

  return (
    <main className="container section">
      <h1>Profile</h1>

      <div className="profile-header">
        <div className="profile-avatar">{initial}</div>
        <div>
          <input
            className="profile-name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Your name"
            maxLength={30}
          />
          <p className="profile-sub">Home cook • RecipeHub local profile</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{favorites.length}</div>
          <div className="stat-label">Saved Recipes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{Object.keys(cuisineCounts).length}</div>
          <div className="stat-label">Cuisines Explored</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{topCuisine}</div>
          <div className="stat-label">Top Cuisine</div>
        </div>
      </div>

      <div className="profile-section">
        <h2>Preferences</h2>
        {PREFERENCE_OPTIONS.map(({ id, label }) => (
          <label key={id} className="preference-item">
            <input
              type="checkbox"
              checked={Boolean(preferences[id])}
              onChange={() =>
                setPreferences((prev) => ({ ...prev, [id]: !prev[id] }))
              }
            />
            {label}
          </label>
        ))}
        <p className="preference-hint">
          Saved to your browser. These will pre-select search filters in a future update.
        </p>
      </div>

      <div className="profile-section">
        <h2>Settings</h2>
        <div className="settings-row">
          <button className="danger-btn" onClick={handleClearFavorites}>
            <Trash2 size={16} /> Clear all favorites
          </button>
          <button className="clear-filters-btn" onClick={handleReset}>
            Reset profile
          </button>
        </div>
      </div>
    </main>
  );
}