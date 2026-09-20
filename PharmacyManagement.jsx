import { useMemo, useState } from "react";

const initialMedicine = {
  name: "",
  code: "",
  batch: "",
  quantity: "",
  reorder: "",
  price: "",
  expiry: "",
};

const initialSupplier = {
  name: "",
  company: "",
  phone: "",
  email: "",
  address: "",
};

const initialOrder = {
  medicine: "",
  supplier: "",
  quantity: "",
  price: "",
  date: "",
};

const initialSale = {
  medicine: "",
  patient: "",
  quantity: "",
  price: "",
  date: "",
};

const initialReturn = {
  medicine: "",
  patient: "",
  quantity: "",
  reason: "",
  date: "",
};

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 60,
    overflowY: "auto",
    background: "#f0f6fb",
    color: "#0d2b55",
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    background: "#0d2b55",
    color: "white",
  },
  content: {
    maxWidth: 1250,
    margin: "0 auto",
    padding: 24,
  },
  nav: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  navButton: {
    padding: "9px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    background: "white",
    color: "#0d2b55",
    fontWeight: 700,
    cursor: "pointer",
  },
  card: {
    background: "white",
    border: "1px solid #e2eaf0",
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    boxShadow: "0 2px 10px rgba(13,43,85,.07)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 12,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    marginTop: 5,
    marginBottom: 12,
    padding: 10,
    border: "1px solid #cbd5e1",
    borderRadius: 7,
    background: "#f8fafc",
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 700,
  },
  button: {
    border: 0,
    borderRadius: 7,
    padding: "10px 16px",
    background: "#0e7490",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
  },
  close: {
    border: "1px solid white",
    borderRadius: 8,
    padding: "7px 14px",
    background: "transparent",
    color: "white",
    cursor: "pointer",
  },
  tableWrap: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    minWidth: 760,
    borderCollapse: "collapse",
  },
  th: {
    padding: 10,
    textAlign: "left",
    background: "#0d2b55",
    color: "white",
    fontSize: 12,
  },
  td: {
    padding: 10,
    borderBottom: "1px solid #e2e8f0",
    fontSize: 13,
  },
  alert: {
    padding: 10,
    marginTop: 8,
    borderRadius: 7,
    background: "#fff7df",
    color: "#946200",
  },
  expired: {
    background: "#ffe4e6",
    color: "#b4232f",
  },
};

function Field({ label, name, type = "text", value, onChange, required }) {
  return (
    <label style={styles.label}>
      {label}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        style={styles.input}
      />
    </label>
  );
}

function getStatus(medicine) {
  if (new Date(medicine.expiry) < new Date()) {
    return { text: "Expired", color: "#b4232f", background: "#ffe4e6" };
  }

  if (medicine.quantity <= medicine.reorder) {
    return { text: "Low Stock", color: "#946200", background: "#fff7df" };
  }

  return { text: "Available", color: "#087c4c", background: "#dcfce7" };
}

