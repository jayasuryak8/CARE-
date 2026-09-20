import { useState } from "react";

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 50,
    overflowY: "auto",
    background: "#f0f6fb",
    color: "#0d2b55",
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    background: "#0d2b55",
    color: "white",
  },
  close: {
    border: "1px solid white",
    borderRadius: 8,
    padding: "7px 14px",
    background: "transparent",
    color: "white",
    cursor: "pointer",
  },
  content: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: 24,
  },
  nav: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  navButton: {
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    padding: "9px 14px",
    background: "white",
    color: "#0d2b55",
    cursor: "pointer",
    fontWeight: 700,
  },
  activeNav: {
    background: "#0e7490",
    color: "white",
    borderColor: "#0e7490",
  },
  card: {
    background: "white",
    border: "1px solid #e2eaf0",
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    boxShadow: "0 2px 10px rgba(13,43,85,.07)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    marginTop: 5,
    marginBottom: 12,
    padding: 10,
    border: "1px solid #cbd5e1",
    borderRadius: 7,
    background: "#f8fafc",
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 700,
  },
  button: {
    border: 0,
    borderRadius: 7,
    padding: "10px 16px",
    background: "#0e7490",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
  },
  dangerButton: {
    border: 0,
    borderRadius: 7,
    padding: "7px 11px",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    minWidth: 700,
    borderCollapse: "collapse",
  },
  th: {
    padding: 10,
    textAlign: "left",
    background: "#0d2b55",
    color: "white",
    fontSize: 12,
  },
  td: {
    padding: 10,
    borderBottom: "1px solid #e2e8f0",
    fontSize: 13,
    verticalAlign: "top",
  },
};

const Field = ({ label, name, type = "text", required = false }) => (
  <label style={styles.label}>
    {label}
    <input name={name} type={type} required={required} style={styles.input} />
  </label>
);

const ModuleCard = ({ title, children }) => (
  <section style={styles.card}>
    <h2 style={{ marginTop: 0, fontSize: 18 }}>{title}</h2>
    {children}
  </section>
);

