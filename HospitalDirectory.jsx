import { useMemo, useState } from "react";

const districtHospitals = {
  Tiruvarur: [
    ["ARUN MEDICAL CENTRE", "அருண் மருத்துவ மையம்", "No. 84, North Main Street, Thiruvarur, Tamil Nadu - 610001", "04366-240579 / 96269 10700", "General Gynaecology, Surgery"],
    ["HANIFA NURSING HOME", "ஹனிஃபா நர்சிங் ஹோம்", "51-C, Hospital Street, Thiruthuraipoondi, Thiruvarur, Tamil Nadu - 614713", "04369-222312", "General Medicine, General Surgery, Gynaecology, Surgical Gastroenterology"],
    ["LAKSHANA HOSPITAL", "லக்ஷனா மருத்துவமனை", "19, Kamalayalayam West Bank, Thiruvarur, Tamil Nadu - 614712", "04366-240210 / 241583", "General Medicine, Gynaecology, Orthopaedic Surgery, General Surgery"],
    ["LIONS EYE HOSPITAL", "லயன்ஸ் கண் மருத்துவமனை", "Vandampalai, Kanglancheri PO, Tiruvarur, Tamil Nadu - 610101", "04366-240099", "General Medicine, General Surgery, Gynaecology, Surgical Gastroenterology"],
    ["N.V.K. HOSPITAL", "என்.வி.கே. மருத்துவமனை", "32-A, Railway Station Road, Thiruthuraipundi, Thiruvarur, Tamil Nadu - 614713", "04369-222353", "General Medicine, Orthopaedics, General Surgery, Gynaecology, Urology, ENT"],
    ["NAVA JEEVAN MEDICAL FOUNDATION", "நவா ஜீவன் மெடிக்கல் பவுண்டேஷன்", "No.3/4B, Thanjai Salai, Vilamal, Tiruvarur, Tamil Nadu - 610004", "9597035108 / 9894906108", "General Surgery, Gynaecology"],
    ["P.K.T. NURSING HOME", "பி.கே.டி. நர்சிங் ஹோம்", "30 A&B, Tiruvarur Road, Thiruthuraipoondi, Tamil Nadu - 614713", "04369-220502", "General Medicine, Cardiology, Pediatrics, Gastroenterology, General Surgery, Gynaecology, Urology, Neurology"],
    ["RAJ HOSPITAL", "ராஜ் மருத்துவமனை", "No.10, Balakrishna Nagar, Mannargudi, Thiruvarur, Tamil Nadu - 614001", "04175-222555 / 04175-222666", "General Medicine, General Surgery, Gynaecology, Cardiology, ENT, Gastroenterology, Neurology"],
    ["SRI VENKATESWARA NURSING HOME", "ஸ்ரீ வெங்கடேஸ்வரா நர்சிங் ஹோம்", "87, Hospital Street, Thiruthuraipoondi, Tamil Nadu - 614712", "04369-222991", "General Medicine, General Surgery, Gynaecology"],
    ["TIRUVARUR MEDICAL CENTRE (P) LTD", "திருவாரூர் மருத்துவ மையம்", "27, Javulikara Street, Tiruvarur, Tamil Nadu - 610101", "04366-242292 / 240292 / 241665", "General Medicine, General Surgery, Gynaecology, Nephrology, Urology, Orthopaedic Surgery"],
    ["V.S. HOSPITAL", "வி.எஸ். மருத்துவமனை", "47, Pidari Koil Street, Tiruvarur, Tamil Nadu - 610101", "04366-243320", "General Medicine, General Surgery, Gynaecology, Nephrology, Urology, Orthopaedic Surgery"],
  ],
  Ariyalur: [
    ["A.S. NURSING HOME", "ஏ.எஸ். மருத்துவமனை", "Pattunoolkara Street, Ariyalur, Tamil Nadu - 621704", "04329-222425", "Ophthalmology"],
    ["ARIYALUR GOLDEN HOSPITAL (P) LTD", "அரியலூர் கோல்டன் மருத்துவமனை", "81 A, Sendurai Road, Ariyalur, Tamil Nadu - 621704", "04329-222530", "General Gynaecology, Surgery"],
    ["EZHIL SURGICAL AND MATERNITY HOSPITAL", "எழில் அறுவை சிகிச்சை மற்றும் மகப்பேறு மருத்துவமனை", "44 A1/A2, Jayankondam, South Vellala Street, Ariyalur, Tamil Nadu - 621802", "04331-321818 / 290650", "General Medicine, General Surgery, Gynaecology, Nephrology, Urology, Orthopaedics"],
  ],
  Chengalpattu: [
    ["BALAJI HOSPITAL", "பாலாஜி மருத்துவமனை", "14, Varadhanar Street, Vedachalam Nagar, Chengalpattu, Tamil Nadu - 603001", "044-27428304", "General Medicine, General Surgery, Gynaecology"],
    ["J.S.P. HOSPITALS (P) LTD", "ஜே.எஸ்.பி. மருத்துவமனை", "Kancheepuram High Road, Chengalpattu, Tamil Nadu - 603002", "044-27426829 / 27428851", "General Medicine, Gynaecology, Orthopaedic Surgery, General Surgery"],
    ["SRI VENKATESWARA HOSPITAL", "ஸ்ரீ வெங்கடேஸ்வரா மருத்துவமனை", "No.2/27, Gandhi Street, Singaperumal Koil, Chengalpattu, Tamil Nadu - 603204", "044-27464555", "General Medicine, General Surgery, Gynaecology"],
  ],
  Coimbatore: [
    ["GANGA MEDICAL CENTER & HOSPITALS LTD", "கங்கா மருத்துவ மையம் & மருத்துவமனை", "313, Mettupalayam Road, Coimbatore, Tamil Nadu - 641043", "0422-2485000", "General Medicine, General Surgery, Gynaecology"],
    ["KOVAI MEDICAL CENTER & HOSPITAL LTD", "கோவை மெடிக்கல் சென்டர் & ஹாஸ்பிடல்", "Post Box No.3209, Avinashi Road, Coimbatore, Tamil Nadu - 641014", "0422-4323602 / 702", "General Medicine, General Surgery, Gynaecology, Cardiology, Neurology"],
    ["ROYAL CARE SUPER SPECIALITY HOSPITAL", "ராயல் கேர் சூப்பர் ஸ்பெஷாலிட்டி மருத்துவமனை", "No.372F, Dr. Nanjappa Road, Coimbatore, Tamil Nadu - 641018", "0422-4001000 / 2233000", "General Medicine, General Surgery, Gynaecology, Orthopaedics, Neurology"],
  ],
  Salem: [
    ["SALEM MEDICAL CENTRE", "சேலம் மருத்துவ மையம்", "No.50, Kannankurchi Road, Hasthampatty, Salem, Tamil Nadu - 636007", "0427-2418213", "General Medicine, General Surgery, Gynaecology, Nephrology, Urology"],
    ["SRI GOKULAM HOSPITAL", "ஸ்ரீ கோகுளம் மருத்துவமனை", "3/60, Meyyanur Road, Salem, Tamil Nadu - 636004", "0427-2448171 / 76", "Cardiology, General Medicine, General Surgery, Gynaecology, Orthopaedics"],
  ],
  Madurai: [
    ["APOLLO HOSPITALS", "அப்பல்லோ மருத்துவமனை", "K.K. Nagar, Madurai, Tamil Nadu - 625020", "0452-6461066", "Multi Speciality"],
    ["MEENAKSHI MISSION HOSPITAL & RESEARCH CENTER", "மீனாட்சி மிஷன் மருத்துவமனை", "Lake Area, Melur Road, Madurai, Tamil Nadu - 625107", "0452-4263034 / 2543000", "General Medicine, General Surgery, Gynaecology, Nephrology, Urology, Orthopaedics"],
  ],
  Tiruchirapalli: [
    ["APOLLO SPECIALITY HOSPITALS", "அப்பல்லோ சிறப்பு மருத்துவமனை", "Chennai Highway, Ariyamangalam Area, Tiruchirapalli, Tamil Nadu - 620010", "0431-3307777", "Oncology, General Medicine, General Surgery"],
    ["TIRUCHY MEDICAL CENTRE & HOSPITAL LTD", "திருச்சி மருத்துவ மையம் & மருத்துவமனை", "No.B-17, 11-B Cross, Thillainagar West, Tiruchirapalli, Tamil Nadu - 620018", "0431-2741919", "General Medicine, General Surgery, Gynaecology, Nephrology, Urology"],
  ],
};

