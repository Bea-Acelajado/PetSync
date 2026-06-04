import { useMemo, useState } from "react";
import { saveDocument } from "../../petsyncData";

const clinics = [
  {
    name: "Bay Area Pet Hospital",
    area: "Downtown",
    distance: "0.8 miles away",
    rating: "4.9",
    tags: ["Urgent care", "Surgery"],
  },
  {
    name: "Paws & Whiskers Clinic",
    area: "Pacific Heights",
    distance: "2.4 miles away",
    rating: "4.7",
    tags: ["Dentistry", "Wellness"],
  },
  {
    name: "Mission District Vets",
    area: "Mission",
    distance: "3.1 miles away",
    rating: "4.5",
    tags: ["X-ray", "Grooming"],
  },
];

const visitReasons = ["Check-up", "Vaccination", "Surgery", "Grooming"];
const pets = ["Luna", "Milo"];
const serviceCosts = {
  "Check-up": 65,
  Vaccination: 113,
  Surgery: 185,
  Grooming: 105,
};
const takenSlots = {
  "1": ["09:00 AM"],
  "2": ["10:30 AM", "04:00 PM"],
  "3": ["05:30 PM"],
  "4": ["02:30 PM"],
};
const dates = [
  { day: "MON", date: "28", muted: true },
  { day: "TUE", date: "29", muted: true },
  { day: "WED", date: "30", muted: true },
  { day: "THU", date: "1" },
  { day: "FRI", date: "2" },
  { day: "SAT", date: "3" },
  { day: "SUN", date: "4" },
];
const times = ["09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM", "05:30 PM"];

