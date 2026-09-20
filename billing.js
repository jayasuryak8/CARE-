let bills = [];
let insuranceClaims = [];
let refunds = [];

let billId = 1001;
let claimId = 1;
let refundId = 1;

const $ = id => document.getElementById(id);
const value = id => $(id)?.value.trim() || "";
const money = amount => Number(amount || 0).toFixed(2);

function getTodayDate() {
    return new Date().toISOString().split("T")[0];
}

function escapeHtml(input) {
    return String(input ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[character]));
}

function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });

    const section = $(sectionId);
    if (section) section.classList.add("active");

    if (sectionId === "dashboard") updateDashboard();
}

function calculateBill() {
    const consultation = Number(value("consultation")) || 0;
    const lab = Number(value("lab")) || 0;
    const pharmacy = Number(value("pharmacy")) || 0;
    const room = Number(value("room")) || 0;
    const surgery = Number(value("surgery")) || 0;
    const taxRate = Number(value("taxRate")) || 0;
    let insurance = Number(value("insuranceAmount")) || 0;

    const subtotal = consultation + lab + pharmacy + room + surgery;
    const taxAmount = subtotal * taxRate / 100;
    const total = subtotal + taxAmount;

    insurance = Math.min(Math.max(insurance, 0), total);
    const grandTotal = total - insurance;

    $("subtotal").textContent = money(subtotal);
    $("taxAmount").textContent = money(taxAmount);
    $("insuranceDisplay").textContent = money(insurance);
    $("grandTotal").textContent = money(grandTotal);

    return { subtotal, taxAmount, insurance, grandTotal };
}

function generateBill() {
    const patientId = value("patientId");
    const patientName = value("patientName");
    const phone = value("patientPhone");
    const date = value("billDate");
    const payment = value("paymentMethod");

    if (!patientId || !patientName || !date || !payment) {
        alert("Please enter Patient ID, Patient Name, Date and Payment Method.");
        return;
    }

    const charges = calculateBill();

    const bill = {
        id: billId++,
        patientId,
        patientName,
        phone,
        date,
        consultation: Number(value("consultation")) || 0,
        lab: Number(value("lab")) || 0,
        pharmacy: Number(value("pharmacy")) || 0,
        room: Number(value("room")) || 0,
        surgery: Number(value("surgery")) || 0,
        taxRate: Number(value("taxRate")) || 0,
        taxAmount: charges.taxAmount,
        insurance: charges.insurance,
        subtotal: charges.subtotal,
        total: charges.grandTotal,
        payment
    };

    bills.push(bill);
    displayTransactions();
    updateDashboard();

    alert(`Bill generated successfully!\n\nBill No: BILL-${bill.id}\nGrand Total: ₹${money(bill.total)}`);
    printBill(bill);
    clearBillForm();
}

