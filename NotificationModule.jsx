import { useState } from "react";

const sections = [
  ["dashboard", "📊 Dashboard"],
  ["disease", "🤖 Disease Prediction"],
  ["chatbot", "💬 AI Chatbot"],
  ["ocr", "📄 OCR Reports"],
  ["voice", "🎙️ Voice Notes"],
  ["risk", "📊 Health Risk"],
  ["drug", "💊 Drug Checker"],
  ["predictive", "📈 Analytics"],
  ["sentiment", "😊 Sentiment"],
];

const initialData = {
  disease: [],
  chatbot: [],
  ocr: [],
  voice: [],
  risk: [],
  drug: [],
  predictive: [],
  sentiment: [],
};

const initialIds = {
  disease: 1001,
  chatbot: 2001,
  ocr: 3001,
  voice: 4001,
  risk: 5001,
  drug: 6001,
  predictive: 7001,
  sentiment: 8001,
};

const initialForms = {
  disease: { symptoms: "", age: "", severity: "" },
  chatbot: { user: "", question: "" },
  ocr: { patient: "", text: "" },
  voice: { doctor: "", title: "", note: "" },
  risk: { patient: "", age: "", condition: "" },
  drug: { one: "", two: "" },
  predictive: { module: "", month: "" },
  sentiment: { patient: "", text: "" },
};

const labels = {
  disease: "Disease Checks",
  chatbot: "Chatbot Queries",
  ocr: "OCR Scans",
  voice: "Voice Notes",
  risk: "Risk Reports",
  drug: "Drug Checks",
  predictive: "Forecasts",
  sentiment: "Sentiment Reports",
};

