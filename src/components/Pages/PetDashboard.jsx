import { useEffect, useMemo, useState } from "react";
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

const PetDashboard = () => {
  const [pets, setPets] = useState(initialPets);
  const [selectedPet, setSelectedPet] = useState(initialPets[0].name);
  const [newPet, setNewPet] = useState({ name: "", type: "Dog", breed: "" });

  useEffect(() => {
    const loadPets = async () => {
      const data = await loadCollection("pets", initialPets);
      setPets(data);
      setSelectedPet(data[0]?.name || initialPets[0].name);
    };

    loadPets();
  }, []);

  const pet = useMemo(
    () => pets.find((item) => item.name === selectedPet) || pets[0],
    [pets, selectedPet]
  );

  const handleAddPet = async (e) => {
    e.preventDefault();

    if (!newPet.name.trim()) {
      alert("please enter your pet's name");
      return;
    }

    const petToAdd = {
      name: newPet.name.trim(),
      type: newPet.type,
      breed: newPet.breed.trim() || "Mixed breed",
      age: "New profile",
      weight: "Add weight",
      sex: "Add sex",
      microchip: "Not added",
      image: "/assets/users/user-icon.svg",
    };

    setPets((current) => [...current, petToAdd]);
    setSelectedPet(petToAdd.name);
    await saveDocument("pets", petToAdd);
    setNewPet({ name: "", type: "Dog", breed: "" });
  };

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

        <form className="add-pet-card" onSubmit={handleAddPet}>
          <h2>Add Pet</h2>
          <label>
            Name
            <input
              onChange={(e) => setNewPet((current) => ({ ...current, name: e.target.value }))}
              placeholder="Pet name"
              value={newPet.name}
            />
          </label>
          <label>
            Pet type
            <select
              onChange={(e) => setNewPet((current) => ({ ...current, type: e.target.value }))}
              value={newPet.type}
            >
              <option>Dog</option>
              <option>Cat</option>
              <option>Bird</option>
              <option>Fish</option>
              <option>Rabbit</option>
              <option>Hamster</option>
            </select>
          </label>
          <label>
            Breed
            <input
              onChange={(e) => setNewPet((current) => ({ ...current, breed: e.target.value }))}
              placeholder="Breed or species"
              value={newPet.breed}
            />
          </label>
          <button type="submit">Add pet</button>
        </form>
      </section>
    </main>
  );
};

export default PetDashboard;
