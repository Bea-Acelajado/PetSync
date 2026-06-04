import { useEffect, useState } from "react";
import { loadCollection } from "../../petsyncData";

const nearbyClinics = [
  {
    name: "Bay Area Pet Hospital",
    location: "Downtown",
    distance: "0.8 miles away",
    distanceValue: 0.8,
    rating: "4.9",
    reviews: 428,
    openNow: true,
    closesAt: "6:00 PM",
    nextAvailable: "Today 3:30 PM",
    acceptsNewPatients: true,
    emergency: true,
    services: ["Urgent care", "Surgery", "Vaccination"],
  },
  {
    name: "Paws & Whiskers Clinic",
    location: "Pacific Heights",
    distance: "2.4 miles away",
    distanceValue: 2.4,
    rating: "4.7",
    reviews: 312,
    openNow: true,
    closesAt: "7:30 PM",
    nextAvailable: "Tomorrow 9:00 AM",
    acceptsNewPatients: true,
    emergency: false,
    services: ["Dentistry", "Wellness", "Nutrition"],
  },
  {
    name: "Mission District Vets",
    location: "Mission",
    distance: "3.1 miles away",
    distanceValue: 3.1,
    rating: "4.5",
    reviews: 196,
    openNow: false,
    closesAt: "Closed now",
    nextAvailable: "Tomorrow 11:30 AM",
    acceptsNewPatients: false,
    emergency: true,
    services: ["X-ray", "Grooming", "Emergency triage"],
  },
  {
    name: "Harbor Animal Care",
    location: "Waterfront",
    distance: "3.8 miles away",
    distanceValue: 3.8,
    rating: "4.6",
    reviews: 244,
    openNow: true,
    closesAt: "5:00 PM",
    nextAvailable: "Fri 10:00 AM",
    acceptsNewPatients: true,
    emergency: false,
    services: ["Fish care", "Bird care", "Diagnostics"],
  },
];

const filterOptions = [
  { id: "openNow", label: "Open Now" },
  { id: "emergency", label: "Emergency Services" },
  { id: "acceptsNewPatients", label: "Accepts New Patients" },
];

const FindClinics = () => {
  const [clinics, setClinics] = useState(nearbyClinics);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortBy, setSortBy] = useState("nearest");
  const [favoriteClinics, setFavoriteClinics] = useState([]);
  const [focusedClinic, setFocusedClinic] = useState(nearbyClinics[0].name);

  useEffect(() => {
    const loadClinics = async () => {
      const data = await loadCollection("clinics", nearbyClinics);
      setClinics(data);
    };

    loadClinics();
  }, []);

  const toggleFilter = (filterId) => {
    setActiveFilters((current) =>
      current.includes(filterId)
        ? current.filter((item) => item !== filterId)
        : [...current, filterId]
    );
  };

  const toggleFavoriteClinic = (clinicName) => {
    setFavoriteClinics((current) =>
      current.includes(clinicName)
        ? current.filter((name) => name !== clinicName)
        : [...current, clinicName]
    );
  };

  const visibleClinics = clinics
    .filter((clinic) => {
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !query ||
        clinic.name.toLowerCase().includes(query) ||
        clinic.location.toLowerCase().includes(query);
      const matchesFilters = activeFilters.every((filterId) => Boolean(clinic[filterId]));

      return matchesSearch && matchesFilters;
    })
    .sort((first, second) => {
      if (sortBy === "highestRated") {
        return Number(second.rating) - Number(first.rating);
      }

      if (sortBy === "mostReviewed") {
        return Number(second.reviews || 0) - Number(first.reviews || 0);
      }

      return Number(first.distanceValue || 0) - Number(second.distanceValue || 0);
    });

  const activeMapClinic =
    visibleClinics.find((clinic) => clinic.name === focusedClinic) || visibleClinics[0];

  return (
    <main className="appointment-directory-page">
      <section className="appointment-intro compact">
        <span className="appointment-kicker">Nearby clinics</span>
        <h1>Find Clinics</h1>
        <p>
          Browse trusted veterinary clinics near your location and compare their
          ratings, distance, and available services.
        </p>
      </section>

      <section className="clinic-discovery-controls" aria-label="Clinic search and filters">
        <label>
          Search
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search clinic or neighborhood"
          />
        </label>
        <label>
          Sort by
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="nearest">Nearest</option>
            <option value="highestRated">Highest Rated</option>
            <option value="mostReviewed">Most Reviewed</option>
          </select>
        </label>
        <div className="clinic-filter-row">
          {filterOptions.map((filter) => (
            <button
              className={activeFilters.includes(filter.id) ? "active" : ""}
              key={filter.id}
              onClick={() => toggleFilter(filter.id)}
              type="button"
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      <section className="clinic-results-layout">
        <section className="directory-list">
          {visibleClinics.map((clinic) => (
            <article
              className="directory-card"
              key={clinic.name}
              onMouseEnter={() => setFocusedClinic(clinic.name)}
              onFocus={() => setFocusedClinic(clinic.name)}
              tabIndex={0}
            >
              <div>
                <div className="directory-card-heading">
                  <h2>{clinic.name}</h2>
                  <button
                    className={`clinic-save-button ${favoriteClinics.includes(clinic.name) ? "saved" : ""}`}
                    onClick={() => toggleFavoriteClinic(clinic.name)}
                    type="button"
                    aria-label={`Save ${clinic.name}`}
                  />
                </div>
                <p>
                  {clinic.location} - {clinic.distance}
                </p>
                <div className="clinic-status-row">
                  <span className={clinic.openNow ? "open" : "closed"}>
                    {clinic.openNow ? `Open - closes ${clinic.closesAt}` : "Closed"}
                  </span>
                  <span>Next available: {clinic.nextAvailable}</span>
                </div>
                <div className="clinic-tags">
                  {clinic.services.map((service) => (
                    <em key={service}>{service}</em>
                  ))}
                </div>
              </div>
              <div className="directory-card-actions">
                <span className="directory-rating">{clinic.rating}/5.0</span>
                <small>{clinic.reviews} reviews</small>
                <button type="button">View Details</button>
              </div>
            </article>
          ))}
          {visibleClinics.length === 0 && (
            <article className="directory-card">
              <div>
                <h2>No clinics found</h2>
                <p>Try adjusting your search or filters.</p>
              </div>
            </article>
          )}
        </section>

        <aside className="clinic-map-card" aria-label="Clinic map preview">
          <div className="clinic-map-canvas">
            <span className="current-location">You</span>
            {visibleClinics.map((clinic, index) => (
              <button
                className={activeMapClinic?.name === clinic.name ? "active" : ""}
                key={clinic.name}
                onClick={() => setFocusedClinic(clinic.name)}
                style={{
                  left: `${24 + index * 18}%`,
                  top: `${32 + (index % 2) * 28}%`,
                }}
                type="button"
                aria-label={`Show ${clinic.name} on map`}
              />
            ))}
          </div>
          {activeMapClinic && (
            <div className="clinic-map-details">
              <strong>{activeMapClinic.name}</strong>
              <span>
                {activeMapClinic.location} - {activeMapClinic.distance}
              </span>
              <small>Next available: {activeMapClinic.nextAvailable}</small>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
};

export default FindClinics;
