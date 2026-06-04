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
    breed: "Domestic Shorthair",
    size: "Small",
    temperament: ["house-trained", "quiet home"],
    urgency: "Routine",
    verification: ["Health check", "Core vaccines"],
  },
  {
    name: "Buddy",
    type: "Dog",
    age: "2 years old",
    location: "Mission District",
    status: "Needs foster or adopter",
    image: "/assets/about-us/dog.jpg",
    note: "Found near a park, friendly with people, and awaiting full vet clearance.",
    breed: "Mixed Breed",
    size: "Medium",
    temperament: ["good with kids", "friendly"],
    urgency: "Most Urgent",
    verification: ["Initial exam", "Flea/tick treatment"],
  },
  {
    name: "Pebble",
    type: "Rabbit",
    age: "8 months old",
    location: "Harbor Animal Care",
    status: "Clinic verified",
    image: "/assets/doctors/amanda.jpg",
    note: "Calm rabbit with basic health check completed by a partner clinic.",
    breed: "Mini Lop",
    size: "Small",
    temperament: ["calm", "house-trained"],
    urgency: "Routine",
    verification: ["Clinic verified", "Health check"],
  },
];

const adoptionGuides = [
  "What to do if you find a stray",
  "How to introduce a new pet to your home",
  "Preparing for a first foster night",
];

const Adoption = () => {
  const [pets, setPets] = useState(adoptionPets);
  const [filters, setFilters] = useState({
    type: "All",
    age: "All",
    breed: "",
    size: "All",
    temperament: "All",
    sort: "All",
  });
  const [form, setForm] = useState({
    type: "Dog",
    location: "",
    note: "",
    photo: "",
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
      breed: "Unknown",
      size: "Unknown",
      temperament: ["needs assessment"],
      urgency: "Most Urgent",
      verification: ["Pending clinic review"],
    };

    setPets((current) => [post, ...current]);
    await saveDocument("adoptionPosts", post);
    setForm({ type: "Dog", location: "", note: "", photo: "" });
    alert("adoption post created successfully! Nearby volunteers and foster subscribers will be notified.");
  };

  const filteredPets = pets
    .filter((pet) => filters.type === "All" || pet.type === filters.type)
    .filter((pet) => filters.age === "All" || pet.age.includes(filters.age))
    .filter((pet) => !filters.breed.trim() || pet.breed?.toLowerCase().includes(filters.breed.trim().toLowerCase()))
    .filter((pet) => filters.size === "All" || pet.size === filters.size)
    .filter((pet) => filters.temperament === "All" || pet.temperament?.includes(filters.temperament))
    .sort((a, b) => {
      if (filters.sort !== "Most Urgent") {
        return 0;
      }

      return (b.urgency === "Most Urgent") - (a.urgency === "Most Urgent");
    });

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

      <section className="adoption-discovery-card">
        <div className="adoption-filter-grid">
          <label>
            Animal type
            <select
              value={filters.type}
              onChange={(event) => setFilters((current) => ({ ...current, type: event.target.value }))}
            >
              <option>All</option>
              <option>Dog</option>
              <option>Cat</option>
              <option>Rabbit</option>
            </select>
          </label>
          <label>
            Age
            <select
              value={filters.age}
              onChange={(event) => setFilters((current) => ({ ...current, age: event.target.value }))}
            >
              <option>All</option>
              <option>months</option>
              <option>year</option>
              <option>years</option>
            </select>
          </label>
          <label>
            Breed
            <input
              value={filters.breed}
              onChange={(event) => setFilters((current) => ({ ...current, breed: event.target.value }))}
              placeholder="Search breed"
            />
          </label>
          <label>
            Size
            <select
              value={filters.size}
              onChange={(event) => setFilters((current) => ({ ...current, size: event.target.value }))}
            >
              <option>All</option>
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
              <option>Unknown</option>
            </select>
          </label>
          <label>
            Temperament
            <select
              value={filters.temperament}
              onChange={(event) => setFilters((current) => ({ ...current, temperament: event.target.value }))}
            >
              <option>All</option>
              <option>good with kids</option>
              <option>house-trained</option>
              <option>calm</option>
              <option>friendly</option>
            </select>
          </label>
          <label>
            Sort
            <select
              value={filters.sort}
              onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}
            >
              <option>All</option>
              <option>Most Urgent</option>
            </select>
          </label>
        </div>
      </section>

      <section className="adoption-layout">
        <div className="adoption-list">
          {filteredPets.map((pet) => (
            <article className="adoption-card" key={pet.name}>
              <img src={pet.image} alt={pet.name} />
              <div>
                <div className="adoption-status-row">
                  <span>{pet.status}</span>
                  {pet.urgency === "Most Urgent" && <em>Most Urgent</em>}
                </div>
                <h2>{pet.name}</h2>
                <p>
                  {pet.type} - {pet.age} - {pet.breed} - {pet.size} - {pet.location}
                </p>
                <small>{pet.note}</small>
                <div className="verification-row">
                  {(pet.verification || []).map((item) => (
                    <strong key={item}>{item}</strong>
                  ))}
                </div>
                <div className="adoption-action-row">
                  <button type="button">Message helper</button>
                  <button type="button">Chat safely</button>
                  <button type="button">Share</button>
                </div>
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
          <label>
            Photos
            <input
              onChange={(e) => setForm((current) => ({ ...current, photo: e.target.value }))}
              type="file"
              accept="image/*"
            />
          </label>
          <div className="matching-notice">
            Automatic matching will alert nearby volunteers, fosters, and clinics when this post is created.
          </div>
          <button onClick={handleCreatePost} type="button">Create adoption post</button>
        </aside>
      </section>

      <section className="adoption-support-grid">
        <article className="adoption-guides-card">
          <h2>Adoption Guides</h2>
          {adoptionGuides.map((guide) => (
            <a href="/appointments/info" key={guide}>{guide}</a>
          ))}
        </article>
      </section>
    </main>
  );
};

export default Adoption;
