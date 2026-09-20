const tests = [];
const bookings = [];
const samples = [];
const technicians = [];
const results = [];

let testId = 1001;
let bookingId = 1;
let sampleId = 1;
let resultId = 1;

function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });

    const section = document.getElementById(sectionId);
    if (section) section.classList.add("active");

    updateDashboard();
}

function valueOf(id) {
    return document.getElementById(id).value.trim();
}

function clearFields(ids) {
    ids.forEach(id => {
        document.getElementById(id).value = "";
    });
}

function addTest() {
    const name = valueOf("testName");
    const category = valueOf("testCategory");
    const price = Number(valueOf("testPrice"));

    if (!name || !category || price <= 0) {
        alert("Please enter Test Name, Category and Price.");
        return;
    }

    tests.push({ id: testId++, name, category, price });
    displayTests();
    clearFields(["testName", "testCategory", "testPrice"]);
    updateDashboard();
    alert(`Laboratory Test Added!\nTest ID: LAB-${testId - 1}`);
}

function displayTests() {
    document.getElementById("testTable").innerHTML = tests.map(test => `
        <tr>
            <td>LAB-${test.id}</td>
            <td>${test.name}</td>
            <td>${test.category}</td>
            <td>₹${test.price}</td>
        </tr>
    `).join("");
}

function bookTest() {
    const patient = valueOf("bookingPatient");
    const test = valueOf("bookingTest");
    const doctor = valueOf("bookingDoctor");
    const date = valueOf("bookingDate");
    const time = valueOf("bookingTime");

    if (!patient || !test || !date) {
        alert("Please enter Patient, Test and Date.");
        return;
    }

    bookings.push({
        id: bookingId++,
        patient,
        test,
        doctor,
        date,
        time,
        status: "Booked"
    });

    displayBookings();
    clearFields([
        "bookingPatient",
        "bookingTest",
        "bookingDoctor",
        "bookingDate",
        "bookingTime"
    ]);
    updateDashboard();
    alert(`Test booked successfully!\nBooking ID: LAB-B${bookingId - 1}`);
}

function displayBookings() {
    document.getElementById("bookingTable").innerHTML = bookings.map(booking => `
        <tr>
            <td>LAB-B${booking.id}</td>
            <td>${booking.patient}</td>
            <td>${booking.test}</td>
            <td>${booking.doctor}</td>
            <td>${booking.date}</td>
            <td>${booking.time}</td>
            <td>${booking.status}</td>
        </tr>
    `).join("");
}

function collectSample() {
    const patient = valueOf("samplePatient");
    const test = valueOf("sampleTest");
    const type = valueOf("sampleType");
    const date = valueOf("sampleDate");
    const time = valueOf("sampleTime");

    if (!patient || !test || !type) {
        alert("Please enter Patient, Test and Sample Type.");
        return;
    }

    samples.push({
        id: sampleId++,
        patient,
        test,
        type,
        date,
        time,
        status: "Collected"
    });

    displaySamples();
    clearFields([
        "samplePatient",
        "sampleTest",
        "sampleType",
        "sampleDate",
        "sampleTime"
    ]);
    updateDashboard();
    alert(`Sample collected successfully!\nSample ID: S-${sampleId - 1}`);
}

function displaySamples() {
    document.getElementById("sampleTable").innerHTML = samples.map(sample => `
        <tr>
            <td>S-${sample.id}</td>
            <td>${sample.patient}</td>
            <td>${sample.test}</td>
            <td>${sample.type}</td>
            <td>${sample.date}</td>
            <td>${sample.time}</td>
            <td>${sample.status}</td>
        </tr>
    `).join("");
}

function assignTechnician() {
    const patient = valueOf("technicianPatient");
    const test = valueOf("technicianTest");
    const technician = valueOf("technicianName");
    const shift = valueOf("technicianShift");

    if (!patient || !test || !technician) {
        alert("Please enter Patient, Test and Technician.");
        return;
    }

    technicians.push({
        patient,
        test,
        technician,
        shift,
        status: "Assigned"
    });

    displayTechnicians();
    clearFields([
        "technicianPatient",
        "technicianTest",
        "technicianName",
        "technicianShift"
    ]);
    alert("Technician assigned successfully.");
}

function displayTechnicians() {
    document.getElementById("technicianTable").innerHTML =
        technicians.map(item => `
            <tr>
                <td>${item.patient}</td>
                <td>${item.test}</td>
                <td>${item.technician}</td>
                <td>${item.shift}</td>
                <td>${item.status}</td>
            </tr>
        `).join("");
}

