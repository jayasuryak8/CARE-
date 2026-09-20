import { useEffect, useState } from "react";
import Hospital from "./Hospital";
import HospitalDetails from "./HospitalDetails";
import Doctors from "./Doctors";
import Appointment from "./Appointment";
import Emergency from "./Emergency";
import "./style.css";

const API_URL = "http://localhost:5000/api";

export default function App() {
  const [page, setPage] = useState("hospitals");
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/hospitals`).then(response => response.json()),
      fetch(`${API_URL}/doctors`).then(response => response.json()),
    ])
      .then(([hospitalData, doctorData]) => {
        setHospitals(hospitalData);
        setDoctors(doctorData);
      })
      .catch(() => {
        window.alert("Unable to connect to the Python backend.");
      })
      .finally(() => setLoading(false));
  }, []);

  const openHospital = hospital => {
    setSelectedHospital(hospital);
    setPage("details");
  };

  const bookAppointment = doctor => {
    setSelectedDoctor(doctor);
    setPage("appointment");
  };

  return (
    <div className="app">
      <header className="navbar">
        <h1>CARE LOVE</h1>

        <nav>
          <button onClick={() => setPage("hospitals")}>Hospitals</button>
          <button onClick={() => setPage("doctors")}>Doctors</button>
          <button
            className="emergency-link"
            onClick={() => setPage("emergency")}
          >
            Emergency
          </button>
        </nav>
      </header>

      <main className="container">
        {loading && <p className="muted">Loading healthcare data...</p>}

        {!loading && page === "hospitals" && (
          <Hospital hospitals={hospitals} onSelect={openHospital} />
        )}

        {!loading && page === "details" && (
          <HospitalDetails
            hospital={selectedHospital}
            onBack={() => setPage("hospitals")}
            onViewDoctors={() => setPage("doctors")}
          />
        )}

        {!loading && page === "doctors" && (
          <Doctors
            doctors={doctors}
            hospital={selectedHospital}
            onBack={() => setPage("hospitals")}
            onBook={bookAppointment}
          />
        )}

        {!loading && page === "appointment" && (
          <Appointment
            doctor={selectedDoctor}
            hospital={selectedHospital}
            apiUrl={API_URL}
            onBack={() => setPage("doctors")}
          />
        )}

        {page === "emergency" && (
          <Emergency onBack={() => setPage("hospitals")} />
        )}
      </main>
    </div>
  );
}