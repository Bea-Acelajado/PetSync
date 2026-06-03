import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import MainPage from "./components/Pages/MainPage";

// 🧱 HUB LAYOUTS (you will create these next)
import AppointmentLayout from "./layouts/AppointmentLayout";
import CommunityLayout from "./layouts/CommunityLayout";
import PetLayout from "./layouts/PetLayout";

// 📅 APPOINTMENTS HUB PAGES
import BookAppointment from "./components/Pages/BookAppointment";
import ClinicInfo from "./components/Pages/ClinicInfo";
import FindClinics from "./components/Pages/FindClinics";
import FindVeterinarians from "./components/Pages/FindVeterinarians";

// 🌍 COMMUNITY HUB PAGES
import Community from "./components/Pages/Community";
import Adoption from "./components/Pages/Adoption";

// 🐾 PET HUB PAGES
import PetDashboard from "./components/Pages/PetDashboard";
import PetRecords from "./components/Pages/PetRecords";
import PetReminders from "./components/Pages/PetReminders";
import PetFinances from "./components/Pages/PetFinances";

// 👤 PROFILE
import OwnerDashboard from "./components/Pages/OwnerDashboard";

export default function App() {
  return (
    <Routes>

      {/* 🧱 MAIN SHELL */}
      <Route element={<MainLayout />}>

        <Route index element={<MainPage />} />

        {/* 📅 APPOINTMENT HUB */}
        <Route path="/appointments" element={<AppointmentLayout />}>
          <Route index element={<BookAppointment />} />
          <Route path="clinics" element={<FindClinics />} />
          <Route path="veterinarians" element={<FindVeterinarians />} />
          <Route path="info" element={<ClinicInfo />} />
          <Route path="clinic/:id" element={<ClinicInfo />} />
        </Route>

        <Route path="/clinic" element={<ClinicInfo />} />

        {/* 🌍 COMMUNITY HUB */}
        <Route path="/community" element={<CommunityLayout />}>
          <Route index element={<Community />} />
          <Route path="adoption" element={<Adoption />} />
        </Route>

        {/* 🐾 PET HUB */}
        <Route path="/pets" element={<PetLayout />}>
          <Route index element={<PetDashboard />} />
          <Route path="records" element={<PetRecords />} />
          <Route path="reminders" element={<PetReminders />} />
          <Route path="finance" element={<PetFinances />} />
          <Route path="finances" element={<PetFinances />} />
        </Route>

        <Route path="/profile" element={<OwnerDashboard />} />

      </Route>

    </Routes>
  );
}