function printBill(bill) {
    const printWindow = window.open("", "_blank", "width=800,height=700");

    if (!printWindow) {
        alert("Please allow pop-ups to print the bill.");
        return;
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Hospital Bill</title>
            <style>
                body{font-family:Arial;padding:40px;color:#222}
                .header{text-align:center;border-bottom:2px solid #123c69;padding-bottom:15px}
                .header h1{color:#123c69}
                .patient{margin-top:25px}
                table{width:100%;border-collapse:collapse;margin-top:25px}
                th,td{border:1px solid #ccc;padding:10px}
                th{background:#123c69;color:#fff}
                .total{margin-top:25px;text-align:right;font-size:20px;font-weight:bold}
                .footer{margin-top:60px;text-align:center}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🏥 City Hospital</h1>
                <h2>Hospital Billing Invoice</h2>
                <p>Bill No: BILL-${escapeHtml(bill.id)}</p>
            </div>
            <div class="patient">
                <p><strong>Patient ID:</strong> ${escapeHtml(bill.patientId)}</p>
                <p><strong>Patient Name:</strong> ${escapeHtml(bill.patientName)}</p>
                <p><strong>Phone:</strong> ${escapeHtml(bill.phone)}</p>
                <p><strong>Date:</strong> ${escapeHtml(bill.date)}</p>
            </div>
            <table>
                <tr><th>Service</th><th>Amount</th></tr>
                <tr><td>Consultation Charges</td><td>₹${money(bill.consultation)}</td></tr>
                <tr><td>Lab Charges</td><td>₹${money(bill.lab)}</td></tr>
                <tr><td>Pharmacy Charges</td><td>₹${money(bill.pharmacy)}</td></tr>
                <tr><td>Room Charges</td><td>₹${money(bill.room)}</td></tr>
                <tr><td>Surgery Charges</td><td>₹${money(bill.surgery)}</td></tr>
                <tr><td>GST / Tax (${bill.taxRate}%)</td><td>₹${money(bill.taxAmount)}</td></tr>
                <tr><td>Insurance Coverage</td><td>- ₹${money(bill.insurance)}</td></tr>
            </table>
            <div class="total">
                Grand Total: ₹${money(bill.total)}<br><br>
                Payment: ${escapeHtml(bill.payment)}
            </div>
            <div class="footer">Thank you for choosing City Hospital.<br><br>Authorized Signature</div>
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}

function clearBillForm() {
    ["patientId", "patientName", "patientPhone", "billDate", "paymentMethod"]
        .forEach(id => $(id).value = "");

    ["consultation", "lab", "pharmacy", "room", "surgery", "insuranceAmount"]
        .forEach(id => $(id).value = 0);

    $("taxRate").value = 18;
    $("billDate").value = getTodayDate();
    calculateBill();
}

function submitClaim() {
    const patient = value("claimPatient");
    const company = value("insuranceCompany");
    const policy = value("policyNumber");
    const amount = Number(value("claimAmount")) || 0;
    const status = value("claimStatus");

    if (!patient || !company || !policy || amount <= 0) {
        alert("Please enter all insurance claim details.");
        return;
    }

    insuranceClaims.push({
        id: claimId++,
        patient,
        company,
        policy,
        amount,
        status
    });

    displayClaims();
    updateDashboard();
    alert(`Insurance claim submitted!\nClaim ID: CLM-${claimId - 1}`);

    ["claimPatient", "insuranceCompany", "policyNumber", "claimAmount"]
        .forEach(id => $(id).value = "");

    $("claimStatus").value = "Pending";
}

function displayClaims() {
    $("claimTable").innerHTML = insuranceClaims.map(claim => `
        <tr>
            <td>CLM-${claim.id}</td>
            <td>${escapeHtml(claim.patient)}</td>
            <td>${escapeHtml(claim.company)}</td>
            <td>${escapeHtml(claim.policy)}</td>
            <td>₹${money(claim.amount)}</td>
            <td class="status-${claim.status.toLowerCase()}">${escapeHtml(claim.status)}</td>
        </tr>
    `).join("");
}

function processRefund() {
    const patient = value("refundPatient");
    const bill = value("refundBill");
    const amount = Number(value("refundValue")) || 0;
    const reason = value("refundReason");

    if (!patient || !bill || amount <= 0 || !reason) {
        alert("Please enter all refund details.");
        return;
    }

    refunds.push({
        id: refundId++,
        patient,
        bill,
        amount,
        reason,
        status: "Processed"
    });

    displayRefunds();
    updateDashboard();
    alert(`Refund processed successfully!\nRefund ID: REF-${refundId - 1}`);

    ["refundPatient", "refundBill", "refundValue", "refundReason"]
        .forEach(id => $(id).value = "");
}

function displayRefunds() {
    $("refundTable").innerHTML = refunds.map(refund => `
        <tr>
            <td>REF-${refund.id}</td>
            <td>${escapeHtml(refund.patient)}</td>
            <td>${escapeHtml(refund.bill)}</td>
            <td>₹${money(refund.amount)}</td>
            <td>${escapeHtml(refund.reason)}</td>
            <td class="status-approved">${refund.status}</td>
        </tr>
    `).join("");
}

function displayTransactions() {
    $("transactionTable").innerHTML = bills.map(bill => `
        <tr>
            <td>BILL-${bill.id}</td>
            <td>${escapeHtml(bill.patientName)}</td>
            <td>₹${money(bill.subtotal)}</td>
            <td>₹${money(bill.taxAmount)}</td>
            <td>₹${money(bill.insurance)}</td>
            <td><strong>₹${money(bill.total)}</strong></td>
            <td>${escapeHtml(bill.payment)}</td>
            <td>${escapeHtml(bill.date)}</td>
        </tr>
    `).join("");
}

function updateDashboard() {
    const setText = (id, content) => {
        const element = $(id);
        if (element) element.textContent = content;
    };

    setText("totalBills", bills.length);
    setText("totalRevenue", money(bills.reduce((sum, bill) => sum + bill.total, 0)));
    setText("claimCount", insuranceClaims.length);
    setText("refundAmount", money(refunds.reduce((sum, refund) => sum + refund.amount, 0)));

    const totals = {
        dashConsultation: bills.reduce((sum, bill) => sum + bill.consultation, 0),
        dashLab: bills.reduce((sum, bill) => sum + bill.lab, 0),
        dashPharmacy: bills.reduce((sum, bill) => sum + bill.pharmacy, 0),
        dashRoom: bills.reduce((sum, bill) => sum + bill.room, 0),
        dashSurgery: bills.reduce((sum, bill) => sum + bill.surgery, 0),
        dashTax: bills.reduce((sum, bill) => sum + bill.taxAmount, 0)
    };

    Object.entries(totals).forEach(([id, total]) => setText(id, money(total)));
}

document.addEventListener("DOMContentLoaded", () => {
    $("billDate").value = getTodayDate();

    [
        "consultation", "lab", "pharmacy", "room",
        "surgery", "taxRate", "insuranceAmount"
    ].forEach(id => $(id).addEventListener("input", calculateBill));

    calculateBill();
    displayClaims();
    displayRefunds();
    displayTransactions();
    updateDashboard();
});