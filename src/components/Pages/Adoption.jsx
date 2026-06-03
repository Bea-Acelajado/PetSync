import { useEffect, useState } from "react";
import { loadCollection, saveDocument } from "../../petsyncData";

const adoptionPets = [
  {
    name: "Luna",
    type: "Cat",
    age: "1 year old",
    location: "Downtown rescue foster",
    status: "Ready for adoption",
    image: "/assets/doctors/olivia.jpg",
    note: "Gentle, litter-trained, and comfortable with quiet homes.",
  },
  {
    name: "Buddy",
    type: "Dog",
    age: "2 years old",
    location: "Mission District",
    status: "Needs foster or adopter",
    image: "/assets/about-us/dog.jpg",
    note: "Found near a park, friendly with people, and awaiting full vet clearance.",
  },
  {
    name: "Pebble",
    type: "Rabbit",
    age: "8 months old",
    location: "Harbor Animal Care",
    status: "Clinic verified",
    image: "/assets/doctors/amanda.jpg",
    note: "Calm rabbit with basic health check completed by a partner clinic.",
  },
];

const Adoption = () => {
  const [pets, setPets] = useState(adoptionPets);
  const [form, setForm] = useState({
    type: "Dog",
    location: "",
    note: "",
  });

  useEffect(() => {
    const loadAdoptions = async () => {
      const data = await loadCollection("adoptionPosts", adoptionPets);
      setPets(data);
    };

    loadAdoptions();
  }, []);

  const handleCreatePost = async () => {
    if (!form.location.trim() || !form.note.trim()) {
      alert("please complete the adoption post first");
      return;
    }

    const post = {
      name: "Stray pet",
      type: form.type,
      age: "Age unknown",
      location: form.location.trim(),
      status: "Needs foster or adopter",
      image: "/assets/users/user-icon.svg",
      note: form.note.trim(),
    };

    setPets((current) => [post, ...current]);
    await saveDocument("adoptionPosts", post);
    setForm({ type: "Dog", location: "", note: "" });
    alert("adoption post created successfully!");
  };

  return (
    <main className="adoption-page">
      <section className="adoption-hero">
        <span className="community-kicker">Pet adoption</span>
        <h1>Help rescued pets find safer homes</h1>
        <p>
          Share adoption leads, support people who found stray animals, and help
          connect pets with responsible owners.
        </p>
      </section>

      <section className="adoption-layout">
        <div className="adoption-list">
          {pets.map((pet) => (
            <article className="adoption-card" key={pet.name}>
              <img src={pet.image} alt={pet.name} />
              <div>
                <span>{pet.status}</span>
                <h2>{pet.name}</h2>
                <p>
                  {pet.type} - {pet.age} - {pet.location}
                </p>
                <small>{pet.note}</small>
                <button type="button">Contact helper</button>
              </div>
            </article>
          ))}
        </div>

        <aside className="stray-help-card">
          <h2>Found a stray animal?</h2>
          <p>
            Post a short description, location, photos, and any urgent health
            concerns so nearby owners and clinics can help.
          </p>
          <label>
            Animal type
            <select
              onChange={(e) => setForm((current) => ({ ...current, type: e.target.value }))}
              value={form.type}
            >
              <option>Dog</option>
              <option>Cat</option>
              <option>Bird</option>
              <option>Rabbit</option>
              <option>Hamster</option>
              <option>Other</option>
            </select>
          </label>
          <label>
            Location found
            <input
              onChange={(e) => setForm((current) => ({ ...current, location: e.target.value }))}
              placeholder="City or neighborhood"
              value={form.location}
            />
          </label>
          <label>
            Notes
            <textarea
              onChange={(e) => setForm((current) => ({ ...current, note: e.target.value }))}
              placeholder="Describe the pet and what help is needed..."
              value={form.note}
            />
          </label>
          <button onClick={handleCreatePost} type="button">Create adoption post</button>
        </aside>
      </section>
    </main>
  );
};

export default Adoption;
