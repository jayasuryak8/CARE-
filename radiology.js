const reports = [];
let selectedImages = [];

const form = document.getElementById("radiologyForm");
const imageUpload = document.getElementById("imageUpload");
const imagePreview = document.getElementById("imagePreview");
const scanTypeSelect = document.getElementById("scanType");

document.querySelectorAll(".scan-card").forEach(card => {
    card.addEventListener("click", () => {
        const scan = card.dataset.scan;
        scanTypeSelect.value = scan;

        document.querySelectorAll(".scan-card").forEach(item => {
            item.classList.toggle("selected", item === card);
        });
    });
});

imageUpload.addEventListener("change", event => {
    selectedImages = Array.from(event.target.files);
    renderImagePreview();
});

function renderImagePreview() {
    imagePreview.innerHTML = "";

    selectedImages.forEach((file, index) => {
        const reader = new FileReader();

        reader.onload = event => {
            const item = document.createElement("div");
            item.className = "preview-item";
            item.innerHTML = `
                <img src="${event.target.result}" alt="Radiology image">
                <button type="button" class="remove-image">×</button>
            `;

            item.querySelector("button").addEventListener("click", () => {
                selectedImages.splice(index, 1);
                renderImagePreview();
            });

            imagePreview.appendChild(item);
        };

        reader.readAsDataURL(file);
    });
}

form.addEventListener("submit", event => {
    event.preventDefault();

    const data = {
        patientName: document.getElementById("patientName").value.trim(),
        patientId: document.getElementById("patientId").value.trim(),
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        scan: scanTypeSelect.value,
        date: document.getElementById("scanDate").value,
        doctor: document.getElementById("doctor").value.trim(),
        radiologist: document.getElementById("radiologist").value.trim(),
        status: document.getElementById("status").value,
        report: document.getElementById("report").value.trim()
    };

    if (!data.scan) {
        alert("Please select a radiology examination.");
        return;
    }

    reports.push(data);
    updateTable();
    updateDashboard();
    showMessage("Radiology report saved successfully.");
    clearForm();
});

function updateTable() {
    const table = document.getElementById("recordTable");
    table.innerHTML = "";

    reports.forEach((report, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHtml(report.patientName)}</td>
            <td>${escapeHtml(report.patientId)}</td>
            <td>${escapeHtml(report.scan)}</td>
            <td>${escapeHtml(report.date)}</td>
            <td>${escapeHtml(report.doctor)}</td>
            <td>${escapeHtml(report.radiologist)}</td>
            <td><span class="status">${escapeHtml(report.status)}</span></td>
            <td>
                <button class="action-btn" data-action="view">View</button>
                <button class="action-btn delete-btn" data-action="delete">Delete</button>
            </td>
        `;

        row.querySelector('[data-action="view"]').addEventListener("click", () => viewReport(index));
        row.querySelector('[data-action="delete"]').addEventListener("click", () => deleteReport(index));
        table.appendChild(row);
    });
}

function updateDashboard() {
    document.getElementById("totalScans").textContent = reports.length;
    document.getElementById("xrayCount").textContent = reports.filter(item => item.scan === "X-Ray").length;
    document.getElementById("mriCount").textContent = reports.filter(item => item.scan === "MRI").length;
    document.getElementById("ctCount").textContent = reports.filter(item => item.scan === "CT Scan").length;
    document.getElementById("ultrasoundCount").textContent = reports.filter(item => item.scan === "Ultrasound").length;
}

function viewReport(index) {
    const report = reports[index];

    alert(
        `RADIOLOGY REPORT\n\n` +
        `Patient ID: ${report.patientId}\n` +
        `Patient Name: ${report.patientName}\n` +
        `Age: ${report.age}\n` +
        `Gender: ${report.gender}\n` +
        `Doctor: ${report.doctor}\n` +
        `Examination: ${report.scan}\n` +
        `Date: ${report.date}\n` +
        `Radiologist: ${report.radiologist}\n` +
        `Status: ${report.status}\n\n` +
        `Report:\n${report.report}`
    );
}

function deleteReport(index) {
    if (confirm("Are you sure you want to delete this report?")) {
        reports.splice(index, 1);
        updateTable();
        updateDashboard();
    }
}

function clearForm() {
    form.reset();
    selectedImages = [];
    imagePreview.innerHTML = "";

    document.querySelectorAll(".scan-card").forEach(card => {
        card.classList.remove("selected");
    });
}

function showMessage(text) {
    const message = document.getElementById("message");
    message.textContent = text;
    message.style.display = "block";

    setTimeout(() => {
        message.style.display = "none";
    }, 3000);
}

document.getElementById("clearButton").addEventListener("click", clearForm);

document.getElementById("searchInput").addEventListener("input", event => {
    const keyword = event.target.value.toLowerCase();

    document.querySelectorAll("#recordTable tr").forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(keyword) ? "" : "none";
    });
});

document.getElementById("scanDate").value = new Date().toISOString().split("T")[0];

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

updateDashboard();