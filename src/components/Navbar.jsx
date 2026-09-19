import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ChefHat, Heart, Menu, UserRound, X } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { favorites } = useFavorites();

  const linkClass = ({ isActive }) => "nav-link" + (isActive ? " active" : "");
  const close = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo" onClick={close}>
          <ChefHat size={26} /> RecipeHub
        </Link>

        <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={"nav-links" + (open ? " open" : "")}>
          <NavLink to="/" end className={linkClass} onClick={close}>Home</NavLink>
          <NavLink to="/explore" className={linkClass} onClick={close}>Explore</NavLink>
          <NavLink to="/favorites" className={linkClass} onClick={close}>
            <Heart size={16} /> Favorites
            {favorites.length > 0 && (
              <span className="nav-fav-count">{favorites.length}</span>
            )}
          </NavLink>
          <NavLink to="/profile" className={linkClass} onClick={close}>
            <UserRound size={16} /> Profile
          </NavLink>
        </nav>
      </div>
    </header>
  );
}