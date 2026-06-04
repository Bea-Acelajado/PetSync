import { useEffect, useState } from "react";
import { loadCollection } from "../../petsyncData";

const financeRows = [
  { item: "Annual wellness checkup", pet: "Luna", status: "Paid", amount: 65, category: "Checkups", month: "Jan", insured: true },
  { item: "Vaccination booster", pet: "Milo", status: "Pending", amount: 48, category: "Vaccines", month: "Feb", insured: false },
  { item: "Dental cleaning deposit", pet: "Luna", status: "Pending", amount: 120, category: "Grooming", month: "Mar", insured: true },
  { item: "Skin irritation follow-up", pet: "Luna", status: "Paid", amount: 42, category: "Emergency", month: "Apr", insured: false },
];

const PetFinances = () => {
  const [rows, setRows] = useState(financeRows);
  const [selectedPet, setSelectedPet] = useState("All");
  const [paymentRow, setPaymentRow] = useState(null);
  const [reminderOptIns, setReminderOptIns] = useState([]);
  const [insuranceClaims, setInsuranceClaims] = useState(
    financeRows.filter((row) => row.insured).map((row) => row.item)
  );

  useEffect(() => {
    const loadFinances = async () => {
      const data = await loadCollection("petFinances", financeRows);
      setRows(data);
    };

    loadFinances();
  }, []);

  const visibleRows = rows.filter((row) => selectedPet === "All" || row.pet === selectedPet);
  const pets = ["All", ...new Set(rows.map((row) => row.pet))];
  const paid = visibleRows
    .filter((row) => row.status === "Paid")
    .reduce((total, row) => total + Number(row.amount || 0), 0);
  const pending = visibleRows
    .filter((row) => row.status === "Pending")
    .reduce((total, row) => total + Number(row.amount || 0), 0);
  const monthTotals = ["Jan", "Feb", "Mar", "Apr"].map((month) => ({
    month,
    total: visibleRows
      .filter((row) => row.month === month)
      .reduce((sum, row) => sum + Number(row.amount || 0), 0),
  }));
  const categoryTotals = [...new Set(visibleRows.map((row) => row.category))].map((category) => ({
    category,
    total: visibleRows
      .filter((row) => row.category === category)
      .reduce((sum, row) => sum + Number(row.amount || 0), 0),
  }));

  const toggleReminder = (item) => {
    setReminderOptIns((current) =>
      current.includes(item) ? current.filter((rowItem) => rowItem !== item) : [...current, item]
    );
  };

  const toggleInsurance = (item) => {
    setInsuranceClaims((current) =>
      current.includes(item) ? current.filter((rowItem) => rowItem !== item) : [...current, item]
    );
  };

  return (
    <main className="pet-subpage">
      <section className="pet-subpage-intro">
        <span className="pet-kicker">Pet payments</span>
        <h1>Pet Finances</h1>
        <p>Track balances already paid and balances still needed for appointments.</p>
      </section>

      <div className="finance-toolbar">
        <label>
          Pet
          <select value={selectedPet} onChange={(event) => setSelectedPet(event.target.value)}>
            {pets.map((pet) => (
              <option key={pet}>{pet}</option>
            ))}
          </select>
        </label>
      </div>

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

      <section className="finance-insights-grid">
        <article className="finance-insight-card">
          <h2>Monthly Spending</h2>
          <div className="finance-bar-chart">
            {monthTotals.map((item) => (
              <span key={item.month} style={{ height: `${Math.max(item.total, 20)}px` }}>
                <strong>${item.total}</strong>
                <em>{item.month}</em>
              </span>
            ))}
          </div>
        </article>
        <article className="finance-insight-card">
          <h2>Category Breakdown</h2>
          <div className="finance-breakdown-list">
            {categoryTotals.map((item) => (
              <span key={item.category}>
                {item.category} <strong>${item.total.toFixed(2)}</strong>
              </span>
            ))}
          </div>
        </article>
      </section>

      <section className="finance-table">
        {visibleRows.map((row) => (
          <article key={`${row.item}-${row.pet}`}>
            <div>
              <h2>{row.item}</h2>
              <p>{row.pet} - {row.category}</p>
            </div>
            <span className={row.status === "Paid" ? "paid" : "pending"}>
              {row.status}
            </span>
            <strong>${Number(row.amount || 0).toFixed(2)}</strong>
            <div className="finance-row-actions">
              {row.status === "Pending" ? (
                <>
                  <button onClick={() => setPaymentRow(row)} type="button">Pay Now</button>
                  <label>
                    <input
                      checked={reminderOptIns.includes(row.item)}
                      onChange={() => toggleReminder(row.item)}
                      type="checkbox"
                    />
                    Payment reminders
                  </label>
                </>
              ) : (
                <button type="button">Download Receipt</button>
              )}
              <label>
                <input
                  checked={insuranceClaims.includes(row.item)}
                  onChange={() => toggleInsurance(row.item)}
                  type="checkbox"
                />
                Insurance claim
              </label>
            </div>
          </article>
        ))}
      </section>

      <section className="finance-payment-methods-row">
        <article className="finance-insight-card">
          <h2>Payment Methods</h2>
          <span>Visa ending 4242</span>
          <span>Pet insurance reimbursement account</span>
          <button type="button">Manage Methods</button>
        </article>
      </section>

      {paymentRow && (
        <div className="finance-modal-backdrop" role="presentation">
          <section className="finance-payment-modal" role="dialog" aria-modal="true">
            <span>Secure Payment</span>
            <h2>{paymentRow.item}</h2>
            <p>{paymentRow.pet} - ${Number(paymentRow.amount || 0).toFixed(2)}</p>
            <label>
              Payment method
              <select defaultValue="Visa ending 4242">
                <option>Visa ending 4242</option>
                <option>Add new card</option>
              </select>
            </label>
            <div>
              <button type="button" onClick={() => setPaymentRow(null)}>Submit Payment</button>
              <button type="button" onClick={() => setPaymentRow(null)}>Close</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default PetFinances;
