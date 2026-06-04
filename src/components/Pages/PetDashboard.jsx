import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { loadCollection, saveDocument } from "../../petsyncData";

const initialPets = [
  {
    name: "Luna",
    type: "Dog",
    breed: "Golden Retriever",
    age: "4 years",
    weight: "28.5 kg",
    sex: "Female",
    microchip: "#982...451",
    image: "/assets/about-us/dog.jpg",
  },
  {
    name: "Milo",
    type: "Cat",
    breed: "Domestic Shorthair",
    age: "2 years",
    weight: "5.1 kg",
    sex: "Male",
    microchip: "#552...118",
    image: "/assets/doctors/olivia.jpg",
  },
];

const history = [
  {
    title: "Annual Wellness Checkup",
    date: "Jan 15, 2024",
    text: "Full physical exam completed. Vital signs were normal. Recommended increased dental chew frequency.",
  },
  {
    title: "Minor Skin Irritation Treatment",
    date: "Nov 22, 2023",
    text: "Allergic reaction to environmental pollens. Symptoms resolved within one week.",
  },
  {
    title: "Teeth Cleaning",
    date: "Aug 10, 2023",
    text: "Routine professional cleaning under general anesthesia. No extractions required.",
  },
];

const medications = [
  { name: "Heartworm Preventive", dosage: "1 chew", frequency: "Monthly", refill: "Jul 1, 2026" },
  { name: "Omega-3 Supplement", dosage: "500 mg", frequency: "Daily", refill: "Jun 20, 2026" },
];

const lifeEvents = [
  { title: "Adopted", date: "Mar 12, 2020" },
  { title: "First Birthday", date: "May 8, 2021" },
  { title: "Graduated Puppy School", date: "Sep 18, 2021" },
];

const documents = ["Annual lab results.pdf", "Dental x-ray report.pdf", "Health certificate.pdf"];
const milestones = ["Senior wellness screening at age 7", "Heartworm refill due next month", "Golden Retriever hip screening reminder"];
const badges = ["Vaccination Complete", "Healthy Weight Achieved", "Dental Care Streak"];

const PetDashboard = () => {
  const [pets, setPets] = useState(initialPets);
  const [selectedPet, setSelectedPet] = useState(initialPets[0].name);
  const [petsLoaded, setPetsLoaded] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const loadPets = async () => {
      const data = await loadCollection("pets", initialPets);
      setPets(data);
      setSelectedPet(data[0]?.name || initialPets[0].name);
      setPetsLoaded(true);
    };

    loadPets();
  }, []);

  useEffect(() => {
    const addPetTemplate = async () => {
      if (!petsLoaded || searchParams.get("add") !== "pet") {
        return;
      }

      const nextNumber = pets.length + 1;
      const petToAdd = {
        name: `New Pet ${nextNumber}`,
        type: "Dog",
        breed: "New pet profile",
        age: "New profile",
        weight: "Add weight",
        sex: "Add sex",
        microchip: "Not added",
        image: "/assets/users/user-icon.svg",
      };

      setPets((current) => [...current, petToAdd]);
      setSelectedPet(petToAdd.name);
      setSearchParams({});
      await saveDocument("pets", petToAdd);
    };

    addPetTemplate();
  }, [pets, petsLoaded, searchParams, setSearchParams]);

  const pet = useMemo(
    () => pets.find((item) => item.name === selectedPet) || pets[0],
    [pets, selectedPet]
  );

  const shareLink = `https://petsync.local/passport/${pet.name.toLowerCase()}`;

  return (
    <main className="pet-dashboard-page">
      <section className="pet-dashboard-top">
        <div>
          <span className="pet-kicker">My pets</span>
          <h1>{pet.name}'s Passport</h1>
        </div>
        <div className="pet-selector">
          {pets.map((item) => (
            <button
              className={selectedPet === item.name ? "active" : ""}
              key={item.name}
              onClick={() => setSelectedPet(item.name)}
              type="button"
            >
              {item.name}
            </button>
          ))}
        </div>
      </section>

      <section className="pet-dashboard-grid">
        <aside className="pet-profile-card">
          <img src={pet.image} alt={pet.name} />
          <h2>{pet.name}</h2>
          <p>{pet.breed}</p>
          <div className="pet-stat-grid">
            <span>
              Age <strong>{pet.age}</strong>
            </span>
            <span>
              Weight <strong>{pet.weight}</strong>
            </span>
            <span>
              Sex <strong>{pet.sex}</strong>
            </span>
            <span>
              Microchip <strong>{pet.microchip}</strong>
            </span>
          </div>
          <div className="pet-quick-actions">
            <button type="button">Log Weight</button>
            <a href="/appointments">Book Appointment</a>
          </div>
        </aside>

        <section className="medical-history-card">
          <h2>Medical History</h2>
          <div className="history-timeline">
            {history.map((item) => (
              <article key={item.title}>
                <span />
                <div>
                  <header>
                    <h3>{item.title}</h3>
                    <small>{item.date}</small>
                  </header>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="vaccination-card">
          <h2>Vaccinations</h2>
          <article>
            <strong>Rabies</strong>
            <span>Up to date</span>
          </article>
          <article>
            <strong>DHPP</strong>
            <span>Up to date</span>
          </article>
        </section>

        <section className="passport-card medication-card">
          <h2>Active Medications</h2>
          {medications.map((item) => (
            <article key={item.name}>
              <strong>{item.name}</strong>
              <span>{item.dosage} - {item.frequency}</span>
              <small>Refill reminder: {item.refill}</small>
            </article>
          ))}
        </section>

        <section className="passport-card life-events-card">
          <h2>Life Events</h2>
          {lifeEvents.map((event) => (
            <article key={event.title}>
              <strong>{event.title}</strong>
              <span>{event.date}</span>
            </article>
          ))}
        </section>

        <section className="passport-card badge-card">
          <h2>Milestone Badges</h2>
          <div>
            {badges.map((badge) => (
              <span key={badge}>{badge}</span>
            ))}
          </div>
        </section>

        <section className="passport-card milestone-card">
          <h2>Upcoming Milestones</h2>
          {milestones.map((milestone) => (
            <span key={milestone}>{milestone}</span>
          ))}
        </section>

        <section className="passport-card document-vault-card">
          <h2>Document Vault</h2>
          <label>
            Upload PDF or image
            <input type="file" accept="application/pdf,image/*" />
          </label>
          {documents.map((document) => (
            <span key={document}>{document}</span>
          ))}
        </section>

        <section className="passport-card passport-share-card">
          <h2>Share Passport</h2>
          <p>Temporary secure link for clinics, pet sitters, or groomers.</p>
          <code>{shareLink}</code>
          <button type="button">Generate Link</button>
        </section>
      </section>
    </main>
  );
};

export default PetDashboard;
