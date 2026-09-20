import { useMemo, useState } from "react";

const moduleData = {
  "Core Modules": {
    icon: "🏥",
    color: "#38f2d0",
    items: {
      "Patient Management": ["Patient Registration", "Patient ID Generation", "Medical History", "Allergy Details", "Emergency Contacts", "Patient Portal"],
      "Doctor Management": ["Doctor Profiles", "Specialization", "Working Hours", "Leave Management", "Consultation Fees", "Performance Reports"],
      "Appointment Management": ["Online Booking", "Walk-in Appointments", "Appointment Reminder", "Queue Management", "Token Generation", "Video Consultation"],
      "Department Management": ["Department List", "Department Head", "Staff Allocation", "Department Reports"],
    },
  },
  "Clinical Modules": {
    icon: "🩺",
    color: "#52baff",
    items: {
      "Electronic Medical Records": ["Diagnosis", "Symptoms", "Treatment Plans", "Clinical Notes", "Progress Notes", "Patient Timeline"],
      "Prescription Management": ["Digital Prescription", "Medicine Dosage", "Duration", "Refill History", "Printable Prescription"],
      "Nursing Module": ["Nurse Assignment", "Patient Monitoring", "Daily Vitals", "Shift Management", "Nursing Notes"],
    },
  },
  "Pharmacy Module": {
    icon: "💊",
    color: "#ffb35d",
    items: {
      "Medicine Inventory": ["Supplier Management", "Stock Alerts", "Purchase Orders", "Sales", "Barcode Scanning", "Expiry Tracking"],
    },
  },
  "Laboratory Module": {
    icon: "🧪",
    color: "#a77cff",
    items: {
      Laboratory: ["Test Categories", "Test Booking", "Sample Collection", "Technician Assignment", "Result Entry", "PDF Reports"],
    },
  },
  "Radiology Module": {
    icon: "📷",
    color: "#ff73b7",
    items: {
      Radiology: ["X-Ray", "MRI", "CT Scan", "Ultrasound", "Image Upload", "Radiologist Report"],
    },
  },
  "Emergency Module": {
    icon: "🚑",
    color: "#ff718b",
    items: {
      Emergency: ["Emergency Registration", "Ambulance Tracking", "Trauma Care", "Critical Alerts", "Priority Queue"],
    },
  },
  "Billing Module": {
    icon: "💳",
    color: "#52baff",
    items: {
      Billing: ["Consultation Charges", "Lab Charges", "Pharmacy Charges", "Room Charges", "GST/Tax", "Insurance Claims"],
    },
  },
  "Patient Portal": {
    icon: "📱",
    color: "#38f2d0",
    items: {
      "Patient Services": ["View Appointments", "Download Reports", "Pay Bills", "View Prescriptions", "Chat with Doctor", "Telemedicine"],
    },
  },
  "Reports & Analytics": {
    icon: "📈",
    color: "#52baff",
    items: {
      Analytics: ["Daily Revenue", "Patient Statistics", "Doctor Performance", "Pharmacy Sales", "Bed Occupancy", "Disease Trends"],
    },
  },
  "AI Features": {
    icon: "🤖",
    color: "#ff73b7",
    items: {
      "Artificial Intelligence": ["AI Disease Prediction", "AI Patient Chatbot", "OCR Medical Reports", "Voice Notes", "Drug Interaction Checker", "Predictive Analytics"],
    },
  },
};

const flattenModules = () =>
  Object.entries(moduleData).flatMap(([category, group]) =>
    Object.entries(group.items).map(([title, items]) => ({
      category,
      title,
      items,
      icon: group.icon,
      color: group.color,
    }))
  );

