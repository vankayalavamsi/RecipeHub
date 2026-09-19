import { X } from "lucide-react";
const CUISINES = [
  "American", "British", "Chinese", "French", "Indian",
  "Italian", "Japanese", "Mexican", "Thai", "Vietnamese",
];

const DIETS = ["Vegetarian", "Vegan", "Gluten Free"];

const TIME_OPTIONS = [
  { value: "under-15", label: "Under 15 min" },
  { value: "15-30", label: "15–30 min" },
  { value: "30-60", label: "30–60 min" },
  { value: "60-plus", label: "60+ min" },
];

export default function FilterBar({ filters, onChange, onClear, hasActiveFilters }) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="filter-cuisine">Cuisine</label>
        <select
          id="filter-cuisine"
          value={filters.cuisine}
          onChange={(e) => onChange("cuisine", e.target.value)}
        >
          <option value="">All cuisines</option>
          {CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-diet">Diet</label>
        <select
          id="filter-diet"
          value={filters.diet}
          onChange={(e) => onChange("diet", e.target.value)}
        >
          <option value="">All diets</option>
          {DIETS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="filter-time">Cooking time</label>
        <select
          id="filter-time"
          value={filters.time}
          onChange={(e) => onChange("time", e.target.value)}
        >
          <option value="">Any time</option>
          {TIME_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      {hasActiveFilters && (
        <button className="clear-filters-btn" onClick={onClear}>
          <X size={14} /> Clear filters
        </button>
      )}
    </div>
  );
}