export default function PharmacyManagement({ onClose }) {
  const [section, setSection] = useState("dashboard");
  const [medicines, setMedicines] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [sales, setSales] = useState([]);
  const [returns, setReturns] = useState([]);
  const [barcode, setBarcode] = useState("");

  const [medicine, setMedicine] = useState(initialMedicine);
  const [supplier, setSupplier] = useState(initialSupplier);
  const [order, setOrder] = useState(initialOrder);
  const [sale, setSale] = useState(initialSale);
  const [medicineReturn, setMedicineReturn] = useState(initialReturn);

  const alerts = useMemo(() => {
    const result = [];

    medicines.forEach((item) => {
      const days = Math.ceil(
        (new Date(item.expiry) - new Date()) / (1000 * 60 * 60 * 24)
      );

      if (days < 0) {
        result.push({
          text: `${item.name} has expired.`,
          expired: true,
        });
      } else if (item.quantity <= item.reorder) {
        result.push({
          text: `${item.name} is low in stock. Current stock: ${item.quantity}.`,
        });
      } else if (days <= 30) {
        result.push({
          text: `${item.name} expires in ${days} days.`,
        });
      }
    });

    return result;
  }, [medicines]);

  const updateForm = (setter) => (event) => {
    const { name, value } = event.target;
    setter((current) => ({ ...current, [name]: value }));
  };

  const addMedicine = (event) => {
    event.preventDefault();

    setMedicines((items) => [
      ...items,
      {
        id: 1001 + items.length,
        ...medicine,
        quantity: Number(medicine.quantity),
        reorder: Number(medicine.reorder),
        price: Number(medicine.price),
      },
    ]);

    setMedicine(initialMedicine);
    window.alert("Medicine added successfully.");
  };

  const addSupplier = (event) => {
    event.preventDefault();

    setSuppliers((items) => [
      ...items,
      { id: 501 + items.length, ...supplier },
    ]);

    setSupplier(initialSupplier);
    window.alert("Supplier added successfully.");
  };

  const createPurchaseOrder = (event) => {
    event.preventDefault();

    setPurchaseOrders((items) => [
      ...items,
      {
        id: items.length + 1,
        ...order,
        quantity: Number(order.quantity),
        price: Number(order.price),
        status: "Pending",
      },
    ]);

    setOrder(initialOrder);
    window.alert("Purchase order created.");
  };

  const makeSale = (event) => {
    event.preventDefault();

    const item = medicines.find(
      (entry) => entry.name.toLowerCase() === sale.medicine.toLowerCase()
    );

    if (!item) {
      window.alert("Medicine not found in inventory.");
      return;
    }

    if (item.quantity < Number(sale.quantity)) {
      window.alert(`Insufficient stock. Available: ${item.quantity}`);
      return;
    }

    const quantity = Number(sale.quantity);
    const price = Number(sale.price);

    setMedicines((items) =>
      items.map((entry) =>
        entry.id === item.id
          ? { ...entry, quantity: entry.quantity - quantity }
          : entry
      )
    );

    setSales((items) => [
      ...items,
      {
        id: items.length + 1,
        ...sale,
        quantity,
        total: quantity * price,
      },
    ]);

    setSale(initialSale);
    window.alert(`Sale completed successfully. Total: ₹${quantity * price}`);
  };

  const processReturn = (event) => {
    event.preventDefault();

    setMedicines((items) =>
      items.map((entry) =>
        entry.name.toLowerCase() === medicineReturn.medicine.toLowerCase()
          ? {
              ...entry,
              quantity: entry.quantity + Number(medicineReturn.quantity),
            }
          : entry
      )
    );

    setReturns((items) => [
      ...items,
      {
        id: items.length + 1,
        ...medicineReturn,
        quantity: Number(medicineReturn.quantity),
      },
    ]);

    setMedicineReturn(initialReturn);
    window.alert("Medicine return processed successfully.");
  };

  const foundMedicine = medicines.find((item) => item.code === barcode);

  const renderTable = (headers, rows) => (
    <div style={styles.tableWrap}>
      <table style={styles.table}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} style={styles.th}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? rows : (
            <tr>
              <td colSpan={headers.length} style={styles.td}>No records available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={styles.overlay}>
      <header style={styles.header}>
        <div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>PHARMACY OPERATIONS</div>
          <h1 style={{ margin: "4px 0 0", fontSize: 22 }}>Pharmacy Management</h1>
        </div>
        <button style={styles.close} onClick={onClose}>Close</button>
      </header>

      <main style={styles.content}>
        <nav style={styles.nav}>
          {[
            ["dashboard", "Dashboard"],
            ["inventory", "Inventory"],
            ["suppliers", "Suppliers"],
            ["purchases", "Purchase Orders"],
            ["sales", "Sales"],
            ["returns", "Returns"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              style={{
                ...styles.navButton,
                ...(section === id
                  ? { background: "#0e7490", color: "white", borderColor: "#0e7490" }
                  : {}),
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        {section === "dashboard" && (
          <>
            <div style={styles.grid}>
              {[
                ["Medicines", medicines.length],
                ["Suppliers", suppliers.length],
                ["Low Stock", medicines.filter((item) => item.quantity <= item.reorder).length],
                ["Sales Revenue", `₹${sales.reduce((sum, item) => sum + item.total, 0)}`],
              ].map(([label, value]) => (
                <div key={label} style={styles.card}>
                  <div style={{ color: "#64748b", fontWeight: 700 }}>{label}</div>
                  <div style={{ marginTop: 8, fontSize: 30, fontWeight: 900, color: "#0e7490" }}>{value}</div>
                </div>
              ))}
            </div>

            <section style={styles.card}>
              <h2 style={{ marginTop: 0 }}>Stock and Expiry Alerts</h2>
              {alerts.length ? alerts.map((alert, index) => (
                <div key={index} style={{ ...styles.alert, ...(alert.expired ? styles.expired : {}) }}>
                  {alert.expired ? "❌" : "⚠️"} {alert.text}
                </div>
              )) : (
                <div style={{ ...styles.alert, background: "#dcfce7", color: "#087c4c" }}>
                  ✅ No stock or expiry alerts.
                </div>
              )}
            </section>
          </>
        )}

        {section === "inventory" && (
          <>
            <section style={styles.card}>
              <h2 style={{ marginTop: 0 }}>Add Medicine</h2>
              <form onSubmit={addMedicine}>
                <div style={styles.grid}>
                  <Field label="Medicine Name" name="name" value={medicine.name} onChange={updateForm(setMedicine)} required />
                  <Field label="Medicine Code / Barcode" name="code" value={medicine.code} onChange={updateForm(setMedicine)} required />
                  <Field label="Batch Number" name="batch" value={medicine.batch} onChange={updateForm(setMedicine)} />
                  <Field label="Quantity" name="quantity" type="number" value={medicine.quantity} onChange={updateForm(setMedicine)} required />
                  <Field label="Reorder Level" name="reorder" type="number" value={medicine.reorder} onChange={updateForm(setMedicine)} />
                  <Field label="Price" name="price" type="number" value={medicine.price} onChange={updateForm(setMedicine)} />
                  <Field label="Expiry Date" name="expiry" type="date" value={medicine.expiry} onChange={updateForm(setMedicine)} required />
                </div>
                <button style={styles.button}>Add Medicine</button>
              </form>
            </section>

            <section style={styles.card}>
              <h2 style={{ marginTop: 0 }}>Barcode Lookup</h2>
              <input
                placeholder="Enter medicine code"
                value={barcode}
                onChange={(event) => setBarcode(event.target.value)}
                style={styles.input}
              />
              {barcode && (
                <p>
                  {foundMedicine
                    ? `Medicine Found: ${foundMedicine.name} | Batch: ${foundMedicine.batch} | Stock: ${foundMedicine.quantity} | Price: ₹${foundMedicine.price}`
                    : "Medicine not found."}
                </p>
              )}
            </section>

            <section style={styles.card}>
              <h2 style={{ marginTop: 0 }}>Inventory</h2>
              {renderTable(
                ["ID", "Name", "Code", "Batch", "Quantity", "Reorder", "Price", "Expiry", "Status"],
                medicines.map((item) => {
                  const status = getStatus(item);
                  return (
                    <tr key={item.id}>
                      <td style={styles.td}>M{item.id}</td>
                      <td style={styles.td}>{item.name}</td>
                      <td style={styles.td}>{item.code}</td>
                      <td style={styles.td}>{item.batch}</td>
                      <td style={styles.td}>{item.quantity}</td>
                      <td style={styles.td}>{item.reorder}</td>
                      <td style={styles.td}>₹{item.price}</td>
                      <td style={styles.td}>{item.expiry}</td>
                      <td style={{ ...styles.td, color: status.color, background: status.background, fontWeight: 700 }}>{status.text}</td>
                    </tr>
                  );
                })
              )}
            </section>
          </>
        )}

        {section === "suppliers" && (
          <>
            <section style={styles.card}>
              <h2 style={{ marginTop: 0 }}>Add Supplier</h2>
              <form onSubmit={addSupplier}>
                <div style={styles.grid}>
                  {Object.keys(supplier).map((key) => (
                    <Field key={key} label={key[0].toUpperCase() + key.slice(1)} name={key} value={supplier[key]} onChange={updateForm(setSupplier)} required={key === "name" || key === "company"} />
                  ))}
                </div>
                <button style={styles.button}>Add Supplier</button>
              </form>
            </section>

            <section style={styles.card}>
              <h2 style={{ marginTop: 0 }}>Supplier Directory</h2>
              {renderTable(
                ["ID", "Name", "Company", "Phone", "Email", "Address"],
                suppliers.map((item) => (
                  <tr key={item.id}>
                    <td style={styles.td}>S{item.id}</td>
                    <td style={styles.td}>{item.name}</td>
                    <td style={styles.td}>{item.company}</td>
                    <td style={styles.td}>{item.phone}</td>
                    <td style={styles.td}>{item.email}</td>
                    <td style={styles.td}>{item.address}</td>
                  </tr>
                ))
              )}
            </section>
          </>
        )}

        {section === "purchases" && (
          <section style={styles.card}>
            <h2 style={{ marginTop: 0 }}>Create Purchase Order</h2>
            <form onSubmit={createPurchaseOrder}>
              <div style={styles.grid}>
                <Field label="Medicine" name="medicine" value={order.medicine} onChange={updateForm(setOrder)} required />
                <Field label="Supplier" name="supplier" value={order.supplier} onChange={updateForm(setOrder)} required />
                <Field label="Quantity" name="quantity" type="number" value={order.quantity} onChange={updateForm(setOrder)} required />
                <Field label="Price" name="price" type="number" value={order.price} onChange={updateForm(setOrder)} />
                <Field label="Date" name="date" type="date" value={order.date} onChange={updateForm(setOrder)} />
              </div>
              <button style={styles.button}>Create Purchase Order</button>
            </form>

            {renderTable(
              ["Order", "Medicine", "Supplier", "Quantity", "Price", "Date", "Status"],
              purchaseOrders.map((item) => (
                <tr key={item.id}>
                  <td style={styles.td}>PO-{item.id}</td>
                  <td style={styles.td}>{item.medicine}</td>
                  <td style={styles.td}>{item.supplier}</td>
                  <td style={styles.td}>{item.quantity}</td>
                  <td style={styles.td}>₹{item.price}</td>
                  <td style={styles.td}>{item.date}</td>
                  <td style={styles.td}>{item.status}</td>
                </tr>
              ))
            )}
          </section>
        )}

        {section === "sales" && (
          <section style={styles.card}>
            <h2 style={{ marginTop: 0 }}>Make Sale</h2>
            <form onSubmit={makeSale}>
              <div style={styles.grid}>
                <Field label="Medicine Name" name="medicine" value={sale.medicine} onChange={updateForm(setSale)} required />
                <Field label="Patient" name="patient" value={sale.patient} onChange={updateForm(setSale)} required />
                <Field label="Quantity" name="quantity" type="number" value={sale.quantity} onChange={updateForm(setSale)} required />
                <Field label="Unit Price" name="price" type="number" value={sale.price} onChange={updateForm(setSale)} required />
                <Field label="Date" name="date" type="date" value={sale.date} onChange={updateForm(setSale)} />
              </div>
              <button style={styles.button}>Complete Sale</button>
            </form>

            {renderTable(
              ["Sale", "Medicine", "Patient", "Quantity", "Total", "Date"],
              sales.map((item) => (
                <tr key={item.id}>
                  <td style={styles.td}>SALE-{item.id}</td>
                  <td style={styles.td}>{item.medicine}</td>
                  <td style={styles.td}>{item.patient}</td>
                  <td style={styles.td}>{item.quantity}</td>
                  <td style={styles.td}>₹{item.total}</td>
                  <td style={styles.td}>{item.date}</td>
                </tr>
              ))
            )}
          </section>
        )}

        {section === "returns" && (
          <section style={styles.card}>
            <h2 style={{ marginTop: 0 }}>Process Medicine Return</h2>
            <form onSubmit={processReturn}>
              <div style={styles.grid}>
                <Field label="Medicine Name" name="medicine" value={medicineReturn.medicine} onChange={updateForm(setMedicineReturn)} required />
                <Field label="Patient" name="patient" value={medicineReturn.patient} onChange={updateForm(setMedicineReturn)} required />
                <Field label="Quantity" name="quantity" type="number" value={medicineReturn.quantity} onChange={updateForm(setMedicineReturn)} required />
                <Field label="Reason" name="reason" value={medicineReturn.reason} onChange={updateForm(setMedicineReturn)} required />
                <Field label="Date" name="date" type="date" value={medicineReturn.date} onChange={updateForm(setMedicineReturn)} />
              </div>
              <button style={styles.button}>Process Return</button>
            </form>

            {renderTable(
              ["Return", "Medicine", "Patient", "Quantity", "Reason", "Date"],
              returns.map((item) => (
                <tr key={item.id}>
                  <td style={styles.td}>RET-{item.id}</td>
                  <td style={styles.td}>{item.medicine}</td>
                  <td style={styles.td}>{item.patient}</td>
                  <td style={styles.td}>{item.quantity}</td>
                  <td style={styles.td}>{item.reason}</td>
                  <td style={styles.td}>{item.date}</td>
                </tr>
              ))
            )}
          </section>
        )}
      </main>
    </div>
  );
}