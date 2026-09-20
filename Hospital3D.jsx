import React, { useMemo, useState } from "react";
import "./hospital3d.css";

const floors = [0, 1, 2];
const wingWindows = [0, 1, 2, 3, 4, 5];

export default function Hospital3D() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [zoomed, setZoomed] = useState(false);
  const particles = useMemo(() => Array.from({ length: 35 }, (_, index) => ({
    id: index,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    opacity: Math.random(),
    duration: `${3 + Math.random() * 5}s`,
  })), []);

  const moveScene = (event) => {
    setPointer({
      x: (event.clientX / window.innerWidth - 0.5) * 10,
      y: (event.clientY / window.innerHeight - 0.5) * -8,
    });
  };

  const moveTouch = (event) => {
    const touch = event.touches[0];
    setPointer({
      x: (touch.clientX / window.innerWidth - 0.5) * 10,
      y: (touch.clientY / window.innerHeight - 0.5) * -8,
    });
  };

  return (
    <main className="hospital-scene-page" onMouseMove={moveScene} onTouchMove={moveTouch}>
      <div className="hospital-stars" />
      {particles.map((particle) => (
        <i className="scene-particle" key={particle.id} style={{ left: particle.left, top: particle.top, opacity: particle.opacity, animationDuration: particle.duration }} />
      ))}
      <div
        className={`hospital-world ${zoomed ? "is-zoomed" : ""}`}
        style={{ transform: `translate(-50%, -42%) rotateX(${58 + pointer.y}deg) rotateY(${pointer.x}deg)` }}
        onClick={() => setZoomed((value) => !value)}
        role="button"
        tabIndex={0}
        aria-label="3D hospital model"
        onKeyDown={(event) => event.key === "Enter" && setZoomed((value) => !value)}
      >
        <div className="hospital-building main-building">
          <div className="hospital-roof" />
          <div className="hospital-sign"><span>+</span> CARE</div>
          {floors.map((floor) => <div className={`hospital-floor floor-${floor}`} key={floor}>{wingWindows.slice(0, 5).map((window) => <i className="hospital-window" key={window} />)}</div>)}
          <div className="hospital-entrance"><div className="entrance-light" /><div className="entrance-door left-door" /><div className="entrance-door right-door" /><b>EMERGENCY</b></div>
        </div>
        <div className="hospital-building side-wing left-wing">{wingWindows.map((item) => <i className="wing-window" key={item} />)}</div>
        <div className="hospital-building side-wing right-wing">{wingWindows.map((item) => <i className="wing-window" key={item} />)}</div>
        <div className="helipad"><span>H</span></div>
        <div className="hospital-road" />
        <div className="hospital-ambulance"><div className="ambulance-body"><i className="ambulance-window" /><b>+</b><em /></div><i className="wheel wheel-one" /><i className="wheel wheel-two" /></div>
        {["tree-one", "tree-two", "tree-three"].map((tree) => <div className={`hospital-tree ${tree}`} key={tree}><i /><b /></div>)}
      </div>
      <div className="scene-card scene-card-one" style={{ transform: `translate(${pointer.x}px, ${-pointer.y}px)` }}><span>+</span><div><small>HEALTHCARE</small><b>24/7 SERVICE</b></div></div>
      <div className="scene-card scene-card-two" style={{ transform: `translate(${pointer.x * 2}px, ${-pointer.y * 2}px)` }}><span>♥</span><div><small>PATIENT CARE</small><b>SMART HEALTH</b></div></div>
      <div className="scene-card scene-card-three" style={{ transform: `translate(${pointer.x * 3}px, ${-pointer.y * 3}px)` }}><span>✚</span><div><small>EMERGENCY</small><b>FAST RESPONSE</b></div></div>
      <section className="hospital-hero-copy"><small>SMART HEALTHCARE</small><h1>HOSPITAL <span>3D</span></h1><p>Advanced Healthcare Infrastructure</p></section>
      <div className="hospital-footer"><span>MEDICAL</span><span>CARE</span><span>TECHNOLOGY</span></div>
    </main>
  );
}
