import React, { useMemo, useState } from "react";

const initialAmbulances = [
  {
    id: "AMB-001",
    vehicleNumber: "TN 01 AB 1234",
    type: "Advanced Life Support",
    status: "Available",
    location: "Chennai Central",
    driver: "Ravi Kumar",
  },
  {
    id: "AMB-002",
    vehicleNumber: "TN 02 CD 5678",
    type: "Basic Life Support",
    status: "On Duty",
    location: "T. Nagar",
    driver: "Suresh Babu",
  },
];

const initialDrivers = [
  {
    id: "DRV-001",
    name: "Ravi Kumar",
    phone: "9876543210",
    license: "TN-DR-45821",
    ambulance: "AMB-001",
    status: "Available",
  },
  {
    id: "DRV-002",
    name: "Suresh Babu",
    phone: "9865432100",
    license: "TN-DR-78214",
    ambulance: "AMB-002",
    status: "On Duty",
  },
];

const initialCalls = [
  {
    id: "CALL-001",
    caller: "Meena Krishnan",
    phone: "9840012345",
    location: "Anna Nagar, Chennai",
    priority: "Critical",
    status: "Dispatched",
    time: "10:30 AM",
  },
];

const initialFuelLogs = [
  {
    id: "FUEL-001",
    ambulance: "AMB-001",
    date: "2026-08-25",
    litres: 42,
    amount: 4200,
    odometer: 24680,
  },
];

const initialMaintenance = [
  {
    id: "MNT-001",
    ambulance: "AMB-002",
    type: "Engine Service",
    date: "2026-08-30",
    nextDue: "2026-11-30",
    status: "Scheduled",
  },
];

const tabs = [
  "Ambulance Details",
  "Driver Management",
  "GPS Tracking",
  "Emergency Calls",
  "Fuel Log",
  "Maintenance",
];

const colors = {
  navy: "#12304a",
  blue: "#1677ff",
  teal: "#0b9b8a",
  red: "#dc3545",
  orange: "#e88716",
  green: "#168753",
  border: "#dce5ec",
  background: "#f5f8fb",
  white: "#ffffff",
  text: "#263746",
  muted: "#71808d",
};

