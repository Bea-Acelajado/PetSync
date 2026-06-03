import { useEffect, useState } from "react";
import { loadCollection, saveDocument } from "../../petsyncData";

const startingNotes = [
  "Give Luna heartworm medicine every first Monday of the month.",
  "Ask clinic about Milo's next booster schedule.",
];

const PetReminders = () => {
  const [notes, setNotes] = useState(startingNotes);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const loadNotes = async () => {
      const data = await loadCollection(
        "petReminders",
        startingNotes.map((text) => ({ text }))
      );
      setNotes(data.map((note) => note.text || note));
    };

    loadNotes();
  }, []);

  const addNote = async () => {
    if (!draft.trim()) {
      alert("please write a reminder first");
      return;
    }

    const note = draft.trim();
    setNotes((current) => [note, ...current]);
    await saveDocument("petReminders", { text: note });
    setDraft("");
  };

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
          <button onClick={addNote} type="button">
            Save reminder
          </button>
        </div>

        <div className="note-list">
          {notes.map((note, index) => (
            <article className="note-card" key={`${note}-${index}`}>
              <span>Reminder {notes.length - index}</span>
              <p>{note}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default PetReminders;
