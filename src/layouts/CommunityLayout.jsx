import { NavLink, Outlet } from "react-router-dom";

const CommunityLayout = () => {
  return (
    <div className="community-hub">
      <nav className="community-subnav" aria-label="Community hub">
        <NavLink end to="/community">
          Community
        </NavLink>
        <NavLink to="/community/adoption">Pet adoption</NavLink>
      </nav>
      <Outlet />
    </div>
  );
};

export default CommunityLayout;
