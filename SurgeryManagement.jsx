import { useMemo, useState } from "react";
import "./surgery.css";

const today = new Date().toISOString().split("T")[0];

const initialOTStatus = {
  "OT-1": "Available",
  "OT-2": "Available",
  "OT-3": "Available",
  "OT-4": "Available",
};

const equipmentItems = [
  ["Operating Table", "operatingTable"],
  ["Anesthesia Machine", "anesthesiaMachine"],
  ["Ventilator", "ventilator"],
  ["Patient Monitor", "monitor"],
  ["Surgical Lights", "surgicalLights"],
  ["Oxygen Supply", "oxygen"],
  ["Suction Machine", "suction"],
  ["Sterilized Instruments", "sterilization"],
];

const emptySurgery = {
  patientId: "",
  patientName: "",
  surgeryName: "",
  ot: "",
  date: today,
  start: "",
  end: "",
  priority: "",
};

export default function SurgeryManagement() {
  const [section, setSection] = useState("dashboard");
  const [surgeries, setSurgeries] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [checklists, setChecklists] = useState([]);
  const [notes, setNotes] = useState([]);
  const [otStatus, setOtStatus] = useState(initialOTStatus);

  const [surgeryForm, setSurgeryForm] = useState(emptySurgery);
  const [assignmentForm, setAssignmentForm] = useState({
    surgery: "",
    surgeon: "",
    specialization: "",
    role: "",
  });
  const [checklistForm, setChecklistForm] = useState({
    surgeryId: "",
    equipment: {},
  });
  const [notesForm, setNotesForm] = useState({
    surgery: "",
    patient: "",
    surgeon: "",
    preoperative: "",
    procedure: "",
    postoperative: "",
    complications: "",
  });
  const [search, setSearch] = useState("");

  const updateForm = (setter, field, value) => {
    setter(previous => ({ ...previous, [field]: value }));
  };

  const scheduleSurgery = event => {
    event.preventDefault();

    const {
      patientId,
      patientName,
      surgeryName,
      ot,
      date,
      start,
      end,
      priority,
    } = surgeryForm;

    if (
      !patientId ||
      !patientName ||
      !surgeryName ||
      !ot ||
      !date ||
      !start ||
      !end ||
      !priority
    ) {
      alert("Please enter all surgery details.");
      return;
    }

    if (start >= end) {
      alert("End time must be later than start time.");
      return;
    }

    const conflict = surgeries.some(surgery =>
      surgery.ot === ot &&
      surgery.date === date &&
      surgery.status !== "Cancelled" &&
      start < surgery.end &&
      end > surgery.start
    );

    if (conflict) {
      alert(`${ot} is already booked during this time.`);
      return;
    }

    const surgery = {
      ...surgeryForm,
      id: `SUR-${1001 + surgeries.length}`,
      status: "Scheduled",
    };

    setSurgeries(previous => [...previous, surgery]);
    setSurgeryForm({ ...emptySurgery, date: today });
    alert(`Surgery scheduled successfully!\n\nSurgery ID: ${surgery.id}`);
  };

  const changeSurgeryStatus = (id, status) => {
    setSurgeries(previous =>
      previous.map(surgery =>
        surgery.id === id ? { ...surgery, status } : surgery
      )
    );
  };

  const filteredSurgeries = useMemo(() => {
    const query = search.toLowerCase();

    return surgeries.filter(surgery =>
      `${surgery.patientName} ${surgery.surgeryName} ${surgery.patientId}`
        .toLowerCase()
        .includes(query)
    );
  }, [surgeries, search]);

  const toggleOT = ot => {
    setOtStatus(previous => ({
      ...previous,
      [ot]: previous[ot] === "Available" ? "Occupied" : "Available",
    }));
  };

  const assignSurgeon = event => {
    event.preventDefault();

    const { surgery, surgeon, specialization, role } = assignmentForm;

    if (!surgery || !surgeon || !specialization || !role) {
      alert("Please enter all surgeon details.");
      return;
    }

    setAssignments(previous => [
      ...previous,
      {
        id: `ASN-${2001 + previous.length}`,
        surgery,
        surgeon,
        specialization,
        role,
      },
    ]);

    setAssignmentForm({
      surgery: "",
      surgeon: "",
      specialization: "",
      role: "",
    });

    alert("Surgeon assigned successfully.");
  };

  const saveChecklist = event => {
    event.preventDefault();

    if (!checklistForm.surgeryId) {
      alert("Please enter Surgery ID.");
      return;
    }

    const completed = equipmentItems.filter(
      ([, id]) => checklistForm.equipment[id]
    ).length;

    const checklist = {
      id: `CHK-${3001 + checklists.length}`,
      surgeryId: checklistForm.surgeryId,
      completed,
      total: equipmentItems.length,
      status: completed === equipmentItems.length ? "Ready" : "Pending",
    };

    setChecklists(previous => [...previous, checklist]);
    setChecklistForm({ surgeryId: "", equipment: {} });

    alert(
      `Equipment checklist saved.\n\nCompleted: ${completed}/${equipmentItems.length}\nStatus: ${checklist.status}`
    );
  };

  const saveNotes = event => {
    event.preventDefault();

    const {
      surgery,
      patient,
      surgeon,
      procedure,
    } = notesForm;

    if (!surgery || !patient || !surgeon || !procedure) {
      alert("Please enter the required surgery note details.");
      return;
    }

    setNotes(previous => [
      ...previous,
      {
        ...notesForm,
        id: `NOTE-${4001 + previous.length}`,
        date: today,
      },
    ]);

    setNotesForm({
      surgery: "",
      patient: "",
      surgeon: "",
      preoperative: "",
      procedure: "",
      postoperative: "",
      complications: "",
    });

    alert("Surgery notes saved successfully.");
  };

  const printNotes = note => {
    const printWindow = window.open("", "_blank", "width=900,height=700");

    if (!printWindow) {
      alert("Please allow pop-ups to print the notes.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Surgery Notes</title>
          <style>
            body { font-family: Arial; padding: 40px; color: #222; }
            h1 { text-align: center; color: #123c69; }
            h2 { color: #123c69; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
            .info { margin: 20px 0; line-height: 1.8; }
            .note { border: 1px solid #ccc; padding: 15px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <h1>🏥 Hospital Surgery Notes</h1>
          <div class="info">
            <strong>Note ID:</strong> ${note.id}<br>
            <strong>Surgery ID:</strong> ${note.surgery}<br>
            <strong>Patient:</strong> ${note.patient}<br>
            <strong>Surgeon:</strong> ${note.surgeon}<br>
            <strong>Date:</strong> ${note.date}
          </div>
          <div class="note"><h2>Pre-operative Notes</h2><p>${note.preoperative || "None"}</p></div>
          <div class="note"><h2>Procedure / Operation</h2><p>${note.procedure}</p></div>
          <div class="note"><h2>Post-operative Notes</h2><p>${note.postoperative || "None"}</p></div>
          <div class="note"><h2>Complications / Observations</h2><p>${note.complications || "None"}</p></div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  const statusClass = status => status.toLowerCase().replaceAll(" ", "-");

  const dashboardCards = [
    ["Total Surgeries", surgeries.length],
    ["Scheduled", surgeries.filter(s => s.status === "Scheduled").length],
    ["Completed", surgeries.filter(s => s.status === "Completed").length],
    ["Available OT", Object.values(otStatus).filter(s => s === "Available").length],
    ["Assigned Surgeons", assignments.length],
    ["Pending Checklists", checklists.filter(c => c.status === "Pending").length],
  ];

  return (
    <div className="surgery-app">
      <aside className="surgery-sidebar">
        <h2>🏥 Surgery</h2>

        {[
          ["dashboard", "📊 Dashboard"],
          ["schedule", "📅 Schedule Surgery"],
          ["ot", "🏥 OT Availability"],
          ["surgeons", "👨‍⚕️ Surgeon Assignment"],
          ["checklist", "✅ Equipment Checklist"],
          ["notes", "📝 Surgery Notes"],
        ].map(([id, label]) => (
          <button
            key={id}
            className={section === id ? "active" : ""}
            onClick={() => setSection(id)}
          >
            {label}
          </button>
        ))}
      </aside>

      <main className="surgery-main">
        {section === "dashboard" && (
          <section>
            <h1>Surgery Management Dashboard</h1>

            <div className="surgery-cards">
              {dashboardCards.map(([label, value]) => (
                <div className="surgery-card" key={label}>
                  <h3>{label}</h3>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <div className="surgery-box">
              <h2>Operating Theatre Overview</h2>
              <p>
                Schedule surgeries, assign surgeons, prepare equipment
                checklists and maintain complete operation notes.
              </p>
            </div>
          </section>
        )}

        {section === "schedule" && (
          <section>
            <h1>Surgery Scheduling</h1>

            <div className="surgery-box">
              <h2>Schedule New Surgery</h2>

              <form className="surgery-form" onSubmit={scheduleSurgery}>
                {[
                  ["patientId", "Patient ID"],
                  ["patientName", "Patient Name"],
                  ["surgeryName", "Surgery Name"],
                ].map(([field, placeholder]) => (
                  <input
                    key={field}
                    placeholder={placeholder}
                    value={surgeryForm[field]}
                    onChange={e =>
                      updateForm(setSurgeryForm, field, e.target.value)
                    }
                  />
                ))}

                <select
                  value={surgeryForm.ot}
                  onChange={e =>
                    updateForm(setSurgeryForm, "ot", e.target.value)
                  }
                >
                  <option value="">Select OT</option>
                  {Object.keys(otStatus).map(ot => (
                    <option key={ot} value={ot}>
                      {ot}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  value={surgeryForm.date}
                  onChange={e =>
                    updateForm(setSurgeryForm, "date", e.target.value)
                  }
                />

                <input
                  type="time"
                  value={surgeryForm.start}
                  onChange={e =>
                    updateForm(setSurgeryForm, "start", e.target.value)
                  }
                />

                <input
                  type="time"
                  value={surgeryForm.end}
                  onChange={e =>
                    updateForm(setSurgeryForm, "end", e.target.value)
                  }
                />

                <select
                  value={surgeryForm.priority}
                  onChange={e =>
                    updateForm(setSurgeryForm, "priority", e.target.value)
                  }
                >
                  <option value="">Select Priority</option>
                  <option>Emergency</option>
                  <option>Urgent</option>
                  <option>Routine</option>
                </select>

                <button className="primary-btn">Schedule Surgery</button>
              </form>
            </div>

            <div className="surgery-box">
              <input
                className="search-input"
                placeholder="Search patient or surgery..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="surgery-table-wrap">
              <table className="surgery-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Surgery</th>
                    <th>OT</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSurgeries.map(surgery => (
                    <tr key={surgery.id}>
                      <td>{surgery.id}</td>
                      <td>
                        {surgery.patientName}
                        <small>{surgery.patientId}</small>
                      </td>
                      <td>{surgery.surgeryName}</td>
                      <td>{surgery.ot}</td>
                      <td>{surgery.date}</td>
                      <td>{surgery.start} - {surgery.end}</td>
                      <td className={`priority-${surgery.priority.toLowerCase()}`}>
                        {surgery.priority}
                      </td>
                      <td className={`status-${statusClass(surgery.status)}`}>
                        {surgery.status}
                      </td>
                      <td>
                        {surgery.status === "Scheduled" && (
                          <>
                            <button
                              className="complete-btn"
                              onClick={() =>
                                changeSurgeryStatus(surgery.id, "Completed")
                              }
                            >
                              Complete
                            </button>
                            <button
                              className="cancel-btn"
                              onClick={() => {
                                if (window.confirm("Cancel this surgery?")) {
                                  changeSurgeryStatus(surgery.id, "Cancelled");
                                }
                              }}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {section === "ot" && (
          <section>
            <h1>Operating Theatre Availability</h1>

            <div className="ot-grid">
              {Object.entries(otStatus).map(([ot, status]) => (
                <div className="ot-card" key={ot}>
                  <h2>{ot}</h2>
                  <div className={`ot-status ${status.toLowerCase()}`}>
                    ● {status}
                  </div>
                  <button
                    className="primary-btn"
                    onClick={() => toggleOT(ot)}
                  >
                    Mark as {status === "Available" ? "Occupied" : "Available"}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {section === "surgeons" && (
          <section>
            <h1>Surgeon Assignment</h1>

            <div className="surgery-box">
              <form className="surgery-form" onSubmit={assignSurgeon}>
                <input
                  placeholder="Surgery ID"
                  value={assignmentForm.surgery}
                  onChange={e =>
                    updateForm(setAssignmentForm, "surgery", e.target.value)
                  }
                />
                <input
                  placeholder="Surgeon Name"
                  value={assignmentForm.surgeon}
                  onChange={e =>
                    updateForm(setAssignmentForm, "surgeon", e.target.value)
                  }
                />
                <input
                  placeholder="Specialization"
                  value={assignmentForm.specialization}
                  onChange={e =>
                    updateForm(
                      setAssignmentForm,
                      "specialization",
                      e.target.value
                    )
                  }
                />
                <select
                  value={assignmentForm.role}
                  onChange={e =>
                    updateForm(setAssignmentForm, "role", e.target.value)
                  }
                >
                  <option value="">Select Role</option>
                  <option>Primary Surgeon</option>
                  <option>Assistant Surgeon</option>
                  <option>Anesthesiologist</option>
                  <option>Consultant</option>
                </select>
                <button className="primary-btn">Assign Surgeon</button>
              </form>
            </div>

            <div className="surgery-table-wrap">
              <table className="surgery-table">
                <thead>
                  <tr>
                    <th>Assignment ID</th>
                    <th>Surgery ID</th>
                    <th>Surgeon</th>
                    <th>Specialization</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(assignment => (
                    <tr key={assignment.id}>
                      <td>{assignment.id}</td>
                      <td>{assignment.surgery}</td>
                      <td>{assignment.surgeon}</td>
                      <td>{assignment.specialization}</td>
                      <td>{assignment.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {section === "checklist" && (
          <section>
            <h1>Equipment Checklist</h1>

            <div className="surgery-box">
              <form onSubmit={saveChecklist}>
                <input
                  className="search-input"
                  placeholder="Surgery ID"
                  value={checklistForm.surgeryId}
                  onChange={e =>
                    updateForm(setChecklistForm, "surgeryId", e.target.value)
                  }
                />

                <div className="checklist-grid">
                  {equipmentItems.map(([name, id]) => (
                    <label key={id} className="check-item">
                      <input
                        type="checkbox"
                        checked={Boolean(checklistForm.equipment[id])}
                        onChange={e =>
                          setChecklistForm(previous => ({
                            ...previous,
                            equipment: {
                              ...previous.equipment,
                              [id]: e.target.checked,
                            },
                          }))
                        }
                      />
                      {name}
                    </label>
                  ))}
                </div>

                <button className="primary-btn">Save Checklist</button>
              </form>
            </div>

            <div className="surgery-table-wrap">
              <table className="surgery-table">
                <thead>
                  <tr>
                    <th>Checklist ID</th>
                    <th>Surgery ID</th>
                    <th>Completed</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {checklists.map(checklist => (
                    <tr key={checklist.id}>
                      <td>{checklist.id}</td>
                      <td>{checklist.surgeryId}</td>
                      <td>{checklist.completed}</td>
                      <td>{checklist.total}</td>
                      <td className={`status-${checklist.status.toLowerCase()}`}>
                        {checklist.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {section === "notes" && (
          <section>
            <h1>Surgery Notes</h1>

            <div className="surgery-box">
              <form className="surgery-form" onSubmit={saveNotes}>
                <input
                  placeholder="Surgery ID"
                  value={notesForm.surgery}
                  onChange={e =>
                    updateForm(setNotesForm, "surgery", e.target.value)
                  }
                />
                <input
                  placeholder="Patient Name"
                  value={notesForm.patient}
                  onChange={e =>
                    updateForm(setNotesForm, "patient", e.target.value)
                  }
                />
                <input
                  placeholder="Surgeon Name"
                  value={notesForm.surgeon}
                  onChange={e =>
                    updateForm(setNotesForm, "surgeon", e.target.value)
                  }
                />
                {[
                  ["preoperative", "Pre-operative Notes"],
                  ["procedure", "Procedure / Operation"],
                  ["postoperative", "Post-operative Notes"],
                  ["complications", "Complications / Observations"],
                ].map(([field, placeholder]) => (
                  <textarea
                    key={field}
                    className="full-width"
                    placeholder={placeholder}
                    value={notesForm[field]}
                    onChange={e =>
                      updateForm(setNotesForm, field, e.target.value)
                    }
                  />
                ))}
                <button className="primary-btn">Save Surgery Notes</button>
              </form>
            </div>

            <div className="surgery-table-wrap">
              <table className="surgery-table">
                <thead>
                  <tr>
                    <th>Note ID</th>
                    <th>Surgery ID</th>
                    <th>Patient</th>
                    <th>Surgeon</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {notes.map(note => (
                    <tr key={note.id}>
                      <td>{note.id}</td>
                      <td>{note.surgery}</td>
                      <td>{note.patient}</td>
                      <td>{note.surgeon}</td>
                      <td>{note.date}</td>
                      <td>
                        <button
                          className="print-btn"
                          onClick={() => printNotes(note)}
                        >
                          🖨 Print
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}