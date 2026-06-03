import { useEffect, useState } from "react";
import { loadCollection } from "../../petsyncData";

const ownerPets = [
  { name: "Luna", type: "Dog", breed: "Golden Retriever", status: "Active passport" },
  { name: "Milo", type: "Cat", breed: "Domestic Shorthair", status: "Records updated" },
];

const ownerProfile = {
  name: "Dr. Alex Chen",
  role: "Pet Owner",
  email: "alex.chen@example.com",
  phone: "+1 (555) 014-7289",
  location: "San Francisco, CA",
  preferredClinic: "Bay Area Pet Hospital",
  pets: 2,
  appointments: 6,
  communityPosts: "12 posts",
  memberSince: "2024",
};

const activities = [
  {
    title: "Booked consultation",
    detail: "Bay Area Pet Hospital - Luna",
    date: "Today",
  },
  {
    title: "Saved reminder",
    detail: "Milo booster schedule note",
    date: "Yesterday",
  },
  {
    title: "Community story posted",
    detail: "Shared Luna's progress update",
    date: "May 30",
  },
];

const OwnerDashboard = () => {
  const [profile, setProfile] = useState(ownerProfile);
  const [pets, setPets] = useState(ownerPets);
  const [activityItems, setActivityItems] = useState(activities);

  useEffect(() => {
    const loadProfile = async () => {
      const profileData = await loadCollection("ownerProfile", [ownerProfile]);
      const petsData = await loadCollection("ownerPets", ownerPets);
      const activitiesData = await loadCollection("ownerActivities", activities);

      setProfile(profileData[0] || ownerProfile);
      setPets(petsData);
      setActivityItems(activitiesData);
    };

    loadProfile();
  }, []);

  return (
    <main className="owner-dashboard-page">
      <section className="owner-dashboard-top">
        <div>
          <span className="owner-kicker">Owner profile</span>
          <h1>{profile.name}</h1>
          <p>Pet owner account for appointments, pet records, reminders, and community activity.</p>
        </div>
        <button type="button">Edit profile</button>
      </section>

      <section className="owner-dashboard-grid">
        <aside className="owner-profile-card">
          <img src="/assets/users/user-icon.svg" alt="Owner profile" />
          <h2>{profile.name}</h2>
          <p>{profile.role}</p>
          <div className="owner-stat-grid">
            <span>
              Pets <strong>{profile.pets}</strong>
            </span>
            <span>
              Appointments <strong>{profile.appointments}</strong>
            </span>
            <span>
              Community <strong>{profile.communityPosts}</strong>
            </span>
            <span>
              Member since <strong>{profile.memberSince}</strong>
            </span>
          </div>
        </aside>

        <section className="owner-detail-card">
          <h2>Account Details</h2>
          <div className="owner-detail-grid">
            <article>
              <span>Email</span>
              <strong>{profile.email}</strong>
            </article>
            <article>
              <span>Phone</span>
              <strong>{profile.phone}</strong>
            </article>
            <article>
              <span>Location</span>
              <strong>{profile.location}</strong>
            </article>
            <article>
              <span>Preferred clinic</span>
              <strong>{profile.preferredClinic}</strong>
            </article>
          </div>
        </section>

        <section className="owner-pets-card">
          <h2>Linked Pets</h2>
          <div className="owner-pet-list">
            {pets.map((pet) => (
              <article key={pet.name}>
                <div>
                  <strong>{pet.name}</strong>
                  <span>
                    {pet.type} - {pet.breed}
                  </span>
                </div>
                <em>{pet.status}</em>
              </article>
            ))}
          </div>
        </section>

        <section className="owner-activity-card">
          <h2>Recent Activity</h2>
          <div className="owner-activity-list">
            {activityItems.map((activity) => (
              <article key={`${activity.title}-${activity.date}`}>
                <span />
                <div>
                  <header>
                    <h3>{activity.title}</h3>
                    <small>{activity.date}</small>
                  </header>
                  <p>{activity.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="owner-preferences-card">
          <h2>Care Preferences</h2>
          <div className="preference-list">
            <span>Email appointment reminders</span>
            <span>Community adoption alerts</span>
            <span>Monthly finance summaries</span>
            <span>Veterinarian-reviewed care tips</span>
          </div>
        </section>
      </section>
    </main>
  );
};

export default OwnerDashboard;
