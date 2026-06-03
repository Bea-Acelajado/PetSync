import { NavLink, Outlet } from "react-router-dom";

const appointmentTabs = [
  { label: "Find clinics", path: "/appointments/clinics" },
  { label: "Find veterinarians", path: "/appointments/veterinarians" },
  { label: "Trustworthy information", path: "/appointments/info" },
];

const AppointmentLayout = () => {
  return (
    <div className="appointment-hub">
      <nav className="appointment-subnav" aria-label="Appointment hub">
        <NavLink end to="/appointments">
          Book an appointment
        </NavLink>
        {appointmentTabs.map((tab) => (
          <NavLink key={tab.path} to={tab.path}>
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
};

export default AppointmentLayout;
