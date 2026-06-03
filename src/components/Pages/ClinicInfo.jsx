import { useEffect, useState } from "react";
import { loadCollection } from "../../petsyncData";

const faqs = [
  {
    question: "What symptoms need urgent veterinary attention?",
    answer:
      "Difficulty breathing, repeated vomiting, seizures, collapse, severe bleeding, bloated abdomen, and sudden inability to walk should be treated as urgent.",
    reviewedBy: "Reviewed by Dr. Elena Rodriguez, DVM",
  },
  {
    question: "How often should pets receive wellness check-ups?",
    answer:
      "Most healthy adult pets benefit from a yearly exam. Puppies, kittens, senior pets, and pets with chronic conditions may need more frequent visits.",
    reviewedBy: "Reviewed by Dr. Olivia Parker, DVM",
  },
  {
    question: "What should I prepare before an appointment?",
    answer:
      "Bring vaccination records, current medicines, recent symptoms, diet details, and photos or videos of behavior that may not happen at the clinic.",
    reviewedBy: "Reviewed by Dr. William Carter, DVM",
  },
  {
    question: "Can fish, birds, rabbits, and hamsters use PetSync too?",
    answer:
      "Yes. PetSync is designed for different pet types, and exotic or small-pet questions should be matched with clinics that list those specialties.",
    reviewedBy: "Reviewed by Dr. Amanda Lee, DVM",
  },
];

const ClinicInfo = () => {
  const [items, setItems] = useState(faqs);

  useEffect(() => {
    const loadFaqs = async () => {
      const data = await loadCollection("trustworthyInfo", faqs);
      setItems(data);
    };

    loadFaqs();
  }, []);

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

      <section className="faq-list">
        {items.map((item) => (
          <article className="faq-card" key={item.question}>
            <h2>{item.question}</h2>
            <p>{item.answer}</p>
            <span>{item.reviewedBy}</span>
          </article>
        ))}
      </section>
    </main>
  );
};

export default ClinicInfo;
