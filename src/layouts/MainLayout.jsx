import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";

const navItems = [
  { label: "Appointments", path: "/appointments" },
  { label: "Community", path: "/community" },
  { label: "Pets", path: "/pets" },
  { label: "Profile", path: "/profile" },
];

const MainLayout = () => {
  const { mode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="petsync-app-shell" data-mode={mode}>
      <header className="petsync-header">
        <Link className="petsync-brand" to="/">
          PetSync
        </Link>

        <p className="petsync-tagline">because every pet deserves better care</p>

        <div className="petsync-header-actions">
          <Link className="profile-link" to="/profile" aria-label="Open profile">
            <img src="/assets/users/user-icon.svg" alt="User profile" />
          </Link>
          <button
            aria-expanded={sidebarOpen}
            aria-label="Open navigation menu"
            className="sidebar-toggle"
            onClick={() => setSidebarOpen((current) => !current)}
            type="button"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <aside className={`petsync-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-title">
          <span>PetSync</span>
          <button
            aria-label="Close navigation menu"
            onClick={() => setSidebarOpen(false)}
            type="button"
          >
            x
          </button>
        </div>
        <nav>
          {navItems.map((item) => (
            <Link
              key={item.path}
              onClick={() => setSidebarOpen(false)}
              to={item.path}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {sidebarOpen && (
        <button
          aria-label="Close navigation menu overlay"
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          type="button"
        />
      )}

      <div className="petsync-page-content">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