function Field({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <label style={styles.field}>
      <span>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
        style={styles.input}
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label style={styles.field}>
      <span>{label}</span>
      <select
        value={value}
        onChange={event => onChange(event.target.value)}
        style={styles.input}
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Badge({ children, color = colors.blue }) {
  return (
    <span
      style={{
        ...styles.badge,
        color,
        background: `${color}18`,
      }}
    >
      {children}
    </span>
  );
}

function SectionHeader({ title, description, buttonText, onClick }) {
  return (
    <div style={styles.sectionHeader}>
      <div>
        <h2 style={styles.heading}>{title}</h2>
        <p style={styles.description}>{description}</p>
      </div>
      {buttonText && (
        <button onClick={onClick} style={styles.primaryButton}>
          + {buttonText}
        </button>
      )}
    </div>
  );
}

const AmbulanceModule = () => {
  const [activeTab, setActiveTab] = useState("Ambulance Details");
  const [ambulances, setAmbulances] = useState(initialAmbulances);
  const [drivers, setDrivers] = useState(initialDrivers);
  const [calls, setCalls] = useState(initialCalls);
  const [fuelLogs, setFuelLogs] = useState(initialFuelLogs);
  const [maintenance, setMaintenance] = useState(initialMaintenance);

  const [showAmbulanceForm, setShowAmbulanceForm] = useState(false);
  const [showDriverForm, setShowDriverForm] = useState(false);
  const [showCallForm, setShowCallForm] = useState(false);
  const [showFuelForm, setShowFuelForm] = useState(false);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);

  const availableCount = useMemo(
    () => ambulances.filter(item => item.status === "Available").length,
    [ambulances]
  );

  const updateAmbulanceStatus = (id, status) => {
    setAmbulances(items =>
      items.map(item => (item.id === id ? { ...item, status } : item))
    );
  };

  const updateCallStatus = (id, status) => {
    setCalls(items =>
      items.map(item => (item.id === id ? { ...item, status } : item))
    );
  };

  const renderAmbulanceDetails = () => (
    <>
      <SectionHeader
        title="Ambulance Details"
        description="Manage ambulance vehicles, availability, and assignments."
        buttonText="Add Ambulance"
        onClick={() => setShowAmbulanceForm(true)}
      />

      {showAmbulanceForm && (
        <AmbulanceForm
          onCancel={() => setShowAmbulanceForm(false)}
          onSave={ambulance => {
            setAmbulances(items => [...items, ambulance]);
            setShowAmbulanceForm(false);
          }}
        />
      )}

      <div style={styles.statsGrid}>
        <StatCard title="Total Ambulances" value={ambulances.length} color={colors.blue} />
        <StatCard title="Available" value={availableCount} color={colors.green} />
        <StatCard
          title="On Duty"
          value={ambulances.filter(item => item.status === "On Duty").length}
          color={colors.orange}
        />
        <StatCard
          title="Maintenance"
          value={ambulances.filter(item => item.status === "Maintenance").length}
          color={colors.red}
        />
      </div>

      <div style={styles.tableCard}>
        <Table
          headers={["Vehicle", "Type", "Location", "Driver", "Status", "Action"]}
          rows={ambulances.map(item => [
            <strong>{item.vehicleNumber}</strong>,
            item.type,
            item.location,
            item.driver,
            <Badge color={item.status === "Available" ? colors.green : colors.orange}>
              {item.status}
            </Badge>,
            <select
              value={item.status}
              onChange={event =>
                updateAmbulanceStatus(item.id, event.target.value)
              }
              style={styles.smallSelect}
            >
              <option>Available</option>
              <option>On Duty</option>
              <option>Maintenance</option>
            </select>,
          ])}
        />
      </div>
    </>
  );

  const renderDrivers = () => (
    <>
      <SectionHeader
        title="Driver Management"
        description="Maintain driver information and ambulance assignments."
        buttonText="Add Driver"
        onClick={() => setShowDriverForm(true)}
      />

      {showDriverForm && (
        <DriverForm
          onCancel={() => setShowDriverForm(false)}
          onSave={driver => {
            setDrivers(items => [...items, driver]);
            setShowDriverForm(false);
          }}
        />
      )}

      <div style={styles.tableCard}>
        <Table
          headers={["Driver", "Phone", "License Number", "Ambulance", "Status"]}
          rows={drivers.map(item => [
            <strong>{item.name}</strong>,
            item.phone,
            item.license,
            item.ambulance,
            <Badge color={item.status === "Available" ? colors.green : colors.orange}>
              {item.status}
            </Badge>,
          ])}
        />
      </div>
    </>
  );

  const renderTracking = () => (
    <>
      <SectionHeader
        title="GPS Tracking"
        description="Monitor active ambulances and their current locations."
      />

      <div style={styles.mapCard}>
        <div style={styles.mapPlaceholder}>
          <div style={styles.mapPin}>📍</div>
          <strong>Live GPS Map</strong>
          <span>Ambulance locations are updated in real time.</span>
        </div>

        <div style={styles.locationList}>
          {ambulances.map(item => (
            <div key={item.id} style={styles.locationItem}>
              <div>
                <strong>{item.vehicleNumber}</strong>
                <div style={styles.mutedText}>{item.location}</div>
              </div>
              <Badge color={item.status === "Available" ? colors.green : colors.orange}>
                {item.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderCalls = () => (
    <>
      <SectionHeader
        title="Emergency Calls"
        description="Record, dispatch, and track emergency ambulance requests."
        buttonText="New Emergency Call"
        onClick={() => setShowCallForm(true)}
      />

      {showCallForm && (
        <CallForm
          onCancel={() => setShowCallForm(false)}
          onSave={call => {
            setCalls(items => [call, ...items]);
            setShowCallForm(false);
          }}
        />
      )}

      <div style={styles.tableCard}>
        <Table
          headers={["Caller", "Phone", "Location", "Priority", "Status", "Action"]}
          rows={calls.map(item => [
            <strong>{item.caller}</strong>,
            item.phone,
            item.location,
            <Badge color={item.priority === "Critical" ? colors.red : colors.orange}>
              {item.priority}
            </Badge>,
            <Badge color={item.status === "Completed" ? colors.green : colors.blue}>
              {item.status}
            </Badge>,
            <select
              value={item.status}
              onChange={event => updateCallStatus(item.id, event.target.value)}
              style={styles.smallSelect}
            >
              <option>Pending</option>
              <option>Dispatched</option>
              <option>Arrived</option>
              <option>Completed</option>
            </select>,
          ])}
        />
      </div>
    </>
  );

  const renderFuelLog = () => (
    <>
      <SectionHeader
        title="Fuel Log"
        description="Track fuel usage, costs, and vehicle odometer readings."
        buttonText="Add Fuel Entry"
        onClick={() => setShowFuelForm(true)}
      />

      {showFuelForm && (
        <FuelForm
          ambulances={ambulances}
          onCancel={() => setShowFuelForm(false)}
          onSave={entry => {
            setFuelLogs(items => [entry, ...items]);
            setShowFuelForm(false);
          }}
        />
      )}

      <div style={styles.tableCard}>
        <Table
          headers={["Ambulance", "Date", "Litres", "Amount", "Odometer"]}
          rows={fuelLogs.map(item => [
            <strong>{item.ambulance}</strong>,
            item.date,
            `${item.litres} L`,
            `₹${item.amount}`,
            `${item.odometer} km`,
          ])}
        />
      </div>
    </>
  );

  const renderMaintenance = () => (
    <>
      <SectionHeader
        title="Maintenance"
        description="Schedule and monitor ambulance service and repairs."
        buttonText="Add Maintenance"
        onClick={() => setShowMaintenanceForm(true)}
      />

      {showMaintenanceForm && (
        <MaintenanceForm
          ambulances={ambulances}
          onCancel={() => setShowMaintenanceForm(false)}
          onSave={entry => {
            setMaintenance(items => [entry, ...items]);
            setShowMaintenanceForm(false);
          }}
        />
      )}

      <div style={styles.tableCard}>
        <Table
          headers={["Ambulance", "Service Type", "Service Date", "Next Due", "Status"]}
          rows={maintenance.map(item => [
            <strong>{item.ambulance}</strong>,
            item.type,
            item.date,
            item.nextDue,
            <Badge color={item.status === "Completed" ? colors.green : colors.orange}>
              {item.status}
            </Badge>,
          ])}
        />
      </div>
    </>
  );

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <div style={styles.titleRow}>
            <span style={styles.titleIcon}>🚑</span>
            <h1 style={styles.title}>Ambulance Module</h1>
          </div>
          <p style={styles.subtitle}>
            Emergency transport and fleet management
          </p>
        </div>

        <div style={styles.headerStatus}>
          <span style={styles.liveDot} />
          System Online
        </div>
      </header>

      <nav style={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.activeTab : {}),
            }}
          >
            {tab}
          </button>
        ))}
      </nav>

      <main style={styles.content}>
        {activeTab === "Ambulance Details" && renderAmbulanceDetails()}
        {activeTab === "Driver Management" && renderDrivers()}
        {activeTab === "GPS Tracking" && renderTracking()}
        {activeTab === "Emergency Calls" && renderCalls()}
        {activeTab === "Fuel Log" && renderFuelLog()}
        {activeTab === "Maintenance" && renderMaintenance()}
      </main>
    </div>
  );
};

