import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../theme/ThemeContext";

const petThemes = [
  { id: "dog", label: "Dog", icon: "dog" },
  { id: "cat", label: "Cat", icon: "cat" },
  { id: "bird", label: "Bird", icon: "bird" },
  { id: "fish", label: "Fish", icon: "fish" },
  { id: "rabbit", label: "Rabbit", icon: "rabbit" },
  { id: "hamster", label: "Hamster", icon: "hamster" },
  { id: "none", label: "None", icon: "none" },
];

const paletteThemes = [
  { id: "deep", label: "Deep blue", color: "#033047" },
  { id: "harbor", label: "Harbor", color: "#304C62" },
  { id: "slate", label: "Slate", color: "#5C677D" },
  { id: "alert", label: "Light gray", color: "#D9D9D9" },
];

const careCards = [
  {
    title: "Appointments",
    text: "Book clinic visits and keep care schedules organized.",
    asset: "/assets/services/exams.png",
  },
  {
    title: "Pet Records",
    text: "Track vaccines, reminders, health notes, and expenses.",
    asset: "/assets/services/vaccination.png",
  },
  {
    title: "Community",
    text: "Connect with pet owners, adoption posts, and local care tips.",
    asset: "/assets/services/rehabilitation.png",
  },
];

const MainPage = () => {
  const { mode, setMode } = useTheme();
  const pageRef = useRef(null);
  const [petTheme, setPetTheme] = useState("dog");
  const [paletteTheme, setPaletteTheme] = useState("deep");

  const selectedTheme = useMemo(
    () => petThemes.find((theme) => theme.id === petTheme),
    [petTheme]
  );

  useEffect(() => {
    const page = pageRef.current;

    if (!page) {
      return undefined;
    }

    const revealItems = page.querySelectorAll(".reveal-on-scroll");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    revealItems.forEach((item) => observer.observe(item));

    const updateHeroMotion = () => {
      const hero = page.querySelector(".petsync-hero");

      if (!hero) {
        return;
      }

      const { top, height } = hero.getBoundingClientRect();
      const progress = Math.min(Math.max((0 - top) / height, 0), 1);
      hero.style.setProperty("--hero-parallax", `${progress * 28}px`);
    };

    updateHeroMotion();
    window.addEventListener("scroll", updateHeroMotion, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateHeroMotion);
    };
  }, []);

  return (
    <main
      ref={pageRef}
      className="petsync-home"
      data-mode={mode}
      data-pet={petTheme}
      data-palette={paletteTheme}
    >
      <section className="petsync-hero">
        <div className="pet-print pet-print-one" />
        <div className="pet-print pet-print-two" />
        <div className="water-ring water-ring-one" />
        <div className="water-ring water-ring-two" />

        <div className="petsync-hero-content reveal-on-scroll">
          <span className="petsync-kicker">Digital veterinary care</span>
          <h1>PetSync</h1>
          <p>
            A calm, organized space for appointments, pet records, reminders,
            community support, and everyday care decisions.
          </p>
          <div className="petsync-hero-actions">
            <Link to="/appointments">Book appointment</Link>
            <Link to="/pets">Open dashboard</Link>
          </div>
        </div>
      </section>

      <section className="petsync-panel petsync-theme-panel reveal-on-scroll">
        <div>
          <span className="petsync-kicker">Dashboard themes</span>
          <h2>Make the workspace match your pet</h2>
        </div>

        <div className="theme-controls">
          <div className="theme-group">
            <span>Mode</span>
            <div className="segmented-control" aria-label="Display mode">
              <button
                className={mode === "light" ? "active" : ""}
                onClick={() => setMode("light")}
                type="button"
              >
                Light
              </button>
              <button
                className={mode === "dark" ? "active" : ""}
                onClick={() => setMode("dark")}
                type="button"
              >
                Dark
              </button>
            </div>
          </div>

          <div className="theme-group">
            <span>Pet</span>
            <div className="pet-theme-grid">
              {petThemes.map((theme) => (
                <button
                  className={petTheme === theme.id ? "active" : ""}
                  key={theme.id}
                  onClick={() => setPetTheme(theme.id)}
                  type="button"
                >
                  <span className={`pet-symbol ${theme.icon}`} />
                  {theme.label}
                </button>
              ))}
            </div>
            <div className="theme-request-ticket">
              <label htmlFor="pet-theme-request">Add pet theme ticket</label>
              <div>
                <input id="pet-theme-request" type="text" placeholder="Request a pet theme" />
                <button type="button">Submit</button>
              </div>
            </div>
          </div>

          <div className="theme-group">
            <span>Background</span>
            <div className="palette-row">
              {paletteThemes.map((theme) => (
                <button
                  aria-label={theme.label}
                  className={paletteTheme === theme.id ? "active" : ""}
                  key={theme.id}
                  onClick={() => setPaletteTheme(theme.id)}
                  style={{ backgroundColor: theme.color }}
                  type="button"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="theme-preview dashboard-preview-card">
          <span className={`pet-symbol large ${selectedTheme?.icon || "dog"}`} />
          <div>
            <h3>
              {selectedTheme?.id === "none"
                ? "No pet theme dashboard"
                : `${selectedTheme?.label} care dashboard`}
            </h3>
            <p>
              Theme choices update this main page instantly and can later be
              saved to a user profile.
            </p>
          </div>
        </div>
      </section>

      <section className="petsync-panel feature-panel reveal-on-scroll">
        <span className="petsync-kicker">What PetSync is about</span>
        <h2>Everything a pet owner needs in one care flow</h2>
        <div className="care-grid">
          {careCards.map((card) => (
            <article className="care-card reveal-on-scroll" key={card.title}>
              <img src={card.asset} alt="" />
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="petsync-about reveal-on-scroll">
        <img src="/assets/about-us/dog.jpg" alt="Dog receiving gentle care" />
        <div>
          <span className="petsync-kicker">About us</span>
          <h2>Built around better, kinder pet care</h2>
          <p>
            PetSync helps owners and veterinary teams stay aligned through
            practical tools for scheduling, records, reminders, and community
            connection.
          </p>
        </div>
      </section>
    </main>
  );
};

export default MainPage;