function CinematicIntro({ onClose }) {
  return (
    <div className="cinematic-intro">
      <div className="intro-grid" />
      <div className="intro-city" />

      <div className="intro-hospital">
        <div className="intro-cross">✚</div>
        <div className="intro-windows" />
      </div>

      <div className="intro-ambulance">
        <span>✚</span>
        <i />
      </div>

      <div className="intro-hologram">
        <strong>SMART HMS SYSTEM</strong>
        <span>Patients <b /></span>
        <span>Appointments <b /></span>
        <span>Emergency <b /></span>
        <span>Analytics <b /></span>
      </div>

      <button className="skip-intro" onClick={onClose}>
        Skip intro ×
      </button>

      <div className="intro-title">
        <small>CARE-FLOW PRESENTS</small>
        <h2>HOSPITAL MANAGEMENT SYSTEM</h2>
        <p>Smart Healthcare • Better Management • Better Patient Care</p>
      </div>

      <style>{`
        .cinematic-intro {
          position: fixed;
          inset: 0;
          z-index: 999;
          display: grid;
          place-items: center;
          overflow: hidden;
          color: white;
          background: #020711;
          animation: introExit 1s ease 16s forwards;
        }

        .intro-grid {
          position: absolute;
          inset: 0;
          opacity: .35;
          background-image:
            linear-gradient(rgba(83,201,255,.14) 1px, transparent 1px),
            linear-gradient(90deg, rgba(83,201,255,.14) 1px, transparent 1px);
          background-size: 70px 70px;
          transform: perspective(500px) rotateX(62deg) scale(2);
          transform-origin: bottom;
          animation: gridMove 4s linear infinite;
        }

        .intro-city {
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          height: 42%;
          opacity: .7;
          background: linear-gradient(
            90deg,
            transparent 3% 8%, #071b31 8% 15%,
            transparent 15% 22%, #0a2039 22% 31%,
            transparent 31% 38%, #071a2d 38% 48%,
            transparent 48% 57%, #0a2039 57% 70%,
            transparent 70% 79%, #071a2d 79% 91%,
            transparent 91%
          );
          clip-path: polygon(
            0 35%, 8% 25%, 14% 42%, 22% 15%, 30% 35%,
            39% 10%, 48% 32%, 57% 18%, 67% 38%,
            76% 9%, 86% 30%, 94% 17%, 100% 35%,
            100% 100%, 0 100%
          );
        }

        .intro-hospital {
          position: absolute;
          left: 50%;
          bottom: 10%;
          width: min(530px, 72vw);
          height: 270px;
          border: 3px solid rgba(117,220,255,.7);
          background: linear-gradient(135deg,#183b5e,#071425 75%);
          box-shadow: 0 0 35px rgba(73,198,255,.35), inset 0 0 35px rgba(73,198,255,.12);
          transform: translateX(-50%) rotateX(8deg) rotateY(-7deg);
          animation: hospitalReveal 2s ease both;
        }

        .intro-cross {
          position: absolute;
          top: 35px;
          left: 50%;
          display: grid;
          width: 92px;
          height: 92px;
          place-items: center;
          color: #06101e;
          border-radius: 24px;
          background: linear-gradient(135deg,#39f2d0,#52baff);
          box-shadow: 0 0 35px #39f2d0;
          font-size: 48px;
          transform: translateX(-50%);
        }

        .intro-windows {
          position: absolute;
          inset: 155px 28px 25px;
          opacity: .7;
          background:
            repeating-linear-gradient(90deg,rgba(101,214,255,.9) 0 18px,transparent 18px 38px),
            repeating-linear-gradient(0deg,rgba(101,214,255,.9) 0 13px,transparent 13px 30px);
          box-shadow: 0 0 18px rgba(82,186,255,.6);
        }

        .intro-ambulance {
          position: absolute;
          bottom: 13%;
          left: -180px;
          width: 145px;
          height: 55px;
          border-radius: 12px 20px 8px 8px;
          background: linear-gradient(#f8fbff 0 65%,#e33c61 65%);
          box-shadow: 0 0 25px rgba(255,72,108,.8);
          animation: ambulanceMove 5s ease-in-out 3s forwards;
        }

        .intro-ambulance span {
          position: absolute;
          top: 8px;
          left: 55px;
          color: #e33c61;
          font-size: 24px;
        }

        .intro-ambulance i {
          position: absolute;
          top: -8px;
          left: 55px;
          width: 35px;
          height: 8px;
          border-radius: 8px;
          background: #ff425d;
          box-shadow: 0 0 25px #ff425d;
          animation: siren .35s infinite alternate;
        }

        .intro-hologram {
          position: absolute;
          top: 18%;
          right: 8%;
          width: 210px;
          padding: 17px;
          color: #9fffee;
          border: 1px solid rgba(56,242,208,.75);
          border-radius: 12px;
          background: rgba(11,50,70,.28);
          box-shadow: 0 0 25px rgba(56,242,208,.3);
          backdrop-filter: blur(8px);
          animation: hologramFloat 3s ease-in-out infinite;
        }

        .intro-hologram strong,
        .intro-hologram span {
          display: block;
        }

        .intro-hologram strong {
          margin-bottom: 10px;
          font-size: 13px;
        }

        .intro-hologram span {
          margin: 7px 0;
          font-size: 10px;
        }

        .intro-hologram b {
          display: block;
          height: 5px;
          margin-top: 3px;
          border-radius: 5px;
          background: linear-gradient(90deg,#39f2d0,#52baff);
          animation: dataLoad 2s ease-in-out infinite alternate;
        }

        .intro-title {
          position: relative;
          z-index: 5;
          text-align: center;
          text-shadow: 0 0 25px rgba(82,186,255,.8);
          animation: titleReveal 2s ease 7s both;
        }

        .intro-title small {
          display: block;
          margin-bottom: 15px;
          color: #39f2d0;
          font-size: 11px;
          letter-spacing: 4px;
        }

        .intro-title h2 {
          margin: 0;
          font-family: "Space Grotesk", Arial, sans-serif;
          font-size: clamp(30px, 6vw, 76px);
          letter-spacing: -3px;
        }

        .intro-title p {
          color: #a9c6df;
          letter-spacing: 2px;
        }

        .skip-intro {
          position: absolute;
          z-index: 10;
          top: 25px;
          right: 25px;
          padding: 10px 15px;
          color: #d9faff;
          border: 1px solid rgba(255,255,255,.3);
          border-radius: 20px;
          background: rgba(255,255,255,.08);
          cursor: pointer;
        }

        @keyframes gridMove {
          to { background-position: 0 70px, 70px 0; }
        }

        @keyframes hospitalReveal {
          from { opacity: 0; transform: translateX(-50%) translateY(80px) rotateX(25deg) rotateY(-20deg) scale(.7); }
          to { opacity: 1; }
        }

        @keyframes ambulanceMove {
          0% { left: -180px; }
          70%,100% { left: calc(50% - 60px); }
        }

        @keyframes siren {
          to { background: #52baff; box-shadow: 0 0 25px #52baff; }
        }

        @keyframes hologramFloat {
          50% { transform: translateY(-18px) rotateY(-8deg); }
        }

        @keyframes dataLoad {
          from { width: 25%; }
          to { width: 100%; }
        }

        @keyframes titleReveal {
          from { opacity: 0; transform: translateY(25px) scale(.8); }
          to { opacity: 1; transform: none; }
        }

        @keyframes introExit {
          to { opacity: 0; visibility: hidden; pointer-events: none; }
        }

        @media (max-width: 650px) {
          .intro-hologram {
            top: 10%;
            right: 5%;
            width: 150px;
            padding: 10px;
          }

          .intro-title {
            padding: 20px;
          }

          .intro-title h2 {
            font-size: 30px;
            letter-spacing: -1px;
          }

          .intro-title p {
            font-size: 11px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cinematic-intro {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

const ModuleDirectory = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showIntro, setShowIntro] = useState(true);

  const categories = ["All", ...Object.keys(moduleData)];

  const modules = useMemo(() => {
    const query = search.toLowerCase().trim();

    return flattenModules().filter(module => {
      const categoryMatch =
        selectedCategory === "All" || module.category === selectedCategory;

      const text = `${module.category} ${module.title} ${module.items.join(" ")}`
        .toLowerCase();

      return categoryMatch && text.includes(query);
    });
  }, [selectedCategory, search]);

  const handleMove = (event, card) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    card.style.transform =
      `perspective(900px) rotateX(${(y / rect.height - .5) * -10}deg)
       rotateY(${(x / rect.width - .5) * 10}deg) translateZ(12px)`;
  };

  return (
    <>
      {showIntro && <CinematicIntro onClose={() => setShowIntro(false)} />}

      <main className="module-directory">
        <header className="module-header">
          <p className="module-eyebrow">CARE-FLOW HOSPITAL MANAGEMENT SYSTEM</p>
          <h1>Explore the Future of Healthcare</h1>
          <p>Interactive modules for smarter hospital operations and patient care.</p>
        </header>

        <input
          className="module-search"
          type="search"
          placeholder="Search modules or features..."
          value={search}
          onChange={event => setSearch(event.target.value)}
        />

        <div className="module-filters">
          {categories.map(category => (
            <button
              key={category}
              className={selectedCategory === category ? "active" : ""}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {modules.length ? (
          <section className="module-grid">
            {modules.map(module => (
              <article
                key={`${module.category}-${module.title}`}
                className="module-card"
                style={{ "--accent": module.color }}
                onMouseMove={event => handleMove(event, event.currentTarget)}
                onMouseLeave={event => {
                  event.currentTarget.style.transform = "";
                }}
              >
                <div className="module-icon">{module.icon}</div>
                <small>{module.category}</small>
                <h2>{module.title}</h2>
                <ul>
                  {module.items.map(item => <li key={item}>{item}</li>)}
                </ul>
                <span className="module-count">
                  {module.items.length} features
                </span>
              </article>
            ))}
          </section>
        ) : (
          <p className="module-empty">No matching modules found.</p>
        )}
      </main>
    </>
  );
};

export default ModuleDirectory;