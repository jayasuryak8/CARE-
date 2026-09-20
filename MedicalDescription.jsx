import React from "react";
import "./CareFlowDashboard.css";

const medicalServices = [
  {
    id: 1,
    title: "Medical Consultation",
    image: "/medical/medical-consultation.jpg",
    caption: "Quality Care Starts With Better Communication",
  },
  {
    id: 2,
    title: "Emergency Care",
    image: "/medical/emergency-care.jpg",
    caption: "24/7 Emergency Support",
  },
  {
    id: 3,
    title: "Preventive Healthcare",
    image: "/medical/preventive-healthcare.jpg",
    caption: "Prevention Is Better Than Cure",
  },
  {
    id: 4,
    title: "Medicine & Pharmacy",
    image: "/medical/medicine-pharmacy.jpg",
    caption: "Safe & Reliable Medication Management",
  },
  {
    id: 5,
    title: "Healthy Lifestyle",
    image: "/medical/healthy-lifestyle.jpg",
    caption: "Take Care of Your Health Every Day",
  },
  {
    id: 6,
    title: "Modern Hospital Technology",
    image: "/medical/modern-hospital-tech.jpg",
    caption: "Smart Technology for Better Healthcare",
  },
];

export default function MedicalDescription() {
  return (
    <section className="medical-description-section">
      <div className="medical-description-header">
        <div>
          <span className="section-label">CARE & WELLNESS</span>
          <h2>Medical Description</h2>
          <p>
            Explore our healthcare services and discover how CareFlow supports
            better patient care.
          </p>
        </div>
      </div>

      <div className="medical-description-grid">
        {medicalServices.map((service) => (
          <article className="medical-description-card" key={service.id}>
            <div className="medical-image-wrapper">
              <img
                src={service.image}
                alt={service.title}
                className="medical-description-image"
              />
              <div className="medical-image-overlay">
                <span>Medical Care</span>
              </div>
            </div>

            <div className="medical-description-content">
              <h3>{service.title}</h3>
              <p>{service.caption}</p>
              <button type="button" className="medical-view-button">
                View Details <span>→</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}