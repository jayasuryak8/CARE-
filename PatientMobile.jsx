import React, { useState } from "react";
import "./patient-mobile.css";

const actions = [
  ["🏥", "Hospitals", "Find nearby care"],
  ["📅", "Book visit", "Reserve a doctor"],
  ["💊", "Pharmacy", "Manage medicines"],
  ["🧪", "Laboratory", "View test results"],
];

function PatientMobile({ onClose }) {
  const [screen, setScreen] = useState("home");
  const [called, setCalled] = useState(false);

  return (
    <div className="patient-backdrop">
      <div className="patient-phone" aria-label="CARE patient mobile app">
        <div className="patient-status"><span>9:41</span><span>●●● ᐳ 🔋</span></div>
        <div className="patient-app">
          {screen === "home" && (
            <>
              <header className="patient-header">
                <div><small>Good morning</small><h1>Arjun Kumar</h1></div>
                <button className="patient-avatar" onClick={() => setScreen("profile")} aria-label="Open profile">👤</button>
              </header>
              <div className="anime-hero">
                <div className="anime-copy"><span className="anime-kicker">CARE / PATIENT APP</span><h2>Your health, <em>in motion.</em></h2><p>Everything you need for a calmer care journey.</p></div>
                <div className="anime-doctor" aria-hidden="true"><div className="anime-hair" /><div className="anime-face">◡</div><div className="anime-body"><b>✚</b></div><i className="anime-orb orb-a" /><i className="anime-orb orb-b" /></div>
              </div>
              <section className="patient-content"><div className="section-title"><h3>Quick actions</h3><span>View all</span></div><div className="action-grid">{actions.map(([icon, title, note]) => <button key={title} className="action-card" onClick={() => setScreen(title === "Book visit" ? "appointment" : "home")}><strong>{icon}</strong><b>{title}</b><small>{note}</small></button>)}</div><div className="section-title"><h3>Next appointment</h3><span className="status-pill">Confirmed</span></div><div className="appointment-card"><div className="doctor-avatar">👨‍⚕️</div><div><b>Dr. Priya Shankar</b><small>Cardiologist · Apollo Hospital</small><strong>Thu, Aug 14 · 10:30 AM</strong></div><span>›</span></div><button className="emergency-button" onClick={() => setScreen("emergency")}>🆘 Emergency assistance</button></section>
            </>
          )}
          {screen === "appointment" && <PatientScreen title="Book Appointment" back={() => setScreen("home")}><div className="progress"><span /><span /><span /><span /></div><h2 className="screen-heading">Choose your specialist</h2>{["Dr. Priya Shankar", "Dr. Rajan Mehta", "Dr. Sunita Rao"].map((doctor, index) => <button className="doctor-row" key={doctor} onClick={() => setScreen("confirmed")}><span className="doctor-avatar">👨‍⚕️</span><span><b>{doctor}</b><small>{index === 0 ? "Cardiologist" : "Senior Specialist"} · 4.{8 + index}</small></span><i>Available</i></button>)}</PatientScreen>}
          {screen === "confirmed" && <PatientScreen title="Appointment booked" back={() => setScreen("home")}><div className="confirmation"><div>✓</div><h2>You are all set</h2><p>Dr. Priya Shankar will see you at Apollo Hospital.</p><strong>Thu, Aug 14 · 10:30 AM</strong><button className="patient-primary" onClick={() => setScreen("home")}>Back to home</button></div></PatientScreen>}
          {screen === "emergency" && <PatientScreen title="Emergency" back={() => setScreen("home")}><button className={`sos-button ${called ? "called" : ""}`} onClick={() => setCalled(true)}>{called ? "✓ Ambulance dispatched" : "🆘 Call ambulance"}</button>{called && <div className="dispatch-card"><b>Unit AMB-042 is on the way</b><small>Estimated arrival · 8 minutes</small><div><i /></div></div>}<h2 className="screen-heading">Nearby hospitals</h2>{["Apollo Hospital", "MIOT International", "Fortis Malar"].map((hospital) => <div className="hospital-row" key={hospital}><span>🏥</span><div><b>{hospital}</b><small>Emergency department · 1.2 km</small></div><strong>›</strong></div>)}</PatientScreen>}
          {screen === "profile" && <PatientScreen title="My Profile" back={() => setScreen("home")}><div className="profile-card"><div className="large-avatar">👤</div><h2>Arjun Kumar</h2><p>Patient ID: MED-2026-0412</p><span>A+ · 28 yrs</span></div><div className="detail-card"><b>Medical history</b><p>Hypertension · Appendectomy</p><b>Insurance</b><p>Star Health · Valid through Jan 2027</p></div></PatientScreen>}
        </div>
        <nav className="patient-nav">{[["home", "⌂", "Home"], ["appointment", "＋", "Visits"], ["profile", "◉", "Profile"]].map(([id, icon, label]) => <button key={id} className={screen === id ? "active" : ""} onClick={() => setScreen(id)}><b>{icon}</b><small>{label}</small></button>)}</nav>
        <button className="close-patient" onClick={onClose} aria-label="Close patient app">×</button>
      </div>
    </div>
  );
}

function PatientScreen({ title, back, children }) {
  return <><header className="patient-subheader"><button onClick={back} aria-label="Go back">←</button><h1>{title}</h1></header><main className="patient-content patient-scroll">{children}</main></>;
}

export default PatientMobile;
