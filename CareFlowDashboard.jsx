import { useEffect, useMemo, useState } from "react";

const today = new Date().toISOString().split("T")[0];

const doctors = [
  { name: "Dr. Ananya Rao", specialization: "Cardiologist", fee: 1200 },
  { name: "Dr. Vikram Singh", specialization: "Neurologist", fee: 1500 },
  { name: "Dr. Neha Kapoor", specialization: "General Physician", fee: 700 },
];

const districts = [
  "Ariyalur", "Chengalpattu", "Coimbatore", "Cuddalore", "Dharmapuri",
  "Dindigul", "Erode", "Madurai", "Salem", "Thanjavur", "Theni",
  "Tirunelveli", "Trichy", "Vellore", "Villupuram",
];

const initialPatients = [
  {
    id: "PT-1001",
    name: "Aarav Sharma",
    phone: "+91 98765 43210",
    age: 32,
    gender: "Male",
    disease: "Routine check-up",
    date: "2026-08-12",
  },
  {
    id: "PT-1002",
    name: "Maya Patel",
    phone: "+91 91234 56789",
    age: 28,
    gender: "Female",
    disease: "Migraine",
    date: "2026-08-13",
  },
];

const initialAppointments = [
  {
    id: "APT-5001",
    patient: "Aarav Sharma",
    doctor: "Dr. Ananya Rao",
    district: "Ariyalur",
    date: today,
    time: "10:00",
    token: "A-01",
    status: "Confirmed",
  },
];

const emptyBooking = {
  patient: "",
  doctor: "",
  district: "",
  date: today,
  time: "",
};

