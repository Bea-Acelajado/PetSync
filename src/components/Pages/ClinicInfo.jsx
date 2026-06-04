import { useEffect, useState } from "react";
import { loadCollection } from "../../petsyncData";

const faqs = [
  {
    question: "What symptoms need urgent veterinary attention?",
    category: "Emergency Care",
    views: 1240,
    answer:
      "Difficulty breathing, repeated vomiting, seizures, collapse, severe bleeding, bloated abdomen, and sudden inability to walk should be treated as urgent.",
    reviewedBy: "Reviewed by Dr. Elena Rodriguez, DVM",
    reviewer: {
      name: "Dr. Elena Rodriguez",
      specialty: "Surgery and preventive care",
      bio: "Fear Free Certified veterinarian focused on calm, clear treatment plans.",
      profile: "/appointments/veterinarians/dr-elena-rodriguez",
    },
  },
  {
    question: "How often should pets receive wellness check-ups?",
    category: "General Wellness",
    views: 980,
    answer:
      "Most healthy adult pets benefit from a yearly exam. Puppies, kittens, senior pets, and pets with chronic conditions may need more frequent visits.",
    reviewedBy: "Reviewed by Dr. Olivia Parker, DVM",
    reviewer: {
      name: "Dr. Olivia Parker",
      specialty: "Dental health and wellness",
      bio: "Preventive care advocate helping owners build simple wellness routines.",
      profile: "/appointments/veterinarians/dr-olivia-parker",
    },
  },
  {
    question: "What should I prepare before an appointment?",
    category: "General Wellness",
    views: 760,
    answer:
      "Bring vaccination records, current medicines, recent symptoms, diet details, and photos or videos of behavior that may not happen at the clinic.",
    reviewedBy: "Reviewed by Dr. William Carter, DVM",
    reviewer: {
      name: "Dr. William Carter",
      specialty: "Emergency medicine",
      bio: "Critical care clinician focused on practical preparation and triage.",
      profile: "/appointments/veterinarians/dr-william-carter",
    },
  },
  {
    question: "Can fish, birds, rabbits, and hamsters use PetSync too?",
    category: "Nutrition",
    views: 640,
    answer:
      "Yes. PetSync is designed for different pet types, and exotic or small-pet questions should be matched with clinics that list those specialties.",
    reviewedBy: "Reviewed by Dr. Amanda Lee, DVM",
    reviewer: {
      name: "Dr. Amanda Lee",
      specialty: "Bird, fish, and exotic pet care",
      bio: "Exotic companion specialist helping owners improve habitat and daily care.",
      profile: "/appointments/veterinarians/dr-amanda-lee",
    },
  },
  {
    question: "How can I tell if behavior changes are medical or training related?",
    category: "Behavior",
    views: 590,
    answer:
      "Sudden aggression, hiding, appetite changes, litter box issues, or sleep disruption can have medical causes and should be discussed with a veterinarian.",
    reviewedBy: "Reviewed by Dr. Olivia Parker, DVM",
    reviewer: {
      name: "Dr. Olivia Parker",
      specialty: "Dental health and wellness",
      bio: "Preventive care advocate helping owners build simple wellness routines.",
      profile: "/appointments/veterinarians/dr-olivia-parker",
    },
  },
];

const categories = ["All", "General Wellness", "Emergency Care", "Nutrition", "Behavior"];

const ClinicInfo = () => {
  const [items, setItems] = useState(faqs);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openQuestion, setOpenQuestion] = useState(faqs[0].question);
  const [savedItems, setSavedItems] = useState([]);
  const [selectedReviewer, setSelectedReviewer] = useState(null);
  const [askOpen, setAskOpen] = useState(false);

  useEffect(() => {
    const loadFaqs = async () => {
      const data = await loadCollection("trustworthyInfo", faqs);
      setItems(data);
    };

    loadFaqs();
  }, []);

  const visibleItems = items.filter((item) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !query ||
      item.question.toLowerCase().includes(query) ||
      item.answer.toLowerCase().includes(query);
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const trendingItems = [...items].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);

  const toggleSaved = (question) => {
    setSavedItems((current) =>
      current.includes(question)
        ? current.filter((item) => item !== question)
        : [...current, question]
    );
  };

  return (
    <main className="appointment-directory-page">
      <section className="appointment-intro compact">
        <span className="appointment-kicker">Professional guidance</span>
        <h1>Trustworthy Information</h1>
        <p>
          Practical pet health answers reviewed by veterinary professionals and
          participating clinics.
        </p>
      </section>

      <section className="info-controls" aria-label="Information search and filters">
        <label>
          Search
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search questions or symptoms"
          />
        </label>
        <div className="info-category-row">
          {categories.map((category) => (
            <button
              className={activeCategory === category ? "active" : ""}
              key={category}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="info-layout">
        <aside className="trending-info-card">
          <h2>Most Viewed</h2>
          {trendingItems.map((item) => (
            <button
              key={item.question}
              onClick={() => {
                setActiveCategory("All");
                setOpenQuestion(item.question);
              }}
              type="button"
            >
              {item.question}
              <span>{item.views} views</span>
            </button>
          ))}
          <button className="ask-pro-button" onClick={() => setAskOpen(true)} type="button">
            Ask a Pro
          </button>
        </aside>

        <section className="faq-list">
          {visibleItems.map((item) => {
            const isOpen = openQuestion === item.question;

            return (
              <article className="faq-card" key={item.question}>
                <button
                  className="faq-question-button"
                  onClick={() => setOpenQuestion(isOpen ? "" : item.question)}
                  type="button"
                >
                  <span>{item.question}</span>
                  <strong>{isOpen ? "-" : "+"}</strong>
                </button>
                {isOpen && (
                  <div className="faq-answer-panel">
                    <p>{item.answer}</p>
                    <div className="faq-card-actions">
                      <button
                        className={savedItems.includes(item.question) ? "saved" : ""}
                        onClick={() => toggleSaved(item.question)}
                        type="button"
                      >
                        {savedItems.includes(item.question) ? "Saved" : "Save for Later"}
                      </button>
                      <button
                        onClick={() => setSelectedReviewer(item.reviewer)}
                        type="button"
                      >
                        {item.reviewedBy}
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
          {visibleItems.length === 0 && (
            <article className="faq-card">
              <h2>No answers found</h2>
              <p>Try another search or submit a question to a participating veterinarian.</p>
            </article>
          )}
        </section>
      </section>

      {selectedReviewer && (
        <div className="info-modal-backdrop" role="presentation">
          <section className="reviewer-modal" role="dialog" aria-modal="true">
            <span>Reviewed by</span>
            <h2>{selectedReviewer.name}, DVM</h2>
            <strong>{selectedReviewer.specialty}</strong>
            <p>{selectedReviewer.bio}</p>
            <div>
              <a href={selectedReviewer.profile}>Full Profile</a>
              <button type="button" onClick={() => setSelectedReviewer(null)}>
                Close
              </button>
            </div>
          </section>
        </div>
      )}

      {askOpen && (
        <div className="info-modal-backdrop" role="presentation">
          <section className="reviewer-modal" role="dialog" aria-modal="true">
            <span>Ask a Pro</span>
            <h2>Submit a Question</h2>
            <label>
              Your question
              <textarea placeholder="Describe your pet health question." rows="5" />
            </label>
            <div>
              <button type="button" onClick={() => setAskOpen(false)}>
                Submit Question
              </button>
              <button type="button" onClick={() => setAskOpen(false)}>
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default ClinicInfo;
