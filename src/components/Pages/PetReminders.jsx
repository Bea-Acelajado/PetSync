import { useEffect, useState } from "react";
import { loadCollection, saveDocument } from "../../petsyncData";

const startingNotes = [
  {
    text: "Give Luna heartworm medicine every first Monday of the month.",
    pet: "Luna",
    category: "Medication",
    priority: "high",
    due: "2026-07-01T09:00",
    recurrence: "Monthly",
    notify: "Browser",
    status: "Pending",
  },
  {
    text: "Ask clinic about Milo's next booster schedule.",
    pet: "Milo",
    category: "Vet Visit",
    priority: "medium",
    due: "2026-06-15T10:30",
    recurrence: "Every X Days",
    customDays: "30",
    notify: "Email",
    status: "Pending",
  },
];

const pets = ["Luna", "Milo"];
const categories = ["All", "Medication", "Vet Visit", "Training", "Nutrition"];
const priorities = ["routine", "medium", "high"];
const recurrences = ["None", "Daily", "Weekly", "Monthly", "Every X Days"];

const PetReminders = () => {
  const [notes, setNotes] = useState(startingNotes);
  const [draft, setDraft] = useState("");
  const [pet, setPet] = useState("Luna");
  const [category, setCategory] = useState("Medication");
  const [priority, setPriority] = useState("routine");
  const [due, setDue] = useState("");
  const [recurrence, setRecurrence] = useState("None");
  const [customDays, setCustomDays] = useState("");
  const [notify, setNotify] = useState("Browser");
  const [activeTab, setActiveTab] = useState("Pending");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePet, setActivePet] = useState("All");

  useEffect(() => {
    const loadNotes = async () => {
      const data = await loadCollection(
        "petReminders",
        startingNotes
      );
      setNotes(data.map((note) => (typeof note === "string" ? { text: note } : note)));
    };

    loadNotes();
  }, []);

  const addNote = async () => {
    if (!draft.trim()) {
      alert("please write a reminder first");
      return;
    }

    const note = {
      text: draft.trim(),
      pet,
      category,
      priority,
      due,
      recurrence,
      customDays,
      notify,
      status: "Pending",
    };

    setNotes((current) => [note, ...current]);
    await saveDocument("petReminders", note);
    setDraft("");
  };

  const updateStatus = (index, status) => {
    setNotes((current) =>
      current.map((note, noteIndex) => (noteIndex === index ? { ...note, status } : note))
    );
  };

  const moveReminder = (index, direction) => {
    setNotes((current) => {
      const next = [...current];
      const targetIndex = index + direction;

      if (targetIndex < 0 || targetIndex >= next.length) {
        return current;
      }

      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const visibleNotes = notes
    .map((note, index) => ({ ...note, originalIndex: index }))
    .filter((note) => {
      const matchesTab = (note.status || "Pending") === activeTab;
      const matchesCategory = activeCategory === "All" || note.category === activeCategory;
      const matchesPet = activePet === "All" || note.pet === activePet;

      return matchesTab && matchesCategory && matchesPet;
    })
    .sort((a, b) => new Date(a.due || "9999-12-31") - new Date(b.due || "9999-12-31"));

  return (
    <main className="pet-subpage">
      <section className="pet-subpage-intro">
        <span className="pet-kicker">Personal notepad</span>
        <h1>Personal Reminders</h1>
        <p>Keep owner notes, care reminders, and pet-specific tasks in one place.</p>
      </section>

      <section className="reminder-layout">
        <div className="notepad-card">
          <textarea
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write a reminder about your pet..."
            value={draft}
          />
          <div className="reminder-form-grid">
            <label>
              Pet
              <select value={pet} onChange={(event) => setPet(event.target.value)}>
                {pets.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              Category
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {categories.filter((item) => item !== "All").map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              Due Date & Time
              <input value={due} onChange={(event) => setDue(event.target.value)} type="datetime-local" />
            </label>
            <label>
              Recurrence
              <select value={recurrence} onChange={(event) => setRecurrence(event.target.value)}>
                {recurrences.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            {recurrence === "Every X Days" && (
              <label>
                Every X Days
                <input value={customDays} onChange={(event) => setCustomDays(event.target.value)} type="number" min="1" />
              </label>
            )}
            <label>
              Priority
              <select value={priority} onChange={(event) => setPriority(event.target.value)}>
                {priorities.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              Notification
              <select value={notify} onChange={(event) => setNotify(event.target.value)}>
                <option>Browser</option>
                <option>Email</option>
                <option>Browser + Email</option>
              </select>
            </label>
          </div>
          <button onClick={addNote} type="button">
            Save reminder
          </button>
        </div>

        <div className="note-list">
          <div className="reminder-toolbar">
            <div>
              {["Pending", "Completed"].map((tab) => (
                <button
                  className={activeTab === tab ? "active" : ""}
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  type="button"
                >
                  {tab === "Completed" ? "History" : tab}
                </button>
              ))}
            </div>
            <select value={activeCategory} onChange={(event) => setActiveCategory(event.target.value)}>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select value={activePet} onChange={(event) => setActivePet(event.target.value)}>
              <option>All</option>
              {pets.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          {visibleNotes.map((note, index) => (
            <article
              className={`note-card priority-${note.priority || "routine"}`}
              draggable
              key={`${note.text}-${note.originalIndex}`}
            >
              <div className="note-card-heading">
                <label>
                  <input
                    checked={(note.status || "Pending") === "Completed"}
                    onChange={(event) =>
                      updateStatus(note.originalIndex, event.target.checked ? "Completed" : "Pending")
                    }
                    type="checkbox"
                  />
                  <span>Reminder {visibleNotes.length - index}</span>
                </label>
                <div>
                  <button onClick={() => moveReminder(note.originalIndex, -1)} type="button">Up</button>
                  <button onClick={() => moveReminder(note.originalIndex, 1)} type="button">Down</button>
                </div>
              </div>
              <p>{note.text}</p>
              <div className="reminder-meta-row">
                <span>{note.pet || "All pets"}</span>
                <span>{note.category || "General"}</span>
                <span>{note.recurrence || "None"}{note.customDays ? ` (${note.customDays} days)` : ""}</span>
                <span>{note.notify || "Browser"} notification</span>
                {note.due && <span>Due {new Date(note.due).toLocaleString()}</span>}
              </div>
              <div className="reminder-quick-actions">
                {(note.category === "Vet Visit" || note.text.toLowerCase().includes("clinic")) && (
                  <>
                    <button type="button">Message Clinic</button>
                    <a href="/appointments">Book Appointment</a>
                  </>
                )}
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(note.text)}&details=${encodeURIComponent(`${note.pet || "Pet"} reminder via PetSync`)}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  Add to Calendar
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default PetReminders;