export default function CareFlowDashboard({ go }) {
  const [active, setActive] = useState("dashboard");
  const [patients, setPatients] = useState(() =>
    JSON.parse(localStorage.getItem("careflowPatients") || "null") ||
    initialPatients
  );
  const [appointments, setAppointments] = useState(() =>
    JSON.parse(localStorage.getItem("careflowAppointments") || "null") ||
    initialAppointments
  );
  const [booking, setBooking] = useState(emptyBooking);
  const [showBooking, setShowBooking] = useState(false);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("careflowPatients", JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem("careflowAppointments", JSON.stringify(appointments));
  }, [appointments]);

  const filteredPatients = useMemo(() => {
    const query = search.toLowerCase();

    return patients.filter(patient =>
      `${patient.id} ${patient.name} ${patient.phone}`
        .toLowerCase()
        .includes(query)
    );
  }, [patients, search]);

  const availableSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];

  const bookedSlots = appointments
    .filter(item =>
      item.doctor === booking.doctor &&
      item.date === booking.date &&
      item.status !== "Cancelled"
    )
    .map(item => item.time);

  const notify = text => {
    setMessage(text);
    setTimeout(() => setMessage(""), 2500);
  };

  const updateBooking = (field, value) => {
    setBooking(current => ({
      ...current,
      [field]: value,
      ...(field === "doctor" || field === "date" ? { time: "" } : {}),
    }));
  };

  const bookAppointment = event => {
    event.preventDefault();

    const { patient, doctor, district, date, time } = booking;

    if (!patient || !doctor || !district || !date || !time) {
      notify("Please complete all booking fields.");
      return;
    }

    const duplicate = appointments.some(item =>
      item.doctor === doctor &&
      item.date === date &&
      item.time === time &&
      item.status !== "Cancelled"
    );

    if (duplicate) {
      notify("This time slot is already booked.");
      return;
    }

    const appointment = {
      id: `APT-${5001 + appointments.length}`,
      patient,
      doctor,
      district,
      date,
      time,
      token: `A-${String(appointments.length + 1).padStart(2, "0")}`,
      status: "Scheduled",
    };

    setAppointments(current => [...current, appointment]);
    setBooking(emptyBooking);
    setShowBooking(false);
    setActive("appointments");
    notify("Appointment booked successfully.");
  };

  const updateStatus = (id, status) => {
    setAppointments(current =>
      current.map(item => item.id === id ? { ...item, status } : item)
    );
    notify("Appointment status updated.");
  };

  const checkIn = id => {
    updateStatus(id, "Confirmed");
  };

  const renderDashboard = () => (
    <>
      <Header title="Appointment Dashboard" />

      <div style={styles.hero}>
        <div>
          <small>CAREFLOW HEALTHCARE</small>
          <h1>Manage care with confidence.</h1>
          <p>Appointments, patients, and medical staff in one organized workspace.</p>
          <button style={styles.primaryButton} onClick={() => setShowBooking(true)}>
            + Book Appointment
          </button>
        </div>
        <div style={styles.heroIcon}>🏥</div>
      </div>

      <div style={styles.stats}>
        <Stat label="Total Appointments" value={appointments.length} icon="📅" />
        <Stat
          label="Today's Appointments"
          value={appointments.filter(item => item.date === today).length}
          icon="⏰"
        />
        <Stat label="Available Doctors" value={doctors.length} icon="👨‍⚕️" />
        <Stat
          label="Pending Appointments"
          value={appointments.filter(item =>
            ["Scheduled", "Rescheduled"].includes(item.status)
          ).length}
          icon="⌛"
        />
      </div>

      <div style={styles.grid}>
        <Panel title="Today's Appointments">
          {appointments.filter(item => item.date === today).length === 0 ? (
            <Empty text="No appointments scheduled for today." />
          ) : (
            appointments
              .filter(item => item.date === today)
              .map(item => (
                <div style={styles.visit} key={item.id}>
                  <div style={styles.avatar}>{initials(item.patient)}</div>
                  <div style={{ flex: 1 }}>
                    <strong>{item.patient}</strong>
                    <small>{item.doctor} · {item.time}</small>
                  </div>
                  <Badge status={item.status}>{item.status}</Badge>
                </div>
              ))
          )}
        </Panel>

        <Panel title="Quick Actions">
          <Action text="Register Patient" icon="👤" onClick={() => setActive("patients")} />
          <Action text="Book Appointment" icon="📅" onClick={() => setShowBooking(true)} />
          <Action text="View Doctors" icon="👨‍⚕️" onClick={() => setActive("doctors")} />
          <Action text="View Reports" icon="📊" onClick={() => setActive("reports")} />
        </Panel>
      </div>
    </>
  );

  const renderPatients = () => (
    <>
      <Header title="Patient Registration" />

      <div style={styles.toolbar}>
        <input
          style={styles.input}
          placeholder="Search patients..."
          value={search}
          onChange={event => setSearch(event.target.value)}
        />
        <button style={styles.primaryButton} onClick={() => setActive("addPatient")}>
          + Add Patient
        </button>
      </div>

      <Panel>
        <Table headers={["ID", "Name", "Phone", "Age / Gender", "Condition", "Date"]}>
          {filteredPatients.map(patient => (
            <tr key={patient.id}>
              <td>{patient.id}</td>
              <td><strong>{patient.name}</strong></td>
              <td>{patient.phone}</td>
              <td>{patient.age} / {patient.gender}</td>
              <td>{patient.disease || "Not specified"}</td>
              <td>{patient.date}</td>
            </tr>
          ))}
        </Table>
      </Panel>
    </>
  );

  const renderDoctors = () => (
    <>
      <Header title="Doctor Management" />
      <div style={styles.doctorGrid}>
        {doctors.map(doctor => (
          <Panel key={doctor.name}>
            <div style={styles.doctorIcon}>⚕</div>
            <h3>{doctor.name}</h3>
            <p style={styles.muted}>{doctor.specialization}</p>
            <p style={styles.muted}>Available: 09:00 - 17:00</p>
            <strong style={{ color: "#36f1d0" }}>₹{doctor.fee}</strong>
          </Panel>
        ))}
      </div>
    </>
  );

  const renderAppointments = () => (
    <>
      <Header title="Appointment Management" />
      <Panel>
        <Table headers={["ID", "Patient", "Doctor", "District", "Date", "Token", "Status", "Action"]}>
          {appointments.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.patient}</td>
              <td>{item.doctor}</td>
              <td>{item.district}</td>
              <td>{item.date}<br />{item.time}</td>
              <td>{item.token}</td>
              <td>
                <select
                  style={styles.smallSelect}
                  value={item.status}
                  onChange={event => updateStatus(item.id, event.target.value)}
                >
                  {["Scheduled", "Confirmed", "Completed", "Cancelled", "Rescheduled"]
                    .map(status => <option key={status}>{status}</option>)}
                </select>
              </td>
              <td>
                <button style={styles.linkButton} onClick={() => checkIn(item.id)}>
                  Check-in
                </button>
              </td>
            </tr>
          ))}
        </Table>
      </Panel>
    </>
  );

  const renderReports = () => (
    <>
      <Header title="Appointment Reports" />
      <div style={styles.stats}>
        <Stat label="Today's Visits" value={appointments.filter(a => a.date === today).length} icon="📅" />
        <Stat label="Completed" value={appointments.filter(a => a.status === "Completed").length} icon="✅" />
        <Stat label="Cancelled" value={appointments.filter(a => a.status === "Cancelled").length} icon="❌" />
        <Stat label="Monthly Total" value={appointments.filter(a => a.date.startsWith(today.slice(0, 7))).length} icon="📈" />
      </div>
    </>
  );

  const renderAddPatient = () => (
    <>
      <Header title="Register New Patient" />
      <Panel>
        <form onSubmit={event => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);

          setPatients(current => [
            ...current,
            {
              id: `PT-${1001 + current.length}`,
              name: form.get("name"),
              phone: form.get("phone"),
              age: form.get("age"),
              gender: form.get("gender"),
              disease: form.get("disease"),
              date: today,
            },
          ]);

          event.currentTarget.reset();
          setActive("patients");
          notify("Patient registered successfully.");
        }}>
          <input name="name" required placeholder="Patient name" style={styles.input} />
          <input name="phone" required placeholder="Phone number" style={styles.input} />
          <input name="age" required type="number" placeholder="Age" style={styles.input} />
          <select name="gender" style={styles.input} defaultValue="Male">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input name="disease" placeholder="Disease / problem" style={styles.input} />
          <button style={styles.primaryButton}>Save Patient</button>
        </form>
      </Panel>
    </>
  );

  const content = {
    dashboard: renderDashboard,
    patients: renderPatients,
    doctors: renderDoctors,
    appointments: renderAppointments,
    reports: renderReports,
    addPatient: renderAddPatient,
  };

  return (
    <div style={styles.app}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>✚ CareFlow</div>
        <small style={styles.sidebarSubtitle}>HOSPITAL MANAGEMENT</small>

        {[
          ["dashboard", "📊 Dashboard"],
          ["patients", "👤 Patients"],
          ["doctors", "👨‍⚕️ Doctors"],
          ["appointments", "📅 Appointments"],
          ["reports", "📈 Reports"],
        ].map(([id, label]) => (
          <button
            key={id}
            style={{
              ...styles.navButton,
              ...(active === id ? styles.activeNav : {}),
            }}
            onClick={() => setActive(id)}
          >
            {label}
          </button>
        ))}

        {go && (
          <button style={styles.backButton} onClick={() => go("home")}>
            ← Back to Home
          </button>
        )}
      </aside>

      <main style={styles.main}>
        {content[active]?.()}

        {message && <div style={styles.toast}>{message}</div>}
      </main>

      {showBooking && (
        <div style={styles.modalBackdrop}>
          <form style={styles.modal} onSubmit={bookAppointment}>
            <button
              type="button"
              style={styles.closeButton}
              onClick={() => setShowBooking(false)}
            >
              ×
            </button>

            <h2>Book Appointment</h2>

            <select
              required
              value={booking.patient}
              onChange={event => updateBooking("patient", event.target.value)}
              style={styles.input}
            >
              <option value="">Select patient</option>
              {patients.map(patient => (
                <option key={patient.id}>{patient.name}</option>
              ))}
            </select>

            <select
              required
              value={booking.doctor}
              onChange={event => updateBooking("doctor", event.target.value)}
              style={styles.input}
            >
              <option value="">Select doctor</option>
              {doctors.map(doctor => (
                <option key={doctor.name}>{doctor.name}</option>
              ))}
            </select>

            <select
              required
              value={booking.district}
              onChange={event => updateBooking("district", event.target.value)}
              style={styles.input}
            >
              <option value="">Select district</option>
              {districts.map(district => (
                <option key={district}>{district}</option>
              ))}
            </select>

            <input
              required
              type="date"
              min={today}
              value={booking.date}
              onChange={event => updateBooking("date", event.target.value)}
              style={styles.input}
            />

            <select
              required
              value={booking.time}
              onChange={event => updateBooking("time", event.target.value)}
              style={styles.input}
            >
              <option value="">Select available slot</option>
              {availableSlots
                .filter(slot => !bookedSlots.includes(slot))
                .map(slot => <option key={slot}>{slot}</option>)}
            </select>

            <button style={{ ...styles.primaryButton, width: "100%" }}>
              Confirm Booking
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function Header({ title }) {
  return (
    <div style={styles.header}>
      <div>
        <small style={styles.eyebrow}>CAREFLOW HEALTHCARE</small>
        <h1>{title}</h1>
      </div>
      <div style={styles.profile}>AK</div>
    </div>
  );
}

function Stat({ label, value, icon }) {
  return (
    <div style={styles.stat}>
      <span style={styles.statIcon}>{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <section style={styles.panel}>
      {title && <h2 style={styles.panelTitle}>{title}</h2>}
      {children}
    </section>
  );
}

function Action({ text, icon, onClick }) {
  return (
    <button style={styles.action} onClick={onClick}>
      <span>{icon}</span>
      {text}
    </button>
  );
}

function Badge({ status }) {
  const colors = {
    Scheduled: "#ffaf5b",
    Confirmed: "#36f1d0",
    Completed: "#50b9ff",
    Cancelled: "#ff718b",
    Rescheduled: "#9f7cff",
  };

  return (
    <span style={{ ...styles.badge, color: colors[status] || "#fff" }}>
      {status}
    </span>
  );
}

function Table({ headers, children }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={styles.table}>
        <thead>
          <tr>{headers.map(header => <th key={header}>{header}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Empty({ text }) {
  return <div style={styles.empty}>{text}</div>;
}

function initials(name) {
  return name
    .split(" ")
    .map(part => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const styles = {
  app: {
    display: "flex",
    minHeight: "100%",
    color: "#f4f8ff",
    background: "#07111f",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  sidebar: {
    width: 220,
    flexShrink: 0,
    padding: 24,
    background: "linear-gradient(160deg, #19314f, #07111f)",
    borderRight: "1px solid rgba(255,255,255,.12)",
  },
  brand: {
    fontSize: 25,
    fontWeight: 800,
    marginBottom: 4,
  },
  sidebarSubtitle: {
    color: "#9db0c9",
    fontSize: 9,
    letterSpacing: 1.4,
  },
  navButton: {
    display: "block",
    width: "100%",
    marginTop: 18,
    padding: "12px 14px",
    border: 0,
    borderRadius: 12,
    color: "#9db0c9",
    background: "transparent",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 600,
  },
  activeNav: {
    color: "#fff",
    background: "linear-gradient(90deg, rgba(80,185,255,.28), rgba(159,124,255,.16))",
    boxShadow: "inset 3px 0 #36f1d0",
  },
  backButton: {
    width: "100%",
    marginTop: 35,
    padding: 10,
    border: "1px solid #36f1d0",
    borderRadius: 10,
    color: "#36f1d0",
    background: "transparent",
    cursor: "pointer",
  },
  main: {
    position: "relative",
    flex: 1,
    minWidth: 0,
    padding: 30,
    overflow: "auto",
    background:
      "radial-gradient(circle at 80% 10%, rgba(159,124,255,.16), transparent 28%), #07111f",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  eyebrow: {
    color: "#36f1d0",
    letterSpacing: 2,
    fontWeight: 800,
  },
  hero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 36,
    borderRadius: 26,
    background: "linear-gradient(115deg, #2c6696, #352669)",
    boxShadow: "0 25px 70px rgba(0,0,0,.35)",
  },
  heroIcon: {
    fontSize: 90,
    transform: "rotate(-10deg)",
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 16,
    margin: "20px 0",
  },
  stat: {
    display: "flex",
    gap: 12,
    padding: 18,
    border: "1px solid rgba(255,255,255,.12)",
    borderRadius: 18,
    background: "rgba(16,31,53,.72)",
  },
  statIcon: {
    fontSize: 28,
  },
  panel: {
    padding: 22,
    border: "1px solid rgba(255,255,255,.12)",
    borderRadius: 20,
    background: "rgba(16,31,53,.72)",
    boxShadow: "0 25px 70px rgba(0,0,0,.25)",
    marginBottom: 20,
  },
  panelTitle: {
    marginTop: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1.4fr .8fr",
    gap: 20,
  },
  visit: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 0",
    borderBottom: "1px solid rgba(255,255,255,.12)",
  },
  avatar: {
    display: "grid",
    placeItems: "center",
    width: 40,
    height: 40,
    borderRadius: "50%",
    color: "#07111f",
    background: "linear-gradient(135deg, #36f1d0, #50b9ff)",
    fontWeight: 800,
  },
  action: {
    display: "block",
    width: "100%",
    padding: 14,
    border: 0,
    borderBottom: "1px solid rgba(255,255,255,.12)",
    color: "#9db0c9",
    background: "transparent",
    textAlign: "left",
    cursor: "pointer",
  },
  doctorGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 16,
  },
  doctorIcon: {
    fontSize: 38,
    color: "#36f1d0",
  },
  toolbar: {
    display: "flex",
    gap: 12,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    minHeight: 43,
    margin: "6px 0",
    padding: "11px 13px",
    border: "1px solid rgba(255,255,255,.12)",
    borderRadius: 10,
    outline: "none",
    color: "#f4f8ff",
    background: "rgba(255,255,255,.07)",
    boxSizing: "border-box",
  },
  smallSelect: {
    padding: 7,
    color: "#07111f",
    borderRadius: 8,
  },
  primaryButton: {
    padding: "12px 18px",
    border: 0,
    borderRadius: 11,
    color: "#07111f",
    background: "linear-gradient(135deg, #36f1d0, #50b9ff)",
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  table: {
    width: "100%",
    minWidth: 760,
    borderCollapse: "collapse",
    fontSize: 12,
  },
  linkButton: {
    border: 0,
    color: "#36f1d0",
    background: "transparent",
    cursor: "pointer",
  },
  badge: {
    padding: "6px 9px",
    borderRadius: 20,
    background: "rgba(255,255,255,.1)",
    fontSize: 10,
    fontWeight: 700,
  },
  profile: {
    display: "grid",
    placeItems: "center",
    width: 40,
    height: 40,
    borderRadius: "50%",
    color: "#07111f",
    background: "linear-gradient(135deg, #36f1d0, #50b9ff)",
    fontWeight: 800,
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 20,
    display: "grid",
    placeItems: "center",
    padding: 20,
    background: "rgba(2,8,18,.75)",
  },
  modal: {
    position: "relative",
    width: "min(480px, 100%)",
    padding: 28,
    borderRadius: 22,
    background: "#142a47",
    boxShadow: "0 35px 100px rgba(0,0,0,.6)",
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 16,
    border: 0,
    color: "#9db0c9",
    background: "transparent",
    fontSize: 28,
    cursor: "pointer",
  },
  toast: {
    position: "fixed",
    right: 25,
    bottom: 25,
    padding: "14px 18px",
    borderRadius: 12,
    background: "#142a47",
    color: "#fff",
    boxShadow: "0 15px 40px rgba(0,0,0,.35)",
  },
  empty: {
    padding: 25,
    color: "#9db0c9",
    textAlign: "center",
  },
  muted: {
    color: "#9db0c9",
  },
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  h1, h2, h3 { font-family: "Space Grotesk", Inter, sans-serif; }
  h1 { margin: 5px 0; font-size: 32px; }
  p { color: #c6d4e8; line-height: 1.6; }
  small { display: block; color: #9db0c9; margin-top: 4px; }
  th, td { padding: 13px 10px; border-bottom: 1px solid rgba(255,255,255,.12); text-align: left; }
  th { color: #9db0c9; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; }
  @media (max-width: 900px) {
    .careflow-stats { grid-template-columns: repeat(2, 1fr); }
  }
`;
if (!document.head.querySelector("[data-careflow-style]")) {
  styleSheet.dataset.careflowStyle = "true";
  document.head.appendChild(styleSheet);
}