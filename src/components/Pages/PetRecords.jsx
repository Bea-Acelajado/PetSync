import { useEffect, useState } from "react";
import { loadCollection } from "../../petsyncData";

const records = [
  {
    pet: "Luna",
    clinic: "Bay Area Pet Hospital",
    visit: "Annual wellness checkup",
    date: "Jan 15, 2024",
    notes: "Normal vital signs. Dental chew routine recommended.",
  },
  {
    pet: "Luna",
    clinic: "Paws & Whiskers Clinic",
    visit: "Skin irritation treatment",
    date: "Nov 22, 2023",
    notes: "Environmental allergy suspected. Medication completed.",
  },
  {
    pet: "Milo",
    clinic: "Mission District Vets",
    visit: "Vaccination update",
    date: "Sep 5, 2023",
    notes: "Core vaccine updated. Next booster scheduled.",
  },
];

const PetRecords = () => {
  const [petRecords, setPetRecords] = useState(records);

  useEffect(() => {
    const loadRecords = async () => {
      const data = await loadCollection("petRecords", records);
      setPetRecords(data);
    };

    loadRecords();
  }, []);

  return (
    <main className="pet-subpage">
      <section className="pet-subpage-intro">
        <span className="pet-kicker">Medical records</span>
        <h1>Pet Records</h1>
        <p>Review previous appointments, clinic notes, and health updates.</p>
      </section>

      <section className="record-list">
        {petRecords.map((record) => (
          <article className="record-card" key={`${record.pet}-${record.date}`}>
            <div>
              <span>{record.pet}</span>
              <h2>{record.visit}</h2>
              <p>{record.clinic}</p>
            </div>
            <div>
              <strong>{record.date}</strong>
              <p>{record.notes}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};

export default PetRecords;