const BookAppointment = () => {
  const [selectedClinic, setSelectedClinic] = useState(clinics[0]);
  const [favoriteClinics, setFavoriteClinics] = useState([]);
  const [selectedPet, setSelectedPet] = useState(pets[0]);
  const [reason, setReason] = useState("Check-up");
  const [notes, setNotes] = useState("");
  const [attachment, setAttachment] = useState("");
  const [selectedDate, setSelectedDate] = useState("3");
  const [time, setTime] = useState("01:00 PM");
  const [confirmation, setConfirmation] = useState(null);

  const doctor = useMemo(
    () => ({
      name: selectedClinic.name === "Bay Area Pet Hospital" ? "Dr. Elena Rodriguez" : "Dr. Marcus Chen",
      title: selectedClinic.name === "Mission District Vets" ? "Emergency Veterinarian" : "Senior Surgeon",
      experience: selectedClinic.name === "Paws & Whiskers Clinic" ? "9 yrs exp." : "12 yrs exp.",
      photo: selectedClinic.name === "Paws & Whiskers Clinic" ? "/assets/doctors/olivia.jpg" : "/assets/doctors/anne.jpg",
    }),
    [selectedClinic]
  );

  const estimatedCost = serviceCosts[reason] || 65;
  const estimatedWait = selectedClinic.name === "Bay Area Pet Hospital" ? "10-15 min" : "15-25 min";

  const calendarUrl = confirmation
    ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        `PetSync appointment for ${confirmation.pet}`
      )}&details=${encodeURIComponent(
        `${confirmation.reason} with ${confirmation.doctor} at ${confirmation.clinic}. Reference: ${confirmation.reference}`
      )}&location=${encodeURIComponent(confirmation.clinic)}`
    : "";

  const toggleFavoriteClinic = (clinicName) => {
    setFavoriteClinics((current) =>
      current.includes(clinicName)
        ? current.filter((name) => name !== clinicName)
        : [...current, clinicName]
    );
  };

  const selectDate = (date) => {
    const nextAvailableTime = times.find((item) => !takenSlots[date]?.includes(item));

    setSelectedDate(date);
    setTime(nextAvailableTime || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !reason.trim() || !time) {
      alert("please complete the form first");
      return;
    }

    const reference = `PS-${Date.now().toString().slice(-6)}`;
    const appointment = {
      pet: selectedPet,
      clinic: selectedClinic.name,
      date: selectedDate,
      time,
      reason,
      notes,
      attachment,
      doctor: doctor.name,
      fee: estimatedCost,
      estimatedWait,
      reference,
      status: "Pending",
    };

    await saveDocument("appointments", appointment);
    console.log("appointment booked:", appointment);

    setConfirmation(appointment);
  };

  return (
    <main className="appointment-page">
      <section className="appointment-intro">
        <span className="appointment-kicker">VetCare Connect</span>
        <h1>Book a Consultation</h1>
        <p>
          Connect with nearby veterinary clinics for secure, professional, and
          compassionate care for your companions.
        </p>
      </section>

      <form className="booking-grid" onSubmit={handleSubmit}>
        <section className="booking-card clinic-directory">
          <h2>Clinic Directory</h2>
          <label>
            Location
            <input readOnly value="San Francisco, CA" />
          </label>
          <label>
            Specialty
            <select defaultValue="General Practice">
              <option>General Practice</option>
              <option>Emergency Care</option>
              <option>Dentistry</option>
              <option>Surgery</option>
            </select>
          </label>

          <div className="clinic-list">
            {clinics.map((clinic) => (
              <button
                className={selectedClinic.name === clinic.name ? "active" : ""}
                key={clinic.name}
                onClick={() => setSelectedClinic(clinic)}
                type="button"
              >
                <span>
                  <strong>{clinic.name}</strong>
                  <small>
                    {clinic.area} - {clinic.distance}
                  </small>
                </span>
                <span className="clinic-rating">star {clinic.rating}</span>
                <span
                  className={`clinic-favorite ${favoriteClinics.includes(clinic.name) ? "saved" : ""}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleFavoriteClinic(clinic.name);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      event.stopPropagation();
                      toggleFavoriteClinic(clinic.name);
                    }
                  }}
                  aria-label={`Save ${clinic.name}`}
                >
                  heart
                </span>
                <span className="clinic-tags">
                  {clinic.tags.map((tag) => (
                    <em key={tag}>{tag}</em>
                  ))}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="booking-card visit-details">
          <h2>Visit Details</h2>
          <label>
            Pet
            <select value={selectedPet} onChange={(event) => setSelectedPet(event.target.value)}>
              {pets.map((pet) => (
                <option key={pet}>{pet}</option>
              ))}
            </select>
          </label>
          <p>Select the primary reason for your visit.</p>
          <div className="visit-reason-grid">
            {visitReasons.map((item) => (
              <button
                className={reason === item ? "active" : ""}
                key={item}
                onClick={() => setReason(item)}
                type="button"
              >
                <span>{item}</span>
              </button>
            ))}
          </div>
          <label>
            Additional Notes or Symptoms
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Describe symptoms, behavior changes, or follow-up context."
              rows="4"
            />
          </label>
          <label className="record-upload">
            Upload Images or Previous Records
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(event) => setAttachment(event.target.files?.[0]?.name || "")}
            />
            <span>{attachment || "Attach a photo, PDF, or record"}</span>
          </label>
        </section>

        <section className="booking-card doctor-card">
          <h2>Preferred Doctor</h2>
          <div className="doctor-profile">
            <img src={doctor.photo} alt={doctor.name} />
            <div>
              <strong>{doctor.name}</strong>
              <span>
                {doctor.title} - {doctor.experience}
              </span>
              <small>Next: Tomorrow 9:00 AM</small>
            </div>
          </div>
          <dl>
            <div>
              <dt>Clinic Rating</dt>
              <dd>{selectedClinic.rating}/5.0</dd>
            </div>
            <div>
              <dt>Consultation Fee</dt>
              <dd>$65.00</dd>
            </div>
            <div>
              <dt>Estimated Wait</dt>
              <dd>{estimatedWait}</dd>
            </div>
            <div>
              <dt>Total Estimated Cost</dt>
              <dd>${estimatedCost}.00</dd>
            </div>
          </dl>
        </section>

        <section className="booking-card date-card">
          <div className="card-heading-row">
            <h2>Select Date & Time</h2>
            <span>&lt; &gt;</span>
          </div>
          <div className="date-grid">
            {dates.map((item) => (
              <button
                className={`${selectedDate === item.date ? "active" : ""} ${item.muted ? "muted" : ""}`}
                disabled={item.muted}
                key={`${item.day}-${item.date}`}
                onClick={() => selectDate(item.date)}
                type="button"
              >
                <span>{item.day}</span>
                <strong>{item.date}</strong>
              </button>
            ))}
          </div>
          <div className="time-row">
            {times.map((item) => {
              const isTaken = takenSlots[selectedDate]?.includes(item);

              return (
                <button
                  className={time === item ? "active" : ""}
                  disabled={isTaken}
                  key={item}
                  onClick={() => setTime(item)}
                  type="button"
                >
                  {item}
                  {isTaken && <span>Taken</span>}
                </button>
              );
            })}
          </div>
        </section>

        <section className="appointment-summary">
          <div>
            <h2>Appointment Summary</h2>
            <p>
              {reason} for {selectedPet} at {selectedClinic.name} with{" "}
              {doctor.name} on day {selectedDate} at {time}.
            </p>
            <strong>Total estimate: ${estimatedCost}.00</strong>
          </div>
          <button type="submit">Confirm appointment</button>
        </section>
      </form>

      {confirmation && (
        <div className="booking-modal-backdrop" role="presentation">
          <section className="booking-success-modal" role="dialog" aria-modal="true">
            <span>Appointment confirmed</span>
            <h2>Reference {confirmation.reference}</h2>
            <p>
              {confirmation.reason} for {confirmation.pet} at{" "}
              {confirmation.clinic} with {confirmation.doctor} on day{" "}
              {confirmation.date} at {confirmation.time}.
            </p>
            <div className="booking-success-actions">
              <a href={calendarUrl} target="_blank" rel="noreferrer">
                Add to Calendar
              </a>
              <button type="button" onClick={() => setConfirmation(null)}>
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default BookAppointment;
