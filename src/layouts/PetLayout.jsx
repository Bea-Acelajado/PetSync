import { NavLink, Outlet } from "react-router-dom";

const petTabs = [
  { label: "Pet records", path: "/pets/records" },
  { label: "Personal reminders", path: "/pets/reminders" },
  { label: "Pet finances", path: "/pets/finances" },
];

const PetLayout = () => {
  return (
    <div className="pet-hub">
      <nav className="pet-subnav" aria-label="Pet dashboard">
        <NavLink end to="/pets">
          Dashboard
        </NavLink>
        {petTabs.map((tab) => (
          <NavLink key={tab.path} to={tab.path}>
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
};

export default PetLayout;
