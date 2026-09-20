let ambulances = JSON.parse(localStorage.getItem("ambulances")) || [];
let drivers = JSON.parse(localStorage.getItem("drivers")) || [];
let calls = JSON.parse(localStorage.getItem("calls")) || [];
let fuelLogs = JSON.parse(localStorage.getItem("fuelLogs")) || [];
let maintenanceRecords = JSON.parse(localStorage.getItem("maintenanceRecords")) || [];
let trackingInterval = null;

const $ = id => document.getElementById(id);
const value = id => $(id).value.trim();

function saveData() {
    localStorage.setItem("ambulances", JSON.stringify(ambulances));
    localStorage.setItem("drivers", JSON.stringify(drivers));
    localStorage.setItem("calls", JSON.stringify(calls));
    localStorage.setItem("fuelLogs", JSON.stringify(fuelLogs));
    localStorage.setItem("maintenanceRecords", JSON.stringify(maintenanceRecords));
}

function updateDashboard() {
    $("totalAmbulances").textContent = ambulances.length;
    $("availableAmbulances").textContent = ambulances.filter(a => a.status === "Available").length;
    $("activeAmbulances").textContent = ambulances.filter(a => a.status === "On Emergency").length;
    $("totalDrivers").textContent = drivers.length;
    $("totalCalls").textContent = calls.length;
    $("maintenanceCount").textContent = ambulances.filter(a => a.status === "Maintenance").length;
}

function statusClass(status) {
    return {
        Available: "status-available",
        "On Emergency": "status-emergency",
        "At Hospital": "status-hospital",
        Maintenance: "status-maintenance"
    }[status] || "";
}

function renderAmbulances() {
    const search = $("ambulanceSearch").value.toLowerCase();
    const filter = $("statusFilter").value;

    $("ambulanceTable").innerHTML = ambulances
        .filter(a => a.number.toLowerCase().includes(search))
        .filter(a => filter === "All" || a.status === filter)
        .map(a => `
            <tr>
                <td><strong>${a.number}</strong></td>
                <td>${a.type}</td>
                <td>${a.model || "-"}</td>
                <td>📍 ${a.location || "-"}</td>
                <td><span class="status ${statusClass(a.status)}">${a.status}</span></td>
                <td><button class="delete-btn" onclick="deleteAmbulance('${a.id}')">Delete</button></td>
            </tr>
        `).join("");
}

function deleteAmbulance(id) {
    if (!confirm("Delete this ambulance?")) return;

    ambulances = ambulances.filter(a => a.id !== id);
    saveData();
    renderAmbulances();
    updateDropdowns();
    updateDashboard();
}

$("ambulanceForm").addEventListener("submit", event => {
    event.preventDefault();

    ambulances.push({
        id: `AMB-${Date.now()}`,
        number: value("ambulanceNumber").toUpperCase(),
        type: value("ambulanceType"),
        model: value("ambulanceModel"),
        year: value("registrationYear"),
        status: value("ambulanceStatus"),
        location: value("baseLocation"),
        lat: value("latitude") || "13.0827",
        lng: value("longitude") || "80.2707"
    });

    saveData();
    renderAmbulances();
    updateDropdowns();
    updateDashboard();
    alert("🚑 Ambulance added successfully!");
    event.target.reset();
});

$("driverForm").addEventListener("submit", event => {
    event.preventDefault();

    drivers.push({
        id: `DRV-${Date.now()}`,
        name: value("driverName"),
        license: value("licenseNumber"),
        phone: value("driverPhone"),
        experience: value("experience") || "0",
        ambulance: value("driverAmbulance"),
        status: value("driverStatus")
    });

    saveData();
    renderDrivers();
    updateDashboard();
    alert("👨‍✈️ Driver added successfully!");
    event.target.reset();
});

function renderDrivers() {
    $("driverTable").innerHTML = drivers.map(d => `
        <tr>
            <td><strong>${d.name}</strong></td>
            <td>${d.license}</td>
            <td>${d.phone}</td>
            <td>${d.experience} years</td>
            <td>${d.ambulance || "Not Assigned"}</td>
            <td><span class="status">${d.status}</span></td>
        </tr>
    `).join("");
}

function updateDropdowns() {
    ["driverAmbulance", "gpsAmbulance", "callAmbulance", "fuelAmbulance", "maintenanceAmbulance"]
        .forEach(id => {
            const select = $(id);
            const current = select.value;
            const empty = id === "driverAmbulance" ? "Not Assigned" : "Select Ambulance";

            select.innerHTML = `<option value="">${empty}</option>`;

            ambulances.forEach(a => {
                select.insertAdjacentHTML("beforeend",
                    `<option value="${a.number}">${a.number}</option>`);
            });

            select.value = current;
        });
}

