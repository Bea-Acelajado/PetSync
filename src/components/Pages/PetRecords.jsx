import { useEffect, useState } from "react";
import { loadCollection } from "../../petsyncData";

const records = [
  {
    pet: "Luna",
    clinic: "Bay Area Pet Hospital",
    visit: "Annual wellness checkup",
    date: "Jan 15, 2024",
    notes: "Normal vital signs. Dental chew routine recommended.",
    soap: {
      subjective: "Owner reports normal appetite and energy.",
      objective: "Weight stable, gums healthy, mild tartar noted.",
      assessment: "Healthy adult dog with early dental buildup.",
      plan: "Continue dental chews and schedule dental recheck in 6 months.",
    },
    diagnostics: ["CBC panel.pdf", "Dental exam images"],
    medication: "None prescribed",
    claimFlagged: false,
  },
  {
    pet: "Luna",
    clinic: "Paws & Whiskers Clinic",
    visit: "Skin irritation treatment",
    date: "Nov 22, 2023",
    notes: "Environmental allergy suspected. Medication completed.",
    soap: {
      subjective: "Owner noticed scratching after park visits.",
      objective: "Localized redness on abdomen, no open wounds.",
      assessment: "Likely seasonal contact dermatitis.",
      plan: "Topical treatment for 7 days and monitor recurrence.",
    },
    diagnostics: ["Skin scrape result.pdf"],
    medication: "Hydrocortisone spray - twice daily - 7 days",
    claimFlagged: true,
  },
  {
    pet: "Milo",
    clinic: "Mission District Vets",
    visit: "Vaccination update",
    date: "Sep 5, 2023",
    notes: "Core vaccine updated. Next booster scheduled.",
    soap: {
      subjective: "Owner reports Milo is eating and playing normally.",
      objective: "Normal temperature and clear lungs.",
      assessment: "Healthy cat due for core vaccination.",
      plan: "Booster completed; next vaccine reminder created.",
    },
    diagnostics: ["Vaccination certificate.pdf"],
    medication: "None prescribed",
    claimFlagged: false,
  },
];

const vaccineStatus = [
  { name: "Rabies", status: "Up-to-Date" },
  { name: "DHPP", status: "Up-to-Date" },
  { name: "Bordetella", status: "Due Soon" },
];

const reminders = ["Bordetella booster due in 21 days", "Annual wellness check-up due Jan 2025", "Flea/tick prevention refill this month"];

const PetRecords = () => {
  const [petRecords, setPetRecords] = useState(records);
  const [selectedPet, setSelectedPet] = useState(records[0].pet);
  const [openRecord, setOpenRecord] = useState(records[0].visit);
  const [flaggedClaims, setFlaggedClaims] = useState(
    records.filter((record) => record.claimFlagged).map((record) => record.visit)
  );

  useEffect(() => {
    const loadRecords = async () => {
      const data = await loadCollection("petRecords", records);
      setPetRecords(data);
    };

    loadRecords();
  }, []);

  const toggleClaim = (visit) => {
    setFlaggedClaims((current) =>
      current.includes(visit)
        ? current.filter((item) => item !== visit)
        : [...current, visit]
    );
  };

  const pets = [...new Set(petRecords.map((record) => record.pet))];
  const visibleRecords = petRecords.filter((record) => record.pet === selectedPet);

  return (
    <main className="pet-subpage">
      <section className="pet-subpage-intro">
        <span className="pet-kicker">Medical records</span>
        <h1>Pet Records</h1>
        <p>Review previous appointments, clinic notes, and health updates.</p>
      </section>

      <section className="records-toolbar">
        <div className="pet-selector">
          {pets.map((pet) => (
            <button
              className={selectedPet === pet ? "active" : ""}
              key={pet}
              onClick={() => setSelectedPet(pet)}
              type="button"
            >
              {pet}
            </button>
          ))}
        </div>
        <button type="button">Add Record</button>
      </section>

      <section className="records-utility-grid">
        <article className="records-panel vaccination-status-panel">
          <h2>Vaccination Status</h2>
          {vaccineStatus.map((item) => (
            <span className={item.status === "Due Soon" ? "due" : "current"} key={item.name}>
              {item.name} <strong>{item.status}</strong>
            </span>
          ))}
        </article>

        <article className="records-panel records-reminder-panel">
          <h2>Automated Reminders</h2>
          {reminders.map((reminder) => (
            <span key={reminder}>{reminder}</span>
          ))}
        </article>

      </section>

      <section className="record-list">
        {visibleRecords.map((record) => (
          <article className="record-card" key={`${record.pet}-${record.date}`}>
            <div>
              <span>{record.pet}</span>
              <h2>{record.visit}</h2>
              <p>{record.clinic}</p>
            </div>
            <div>
              <strong>{record.date}</strong>
              <p>{record.notes}</p>
              <div className="record-actions">
                <button
                  onClick={() => setOpenRecord(openRecord === record.visit ? "" : record.visit)}
                  type="button"
                >
                  View Details
                </button>
                <button type="button">Message Clinic</button>
                <button
                  className={flaggedClaims.includes(record.visit) ? "active" : ""}
                  onClick={() => toggleClaim(record.visit)}
                  type="button"
                >
                  {flaggedClaims.includes(record.visit) ? "Claim Flagged" : "Flag for Insurance"}
                </button>
              </div>
              {openRecord === record.visit && (
                <div className="record-detail-panel">
                  <h3>SOAP Notes</h3>
                  <dl>
                    <div>
                      <dt>Subjective</dt>
                      <dd>{record.soap.subjective}</dd>
                    </div>
                    <div>
                      <dt>Objective</dt>
                      <dd>{record.soap.objective}</dd>
                    </div>
                    <div>
                      <dt>Assessment</dt>
                      <dd>{record.soap.assessment}</dd>
                    </div>
                    <div>
                      <dt>Plan</dt>
                      <dd>{record.soap.plan}</dd>
                    </div>
                  </dl>
                  <h3>Diagnostics</h3>
                  <div className="diagnostic-links">
                    {record.diagnostics.map((item) => (
                      <button key={item} type="button">{item}</button>
                    ))}
                  </div>
                  <h3>Medication</h3>
                  <p>{record.medication}</p>
                </div>
              )}
            </div>
          </article>
        ))}
      </section>

      <section className="records-utility-grid">
        <article className="records-panel records-vault-panel">
          <h2>Document Vault</h2>
          <label>
            Upload outside record
            <input type="file" accept="application/pdf,image/*" />
          </label>
        </article>

        <article className="records-panel records-share-panel">
          <h2>Share Records</h2>
          <p>Generate a secure passport link or export a consolidated PDF.</p>
          <button type="button">Generate Secure Link</button>
          <button type="button">Export PDF</button>
        </article>
      </section>
    </main>
  );
};

export default PetRecords;
