import { useEffect, useState } from "react";
import { loadCollection } from "../../petsyncData";

const nearbyClinics = [
  {
    name: "Bay Area Pet Hospital",
    location: "Downtown",
    distance: "0.8 miles away",
    rating: "4.9",
    services: ["Urgent care", "Surgery", "Vaccination"],
  },
  {
    name: "Paws & Whiskers Clinic",
    location: "Pacific Heights",
    distance: "2.4 miles away",
    rating: "4.7",
    services: ["Dentistry", "Wellness", "Nutrition"],
  },
  {
    name: "Mission District Vets",
    location: "Mission",
    distance: "3.1 miles away",
    rating: "4.5",
    services: ["X-ray", "Grooming", "Emergency triage"],
  },
  {
    name: "Harbor Animal Care",
    location: "Waterfront",
    distance: "3.8 miles away",
    rating: "4.6",
    services: ["Fish care", "Bird care", "Diagnostics"],
  },
];

const FindClinics = () => {
  const [clinics, setClinics] = useState(nearbyClinics);

  useEffect(() => {
    const loadClinics = async () => {
      const data = await loadCollection("clinics", nearbyClinics);
      setClinics(data);
    };

    loadClinics();
  }, []);

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

      <section className="directory-list">
        {clinics.map((clinic) => (
          <article className="directory-card" key={clinic.name}>
            <div>
              <h2>{clinic.name}</h2>
              <p>
                {clinic.location} - {clinic.distance}
              </p>
              <div className="clinic-tags">
                {clinic.services.map((service) => (
                  <em key={service}>{service}</em>
                ))}
              </div>
            </div>
            <span className="directory-rating">{clinic.rating}/5.0</span>
          </article>
        ))}
      </section>
    </main>
  );
};

export default FindClinics;
