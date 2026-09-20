const patients = [];
const bedAllocations = [];
const charges = [];
const nursingRecords = [];

let occupiedBedCount = 0;
let totalChargeAmount = 0;

function setToday() {
    const today = new Date().toISOString().split("T")[0];

    document.querySelectorAll('input[type="date"]').forEach(input => {
        if (!input.value) input.value = today;
    });
}

function getValue(id) {
    return document.getElementById(id).value.trim();
}

function findPatient(id) {
    return patients.find(patient => patient.id.toLowerCase() === id.toLowerCase());
}

document.getElementById("admissionForm").addEventListener("submit", event => {
    event.preventDefault();

    const patient = {
        name: getValue("patientName"),
        id: getValue("patientId"),
        age: getValue("age"),
        gender: getValue("gender"),
        phone: getValue("phone"),
        admissionDate: getValue("admissionDate"),
        doctor: getValue("doctor"),
        department: getValue("department"),
        diagnosis: getValue("diagnosis")
    };

    if (findPatient(patient.id)) {
        alert("Patient ID already exists!");
        return;
    }

    patients.push(patient);
    updateDashboard();
    alert("Patient admitted successfully!");
    event.target.reset();
    setToday();
});

document.getElementById("bedForm").addEventListener("submit", event => {
    event.preventDefault();

    const patientId = getValue("bedPatientId");
    const patient = findPatient(patientId);

    if (!patient) {
        alert("Patient ID not found. Please admit the patient first.");
        return;
    }

    if (bedAllocations.some(item => item.patientId.toLowerCase() === patientId.toLowerCase())) {
        alert("A bed is already allocated to this patient.");
        return;
    }

    if (occupiedBedCount >= 25) {
        alert("No beds are currently available.");
        return;
    }

    const allocation = {
        patientId,
        ward: getValue("ward"),
        room: getValue("room"),
        bed: getValue("bed")
    };

    if (bedAllocations.some(item => item.room === allocation.room && item.bed === allocation.bed)) {
        alert("This bed is already occupied.");
        return;
    }

    bedAllocations.push(allocation);
    occupiedBedCount++;
    updateDashboard();
    alert("Bed allocated successfully!");
    event.target.reset();
});

document.getElementById("transferForm").addEventListener("submit", event => {
    event.preventDefault();

    const patientId = getValue("transferPatientId");
    const patient = findPatient(patientId);

    if (!patient) {
        alert("Patient ID not found!");
        return;
    }

    const allocation = bedAllocations.find(item => item.patientId.toLowerCase() === patientId.toLowerCase());

    if (allocation) {
        allocation.ward = getValue("newWard");
        allocation.room = getValue("newRoom");
    }

    alert(`Patient ${patientId} transferred successfully.`);
    event.target.reset();
});

document.getElementById("chargeForm").addEventListener("submit", event => {
    event.preventDefault();

    const patientId = getValue("chargePatientId");

    if (!findPatient(patientId)) {
        alert("Patient ID not found!");
        return;
    }

    const charge = {
        patientId,
        type: getValue("chargeType"),
        amount: Number(getValue("amount")),
        date: getValue("chargeDate"),
        description: getValue("chargeDescription") || "-"
    };

    charges.push(charge);
    totalChargeAmount += charge.amount;

    document.getElementById("chargeTable").insertAdjacentHTML("beforeend", `
        <tr>
            <td>${escapeHtml(charge.patientId)}</td>
            <td>${escapeHtml(charge.type)}</td>
            <td>₹${charge.amount.toLocaleString()}</td>
            <td>${escapeHtml(charge.date)}</td>
            <td>${escapeHtml(charge.description)}</td>
        </tr>
    `);

    updateDashboard();
    alert("Daily charge added successfully!");
    event.target.reset();
    setToday();
});

document.getElementById("nursingForm").addEventListener("submit", event => {
    event.preventDefault();

    const patientId = getValue("nursingPatientId");

    if (!findPatient(patientId)) {
        alert("Patient ID not found!");
        return;
    }

    nursingRecords.push({
        patientId,
        nurse: getValue("nurseName"),
        temperature: getValue("temperature"),
        bloodPressure: getValue("bloodPressure"),
        pulse: getValue("pulse"),
        oxygen: getValue("oxygen"),
        notes: getValue("nursingNotes")
    });

    alert("Nursing care record saved successfully!");
    event.target.reset();
});

document.getElementById("dischargeForm").addEventListener("submit", event => {
    event.preventDefault();

    const patientId = getValue("dischargePatientId");

    if (!findPatient(patientId)) {
        alert("Patient ID not found!");
        return;
    }

    const summary = {
        patientId,
        dischargeDate: getValue("dischargeDate"),
        doctor: getValue("dischargeDoctor"),
        type: getValue("dischargeType"),
        diagnosis: getValue("finalDiagnosis"),
        treatment: getValue("treatment"),
        instructions: getValue("instructions"),
        followup: getValue("followupDate")
    };

    localStorage.setItem("dischargeSummary", JSON.stringify(summary));
    alert("Discharge summary generated successfully!");
    printSummary();
});

function printSummary() {
    const data = localStorage.getItem("dischargeSummary");

    if (!data) {
        alert("Please generate a discharge summary first.");
        return;
    }

    const summary = JSON.parse(data);
    const printWindow = window.open("", "_blank", "width=800,height=700");

    if (!printWindow) {
        alert("Please allow pop-ups to print the summary.");
        return;
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Discharge Summary</title>
            <style>
                body { font-family: Arial; padding: 40px; color: #333; }
                h1 { text-align: center; color: #023e8a; }
                h2 { color: #0077b6; border-bottom: 1px solid #ccc; padding-bottom: 8px; }
                .hospital { text-align: center; margin-bottom: 30px; }
                .row { margin: 12px 0; }
                .label { font-weight: bold; }
                .box { border: 1px solid #ccc; padding: 15px; margin: 15px 0; min-height: 60px; }
            </style>
        </head>
        <body>
            <div class="hospital">
                <h1>🏥 City Hospital</h1>
                <p>Inpatient Department</p>
                <p>Discharge Summary</p>
            </div>
            <h2>Patient Information</h2>
            <div class="row"><span class="label">Patient ID:</span> ${escapeHtml(summary.patientId)}</div>
            <div class="row"><span class="label">Discharge Date:</span> ${escapeHtml(summary.dischargeDate)}</div>
            <div class="row"><span class="label">Doctor:</span> ${escapeHtml(summary.doctor)}</div>
            <div class="row"><span class="label">Discharge Type:</span> ${escapeHtml(summary.type)}</div>
            <h2>Final Diagnosis</h2><div class="box">${escapeHtml(summary.diagnosis)}</div>
            <h2>Treatment Given</h2><div class="box">${escapeHtml(summary.treatment || "-")}</div>
            <h2>Discharge Instructions</h2><div class="box">${escapeHtml(summary.instructions || "-")}</div>
            <h2>Follow-up</h2><div class="row">${escapeHtml(summary.followup || "Not specified")}</div>
            <br><br>
            <p>__________________________</p>
            <p>Authorized Doctor Signature</p>
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}

function updateDashboard() {
    document.getElementById("totalPatients").textContent = patients.length;
    document.getElementById("occupiedBeds").textContent = occupiedBedCount;
    document.getElementById("availableBeds").textContent = 25 - occupiedBedCount;
    document.getElementById("totalCharges").textContent = `₹${totalChargeAmount.toLocaleString()}`;
}

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        alert("Logged out successfully!");
        window.location.href = "login.html";
    }
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

setToday();
updateDashboard();