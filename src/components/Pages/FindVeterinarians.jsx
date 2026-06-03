import { useEffect, useState } from "react";
import { loadCollection } from "../../petsyncData";

const veterinarians = [
  {
    name: "Dr. Elena Rodriguez",
    clinic: "Bay Area Pet Hospital",
    specialty: "Surgery and preventive care",
    experience: "12 yrs exp.",
    photo: "/assets/doctors/anne.jpg",
  },
  {
    name: "Dr. Olivia Parker",
    clinic: "Paws & Whiskers Clinic",
    specialty: "Dental health and wellness",
    experience: "9 yrs exp.",
    photo: "/assets/doctors/olivia.jpg",
  },
  {
    name: "Dr. William Carter",
    clinic: "Mission District Vets",
    specialty: "Emergency medicine",
    experience: "15 yrs exp.",
    photo: "/assets/doctors/william.jpg",
  },
  {
    name: "Dr. Amanda Lee",
    clinic: "Harbor Animal Care",
    specialty: "Bird, fish, and exotic pet care",
    experience: "10 yrs exp.",
    photo: "/assets/doctors/amanda.jpg",
  },
];

const FindVeterinarians = () => {
  const [vets, setVets] = useState(veterinarians);

  useEffect(() => {
    const loadVets = async () => {
      const data = await loadCollection("veterinarians", veterinarians);
      setVets(data);
    };

    loadVets();
  }, []);

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

      <section className="vet-grid">
        {vets.map((vet) => (
          <article className="vet-card" key={vet.name}>
            <img src={vet.photo} alt={vet.name} />
            <div>
              <h2>{vet.name}</h2>
              <p>{vet.clinic}</p>
              <span>{vet.specialty}</span>
              <small>{vet.experience}</small>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};

export default FindVeterinarians;
