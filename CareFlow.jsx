import React, { useEffect, useMemo, useState } from "react";
import "./careflow.css";

const today = "2026-08-13";
const API_URL = "http://localhost:5000/api";

const initialPatients = [
  { id: "PT-1001", name: "Arjun Kumar", phone: "+91 98765 43210", age: 28, gender: "Male", disease: "Hypertension", allergy: "Penicillin", history: "Appendectomy", emergency: "+91 98765 40000", registered: "Aug 08, 2026" },
  { id: "PT-1002", name: "Meera Nair", phone: "+91 98765 43211", age: 35, gender: "Female", disease: "Diabetes", allergy: "None", history: "None", emergency: "+91 98765 40001", registered: "Aug 09, 2026" },
];

const initialDoctors = [
  { id: 501, name: "Dr. Priya Shankar", specialization: "Cardiologist", workingHours: "09:00 AM - 04:00 PM", fee: 600, department: "Cardiology", available: true },
  { id: 502, name: "Dr. Rajan Mehta", specialization: "Neurologist", workingHours: "10:00 AM - 05:00 PM", fee: 800, department: "Neurology", available: true },
  { id: 503, name: "Dr. Sunita Rao", specialization: "Dermatologist", workingHours: "09:00 AM - 02:00 PM", fee: 500, department: "Dermatology", available: false },
];

const initialAppointments = [
  { token: 1, patient: "Arjun Kumar", doctor: "Dr. Priya Shankar", date: today, time: "10:30 AM", type: "Online Booking", status: "Confirmed" },
  { token: 2, patient: "Meera Nair", doctor: "Dr. Rajan Mehta", date: today, time: "11:00 AM", type: "Walk-in", status: "Scheduled" },
];

const initialDepartments = [
  { id: 101, name: "Cardiology", head: "Dr. Priya Shankar", staff: 12 },
  { id: 102, name: "Neurology", head: "Dr. Rajan Mehta", staff: 8 },
];

const Status = ({ children }) => (
  <span className={`status ${String(children).toLowerCase()}`}>{children}</span>
);

const AnimeDoctor = () => (
  <div className="anime-doctor-scene" aria-label="3D anime doctor illustration">
    <div className="anime-halo" />
    <div className="anime-spark spark-one">✦</div>
    <div className="anime-spark spark-two">✧</div>
    <div className="anime-doctor-figure">
      <div className="anime-hair" />
      <div className="anime-face"><i /><i /><b>⌣</b></div>
      <div className="anime-neck" />
      <div className="anime-coat"><strong>✚</strong><span /><span /></div>
      <div className="anime-stethoscope" />
    </div>
    <div className="anime-platform">CARE TEAM / ONLINE</div>
  </div>
);

const ModuleScene = ({ type, label }) => (
  <div className={`module-scene module-${type}`} aria-label={`${label} 3D visualization`}>
    <div className="module-orbit orbit-one" />
    <div className="module-orbit orbit-two" />
    <div className="module-core">
      <span>{type === "patients" ? "♙" : type === "doctors" ? "⚕" : type === "appointments" ? "◷" : "▣"}</span>
    </div>
    <div className="module-label">{label.toUpperCase()} / LIVE DATA</div>
    <i className="module-particle particle-a" />
    <i className="module-particle particle-b" />
  </div>
);

const Modal = ({ title, eyebrow, close, children }) => (
  <div className="modal" onMouseDown={(e) => e.target === e.currentTarget && close()}>
    <div className="modal-card">
      <button type="button" className="close-modal" onClick={close}>×</button>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children}
    </div>
  </div>
);