function StatCard({ title, value, color }) {
  return (
    <div style={styles.statCard}>
      <span style={{ ...styles.statIcon, background: `${color}18`, color }}>●</span>
      <div>
        <div style={styles.statValue}>{value}</div>
        <div style={styles.mutedText}>{title}</div>
      </div>
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={styles.table}>
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header} style={styles.th}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} style={styles.td}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FormCard({ title, children, onCancel, onSubmit }) {
  return (
    <form onSubmit={onSubmit} style={styles.formCard}>
      <h3 style={styles.formTitle}>{title}</h3>
      <div style={styles.formGrid}>{children}</div>
      <div style={styles.formActions}>
        <button type="button" onClick={onCancel} style={styles.secondaryButton}>
          Cancel
        </button>
        <button type="submit" style={styles.primaryButton}>
          Save
        </button>
      </div>
    </form>
  );
}

function AmbulanceForm({ onCancel, onSave }) {
  const [form, setForm] = useState({
    vehicleNumber: "",
    type: "Basic Life Support",
    location: "",
    driver: "",
  });

  return (
    <FormCard
      title="Add Ambulance"
      onCancel={onCancel}
      onSubmit={event => {
        event.preventDefault();
        onSave({
          id: `AMB-${Date.now()}`,
          ...form,
          status: "Available",
        });
      }}
    >
      <Field label="Vehicle Number" value={form.vehicleNumber} onChange={value => setForm({ ...form, vehicleNumber: value })} />
      <SelectField label="Ambulance Type" value={form.type} onChange={value => setForm({ ...form, type: value })} options={["Basic Life Support", "Advanced Life Support", "Patient Transport"]} />
      <Field label="Current Location" value={form.location} onChange={value => setForm({ ...form, location: value })} />
      <Field label="Assigned Driver" value={form.driver} onChange={value => setForm({ ...form, driver: value })} />
    </FormCard>
  );
}

