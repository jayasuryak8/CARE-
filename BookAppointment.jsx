import { useState } from "react";

const emptyForm = {
  patientName: "",
  email: "",
  phone: "",
  doctor: "",
  date: "",
  time: "",
  reason: "",
};

export default function BookAppointment({ onBooked }) {
  const [formData, setFormData] = useState(emptyForm);

  const handleChange = event => {
    const { name, value } = event.target;

    setFormData(current => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = event => {
    event.preventDefault();

    const appointment = {
      id: `APT-${Date.now()}`,
      patient: formData.patientName,
      email: formData.email,
      phone: formData.phone,
      doctor: formData.doctor,
      date: formData.date,
      time: formData.time,
      reason: formData.reason,
      district: "Not specified",
      token: `A-${Date.now().toString().slice(-2)}`,
      status: "Scheduled",
    };

    onBooked?.(appointment);
    alert("Appointment booked successfully!");
    setFormData(emptyForm);
  };

  return (
    <div className="book-appointment">
      <h2>Book Appointment</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Patient Name
          <input
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            placeholder="Enter patient name"
            required
          />
        </label>

        <label>
          Email Address
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            required
          />
        </label>

        <label>
          Phone Number
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
          />
        </label>

        <label>
          Doctor Name
          <input
            type="text"
            name="doctor"
            value={formData.doctor}
            onChange={handleChange}
            placeholder="Enter doctor name"
            required
          />
        </label>

        <label>
          Appointment Date
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Appointment Time
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Reason for Appointment
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Enter reason for appointment"
            rows="4"
            required
          />
        </label>

        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
}