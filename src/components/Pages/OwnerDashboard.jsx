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

const loginSessions = [
  { device: "Chrome on Windows", location: "San Francisco, CA", status: "Current session" },
  { device: "PetSync Mobile", location: "San Francisco, CA", status: "Last active yesterday" },
];

const billingHistory = [
  { item: "PetSync Care Plus", date: "May 1, 2026", amount: "$12.00" },
  { item: "PetSync Care Plus", date: "Apr 1, 2026", amount: "$12.00" },
];

const OwnerDashboard = () => {
  const [profile, setProfile] = useState(ownerProfile);
  const [pets, setPets] = useState(ownerPets);

  useEffect(() => {
    const loadProfile = async () => {
      const profileData = await loadCollection("ownerProfile", [ownerProfile]);
      const petsData = await loadCollection("ownerPets", ownerPets);

      setProfile(profileData[0] || ownerProfile);
      setPets(petsData);
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
          <label className="owner-upload-control">
            Upload profile picture
            <input type="file" accept="image/*" />
          </label>
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

        <section className="owner-shared-card">
          <h2>Family Access</h2>
          <div className="owner-method-list">
            <article>
              <strong>Maria Chen</strong>
              <span>Shared owner - Luna and Milo</span>
              <button type="button">Manage access</button>
            </article>
            <article>
              <strong>Invite family member</strong>
              <span>Share pet records, reminders, and appointments.</span>
              <button type="button">Send invite</button>
            </article>
          </div>
        </section>

        <section className="owner-privacy-card">
          <h2>Data & Privacy</h2>
          <div className="owner-action-grid">
            <button type="button">Change password</button>
            <label>
              <input type="checkbox" />
              Enable two-factor authentication
            </label>
            <button type="button">Download data archive</button>
            <button type="button">Request account deletion</button>
          </div>
          <div className="owner-session-list">
            {loginSessions.map((session) => (
              <article key={session.device}>
                <strong>{session.device}</strong>
                <span>{session.location}</span>
                <em>{session.status}</em>
              </article>
            ))}
          </div>
        </section>

        <section className="owner-billing-card">
          <h2>Subscription & Billing</h2>
          <div className="owner-method-list">
            <article>
              <strong>PetSync Care Plus</strong>
              <span>Active plan - renews monthly</span>
              <button type="button">Manage plan</button>
            </article>
            {billingHistory.map((invoice) => (
              <article key={`${invoice.item}-${invoice.date}`}>
                <strong>{invoice.item}</strong>
                <span>{invoice.date}</span>
                <em>{invoice.amount}</em>
              </article>
            ))}
          </div>
        </section>

      </section>
    </main>
  );
};

export default OwnerDashboard;
