import { useEffect, useState } from "react";
import { loadCollection } from "../../petsyncData";

const veterinarians = [
  {
    name: "Dr. Elena Rodriguez",
    clinic: "Bay Area Pet Hospital",
    specialty: "Surgery and preventive care",
    specialties: ["Surgery", "Preventive Care"],
    experience: "12 yrs exp.",
    photo: "/assets/doctors/anne.jpg",
    certifications: ["Fear Free Certified", "Soft tissue surgery"],
    philosophy: "Calm, practical care plans that help pets recover comfortably at home.",
    note: "I love helping anxious pets feel safe during complex procedures.",
    badge: "Top Rated",
    availability: "Available today",
    nextSlot: "Today 3:30 PM",
    telehealth: true,
    article: "Read surgery prep tips by Dr. Elena",
  },
  {
    name: "Dr. Olivia Parker",
    clinic: "Paws & Whiskers Clinic",
    specialty: "Dental health and wellness",
    specialties: ["Dentistry", "Wellness"],
    experience: "9 yrs exp.",
    photo: "/assets/doctors/olivia.jpg",
    certifications: ["Veterinary dental care", "Low-stress handling"],
    philosophy: "Preventive dental care should feel approachable for every owner.",
    note: "I focus on small habits that prevent painful dental disease.",
    badge: "Top Rated",
    availability: "Next open slot: Friday",
    nextSlot: "Fri 10:00 AM",
    telehealth: true,
    article: "Read dental wellness notes by Dr. Olivia",
  },
  {
    name: "Dr. William Carter",
    clinic: "Mission District Vets",
    specialty: "Emergency medicine",
    specialties: ["Emergency", "Surgery"],
    experience: "15 yrs exp.",
    photo: "/assets/doctors/william.jpg",
    certifications: ["Emergency triage", "Critical care response"],
    philosophy: "Fast decisions, clear communication, and steady support during urgent visits.",
    note: "I help families understand what matters first in stressful moments.",
    badge: "Emergency Lead",
    availability: "Available today",
    nextSlot: "Today 5:00 PM",
    telehealth: false,
    article: "Read emergency readiness tips by Dr. William",
  },
  {
    name: "Dr. Amanda Lee",
    clinic: "Harbor Animal Care",
    specialty: "Bird, fish, and exotic pet care",
    specialties: ["Exotic Pets", "Bird Care"],
    experience: "10 yrs exp.",
    photo: "/assets/doctors/amanda.jpg",
    certifications: ["Exotic companion care", "Avian wellness"],
    philosophy: "Special species deserve care plans built around their unique behavior and habitat.",
    note: "I enjoy helping owners build healthier daily routines for exotic pets.",
    badge: "Exotics Specialist",
    availability: "Next open slot: Monday",
    nextSlot: "Mon 9:30 AM",
    telehealth: true,
    article: "Read exotic pet care guides by Dr. Amanda",
  },
];

const specialtyFilters = ["Surgery", "Dentistry", "Exotic Pets", "Emergency", "Wellness"];

const FindVeterinarians = () => {
  const [vets, setVets] = useState(veterinarians);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSpecialty, setActiveSpecialty] = useState("All");

  useEffect(() => {
    const loadVets = async () => {
      const data = await loadCollection("veterinarians", veterinarians);
      setVets(data);
    };

    loadVets();
  }, []);

  const filteredVets = vets.filter((vet) => {
    const query = searchTerm.trim().toLowerCase();
    const vetSpecialties = vet.specialties || [vet.specialty];
    const matchesSearch =
      !query ||
      vet.name.toLowerCase().includes(query) ||
      vet.clinic.toLowerCase().includes(query) ||
      vet.specialty.toLowerCase().includes(query);
    const matchesSpecialty =
      activeSpecialty === "All" || vetSpecialties.includes(activeSpecialty);

    return matchesSearch && matchesSpecialty;
  });

  return (
    <main className="appointment-directory-page">
      <section className="appointment-intro compact">
        <span className="appointment-kicker">Close professionals</span>
        <h1>Find Veterinarians</h1>
        <p>
          Review veterinarians from nearby clinics and choose a professional
          whose specialty matches your pet's needs.
        </p>
      </section>

      <section className="vet-discovery-controls" aria-label="Veterinarian search and filters">
        <label>
          Search
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, clinic, or specialty"
          />
        </label>
        <div className="vet-filter-row">
          <button
            className={activeSpecialty === "All" ? "active" : ""}
            onClick={() => setActiveSpecialty("All")}
            type="button"
          >
            All
          </button>
          {specialtyFilters.map((specialty) => (
            <button
              className={activeSpecialty === specialty ? "active" : ""}
              key={specialty}
              onClick={() => setActiveSpecialty(specialty)}
              type="button"
            >
              {specialty}
            </button>
          ))}
        </div>
      </section>

      <section className="vet-grid">
        {filteredVets.map((vet) => (
          <article className="vet-card" key={vet.name}>
            <div className="vet-photo-stack">
              <a href={`/appointments/veterinarians/${vet.name.toLowerCase().replaceAll(" ", "-").replace(".", "")}`}>
                <img src={vet.photo} alt={vet.name} />
              </a>
            </div>
            <div className="vet-card-body">
              <div className="vet-card-heading">
                <div>
                  <h2>{vet.name}</h2>
                  <p>{vet.clinic}</p>
                </div>
                <em>{vet.badge}</em>
              </div>
              <span>{vet.specialty}</span>
              <small>{vet.experience}</small>
              <div className="vet-availability-row">
                <strong>{vet.availability}</strong>
                <small>Next: {vet.nextSlot}</small>
              </div>
              <div className="vet-certifications">
                {(vet.certifications || []).map((certification) => (
                  <em key={certification}>{certification}</em>
                ))}
              </div>
              <p>{vet.philosophy}</p>
              <div className="vet-card-links">
                <a href="/appointments">Book Consultation</a>
                <button type="button">Message Vet</button>
              </div>
              <a className="vet-article-link" href="/appointments/info">
                {vet.article}
              </a>
            </div>
          </article>
        ))}
        {filteredVets.length === 0 && (
          <article className="vet-card">
            <div className="vet-card-body">
              <h2>No veterinarians found</h2>
              <p>Try another search or specialty filter.</p>
            </div>
          </article>
        )}
      </section>
    </main>
  );
};

export default FindVeterinarians;
