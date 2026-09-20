const emergencyPatients=[];
const ambulances=[];
let alerts=[];

const $=id=>document.getElementById(id);
const value=id=>$(id).value.trim();
const esc=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));

function updateDashboard(){
    $("ambulanceCount").textContent=ambulances.length;
    $("patientCount").textContent=emergencyPatients.length;
    $("criticalCount").textContent=emergencyPatients.filter(p=>p.priority==="Critical").length;
    $("queueCount").textContent=emergencyPatients.length;
}

$("emergencyForm").addEventListener("submit",e=>{
    e.preventDefault();
    const patient={
        name:value("patientName"),
        id:value("patientId")||`ER-${Date.now()}`,
        age:value("patientAge"),
        gender:value("gender"),
        phone:value("phone"),
        arrival:value("arrivalMethod"),
        emergency:value("emergencyType"),
        priority:value("priority"),
        symptoms:value("symptoms"),
        status:"Waiting",
        arrivalTime:new Date().toLocaleTimeString()
    };
    emergencyPatients.push(patient);
    sortQueue(); updateDashboard();
    alert(`Emergency patient registered successfully!\n\nQueue ID: ${patient.id}`);
    e.target.reset();
});

function sortQueue(){
    const order={Critical:1,High:2,Medium:3,Low:4};
    emergencyPatients.sort((a,b)=>order[a.priority]-order[b.priority]);
    renderQueue();
}

function renderQueue(){
    $("queueTable").innerHTML=emergencyPatients.map((p,i)=>{
        const cls=`status-${p.priority.toLowerCase()}`;
        return `<tr>
            <td>${i+1}</td>
            <td><strong>${esc(p.name)}</strong><br><small>${esc(p.id)}</small></td>
            <td>${esc(p.emergency)}</td><td>${esc(p.arrivalTime)}</td>
            <td><span class="status ${cls}">${esc(p.priority)}</span></td>
            <td>${esc(p.status)}</td>
            <td><button class="action-btn" onclick="startTreatment('${esc(p.id)}')">Start Treatment</button></td>
        </tr>`;
    }).join("");
}

function startTreatment(id){
    const patient=emergencyPatients.find(p=>p.id===id);
    if(!patient)return;
    patient.status="Under Treatment";
    renderQueue();
    alert(`${patient.name} is now under treatment.`);
}

$("ambulanceForm").addEventListener("submit",e=>{
    e.preventDefault();
    ambulances.push({
        number:value("ambulanceNumber"),driver:value("driverName"),
        phone:value("driverPhone"),type:value("ambulanceType"),
        location:value("location"),status:value("ambulanceStatus")
    });
    renderAmbulances(); updateDashboard();
    alert("Ambulance information updated."); e.target.reset();
});

function renderAmbulances(){
    $("ambulanceTable").innerHTML=ambulances.map(a=>`<tr>
        <td><strong>${esc(a.number)}</strong></td><td>${esc(a.driver)}</td>
        <td>${esc(a.type)}</td><td>📍 ${esc(a.location)}</td>
        <td><span class="status">${esc(a.status)}</span></td>
    </tr>`).join("");
}

$("traumaForm").addEventListener("submit",e=>{
    e.preventDefault();
    if(!emergencyPatients.some(p=>p.id===value("traumaPatientId"))){
        alert("Patient ID not found in Emergency Queue."); return;
    }
    alert("Trauma care record saved successfully."); e.target.reset();
});

$("alertForm").addEventListener("submit",e=>{
    e.preventDefault();
    alerts.push({
        id:`AL-${Date.now()}`,patientId:value("alertPatientId"),
        type:value("alertType"),priority:value("alertPriority"),
        location:value("alertLocation"),message:value("alertMessage"),
        time:new Date().toLocaleTimeString()
    });
    renderAlerts(); e.target.reset(); alert("🚨 Critical alert created!");
});

function renderAlerts(){
    $("alertContainer").innerHTML=alerts.map(a=>`<div class="alert-box">
        <h3>🚨 ${esc(a.type)}</h3><p><strong>Patient:</strong> ${esc(a.patientId)}</p>
        <p><strong>Priority:</strong> ${esc(a.priority)}</p><p><strong>Location:</strong> ${esc(a.location)}</p>
        <p>${esc(a.message)}</p><p><small>${esc(a.time)}</small></p>
        <button class="dismiss-btn" onclick="dismissAlert('${esc(a.id)}')">Dismiss Alert</button>
    </div>`).join("");
}

function dismissAlert(id){
    alerts=alerts.filter(a=>a.id!==id);
    renderAlerts();
}

function logout(){
    if(confirm("Are you sure you want to logout?")){
        alert("Logged out successfully.");
        window.location.href="login.html";
    }
}

updateDashboard();
renderQueue();
renderAmbulances();
renderAlerts();