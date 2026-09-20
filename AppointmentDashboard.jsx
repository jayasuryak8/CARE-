import { useState } from "react";

const initialForm = {
  patientName: "",
  doctor: "",
  date: "",
  time: "",
  reason: "",
};

const doctors = [
  "Dr. Priya Shankar",
  "Dr. Rajan Mehta",
  "Dr. Anitha Rao",
];

export default function AppointmentDashboard() {
  const [formData, setFormData] = useState(initialForm);
  const [appointments, setAppointments] = useState([]);

  const handleChange = event => {
    const { name, value } = event.target;

    setFormData(current => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = event => {
    event.preventDefault();

    setAppointments(current => [
      ...current,
      {
        id: Date.now(),
        ...formData,
        status: "Scheduled",
      },
    ]);

    setFormData(initialForm);
  };

  const cancelAppointment = id => {
    setAppointments(current =>
      current.map(appointment =>
        appointment.id === id
          ? { ...appointment, status: "Cancelled" }
          : appointment
      )
    );
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .appointment-dashboard {
          min-height: 100vh;
          padding: 28px;
          color: #eaf6ff;
          font-family: Arial, sans-serif;
          background:
            radial-gradient(circle at 50% 0%, #164e63 0%, transparent 35%),
            linear-gradient(135deg, #020617, #082f49 55%, #0f172a);
        }

        .cinematic-scene {
          position: relative;
          height: 310px;
          margin-bottom: 28px;
          overflow: hidden;
          border: 1px solid #38bdf855;
          border-radius: 24px;
          background:
            linear-gradient(to bottom, #020617 0%, #082f49 58%, #155e75 100%);
          perspective: 900px;
          box-shadow: 0 20px 60px #0008;
        }

        .scene-title {
          position: absolute;
          z-index: 5;
          top: 28px;
          left: 32px;
          text-shadow: 0 0 18px #38bdf8;
        }

        .scene-title h1 {
          margin: 0;
          font-size: clamp(26px, 5vw, 48px);
          letter-spacing: 3px;
        }

        .scene-title p {
          margin: 8px 0;
          color: #bae6fd;
          letter-spacing: 2px;
        }

        .stars {
          position: absolute;
          inset: 0;
          opacity: .8;
          background-image:
            radial-gradient(#fff 1px, transparent 1px),
            radial-gradient(#7dd3fc 1px, transparent 1px);
          background-size: 70px 70px, 110px 110px;
          animation: starsMove 12s linear infinite;
        }

        .moon {
          position: absolute;
          top: 32px;
          right: 70px;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: #e0f2fe;
          box-shadow: 0 0 35px #bae6fd;
        }

        .hospital {
          position: absolute;
          bottom: 38px;
          left: 50%;
          width: 280px;
          height: 150px;
          transform: translateX(-50%) rotateX(8deg);
          border: 2px solid #67e8f9;
          background: linear-gradient(90deg, #0e7490, #164e63, #0e7490);
          box-shadow:
            0 0 25px #22d3ee99,
            0 18px 0 #02061755;
          animation: hospitalFloat 4s ease-in-out infinite;
        }

        .hospital:before {
          content: "✚";
          position: absolute;
          top: -72px;
          left: 104px;
          width: 70px;
          height: 70px;
          color: #fff;
          font-size: 48px;
          line-height: 70px;
          text-align: center;
          border-radius: 12px 12px 0 0;
          background: #0e7490;
          border: 2px solid #67e8f9;
          text-shadow: 0 0 15px #fff;
        }

        .hospital:after {
          content: "";
          position: absolute;
          left: 20px;
          right: 20px;
          bottom: -22px;
          height: 18px;
          background: #020617;
          box-shadow: 0 0 16px #22d3ee;
        }

        .window {
          position: absolute;
          top: 25px;
          width: 28px;
          height: 22px;
          border: 2px solid #bae6fd;
          background: #fef08a;
          box-shadow: 0 0 12px #fde047;
          animation: windowBlink 3s infinite alternate;
        }

        .w1 { left: 25px; }
        .w2 { left: 75px; animation-delay: .5s; }
        .w3 { right: 75px; animation-delay: 1s; }
        .w4 { right: 25px; animation-delay: 1.5s; }

        .entrance {
          position: absolute;
          bottom: 0;
          left: 112px;
          width: 56px;
          height: 72px;
          background: #082f49;
          border: 2px solid #67e8f9;
        }

        .road {
          position: absolute;
          right: -10%;
          bottom: -75px;
          width: 120%;
          height: 110px;
          transform: rotate(-5deg);
          background: #020617;
          border-top: 3px solid #38bdf8;
        }

        .ambulance {
          position: absolute;
          z-index: 4;
          bottom: 38px;
          left: -130px;
          width: 100px;
          height: 42px;
          border-radius: 8px;
          background: #f8fafc;
          box-shadow: 0 0 18px #f8fafc;
          animation: ambulanceMove 9s linear infinite;
        }

        .ambulance:before {
          content: "✚";
          position: absolute;
          left: 35px;
          top: 2px;
          color: #dc2626;
          font-size: 28px;
          font-weight: bold;
        }

        .ambulance:after {
          content: "●   ●";
          position: absolute;
          bottom: -13px;
          left: 12px;
          color: #020617;
          font-size: 20px;
          letter-spacing: 35px;
        }

        .dashboard-content {
          display: grid;
          grid-template-columns: minmax(280px, 380px) 1fr;
          gap: 22px;
          max-width: 1100px;
          margin: auto;
        }

        .panel,
        .appointment-card {
          padding: 22px;
          border: 1px solid #38bdf855;
          border-radius: 18px;
          background: #082f49cc;
          box-shadow: 0 12px 30px #0005;
        }

        .panel h2,
        .appointment-list h2 {
          margin-top: 0;
          color: #7dd3fc;
        }

        .appointment-form {
          display: grid;
          gap: 12px;
        }

        .appointment-form input,
        .appointment-form textarea,
        .appointment-form select {
          width: 100%;
          padding: 12px;
          color: #e0f2fe;
          border: 1px solid #38bdf866;
          border-radius: 9px;
          outline: none;
          background: #020617aa;
        }

        .appointment-form button,
        .appointment-card button {
          padding: 11px 15px;
          color: white;
          font-weight: bold;
          cursor: pointer;
          border: 0;
          border-radius: 9px;
          background: linear-gradient(90deg, #0891b2, #2563eb);
        }

        .appointment-list {
          display: grid;
          gap: 14px;
        }

        .appointment-card h3 {
          margin-top: 0;
          color: #bae6fd;
        }

        .appointment-card p {
          color: #cbd5e1;
        }

        .appointment-card button {
          background: #dc2626;
        }

        @keyframes starsMove {
          to { background-position: 140px 70px, -110px 110px; }
        }

        @keyframes hospitalFloat {
          50% { transform: translateX(-50%) rotateX(8deg) translateY(-8px); }
        }

        @keyframes windowBlink {
          to { opacity: .35; }
        }

        @keyframes ambulanceMove {
          0% { left: -130px; }
          65%, 100% { left: calc(100% + 130px); }
        }

        @media (max-width: 760px) {
          .appointment-dashboard {
            padding: 14px;
          }

          .dashboard-content {
            grid-template-columns: 1fr;
          }

          .cinematic-scene {
            height: 280px;
          }

          .hospital {
            transform: translateX(-50%) scale(.8) rotateX(8deg);
          }
        }
      `}</style>

      <main className="appointment-dashboard">
        <section className="cinematic-scene">
          <div className="stars" />
          <div className="moon" />

          <div className="scene-title">
            <h1>MediCare</h1>
            <p>YOUR HEALTH, MANAGED SMARTER</p>
          </div>

          <div className="hospital">
            <span className="window w1" />
            <span className="window w2" />
            <span className="window w3" />
            <span className="window w4" />
            <span className="entrance" />
          </div>

          <div className="road" />
          <div className="ambulance" />
        </section>

        <div className="dashboard-content">
          <section className="panel">
            <h2>Book Appointment</h2>

            <form onSubmit={handleSubmit} className="appointment-form">
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="Patient name"
                required
              />

              <select
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                required
              >
                <option value="">Select doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor} value={doctor}>
                    {doctor}
                  </option>
                ))}
              </select>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />

              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />

              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Reason for appointment"
                rows="4"
                required
              />

              <button type="submit">Book Appointment</button>
            </form>
          </section>

          <section>
            <h2 className="appointment-list">Appointments</h2>

            {appointments.length === 0 ? (
              <div className="panel">
                No appointments booked yet.
              </div>
            ) : (
              <div className="appointment-list">
                {appointments.map(appointment => (
                  <article key={appointment.id} className="appointment-card">
                    <h3>{appointment.patientName}</h3>
                    <p>
                      <strong>Doctor:</strong> {appointment.doctor}
                    </p>
                    <p>
                      <strong>Date:</strong> {appointment.date}
                    </p>
                    <p>
                      <strong>Time:</strong> {appointment.time}
                    </p>
                    <p>
                      <strong>Reason:</strong> {appointment.reason}
                    </p>
                    <p>
                      <strong>Status:</strong> {appointment.status}
                    </p>

                    {appointment.status === "Scheduled" && (
                      <button
                        type="button"
                        onClick={() => cancelAppointment(appointment.id)}
                      >
                        Cancel Appointment
                      </button>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}