export default function CareFlow() {
  const [section, setSection] = useState("dashboard");
  const [patients, setPatients] = useState(initialPatients);
  const [doctors, setDoctors] = useState(initialDoctors);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [departments, setDepartments] = useState(initialDepartments);
  const [modal, setModal] = useState("");
  const [toast, setToast] = useState("");
  const [patientSearch, setPatientSearch] = useState("");
  const [appointmentSearch, setAppointmentSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [backendOnline, setBackendOnline] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((response) => setBackendOnline(response.ok))
      .catch(() => setBackendOnline(false));
  }, []);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const filteredPatients = useMemo(() => {
    const query = patientSearch.toLowerCase();
    return patients.filter((p) =>
      `${p.id} ${p.name} ${p.phone} ${p.disease}`.toLowerCase().includes(query)
    );
  }, [patients, patientSearch]);

  const filteredAppointments = useMemo(() => {
    const query = appointmentSearch.toLowerCase();
    return appointments.filter((a) => {
      const text = `${a.token} ${a.patient} ${a.doctor} ${a.type}`.toLowerCase();
      return text.includes(query)
        && (!dateFilter || a.date === dateFilter)
        && (!statusFilter || a.status === statusFilter);
    });
  }, [appointments, appointmentSearch, dateFilter, statusFilter]);

  const addPatient = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const patient = {
      id: `PT-${1001 + patients.length}`,
      name: data.get("name"),
      age: data.get("age"),
      gender: data.get("gender"),
      phone: data.get("phone"),
      disease: data.get("disease"),
      allergy: data.get("allergy"),
      history: data.get("history"),
      emergency: data.get("emergency"),
      registered: "Aug 13, 2026",
    };
    setPatients((items) => [...items, patient]);
    setModal("");
    notify(`Patient registered successfully: ${patient.id}`);
  };

  const addDoctor = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const doctor = {
      id: 501 + doctors.length,
      name: data.get("name"),
      specialization: data.get("specialization"),
      workingHours: data.get("workingHours"),
      fee: data.get("fee"),
      department: data.get("department"),
      available: true,
    };
    setDoctors((items) => [...items, doctor]);
    setModal("");
    notify(`Doctor added successfully: D${doctor.id}`);
  };

  const bookAppointment = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const token = appointments.length + 1;
    const appointment = {
      token,
      patient: data.get("patient"),
      doctor: data.get("doctor"),
      date: data.get("date"),
      time: data.get("time"),
      type: data.get("type"),
      status: "Confirmed",
    };
    setAppointments((items) => [...items, appointment]);
    setModal("");
    notify(`Appointment booked successfully. Token: T-${token}`);
  };

  const addDepartment = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const department = {
      id: 101 + departments.length,
      name: data.get("name"),
      head: data.get("head"),
      staff: data.get("staff"),
    };
    setDepartments((items) => [...items, department]);
    setModal("");
    notify(`Department added successfully: DP${department.id}`);
  };

  const resetData = () => {
    setPatients(initialPatients);
    setDoctors(initialDoctors);
    setAppointments(initialAppointments);
    setDepartments(initialDepartments);
    notify("Demo data has been reset");
  };

  const titles = {
    dashboard: "Appointment Dashboard",
    patients: "Patient Registration",
    doctors: "Doctor Management",
    appointments: "Appointment Management",
    departments: "Department Management",
    reports: "Appointment Reports",
  };

  const todayAppointments = appointments.filter((a) => a.date === today);
  const completed = appointments.filter((a) => a.status === "Completed").length;
  const cancelled = appointments.filter((a) => a.status === "Cancelled").length;

  return (
    <div className="careflow">
      <aside className="sidebar">
        <div className="brand"><span>✚</span><div>CareFlow<small>Hospital System</small></div></div>

        <nav>
          {[
            ["dashboard", "▦", "Dashboard"],
            ["patients", "♙", "Patients"],
            ["doctors", "⚕", "Doctors"],
            ["appointments", "◷", "Appointments"],
            ["departments", "▣", "Departments"],
            ["reports", "▤", "Reports"],
          ].map(([id, icon, label]) => (
            <button key={id} className={`nav-btn ${section === id ? "active" : ""}`} onClick={() => setSection(id)}>
              {icon}<span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="online"><i className={backendOnline ? "" : "offline"} /> {backendOnline ? "Backend online" : "Backend offline"}</div>
          <button className="danger-link" onClick={resetData}>Reset demo data</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">GOOD MORNING, ADMIN</p>
            <h1>{titles[section]}</h1>
          </div>
          <div className="top-actions">
            <button className="icon-btn" onClick={() => notify("No new notifications")}>
              🔔<b>{appointments.filter((a) => a.status === "Scheduled").length}</b>
            </button>
            <div className="profile"><span>AD</span><strong>Admin</strong></div>
          </div>
        </header>

        {section === "dashboard" && (
          <section className="page-section">
            <div className="hero">
              <div>
                <p className="eyebrow">SMART CARE OPERATIONS</p>
                <h2>Everything in one <em>healthy</em> flow.</h2>
                <p>Manage appointments, patients, doctors and hospital operations with confidence.</p>
                <button className="primary-btn" onClick={() => setModal("booking")}>＋ Book an appointment</button>
              </div>
              <AnimeDoctor />
            </div>

            <div className="stat-grid">
              <Stat label="Total patients" value={patients.length} note="Registered patients" />
              <Stat label="Total doctors" value={doctors.length} note="Medical staff" />
              <Stat label="Appointments" value={appointments.length} note="All bookings" />
              <Stat label="Departments" value={departments.length} note="Hospital units" />
            </div>

            <div className="dashboard-grid">
              <div className="panel">
                <div className="panel-heading">
                  <div><p className="eyebrow">LIVE SCHEDULE</p><h3>Today's appointments</h3></div>
                  <button className="text-btn" onClick={() => setSection("appointments")}>View all →</button>
                </div>
                {todayAppointments.map((a) => (
                  <div className="appointment-row" key={a.token}>
                    <div className="time">{a.time}</div>
                    <div><strong>{a.patient}</strong><small>{a.doctor}</small></div>
                    <Status>{a.status}</Status>
                  </div>
                ))}
                {!todayAppointments.length && <p>No appointments scheduled for today.</p>}
              </div>

              <div className="panel quick-panel">
                <div className="panel-heading"><div><p className="eyebrow">QUICK ACTIONS</p><h3>Common tasks</h3></div></div>
                <button className="quick-action" onClick={() => setModal("booking")}>＋ <div><strong>Book appointment</strong><small>Create a patient visit</small></div>→</button>
                <button className="quick-action" onClick={() => setModal("patient")}>♙ <div><strong>Register patient</strong><small>Add patient information</small></div>→</button>
                <button className="quick-action" onClick={() => setModal("doctor")}>⚕ <div><strong>Add doctor</strong><small>Update medical staff</small></div>→</button>
              </div>
            </div>
          </section>
        )}

        {section === "patients" && (
          <section className="page-section">
            <div className="section-heading">
              <div><p className="eyebrow">PATIENT DIRECTORY</p><h2>Patient Registration</h2></div>
              <button className="primary-btn" onClick={() => setModal("patient")}>＋ Add new patient</button>
            </div>
            <ModuleScene type="patients" label="Patient records" />
            <div className="panel">
              <input className="search" value={patientSearch} onChange={(e) => setPatientSearch(e.target.value)} placeholder="⌕ Search patients..." />
              <div className="table-wrap"><table><thead><tr><th>ID</th><th>Patient</th><th>Age</th><th>Gender</th><th>Disease</th><th>Allergy</th><th>Emergency</th></tr></thead><tbody>
                {filteredPatients.map((p) => <tr key={p.id}><td><b>{p.id}</b></td><td>{p.name}<small>{p.phone}</small></td><td>{p.age}</td><td>{p.gender}</td><td>{p.disease}</td><td>{p.allergy}</td><td>{p.emergency}</td></tr>)}
              </tbody></table></div>
            </div>
          </section>
        )}

        {section === "doctors" && (
          <section className="page-section">
            <div className="section-heading">
              <div><p className="eyebrow">MEDICAL STAFF</p><h2>Doctor Management</h2></div>
              <button className="primary-btn" onClick={() => setModal("doctor")}>＋ Add doctor</button>
            </div>
            <ModuleScene type="doctors" label="Care team" />
            <div className="doctor-grid">
              {doctors.map((d) => (
                <article className="doctor-card" key={d.id}>
                  <div className="doctor-avatar">⚕</div>
                  <div className="doctor-info">
                    <h3>{d.name}</h3><p>{d.specialization}</p>
                    <small>{d.department} · {d.workingHours}<br />Fee: ₹{d.fee}</small>
                    <Status>{d.available ? "Available" : "Busy"}</Status>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {section === "appointments" && (
          <section className="page-section">
            <div className="section-heading">
              <div><p className="eyebrow">VISIT SCHEDULING</p><h2>Appointment Management</h2></div>
              <button className="primary-btn" onClick={() => setModal("booking")}>＋ Book appointment</button>
            </div>
            <ModuleScene type="appointments" label="Visit flow" />
            <div className="filter-bar panel">
              <input className="search" value={appointmentSearch} onChange={(e) => setAppointmentSearch(e.target.value)} placeholder="⌕ Search appointments..." />
              <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All statuses</option><option>Scheduled</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option>
              </select>
            </div>
            <div className="panel"><div className="table-wrap"><table><thead><tr><th>Token</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Type</th><th>Status</th></tr></thead><tbody>
              {filteredAppointments.map((a) => <tr key={a.token}><td><b>T-{a.token}</b></td><td>{a.patient}</td><td>{a.doctor}</td><td>{a.date}</td><td>{a.time}</td><td>{a.type}</td><td><Status>{a.status}</Status></td></tr>)}
            </tbody></table></div></div>
          </section>
        )}

        {section === "departments" && (
          <section className="page-section">
            <div className="section-heading">
              <div><p className="eyebrow">HOSPITAL UNITS</p><h2>Department Management</h2></div>
              <button className="primary-btn" onClick={() => setModal("department")}>＋ Add department</button>
            </div>
            <ModuleScene type="departments" label="Hospital units" />
            <div className="panel"><div className="table-wrap"><table><thead><tr><th>ID</th><th>Department</th><th>Head</th><th>Staff count</th></tr></thead><tbody>
              {departments.map((d) => <tr key={d.id}><td><b>DP{d.id}</b></td><td>{d.name}</td><td>{d.head}</td><td>{d.staff}</td></tr>)}
            </tbody></table></div></div>
          </section>
        )}

        {section === "reports" && (
          <section className="page-section">
            <div className="section-heading"><div><p className="eyebrow">INSIGHTS & ANALYTICS</p><h2>Appointment Reports</h2></div></div>
            <div className="report-grid">
              <Stat label="Daily appointments" value={todayAppointments.length} note="Scheduled today" />
              <Stat label="Completed visits" value={completed} note="Successfully completed" />
              <Stat label="Cancelled visits" value={cancelled} note="Requires follow-up" />
              <Stat label="Monthly total" value={appointments.length} note="This calendar month" />
            </div>
            <div className="panel"><h3>Doctor-wise appointments</h3><div className="bars">
              {doctors.map((d) => {
                const count = appointments.filter((a) => a.doctor === d.name).length;
                return <div className="bar-row" key={d.id}><span>{d.name}</span><div><i style={{ width: `${Math.max(12, count * 25)}%` }} /></div><b>{count}</b></div>;
              })}
            </div></div>
          </section>
        )}
      </main>

      {modal === "patient" && <Modal title="Register patient" eyebrow="PATIENT DIRECTORY" close={() => setModal("")}><form onSubmit={addPatient}>
        <label>Name<input name="name" required /></label><label>Age<input name="age" type="number" required /></label>
        <label>Gender<select name="gender"><option>Male</option><option>Female</option><option>Other</option></select></label>
        <label>Phone<input name="phone" /></label><label>Disease<input name="disease" /></label>
        <label>Allergy<input name="allergy" /></label><label>Medical history<input name="history" /></label>
        <label>Emergency contact<input name="emergency" /></label><button className="primary-btn full">Register patient</button>
      </form></Modal>}

      {modal === "doctor" && <Modal title="Add doctor" eyebrow="MEDICAL STAFF" close={() => setModal("")}><form onSubmit={addDoctor}>
        <label>Name<input name="name" required /></label><label>Specialization<input name="specialization" required /></label>
        <label>Working hours<input name="workingHours" placeholder="09:00 AM - 05:00 PM" /></label>
        <label>Consultation fee<input name="fee" type="number" /></label><label>Department<input name="department" /></label>
        <button className="primary-btn full">Add doctor</button>
      </form></Modal>}

      {modal === "booking" && <Modal title="Book appointment" eyebrow="NEW VISIT" close={() => setModal("")}><form onSubmit={bookAppointment}>
        <label>Patient<select name="patient" required>{patients.map((p) => <option key={p.id}>{p.name}</option>)}</select></label>
        <label>Doctor<select name="doctor" required>{doctors.map((d) => <option key={d.id}>{d.name}</option>)}</select></label>
        <label>Date<input name="date" type="date" defaultValue={today} required /></label>
        <label>Time<select name="time"><option>09:00 AM</option><option>10:30 AM</option><option>11:00 AM</option><option>02:30 PM</option></select></label>
        <label>Appointment type<select name="type"><option>Online Booking</option><option>Walk-in</option><option>Video Consultation</option></select></label>
        <button className="primary-btn full">Confirm booking</button>
      </form></Modal>}

      {modal === "department" && <Modal title="Add department" eyebrow="HOSPITAL UNITS" close={() => setModal("")}><form onSubmit={addDepartment}>
        <label>Department name<input name="name" required /></label><label>Department head<input name="head" required /></label>
        <label>Staff count<input name="staff" type="number" defaultValue="0" /></label>
        <button className="primary-btn full">Add department</button>
      </form></Modal>}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function Stat({ label, value, note }) {
  return <article className="stat-card"><div><small>{label}</small><strong>{value}</strong><label>{note}</label></div></article>;
}