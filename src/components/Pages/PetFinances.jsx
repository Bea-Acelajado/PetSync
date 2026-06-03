import { useEffect, useState } from "react";
import { loadCollection } from "../../petsyncData";

const financeRows = [
  { item: "Annual wellness checkup", pet: "Luna", status: "Paid", amount: 65 },
  { item: "Vaccination booster", pet: "Milo", status: "Pending", amount: 48 },
  { item: "Dental cleaning deposit", pet: "Luna", status: "Pending", amount: 120 },
  { item: "Skin irritation follow-up", pet: "Luna", status: "Paid", amount: 42 },
];

const PetFinances = () => {
  const [rows, setRows] = useState(financeRows);

  useEffect(() => {
    const loadFinances = async () => {
      const data = await loadCollection("petFinances", financeRows);
      setRows(data);
    };

    loadFinances();
  }, []);

  const paid = rows
    .filter((row) => row.status === "Paid")
    .reduce((total, row) => total + Number(row.amount || 0), 0);
  const pending = rows
    .filter((row) => row.status === "Pending")
    .reduce((total, row) => total + Number(row.amount || 0), 0);

  return (
    <main className="pet-subpage">
      <section className="pet-subpage-intro">
        <span className="pet-kicker">Pet payments</span>
        <h1>Pet Finances</h1>
        <p>Track balances already paid and balances still needed for appointments.</p>
      </section>

      <section className="finance-summary-grid">
        <article>
          <span>Total paid</span>
          <strong>${paid.toFixed(2)}</strong>
        </article>
        <article>
          <span>Balance to pay</span>
          <strong>${pending.toFixed(2)}</strong>
        </article>
        <article>
          <span>Estimated total</span>
          <strong>${(paid + pending).toFixed(2)}</strong>
        </article>
      </section>

      <section className="finance-table">
        {rows.map((row) => (
          <article key={`${row.item}-${row.pet}`}>
            <div>
              <h2>{row.item}</h2>
              <p>{row.pet}</p>
            </div>
            <span className={row.status === "Paid" ? "paid" : "pending"}>
              {row.status}
            </span>
            <strong>${Number(row.amount || 0).toFixed(2)}</strong>
          </article>
        ))}
      </section>
    </main>
  );
};

export default PetFinances;