function startTracking() {
    const number = value("gpsAmbulance");
    const ambulance = ambulances.find(a => a.number === number);

    if (!ambulance) {
        alert("Please select an ambulance.");
        return;
    }

    $("trackedAmbulance").textContent = ambulance.number;
    $("gpsMessage").textContent = "GPS tracking active";
    $("gpsMarker").style.display = "block";

    updateGPS(ambulance);
    clearInterval(trackingInterval);
    trackingInterval = setInterval(() => updateGPS(ambulance), 3000);
}

function updateGPS(ambulance) {
    const lat = parseFloat(ambulance.lat) + (Math.random() - .5) * .001;
    const lng = parseFloat(ambulance.lng) + (Math.random() - .5) * .001;

    $("currentLat").textContent = lat.toFixed(6);
    $("currentLng").textContent = lng.toFixed(6);
    $("currentSpeed").textContent = `${Math.floor(Math.random() * 60) + 1} km/h`;
    $("lastUpdated").textContent = new Date().toLocaleTimeString();
}

function stopTracking() {
    clearInterval(trackingInterval);
    trackingInterval = null;
    $("gpsMarker").style.display = "none";
    $("gpsMessage").textContent = "GPS tracking stopped.";
}

$("callForm").addEventListener("submit", event => {
    event.preventDefault();

    calls.push({
        id: `CALL-${Date.now()}`,
        caller: value("callerName"),
        phone: value("callerPhone"),
        location: value("emergencyLocation"),
        type: value("callType"),
        priority: value("callPriority"),
        ambulance: value("callAmbulance") || "Not Assigned",
        status: "Pending",
        time: new Date().toLocaleTimeString()
    });

    saveData();
    renderCalls();
    updateDashboard();
    alert("📞 Emergency call registered!");
    event.target.reset();
});

function renderCalls() {
    $("callTable").innerHTML = calls.map(c => `
        <tr>
            <td>${c.id}</td>
            <td><strong>${c.caller}</strong><br>${c.phone}</td>
            <td>📍 ${c.location}</td>
            <td>${c.type}</td>
            <td><span class="status">${c.priority}</span></td>
            <td>${c.ambulance}</td>
            <td>${c.status}</td>
        </tr>
    `).join("");
}

$("fuelForm").addEventListener("submit", event => {
    event.preventDefault();

    const quantity = Number(value("fuelQuantity"));
    const price = Number(value("fuelPrice"));

    fuelLogs.push({
        date: value("fuelDate"),
        ambulance: value("fuelAmbulance"),
        type: value("fuelType"),
        quantity,
        price,
        total: quantity * price,
        odometer: value("odometer")
    });

    saveData();
    renderFuel();
    alert("⛽ Fuel record saved successfully!");
    event.target.reset();
    $("fuelDate").value = new Date().toISOString().split("T")[0];
});

function renderFuel() {
    $("fuelTable").innerHTML = fuelLogs.map(f => `
        <tr>
            <td>${f.date}</td>
            <td>${f.ambulance}</td>
            <td>${f.type}</td>
            <td>${f.quantity} L</td>
            <td>₹${f.price.toFixed(2)}</td>
            <td><strong>₹${f.total.toFixed(2)}</strong></td>
            <td>${f.odometer || "-"} KM</td>
        </tr>
    `).join("");
}

$("maintenanceForm").addEventListener("submit", event => {
    event.preventDefault();

    const record = {
        ambulance: value("maintenanceAmbulance"),
        date: value("maintenanceDate"),
        type: value("maintenanceType"),
        cost: Number(value("serviceCost")) || 0,
        center: value("serviceCenter"),
        status: value("maintenanceStatus"),
        remarks: value("maintenanceRemarks")
    };

    maintenanceRecords.push(record);

    const ambulance = ambulances.find(a => a.number === record.ambulance);
    if (ambulance && ["Scheduled", "In Progress"].includes(record.status)) {
        ambulance.status = "Maintenance";
    }

    saveData();
    renderMaintenance();
    renderAmbulances();
    updateDashboard();
    alert("🔧 Maintenance record saved!");
    event.target.reset();
});

function renderMaintenance() {
    $("maintenanceTable").innerHTML = maintenanceRecords.map(r => `
        <tr>
            <td>${r.ambulance}</td>
            <td>${r.date}</td>
            <td>${r.type}</td>
            <td>₹${r.cost.toFixed(2)}</td>
            <td>${r.center || "-"}</td>
            <td><span class="status">${r.status}</span></td>
        </tr>
    `).join("");
}

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        alert("Logged out successfully.");
        window.location.href = "login.html";
    }
}

$("ambulanceSearch").addEventListener("input", renderAmbulances);
$("statusFilter").addEventListener("change", renderAmbulances);

const today = new Date().toISOString().split("T")[0];
$("fuelDate").value = today;
$("maintenanceDate").value = today;

updateDashboard();
renderAmbulances();
renderDrivers();
renderCalls();
renderFuel();
renderMaintenance();
updateDropdowns();