export default function NotificationModule({ go }) {
  const [active, setActive] = useState("dashboard");
  const [data, setData] = useState(initialData);
  const [ids, setIds] = useState(initialIds);
  const [forms, setForms] = useState(initialForms);

  const updateForm = (section, field, value) => {
    setForms(current => ({
      ...current,
      [section]: { ...current[section], [field]: value },
    }));
  };

  const clearForm = section => {
    setForms(current => ({
      ...current,
      [section]: Object.fromEntries(
        Object.keys(current[section]).map(key => [key, ""])
      ),
    }));
  };

  const addRecord = (section, record) => {
    setData(current => ({
      ...current,
      [section]: [...current[section], { id: ids[section], ...record }],
    }));

    setIds(current => ({
      ...current,
      [section]: current[section] + 1,
    }));

    clearForm(section);
  };

  const submit = section => {
    const form = forms[section];

    if (Object.values(form).some(value => String(value).trim() === "")) {
      alert("Please fill all details.");
      return;
    }

    if (section === "risk" && (Number(form.age) <= 0 || Number(form.age) > 120)) {
      alert("Please enter a valid age.");
      return;
    }

    if (section === "predictive" && Number(form.month) <= 0) {
      alert("Please enter valid months ahead.");
      return;
    }

    if (section === "disease") {
      addRecord("disease", {
        symptoms: form.symptoms,
        age: form.age,
        severity: form.severity,
        result: predictDisease(form.symptoms),
      });
    }

    if (section === "chatbot") {
      addRecord("chatbot", {
        user: form.user,
        question: form.question,
        response: generateResponse(form.question),
      });
    }

    if (section === "ocr") {
      addRecord("ocr", { patient: form.patient, text: form.text });
    }

    if (section === "voice") {
      addRecord("voice", {
        doctor: form.doctor,
        title: form.title,
        note: form.note,
      });
    }

    if (section === "risk") {
      addRecord("risk", {
        patient: form.patient,
        age: form.age,
        condition: form.condition,
        risk: calculateRisk(form.age, form.condition),
      });
    }

    if (section === "drug") {
      addRecord("drug", {
        one: form.one,
        two: form.two,
        result:
          form.one.toLowerCase() === form.two.toLowerCase()
            ? "Duplicate medicine alert"
            : "No major interaction found",
      });
    }

    if (section === "predictive") {
      addRecord("predictive", {
        module: form.module,
        month: form.month,
        prediction:
          Number(form.month) >= 6
            ? "High demand expected"
            : "Stable demand expected",
      });
    }

    if (section === "sentiment") {
      addRecord("sentiment", {
        patient: form.patient,
        text: form.text,
        sentiment: analyzeSentiment(form.text),
      });
    }

    alert("AI record saved successfully.");
  };

  const input = (section, field, placeholder, type = "text") => (
    <input
      type={type}
      placeholder={placeholder}
      value={forms[section][field]}
      onChange={event => updateForm(section, field, event.target.value)}
      style={styles.input}
    />
  );

  const select = (section, field, placeholder, options) => (
    <select
      value={forms[section][field]}
      onChange={event => updateForm(section, field, event.target.value)}
      style={styles.input}
    >
      <option value="">{placeholder}</option>
      {options.map(option => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );

  const formBox = (section, title, children, buttonText) => (
    <div style={styles.formBox}>
      <h3 style={styles.formTitle}>{title}</h3>
      {children}
      <button style={styles.button} onClick={() => submit(section)}>
        {buttonText}
      </button>
    </div>
  );

  const table = (section, columns, rows) => (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column} style={styles.th}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data[section].map(item => (
            <tr key={item.id}>
              {rows(item).map((value, index) => (
                <td key={index} style={styles.td}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderContent = () => {
    if (active === "dashboard") {
      const total = Object.values(data).reduce(
        (sum, records) => sum + records.length,
        0
      );

      return (
        <>
          <h1 style={styles.heading}>AI Dashboard</h1>
          <div style={styles.cards}>
            <DashboardCard label="Total AI Activities" value={total} />
            {Object.keys(labels).map(key => (
              <DashboardCard
                key={key}
                label={labels[key]}
                value={data[key].length}
              />
            ))}
          </div>
          <div style={styles.welcome}>
            <h2>Modern AI Assistance</h2>
            <p>
              Support clinical decisions, patient support, report scanning,
              and hospital analytics with AI-powered tools.
            </p>
          </div>
        </>
      );
    }

    if (active === "disease") {
      return (
        <>
          <h1 style={styles.heading}>AI Disease Prediction</h1>
          {formBox(
            "disease",
            "Predict Possible Disease",
            <>
              {input("disease", "symptoms", "Enter symptoms")}
              {select("disease", "age", "Select Age Group", ["Child", "Adult", "Senior"])}
              {select("disease", "severity", "Select Severity", ["Mild", "Moderate", "Severe"])}
            </>,
            "Predict"
          )}
          {table("disease", ["ID", "Symptoms", "Age Group", "Severity", "AI Result"], item => [
            `AI-${item.id}`, item.symptoms, item.age, item.severity, item.result,
          ])}
        </>
      );
    }

    if (active === "chatbot") {
      return (
        <>
          <h1 style={styles.heading}>AI Chatbot for Patient Support</h1>
          {formBox(
            "chatbot",
            "Ask the Bot",
            <>
              {input("chatbot", "user", "User Name")}
              <textarea
                placeholder="Type your question"
                value={forms.chatbot.question}
                onChange={event => updateForm("chatbot", "question", event.target.value)}
                style={styles.textarea}
              />
            </>,
            "Send Query"
          )}
          {table("chatbot", ["ID", "User", "Question", "Bot Response"], item => [
            `BOT-${item.id}`, item.user, item.question, item.response,
          ])}
        </>
      );
    }

    if (active === "ocr") {
      return (
        <>
          <h1 style={styles.heading}>OCR Medical Report Scanner</h1>
          {formBox(
            "ocr",
            "Scan Report Text",
            <>
              {input("ocr", "patient", "Patient Name")}
              <textarea
                placeholder="Paste scanned report text"
                value={forms.ocr.text}
                onChange={event => updateForm("ocr", "text", event.target.value)}
                style={styles.textarea}
              />
            </>,
            "Save Scan"
          )}
          {table("ocr", ["ID", "Patient", "Extracted Text"], item => [
            `OCR-${item.id}`, item.patient, item.text,
          ])}
        </>
      );
    }

    if (active === "voice") {
      return (
        <>
          <h1 style={styles.heading}>Voice Notes for Doctors</h1>
          {formBox(
            "voice",
            "Add Voice Note",
            <>
              {input("voice", "doctor", "Doctor Name")}
              {input("voice", "title", "Note Title")}
              <textarea
                placeholder="Transcribed voice note"
                value={forms.voice.note}
                onChange={event => updateForm("voice", "note", event.target.value)}
                style={styles.textarea}
              />
            </>,
            "Save Note"
          )}
          {table("voice", ["ID", "Doctor", "Title", "Note"], item => [
            `VCE-${item.id}`, item.doctor, item.title, item.note,
          ])}
        </>
      );
    }

    if (active === "risk") {
      return (
        <>
          <h1 style={styles.heading}>AI Health Risk Analysis</h1>
          {formBox(
            "risk",
            "Analyze Risk",
            <>
              {input("risk", "patient", "Patient Name")}
              {input("risk", "age", "Age", "number")}
              {select("risk", "condition", "Select Condition", [
                "Normal", "Diabetic", "Hypertension", "Cardiac",
              ])}
            </>,
            "Analyze"
          )}
          {table("risk", ["ID", "Patient", "Age", "Condition", "Risk Level"], item => [
            `RSK-${item.id}`, item.patient, item.age, item.condition, item.risk,
          ])}
        </>
      );
    }

    if (active === "drug") {
      return (
        <>
          <h1 style={styles.heading}>Drug Interaction Checker</h1>
          {formBox(
            "drug",
            "Check Medicines",
            <>
              {input("drug", "one", "Medicine 1")}
              {input("drug", "two", "Medicine 2")}
            </>,
            "Check Interaction"
          )}
          {table("drug", ["ID", "Medicine 1", "Medicine 2", "Result"], item => [
            `DRG-${item.id}`, item.one, item.two, item.result,
          ])}
        </>
      );
    }

    if (active === "predictive") {
      return (
        <>
          <h1 style={styles.heading}>Predictive Analytics</h1>
          {formBox(
            "predictive",
            "Forecast Demand",
            <>
              {input("predictive", "module", "Module Name")}
              {input("predictive", "month", "Months Ahead", "number")}
            </>,
            "Generate Forecast"
          )}
          {table("predictive", ["ID", "Module", "Months Ahead", "Prediction"], item => [
            `PRD-${item.id}`, item.module, item.month, item.prediction,
          ])}
        </>
      );
    }

    return (
      <>
        <h1 style={styles.heading}>Patient Feedback Sentiment</h1>
        {formBox(
          "sentiment",
          "Analyze Feedback",
          <>
            {input("sentiment", "patient", "Patient Name")}
            <textarea
              placeholder="Enter feedback"
              value={forms.sentiment.text}
              onChange={event => updateForm("sentiment", "text", event.target.value)}
              style={styles.textarea}
            />
          </>,
          "Analyze Sentiment"
        )}
        {table("sentiment", ["ID", "Patient", "Feedback", "Sentiment"], item => [
          `STM-${item.id}`, item.patient, item.text, item.sentiment,
        ])}
      </>
    );
  };

  return (
    <div style={styles.wrapper}>
      <aside style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>🤖 AI Features</h2>

        {sections.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            style={{
              ...styles.navButton,
              background: active === id ? "#546E7A" : "#37474F",
            }}
          >
            {label}
          </button>
        ))}

        {go && (
          <button
            onClick={() => go("home")}
            style={{ ...styles.navButton, marginTop: 18 }}
          >
            ← Back to Home
          </button>
        )}
      </aside>

      <main style={styles.main}>{renderContent()}</main>
    </div>
  );
}

function DashboardCard({ label, value }) {
  return (
    <div style={styles.card}>
      <h3>{label}</h3>
      <p style={styles.count}>{value}</p>
    </div>
  );
}

function predictDisease(symptoms) {
  const text = symptoms.toLowerCase();

  if (text.includes("fever") || text.includes("cough") || text.includes("cold")) {
    return "Possible Viral Infection";
  }

  if (text.includes("chest") || text.includes("heart")) {
    return "Cardiac Risk";
  }

  if (text.includes("stomach") || text.includes("pain")) {
    return "Gastrointestinal Issue";
  }

  if (text.includes("skin") || text.includes("rash")) {
    return "Dermatology Review";
  }

  return "General Checkup Recommended";
}

function generateResponse(question) {
  const text = question.toLowerCase();

  if (text.includes("appointment")) {
    return "You can book or reschedule appointments from the portal.";
  }

  if (text.includes("report")) {
    return "Your medical reports are available in the Reports section.";
  }

  if (text.includes("medicine") || text.includes("drug")) {
    return "Please consult a doctor before changing any medicine.";
  }

  return "Thanks for contacting support. A doctor will review your query.";
}

function calculateRisk(age, condition) {
  if (condition === "Cardiac" || Number(age) > 60) return "High";
  if (condition === "Diabetic" || condition === "Hypertension") return "Medium";
  return "Low";
}

function analyzeSentiment(text) {
  const value = text.toLowerCase();

  if (/(good|great|excellent|helpful|satisfied)/.test(value)) {
    return "Positive";
  }

  if (/(bad|poor|worst|unhappy|dissatisfied)/.test(value)) {
    return "Negative";
  }

  return "Neutral";
}

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100%",
    background: "#F0F6FB",
    color: "#263238",
  },
  sidebar: {
    width: 190,
    flexShrink: 0,
    background: "#263238",
    color: "white",
    padding: 16,
    overflowY: "auto",
  },
  sidebarTitle: {
    textAlign: "center",
    margin: "8px 0 22px",
    fontSize: 18,
  },
  navButton: {
    width: "100%",
    padding: "10px 8px",
    margin: "5px 0",
    border: "none",
    borderRadius: 7,
    color: "white",
    cursor: "pointer",
    textAlign: "left",
    fontSize: 12,
  },
  main: {
    flex: 1,
    minWidth: 0,
    padding: 20,
    overflowY: "auto",
  },
  heading: {
    color: "#263238",
    margin: "0 0 16px",
    fontSize: 21,
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 10,
  },
  card: {
    background: "white",
    padding: 14,
    borderRadius: 10,
    boxShadow: "0 3px 10px rgba(0,0,0,.08)",
    fontSize: 12,
  },
  count: {
    display: "block",
    color: "#37474F",
    fontSize: 26,
    fontWeight: 700,
    margin: "7px 0 0",
  },
  welcome: {
    background: "white",
    padding: 16,
    marginTop: 16,
    borderRadius: 10,
    boxShadow: "0 3px 10px rgba(0,0,0,.08)",
    fontSize: 13,
  },
  formBox: {
    background: "white",
    padding: 16,
    marginBottom: 16,
    borderRadius: 10,
    boxShadow: "0 3px 10px rgba(0,0,0,.08)",
  },
  formTitle: {
    margin: "0 0 10px",
    color: "#263238",
  },
  input: {
    padding: 10,
    margin: "5px 5px 5px 0",
    width: "calc(50% - 8px)",
    border: "1px solid #CBD5E1",
    borderRadius: 6,
    boxSizing: "border-box",
    background: "white",
  },
  textarea: {
    width: "100%",
    minHeight: 90,
    padding: 10,
    margin: "5px 0",
    border: "1px solid #CBD5E1",
    borderRadius: 6,
    boxSizing: "border-box",
    resize: "vertical",
    fontFamily: "inherit",
  },
  button: {
    display: "block",
    padding: "10px 16px",
    marginTop: 8,
    border: "none",
    borderRadius: 6,
    background: "#37474F",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
  },
  tableWrapper: {
    overflowX: "auto",
    background: "white",
    borderRadius: 10,
    marginBottom: 20,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 12,
  },
  th: {
    background: "#263238",
    color: "white",
    padding: 10,
    whiteSpace: "nowrap",
  },
  td: {
    padding: 9,
    textAlign: "center",
    borderBottom: "1px solid #E2E8F0",
  },
};