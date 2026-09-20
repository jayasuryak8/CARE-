import { useMemo, useState } from "react";
import "./inventory.css";

const today = new Date().toISOString().split("T")[0];

const stockStatus = (quantity, minimum) => {
  if (quantity === 0) return "Out of Stock";
  if (quantity <= minimum) return "Low Stock";
  return "Available";
};

const emptyItem = {
  name: "",
  code: "",
  category: "",
  quantity: "",
  minimum: "",
  location: "",
  unit: "",
  expiry: "",
};

export default function InventoryManagement() {
  const [section, setSection] = useState("dashboard");
  const [equipment, setEquipment] = useState([]);
  const [consumables, setConsumables] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [equipmentForm, setEquipmentForm] = useState(emptyItem);
  const [consumableForm, setConsumableForm] = useState(emptyItem);
  const [supplierForm, setSupplierForm] = useState({
    name: "",
    contact: "",
    phone: "",
    email: "",
    address: "",
  });
  const [orderForm, setOrderForm] = useState({
    item: "",
    supplier: "",
    quantity: "",
    price: "",
    date: today,
  });
  const [equipmentSearch, setEquipmentSearch] = useState("");
  const [consumableSearch, setConsumableSearch] = useState("");

  const allItems = [...equipment, ...consumables];

  const lowStock = allItems.filter(
    item => Number(item.quantity) <= Number(item.minimum)
  );

  const updateForm = (setter, field, value) => {
    setter(previous => ({ ...previous, [field]: value }));
  };

  const addEquipment = event => {
    event.preventDefault();

    if (
      !equipmentForm.name ||
      !equipmentForm.code ||
      !equipmentForm.category ||
      equipmentForm.quantity === "" ||
      equipmentForm.minimum === "" ||
      !equipmentForm.location
    ) {
      alert("Please enter all required equipment details.");
      return;
    }

    setEquipment(previous => [
      ...previous,
      {
        ...equipmentForm,
        id: `EQ-${1001 + previous.length}`,
        quantity: Number(equipmentForm.quantity),
        minimum: Number(equipmentForm.minimum),
        expiry: equipmentForm.expiry || "-",
      },
    ]);

    setEquipmentForm(emptyItem);
  };

  const addConsumable = event => {
    event.preventDefault();

    if (
      !consumableForm.name ||
      !consumableForm.code ||
      !consumableForm.category ||
      consumableForm.quantity === "" ||
      consumableForm.minimum === "" ||
      !consumableForm.unit
    ) {
      alert("Please enter all required consumable details.");
      return;
    }

    setConsumables(previous => [
      ...previous,
      {
        ...consumableForm,
        id: `CON-${2001 + previous.length}`,
        quantity: Number(consumableForm.quantity),
        minimum: Number(consumableForm.minimum),
        expiry: consumableForm.expiry || "-",
      },
    ]);

    setConsumableForm(emptyItem);
  };

  const addSupplier = event => {
    event.preventDefault();

    if (
      !supplierForm.name ||
      !supplierForm.contact ||
      !supplierForm.phone
    ) {
      alert("Please enter supplier name, contact and phone.");
      return;
    }

    setSuppliers(previous => [
      ...previous,
      {
        ...supplierForm,
        id: `SUP-${3001 + previous.length}`,
      },
    ]);

    setSupplierForm({
      name: "",
      contact: "",
      phone: "",
      email: "",
      address: "",
    });
  };

  const createPurchaseOrder = event => {
    event.preventDefault();

    if (
      !orderForm.item ||
      !orderForm.supplier ||
      Number(orderForm.quantity) <= 0 ||
      Number(orderForm.price) <= 0 ||
      !orderForm.date
    ) {
      alert("Please enter all purchase order details.");
      return;
    }

    const supplier = suppliers.find(item => item.id === orderForm.supplier);

    setPurchaseOrders(previous => [
      ...previous,
      {
        ...orderForm,
        id: `PO-${4001 + previous.length}`,
        supplierName: supplier?.name || "Unknown",
        quantity: Number(orderForm.quantity),
        price: Number(orderForm.price),
        total: Number(orderForm.quantity) * Number(orderForm.price),
        status: "Pending",
      },
    ]);

    setOrderForm({
      item: "",
      supplier: "",
      quantity: "",
      price: "",
      date: today,
    });
  };

  const filteredEquipment = useMemo(() => {
    const query = equipmentSearch.toLowerCase();
    return equipment.filter(item =>
      `${item.name} ${item.code} ${item.category}`
        .toLowerCase()
        .includes(query)
    );
  }, [equipment, equipmentSearch]);

  const filteredConsumables = useMemo(() => {
    const query = consumableSearch.toLowerCase();
    return consumables.filter(item =>
      `${item.name} ${item.code} ${item.category}`
        .toLowerCase()
        .includes(query)
    );
  }, [consumables, consumableSearch]);

  const printReport = () => {
    const rows = allItems
      .map(item => `
        <tr>
          <td>${item.name}</td>
          <td>${item.type}</td>
          <td>${item.quantity}</td>
          <td>${item.minimum}</td>
          <td>${stockStatus(item.quantity, item.minimum)}</td>
        </tr>
      `)
      .join("");

    const printWindow = window.open("", "_blank", "width=900,height=700");

    if (!printWindow) {
      alert("Please allow pop-ups to print the report.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Hospital Inventory Report</title>
          <style>
            body{font-family:Arial;padding:30px}
            h1{text-align:center;color:#123c69}
            table{width:100%;border-collapse:collapse;margin-top:25px}
            th,td{border:1px solid #ccc;padding:10px;text-align:center}
            th{background:#123c69;color:white}
          </style>
        </head>
        <body>
          <h1>🏥 Hospital Inventory Stock Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Minimum Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  const statusClass = status =>
    status === "Available"
      ? "status-good"
      : status === "Low Stock"
        ? "status-low"
        : "status-out";

  const renderItemTable = (items, type, onDelete) => (
    <div className="inventory-table-wrap">
      <table className="inventory-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Code</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Minimum</th>
            <th>{type === "equipment" ? "Location" : "Unit"}</th>
            <th>Expiry</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const status = stockStatus(item.quantity, item.minimum);

            return (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.code}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>{item.minimum}</td>
                <td>{type === "equipment" ? item.location : item.unit}</td>
                <td>{item.expiry}</td>
                <td className={statusClass(status)}>{status}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => onDelete(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const itemForm = (form, setter, type) => (
    <form className="inventory-form" onSubmit={type === "equipment" ? addEquipment : addConsumable}>
      <input
        placeholder={`${type === "equipment" ? "Equipment" : "Consumable"} Name`}
        value={form.name}
        onChange={e => updateForm(setter, "name", e.target.value)}
      />
      <input
        placeholder="Item Code"
        value={form.code}
        onChange={e => updateForm(setter, "code", e.target.value)}
      />
      <input
        placeholder="Category"
        value={form.category}
        onChange={e => updateForm(setter, "category", e.target.value)}
      />
      <input
        type="number"
        min="0"
        placeholder="Quantity"
        value={form.quantity}
        onChange={e => updateForm(setter, "quantity", e.target.value)}
      />
      <input
        type="number"
        min="0"
        placeholder="Minimum Stock"
        value={form.minimum}
        onChange={e => updateForm(setter, "minimum", e.target.value)}
      />

      {type === "equipment" ? (
        <input
          placeholder="Storage Location"
          value={form.location}
          onChange={e => updateForm(setter, "location", e.target.value)}
        />
      ) : (
        <input
          placeholder="Unit: Box, Piece, Pack"
          value={form.unit}
          onChange={e => updateForm(setter, "unit", e.target.value)}
        />
      )}

      <input
        type="date"
        value={form.expiry}
        onChange={e => updateForm(setter, "expiry", e.target.value)}
      />

      <button className="primary-btn" type="submit">
        Add {type === "equipment" ? "Equipment" : "Consumable"}
      </button>
    </form>
  );

  return (
    <div className="inventory-app">
      <aside className="inventory-sidebar">
        <h2>📦 Inventory</h2>
        {[
          ["dashboard", "📊 Dashboard"],
          ["equipment", "🏥 Medical Equipment"],
          ["consumables", "🧴 Consumables"],
          ["suppliers", "🏢 Suppliers"],
          ["orders", "📦 Purchase Orders"],
          ["reports", "📈 Stock Reports"],
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

      <main className="inventory-main">
        {section === "dashboard" && (
          <section>
            <h1>Inventory Dashboard</h1>
            <div className="inventory-cards">
              {[
                ["Total Items", allItems.length],
                ["Medical Equipment", equipment.length],
                ["Consumables", consumables.length],
                ["Low Stock", lowStock.length],
                ["Suppliers", suppliers.length],
                ["Purchase Orders", purchaseOrders.length],
              ].map(([label, value]) => (
                <div className="inventory-card" key={label}>
                  <h3>{label}</h3>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <div className="inventory-info">
              <h2>Inventory Overview</h2>
              <p>
                Manage medical equipment, consumables, suppliers,
                purchase orders and stock levels from one centralized system.
              </p>
            </div>
          </section>
        )}

        {section === "equipment" && (
          <section>
            <h1>Medical Equipment</h1>
            <div className="inventory-box">
              <h2>Add Medical Equipment</h2>
              {itemForm(equipmentForm, setEquipmentForm, "equipment")}
            </div>

            <div className="inventory-box">
              <input
                className="search-input"
                placeholder="🔎 Search equipment..."
                value={equipmentSearch}
                onChange={e => setEquipmentSearch(e.target.value)}
              />
            </div>

            {renderItemTable(
              filteredEquipment,
              "equipment",
              index => setEquipment(items => items.filter((_, i) => i !== index))
            )}
          </section>
        )}

        {section === "consumables" && (
          <section>
            <h1>Consumables</h1>
            <div className="inventory-box">
              <h2>Add Consumable</h2>
              {itemForm(consumableForm, setConsumableForm, "consumable")}
            </div>

            <div className="inventory-box">
              <input
                className="search-input"
                placeholder="🔎 Search consumables..."
                value={consumableSearch}
                onChange={e => setConsumableSearch(e.target.value)}
              />
            </div>

            {renderItemTable(
              filteredConsumables,
              "consumable",
              index => setConsumables(items => items.filter((_, i) => i !== index))
            )}
          </section>
        )}

        {section === "suppliers" && (
          <section>
            <h1>Supplier Management</h1>
            <div className="inventory-box">
              <h2>Add Supplier</h2>
              <form className="inventory-form" onSubmit={addSupplier}>
                {[
                  ["name", "Supplier Name"],
                  ["contact", "Contact Person"],
                  ["phone", "Phone Number"],
                  ["email", "Email"],
                  ["address", "Address"],
                ].map(([field, placeholder]) => (
                  <input
                    key={field}
                    placeholder={placeholder}
                    value={supplierForm[field]}
                    onChange={e => updateForm(setSupplierForm, field, e.target.value)}
                  />
                ))}
                <button className="primary-btn">Add Supplier</button>
              </form>
            </div>

            <div className="inventory-table-wrap">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((supplier, index) => (
                    <tr key={supplier.id}>
                      <td>{supplier.id}</td>
                      <td>{supplier.name}</td>
                      <td>{supplier.contact}</td>
                      <td>{supplier.phone}</td>
                      <td>{supplier.email || "-"}</td>
                      <td>{supplier.address || "-"}</td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() =>
                            setSuppliers(items => items.filter((_, i) => i !== index))
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {section === "orders" && (
          <section>
            <h1>Purchase Orders</h1>
            <div className="inventory-box">
              <h2>Create Purchase Order</h2>
              <form className="inventory-form" onSubmit={createPurchaseOrder}>
                <input
                  placeholder="Item Name"
                  value={orderForm.item}
                  onChange={e => updateForm(setOrderForm, "item", e.target.value)}
                />
                <select
                  value={orderForm.supplier}
                  onChange={e => updateForm(setOrderForm, "supplier", e.target.value)}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  placeholder="Quantity"
                  value={orderForm.quantity}
                  onChange={e => updateForm(setOrderForm, "quantity", e.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Unit Price"
                  value={orderForm.price}
                  onChange={e => updateForm(setOrderForm, "price", e.target.value)}
                />
                <input
                  type="date"
                  value={orderForm.date}
                  onChange={e => updateForm(setOrderForm, "date", e.target.value)}
                />
                <button className="primary-btn">Create Purchase Order</button>
              </form>
            </div>

            <div className="inventory-table-wrap">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>PO ID</th>
                    <th>Item</th>
                    <th>Supplier</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrders.map(order => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.item}</td>
                      <td>{order.supplierName}</td>
                      <td>{order.quantity}</td>
                      <td>₹{order.price.toFixed(2)}</td>
                      <td>₹{order.total.toFixed(2)}</td>
                      <td>{order.date}</td>
                      <td className="status-low">{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {section === "reports" && (
          <section>
            <h1>Stock Reports</h1>

            <div className="report-cards">
              {[
                ["Total Inventory Items", allItems.length],
                ["Available Stock", allItems.filter(i => i.quantity > i.minimum).length],
                ["Low Stock Items", lowStock.length],
                ["Out of Stock", allItems.filter(i => i.quantity === 0).length],
              ].map(([label, value]) => (
                <div className="report-card" key={label}>
                  <h3>{label}</h3>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <div className="inventory-box">
              <h2>Low Stock Report</h2>
              <div className="inventory-table-wrap">
                <table className="inventory-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Type</th>
                      <th>Quantity</th>
                      <th>Minimum</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStock.map(item => {
                      const status = stockStatus(item.quantity, item.minimum);

                      return (
                        <tr key={`${item.type}-${item.id}`}>
                          <td>{item.name}</td>
                          <td>{item.type || "Inventory Item"}</td>
                          <td>{item.quantity}</td>
                          <td>{item.minimum}</td>
                          <td className={statusClass(status)}>{status}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <button className="primary-btn" onClick={printReport}>
              🖨 Print Stock Report
            </button>
          </section>
        )}
      </main>
    </div>
  );
}