export default function ClinicalModules({ onClose }) {
  const [active, setActive] = useState("dashboard");
  const [emrRecords, setEmrRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [nurseAssignments, setNurseAssignments] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [nursingNotes, setNursingNotes] = useState([]);

  const submit = (event, setter, message) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    setter((items) => [...items, data]);
    event.currentTarget.reset();
    window.alert(message);
  };

  const printPrescription = (prescription) => {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Digital Prescription</title>
          <style>
            body { font-family: Arial; padding: 40px; color: #123c69; }
            .box { border: 1px solid #ccc; padding: 20px; margin-top: 20px; }
            p { font-size: 16px; }
          </style>
        </head>
        <body>
          <h1>🏥 City Hospital</h1>
          <h2>Digital Prescription</h2>
          <div class="box">
            <p><strong>Patient:</strong> ${prescription.patient}</p>
            <p><strong>Doctor:</strong> Dr. ${prescription.doctor}</p>
            <p><strong>Medicine:</strong> ${prescription.medicine}</p>
            <p><strong>Dosage:</strong> ${prescription.dosage}</p>
            <p><strong>Frequency:</strong> ${prescription.frequency}</p>
            <p><strong>Duration:</strong> ${prescription.duration}</p>
            <p><strong>Refill:</strong> ${prescription.refill || 0}</p>
            <p><strong>Date:</strong> ${prescription.date}</p>
          </div>
          <br />
          <p>Doctor Signature: __________________</p>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  const renderDashboard = () => (
    <div style={styles.grid}>
      {[
        ["EMR Records", emrRecords.length, "📄"],
        ["Prescriptions", prescriptions.length, "💊"],
        ["Nurse Assignments", nurseAssignments.length, "👩‍⚕️"],
        ["Vitals", vitals.length, "❤️"],
        ["Nursing Notes", nursingNotes.length, "📝"],
      ].map(([label, count, icon]) => (
        <div key={label} style={styles.card}>
          <div style={{ fontSize: 28 }}>{icon}</div>
          <div style={{ marginTop: 8, fontWeight: 700 }}>{label}</div>
          <div style={{ fontSize: 30, fontWeight: 900, color: "#0e7490" }}>{count}</div>
        </div>
      ))}
    </div>
  );

  const renderForms = () => (
    <>
      {active === "emr" && (
        <ModuleCard title="Add EMR Record">
          <form onSubmit={(e) => submit(e, setEmrRecords, "EMR record saved successfully.")}>
            <div style={styles.grid}>
              <Field label="Patient Name" name="patient" required />
              <Field label="Diagnosis" name="diagnosis" required />
              <Field label="Symptoms" name="symptoms" required />
              <Field label="Treatment Plan" name="treatment" />
              <Field label="Clinical Notes" name="clinicalNotes" />
              <Field label="Progress Notes" name="progressNotes" />
              <Field label="Date" name="date" type="date" />
            </div>
            <button style={styles.button}>Save EMR Record</button>
          </form>

          {emrRecords.map((record, index) => (
            <div key={index} style={{ ...styles.card, marginTop: 18 }}>
              <h3>{record.patient}</h3>
              <p><strong>Date:</strong> {record.date}</p>
              <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
              <p><strong>Symptoms:</strong> {record.symptoms}</p>
              <p><strong>Treatment:</strong> {record.treatment}</p>
              <p><strong>Clinical Notes:</strong> {record.clinicalNotes}</p>
              <p><strong>Progress Notes:</strong> {record.progressNotes}</p>
            </div>
          ))}
        </ModuleCard>
      )}

      {active === "prescriptions" && (
        <ModuleCard title="Create Digital Prescription">
          <form onSubmit={(e) => submit(e, setPrescriptions, "Digital prescription created successfully.")}>
            <div style={styles.grid}>
              <Field label="Patient Name" name="patient" required />
              <Field label="Doctor Name" name="doctor" required />
              <Field label="Medicine" name="medicine" required />
              <Field label="Dosage" name="dosage" required />
              <Field label="Frequency" name="frequency" />
              <Field label="Duration" name="duration" />
              <Field label="Refill History" name="refill" type="number" />
              <Field label="Date" name="date" type="date" />
            </div>
            <button style={styles.button}>Create Prescription</button>
          </form>

          {prescriptions.map((prescription, index) => (
            <div key={index} style={styles.card}>
              <h3>Digital Prescription #{index + 1}</h3>
              <p><strong>Patient:</strong> {prescription.patient}</p>
              <p><strong>Doctor:</strong> Dr. {prescription.doctor}</p>
              <p><strong>Medicine:</strong> {prescription.medicine}</p>
              <p><strong>Dosage:</strong> {prescription.dosage}</p>
              <p><strong>Frequency:</strong> {prescription.frequency}</p>
              <p><strong>Duration:</strong> {prescription.duration}</p>
              <p><strong>Date:</strong> {prescription.date}</p>
              <button style={styles.button} onClick={() => printPrescription(prescription)}>
                🖨 Print Prescription
              </button>
            </div>
          ))}
        </ModuleCard>
      )}

      {active === "nurses" && (
        <ModuleCard title="Assign Nurse">
          <form onSubmit={(e) => submit(e, setNurseAssignments, "Nurse assigned successfully.")}>
            <div style={styles.grid}>
              <Field label="Nurse Name" name="nurse" required />
              <Field label="Patient Name" name="patient" required />
              <Field label="Shift" name="shift" required />
            </div>
            <button style={styles.button}>Assign Nurse</button>
          </form>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nurse</th>
                <th style={styles.th}>Patient</th>
                <th style={styles.th}>Shift</th>
              </tr>
            </thead>
            <tbody>
              {nurseAssignments.map((item, index) => (
                <tr key={index}>
                  <td style={styles.td}>{item.nurse}</td>
                  <td style={styles.td}>{item.patient}</td>
                  <td style={styles.td}>{item.shift}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ModuleCard>
      )}

      {active === "vitals" && (
        <ModuleCard title="Record Patient Vitals">
          <form onSubmit={(e) => submit(e, setVitals, "Patient vitals saved successfully.")}>
            <div style={styles.grid}>
              <Field label="Patient Name" name="patient" required />
              <Field label="Temperature (°C)" name="temperature" required />
              <Field label="Blood Pressure" name="bloodPressure" required />
              <Field label="Heart Rate (BPM)" name="heartRate" />
              <Field label="Oxygen Saturation (%)" name="oxygen" />
              <Field label="Respiration Rate" name="respiration" />
              <Field label="Date" name="date" type="date" />
            </div>
            <button style={styles.button}>Save Vitals</button>
          </form>

          <table style={styles.table}>
            <thead>
              <tr>
                {["Patient", "Temperature", "Blood Pressure", "Heart Rate", "Oxygen", "Respiration", "Date"].map((item) => (
                  <th key={item} style={styles.th}>{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vitals.map((item, index) => (
                <tr key={index}>
                  <td style={styles.td}>{item.patient}</td>
                  <td style={styles.td}>{item.temperature} °C</td>
                  <td style={styles.td}>{item.bloodPressure}</td>
                  <td style={styles.td}>{item.heartRate} BPM</td>
                  <td style={styles.td}>{item.oxygen}%</td>
                  <td style={styles.td}>{item.respiration}</td>
                  <td style={styles.td}>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ModuleCard>
      )}

      {active === "notes" && (
        <ModuleCard title="Add Nursing Note">
          <form onSubmit={(e) => submit(e, setNursingNotes, "Nursing note saved successfully.")}>
            <Field label="Patient Name" name="patient" required />
            <label style={styles.label}>
              Nursing Note
              <textarea name="note" required style={{ ...styles.input, minHeight: 100 }} />
            </label>
            <Field label="Date" name="date" type="date" />
            <button style={styles.button}>Save Nursing Note</button>
          </form>

          {nursingNotes.map((item, index) => (
            <div key={index} style={styles.card}>
              <h3>{item.patient}</h3>
              <p><strong>Date:</strong> {item.date}</p>
              <p><strong>Nursing Note:</strong> {item.note}</p>
            </div>
          ))}
        </ModuleCard>
      )}
    </>
  );

  return (
    <div style={styles.overlay}>
      <header style={styles.header}>
        <div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>CLINICAL OPERATIONS</div>
          <h1 style={{ margin: "4px 0 0", fontSize: 22 }}>Clinical Records</h1>
        </div>
        <button style={styles.close} onClick={onClose}>Close</button>
      </header>

      <main style={styles.content}>
        <nav style={styles.nav}>
          {[
            ["dashboard", "Dashboard"],
            ["emr", "EMR"],
            ["prescriptions", "Prescriptions"],
            ["nurses", "Nurse Assignments"],
            ["vitals", "Vitals"],
            ["notes", "Nursing Notes"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              style={{
                ...styles.navButton,
                ...(active === id ? styles.activeNav : {}),
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        {active === "dashboard" ? renderDashboard() : renderForms()}
      </main>
    </div>
  );
}