import React from "react";
import ReactDOM from "react-dom/client";
import CareFlow from "./CareFlow.jsx";

function App() {
  return <CareFlow />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);