const toHospital = item => ({
  name: item[0],
  tamilName: item[1],
  address: item[2],
  phone: item[3],
  specialties: item[4],
});

export default function HospitalDirectory() {
  const [district, setDistrict] = useState("");
  const [selectedIndex, setSelectedIndex] = useState("");

  const hospitals = useMemo(
    () => (districtHospitals[district] || []).map(toHospital),
    [district]
  );

  const hospital = selectedIndex === ""
    ? null
    : hospitals[Number(selectedIndex)];

  const mapUrl = hospital
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${hospital.name}, ${hospital.address}`
      )}`
    : "";

  const changeDistrict = event => {
    setDistrict(event.target.value);
    setSelectedIndex("");
  };

  return (
    <section style={styles.wrapper}>
      <h2>Hospital Directory</h2>

      <select value={district} onChange={changeDistrict} style={styles.input}>
        <option value="">Select district</option>
        {Object.keys(districtHospitals).map(item => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>

      <select
        value={selectedIndex}
        onChange={event => setSelectedIndex(event.target.value)}
        style={styles.input}
        disabled={!hospitals.length}
      >
        <option value="">
          {hospitals.length ? "Select hospital" : "Select a district first"}
        </option>
        {hospitals.map((item, index) => (
          <option key={item.name} value={index}>{item.name}</option>
        ))}
      </select>

      {hospital && (
        <div style={styles.card}>
          <strong>{hospital.name}</strong>
          <span>{hospital.tamilName}</span>
          <small>📍 {hospital.address}</small>
          <small>☎ {hospital.phone}</small>
          <small>⚕ {hospital.specialties}</small>
          <a href={mapUrl} target="_blank" rel="noreferrer">
            View map →
          </a>
        </div>
      )}
    </section>
  );
}

const styles = {
  wrapper: {
    maxWidth: 650,
    padding: 24,
    border: "1px solid rgba(255,255,255,.12)",
    borderRadius: 20,
    background: "rgba(16,31,53,.72)",
  },
  input: {
    width: "100%",
    minHeight: 43,
    margin: "6px 0",
    padding: "11px 13px",
    color: "#f4f8ff",
    border: "1px solid rgba(255,255,255,.12)",
    borderRadius: 10,
    background: "rgba(255,255,255,.07)",
  },
  card: {
    display: "grid",
    gap: 8,
    marginTop: 16,
    padding: 18,
    border: "1px solid rgba(54,241,208,.35)",
    borderRadius: 15,
    background: "linear-gradient(135deg, rgba(80,185,255,.14), rgba(159,124,255,.12))",
  },
};