function DriverForm({ onCancel, onSave }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    license: "",
    ambulance: "",
    status: "Available",
  });

  return (
    <FormCard
      title="Add Driver"
      onCancel={onCancel}
      onSubmit={event => {
        event.preventDefault();
        onSave({ id: `DRV-${Date.now()}`, ...form });
      }}
    >
      <Field label="Driver Name" value={form.name} onChange={value => setForm({ ...form, name: value })} />
      <Field label="Phone Number" value={form.phone} onChange={value => setForm({ ...form, phone: value })} />
      <Field label="License Number" value={form.license} onChange={value => setForm({ ...form, license: value })} />
      <Field label="Ambulance ID" value={form.ambulance} onChange={value => setForm({ ...form, ambulance: value })} />
    </FormCard>
  );
}

function CallForm({ onCancel, onSave }) {
  const [form, setForm] = useState({
    caller: "",
    phone: "",
    location: "",
    priority: "Critical",
  });

  return (
    <FormCard
      title="New Emergency Call"
      onCancel={onCancel}
      onSubmit={event => {
        event.preventDefault();
        onSave({
          id: `CALL-${Date.now()}`,
          ...form,
          status: "Pending",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
      }}
    >
      <Field label="Caller Name" value={form.caller} onChange={value => setForm({ ...form, caller: value })} />
      <Field label="Phone Number" value={form.phone} onChange={value => setForm({ ...form, phone: value })} />
      <Field label="Emergency Location" value={form.location} onChange={value => setForm({ ...form, location: value })} />
      <SelectField label="Priority" value={form.priority} onChange={value => setForm({ ...form, priority: value })} options={["Critical", "High", "Normal"]} />
    </FormCard>
  );
}

function FuelForm({ ambulances, onCancel, onSave }) {
  const [form, setForm] = useState({
    ambulance: ambulances[0]?.id || "",
    date: "",
    litres: "",
    amount: "",
    odometer: "",
  });

  return (
    <FormCard
      title="Add Fuel Entry"
      onCancel={onCancel}
      onSubmit={event => {
        event.preventDefault();
        onSave({
          id: `FUEL-${Date.now()}`,
          ...form,
          litres: Number(form.litres),
          amount: Number(form.amount),
          odometer: Number(form.odometer),
        });
      }}
    >
      <SelectField label="Ambulance" value={form.ambulance} onChange={value => setForm({ ...form, ambulance: value })} options={ambulances.map(item => item.id)} />
      <Field label="Date" type="date" value={form.date} onChange={value => setForm({ ...form, date: value })} />
      <Field label="Fuel Litres" type="number" value={form.litres} onChange={value => setForm({ ...form, litres: value })} />
      <Field label="Amount" type="number" value={form.amount} onChange={value => setForm({ ...form, amount: value })} />
      <Field label="Odometer Reading" type="number" value={form.odometer} onChange={value => setForm({ ...form, odometer: value })} />
    </FormCard>
  );
}

function MaintenanceForm({ ambulances, onCancel, onSave }) {
  const [form, setForm] = useState({
    ambulance: ambulances[0]?.id || "",
    type: "General Service",
    date: "",
    nextDue: "",
    status: "Scheduled",
  });

  return (
    <FormCard
      title="Add Maintenance Record"
      onCancel={onCancel}
      onSubmit={event => {
        event.preventDefault();
        onSave({ id: `MNT-${Date.now()}`, ...form });
      }}
    >
      <SelectField label="Ambulance" value={form.ambulance} onChange={value => setForm({ ...form, ambulance: value })} options={ambulances.map(item => item.id)} />
      <SelectField label="Maintenance Type" value={form.type} onChange={value => setForm({ ...form, type: value })} options={["General Service", "Engine Service", "Tyre Replacement", "Emergency Repair"]} />
      <Field label="Service Date" type="date" value={form.date} onChange={value => setForm({ ...form, date: value })} />
      <Field label="Next Due Date" type="date" value={form.nextDue} onChange={value => setForm({ ...form, nextDue: value })} />
      <SelectField label="Status" value={form.status} onChange={value => setForm({ ...form, status: value })} options={["Scheduled", "In Progress", "Completed"]} />
    </FormCard>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: colors.background,
    color: colors.text,
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 32px",
    background: colors.white,
    borderBottom: `1px solid ${colors.border}`,
  },
  titleRow: { display: "flex", alignItems: "center", gap: 12 },
  titleIcon: { fontSize: 30 },
  title: { margin: 0, color: colors.navy, fontSize: 25 },
  subtitle: { margin: "6px 0 0 44px", color: colors.muted },
  headerStatus: { color: colors.green, fontWeight: 700, fontSize: 13 },
  liveDot: {
    display: "inline-block",
    width: 9,
    height: 9,
    borderRadius: "50%",
    background: colors.green,
    marginRight: 7,
  },
  tabs: {
    display: "flex",
    gap: 4,
    padding: "0 32px",
    background: colors.white,
    borderBottom: `1px solid ${colors.border}`,
    overflowX: "auto",
  },
  tab: {
    border: 0,
    background: "transparent",
    color: colors.muted,
    padding: "16px 14px",
    whiteSpace: "nowrap",
    cursor: "pointer",
    fontWeight: 700,
  },
  activeTab: {
    color: colors.blue,
    borderBottom: `3px solid ${colors.blue}`,
  },
  content: { maxWidth: 1250, margin: "0 auto", padding: 32 },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    marginBottom: 22,
  },
  heading: { margin: 0, color: colors.navy, fontSize: 22 },
  description: { color: colors.muted, margin: "7px 0 0" },
  primaryButton: {
    border: 0,
    borderRadius: 8,
    padding: "11px 16px",
    background: colors.blue,
    color: colors.white,
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryButton: {
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    padding: "10px 16px",
    background: colors.white,
    color: colors.text,
    fontWeight: 700,
    cursor: "pointer",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 16,
    marginBottom: 22,
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: 18,
    borderRadius: 12,
    background: colors.white,
    border: `1px solid ${colors.border}`,
  },
  statIcon: {
    width: 35,
    height: 35,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
  },
  statValue: { color: colors.navy, fontSize: 25, fontWeight: 800 },
  tableCard: {
    background: colors.white,
    border: `1px solid ${colors.border}`,
    borderRadius: 12,
    overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 700 },
  th: {
    textAlign: "left",
    padding: 14,
    color: colors.muted,
    background: "#f8fafc",
    fontSize: 12,
    textTransform: "uppercase",
  },
  td: { padding: 15, borderTop: `1px solid ${colors.border}`, fontSize: 14 },
  badge: {
    display: "inline-block",
    padding: "5px 9px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
  },
  smallSelect: {
    border: `1px solid ${colors.border}`,
    borderRadius: 6,
    padding: 6,
    color: colors.text,
  },
  mapCard: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 20,
    background: colors.white,
    border: `1px solid ${colors.border}`,
    borderRadius: 12,
    padding: 18,
  },
  mapPlaceholder: {
    minHeight: 390,
    borderRadius: 10,
    background: "linear-gradient(135deg, #dceff5, #eef5ea)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    color: colors.navy,
  },
  mapPin: { fontSize: 42 },
  locationList: { display: "flex", flexDirection: "column", gap: 12 },
  locationItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    border: `1px solid ${colors.border}`,
    borderRadius: 9,
  },
  mutedText: { color: colors.muted, fontSize: 13, marginTop: 5 },
  formCard: {
    background: colors.white,
    border: `1px solid ${colors.border}`,
    borderRadius: 12,
    padding: 20,
    marginBottom: 22,
  },
  formTitle: { margin: "0 0 18px", color: colors.navy },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 16,
  },
  field: { display: "flex", flexDirection: "column", gap: 7, fontSize: 13, fontWeight: 700 },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 11px",
    border: `1px solid ${colors.border}`,
    borderRadius: 7,
    fontSize: 14,
    color: colors.text,
    background: colors.white,
  },
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
};

export default AmbulanceModule;