function enterResult() {
    const patient = valueOf("resultPatient");
    const test = valueOf("resultTest");
    const value = valueOf("resultValue");
    const normalRange = valueOf("normalRange");
    const status = valueOf("resultStatus");
    const notes = valueOf("resultNotes");

    if (!patient || !test || !value || !status) {
        alert("Please enter Patient, Test, Result and Status.");
        return;
    }

    results.push({
        id: resultId++,
        patient,
        test,
        value,
        normalRange,
        status,
        notes,
        approved: false
    });

    displayResults();
    displayReports();
    clearFields([
        "resultPatient",
        "resultTest",
        "resultValue",
        "normalRange",
        "resultStatus",
        "resultNotes"
    ]);
    updateDashboard();
    alert("Test result saved successfully.");
}

function displayResults() {
    document.getElementById("resultTable").innerHTML = results.map(result => `
        <tr>
            <td>R-${result.id}</td>
            <td>${result.patient}</td>
            <td>${result.test}</td>
            <td>${result.value}</td>
            <td>${result.normalRange}</td>
            <td class="${result.status.toLowerCase()}">${result.status}</td>
            <td>${result.notes}</td>
        </tr>
    `).join("");
}

function displayReports() {
    document.getElementById("reportList").innerHTML = results.map((result, index) => `
        <div class="report-card ${result.approved ? "report-approved" : "report-pending"}">
            <h2>🧪 Laboratory Report</h2>
            <p><strong>Report ID:</strong> R-${result.id}</p>
            <p><strong>Patient:</strong> ${result.patient}</p>
            <p><strong>Test:</strong> ${result.test}</p>
            <p><strong>Result:</strong> ${result.value}</p>
            <p><strong>Normal Range:</strong> ${result.normalRange}</p>
            <p><strong>Status:</strong> ${result.status}</p>
            <p><strong>Notes:</strong> ${result.notes}</p>
            <p><strong>Approval:</strong> ${
                result.approved ? "Approved" : "Pending Approval"
            }</p>
            ${
                !result.approved
                    ? `<button class="approve-btn" onclick="approveReport(${index})">✓ Approve Report</button>`
                    : ""
            }
            <button class="pdf-btn" onclick="generatePDF(${index})">📄 PDF Report</button>
        </div>
    `).join("");
}

function approveReport(index) {
    if (!results[index]) return;

    results[index].approved = true;
    displayReports();
    updateDashboard();
    alert("Laboratory report approved successfully.");
}

function generatePDF(index) {
    const result = results[index];
    if (!result) return;

    const printWindow = window.open("", "", "width=800,height=700");

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Laboratory Report</title>
            <style>
                body { font-family: Arial; padding: 40px; }
                h1 { color: #123c69; text-align: center; }
                h2 { color: #1769aa; }
                .header { text-align: center; border-bottom: 2px solid #123c69; padding-bottom: 15px; }
                .report { margin-top: 30px; border: 1px solid #ccc; padding: 25px; }
                .row { margin: 12px 0; }
                .footer { margin-top: 50px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🏥 City Hospital</h1>
                <h2>Laboratory Report</h2>
            </div>
            <div class="report">
                <div class="row"><strong>Report ID:</strong> R-${result.id}</div>
                <div class="row"><strong>Patient Name:</strong> ${result.patient}</div>
                <div class="row"><strong>Test:</strong> ${result.test}</div>
                <div class="row"><strong>Result:</strong> ${result.value}</div>
                <div class="row"><strong>Normal Range:</strong> ${result.normalRange}</div>
                <div class="row"><strong>Status:</strong> ${result.status}</div>
                <div class="row"><strong>Notes:</strong> ${result.notes}</div>
                <div class="row"><strong>Report Approval:</strong>
                    ${result.approved ? "Approved" : "Pending Approval"}
                </div>
            </div>
            <div class="footer">
                <p>Laboratory Technician: ______________________</p>
                <br>
                <p>Authorized Doctor: ______________________</p>
            </div>
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}

function updateDashboard() {
    document.getElementById("testCount").textContent = tests.length;
    document.getElementById("bookingCount").textContent = bookings.length;
    document.getElementById("sampleCount").textContent = samples.length;
    document.getElementById("pendingCount").textContent =
        results.filter(result => !result.approved).length;
}

updateDashboard();