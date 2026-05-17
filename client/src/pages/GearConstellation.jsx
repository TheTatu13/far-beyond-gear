// GearConstellation.jsx — Fire & Metal Edition
import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { Link, useNavigate } from "react-router-dom";

const C = {
  bg:      "#0d0503",
  primary: "#ff6030",
  accent:  "#d03010",
  gold:    "#ff9900",
  ember:   "#ff4400",
};

// ─── Noduri ──────────────────────────────────────────────────────────────────
const NODES = [
  { id: 0, label: "Chitare",        emoji: "🎸", x: -3.0, y:  1.0, z:  0,   color: "#ff7040", size: 0.48, link: "/products?categories=24", desc: "Electrice, acustice, bass — arsenalul tău" },
  { id: 1, label: "Amplificatoare", emoji: "🔊", x:  2.8, y:  0.6, z: -0.5, color: "#ffaa00", size: 0.44, link: "/products?categories=23", desc: "Tube, solid-state, modelling — puterea sonoră" },
  { id: 2, label: "Pedale",         emoji: "🎛️", x: -1.0, y: -1.8, z:  0.2, color: "#ff5530", size: 0.38, link: "/products?categories=26", desc: "Overdrive, delay, reverb — tonul tău unic" },
  { id: 3, label: "Studio",         emoji: "🎚️", x:  2.5, y: -1.5, z: -1,   color: "#ff8020", size: 0.38, link: "/products?categories=32", desc: "Interfețe, monitoare, microfoane pro" },
  { id: 4, label: "Dimebag",        emoji: "⚡",  x: -2.5, y: -0.3, z: -0.8, color: "#ff2020", size: 0.42, link: "/artist/5",               desc: "Getcha Pull! — Legenda groove metal" },
  { id: 5, label: "Metallica",      emoji: "🤘", x:  0.8, y:  2.2, z: -0.3, color: "#c8c8c8", size: 0.36, link: "/artist/7",               desc: "Master of Puppets — icoana genului" },
  { id: 6, label: "Marshall",       emoji: "🔥", x:  0.0, y: -0.2, z:  0.5, color: "#ff9900", size: 0.50, link: "/brands/38",              desc: "Sunetul britanic definitoriu" },
  { id: 7, label: "Solar",          emoji: "🌙", x: -3.8, y:  2.2, z: -1.5, color: "#cc44ff", size: 0.34, link: "/brands/46",              desc: "Ola Englund — design modern, ton masiv" },
  { id: 8, label: "Deals",          emoji: "💎", x:  3.8, y:  1.8, z: -1,   color: "#ff4010", size: 0.36, link: "/products",               desc: "Cele mai bune oferte — acum live" },
];

const EDGES = [
  [0,4],[0,5],[0,7],
  [1,6],[1,8],[1,3],
  [2,4],[2,6],[2,3],
  [5,6],[5,1],
  [0,6],[4,7],[6,8],
];

// ─── Particule de fundal ──────────────────────────────────────────────────────
function ParticleField({ count = 350 }) {
  const mesh = useRef();
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i*3]   = (Math.random()-0.5)*22;
      pos[i*3+1] = (Math.random()-0.5)*14;
      pos[i*3+2] = (Math.random()-0.5)*10 - 2;
      vel[i*3]   = (Math.random()-0.5)*0.004;
      vel[i*3+1] = (Math.random()-0.5)*0.003 + 0.0005;
      vel[i*3+2] = (Math.random()-0.5)*0.001;
    }
    return [pos, vel];
  }, [count]);

  const posRef = useRef(new Float32Array(positions));

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    const p = posRef.current;
    for (let i = 0; i < count; i++) {
      p[i*3]   += velocities[i*3]   + Math.sin(t*0.2 + i*0.1)*0.0008;
      p[i*3+1] += velocities[i*3+1];
      p[i*3+2] += velocities[i*3+2];
      if (p[i*3+1] >  8) p[i*3+1] = -8;
      if (p[i*3]   > 13) p[i*3]   = -13;
      if (p[i*3]   <-13) p[i*3]   =  13;
    }
    mesh.current.geometry.attributes.position.array.set(p);
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.038} color="#ff5010" transparent opacity={0.38}
        sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

// ─── Jar de foc — particule care urcă ────────────────────────────────────────
function EmberParticles({ count = 220 }) {
  const mesh = useRef();
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i*3]   = (Math.random()-0.5)*20;
      pos[i*3+1] = Math.random()*14 - 8;
      pos[i*3+2] = (Math.random()-0.5)*10 - 4;
      vel[i*3]   = (Math.random()-0.5)*0.006;
      vel[i*3+1] = Math.random()*0.018 + 0.006;
      vel[i*3+2] = (Math.random()-0.5)*0.002;
    }
    return [pos, vel];
  }, [count]);

  const posRef = useRef(new Float32Array(positions));

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    const p = posRef.current;
    for (let i = 0; i < count; i++) {
      p[i*3]   += velocities[i*3] + Math.sin(t*0.8 + i*0.4)*0.0015;
      p[i*3+1] += velocities[i*3+1];
      p[i*3+2] += velocities[i*3+2];
      if (p[i*3+1] > 9) {
        p[i*3]   = (Math.random()-0.5)*20;
        p[i*3+1] = -8;
        p[i*3+2] = (Math.random()-0.5)*10 - 4;
      }
    }
    mesh.current.geometry.attributes.position.array.set(p);
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#ff9940" transparent opacity={0.28}
        sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

// ─── Conexiuni cu puls de energie ─────────────────────────────────────────────
function GlowEdge({ from, to, hoveredNode }) {
  const lineRef  = useRef();
  const lineRef2 = useRef();
  const dotRef   = useRef();
  const isActive = hoveredNode === from.id || hoveredNode === to.id;

  const [geom, curve] = useMemo(() => {
    const start = new THREE.Vector3(from.x, from.y, from.z);
    const end   = new THREE.Vector3(to.x,   to.y,   to.z);
    const mid   = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    mid.z -= 0.4;
    const c = new THREE.QuadraticBezierCurve3(start, mid, end);
    const g = new THREE.BufferGeometry().setFromPoints(c.getPoints(32));
    return [g, c];
  }, [from, to]);

  const dotPos = useRef(0);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = Math.sin(t*1.0 + from.id*0.7)*0.07;

    if (lineRef.current) {
      lineRef.current.material.opacity = isActive ? 0.7 + pulse : 0.18 + pulse;
      lineRef.current.material.color.set(isActive ? "#ff8040" : "#802010");
    }
    if (lineRef2.current) {
      lineRef2.current.material.opacity = isActive ? 0.25 + pulse*0.5 : 0.05;
    }

    // Dot traveling along the edge
    if (dotRef.current && isActive) {
      dotPos.current = (dotPos.current + 0.012) % 1;
      const pt = curve.getPoint(dotPos.current);
      dotRef.current.position.set(pt.x, pt.y, pt.z);
      dotRef.current.material.opacity = 0.9;
    } else if (dotRef.current) {
      dotRef.current.material.opacity = 0;
    }
  });

  return (
    <>
      <line ref={lineRef} geometry={geom}>
        <lineBasicMaterial color="#802010" transparent opacity={0.18}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </line>
      <line ref={lineRef2} geometry={geom}>
        <lineBasicMaterial color="#ff4000" transparent opacity={0.05}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </line>
      {/* Energy pulse dot */}
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshBasicMaterial color="#ffcc60" transparent opacity={0}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </>
  );
}

// ─── Nod cu inel de foc pe hover ─────────────────────────────────────────────
function GearNode({ node, onHover, hovered, onClick }) {
  const groupRef  = useRef();
  const orbRef    = useRef();
  const glowRef   = useRef();
  const ringRef   = useRef();
  const ring2Ref  = useRef();
  const coreRef   = useRef();
  const isHovered = hovered === node.id;
  const scaleVec  = useRef(new THREE.Vector3(1,1,1));

  const orbMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(node.color),
    emissive: new THREE.Color(node.color),
    emissiveIntensity: 1.0,
    metalness: 0.6,
    roughness: 0.12,
  }), [node.color]);

  const glowMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(node.color),
    transparent: true,
    opacity: 0.12,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), [node.color]);

  const ringMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(node.color),
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  }), [node.color]);

  const ring2Mat = useMemo(() => new THREE.MeshBasicMaterial({
    color: "#ffffff",
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  }), []);

  const coreMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: "#ffffff",
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), []);

  useFrame((state) => {
    if (!orbRef.current || !groupRef.current) return;
    const t = state.clock.elapsedTime;

    groupRef.current.position.set(
      node.x + Math.cos(t*0.28 + node.id*0.9)*0.10,
      node.y + Math.sin(t*0.45 + node.id*1.5)*0.20,
      node.z + Math.sin(t*0.35 + node.id*2.0)*0.07,
    );

    orbRef.current.rotation.y += 0.007;
    orbRef.current.rotation.x += 0.003;

    const s = isHovered ? 1.32 : 1;
    scaleVec.current.setScalar(s);
    orbRef.current.scale.lerp(scaleVec.current, 0.09);

    orbRef.current.material.emissiveIntensity = isHovered
      ? 2.8 + Math.sin(t*2.5)*0.5
      : 1.0 + Math.sin(t*1.2 + node.id*2)*0.18;

    if (glowRef.current) {
      const gp = Math.sin(t*1.1 + node.id*2.5)*0.05;
      glowRef.current.material.opacity = isHovered ? 0.38 + gp : 0.10 + gp;
      glowRef.current.scale.setScalar(isHovered ? 1.65 : 1 + gp);
    }

    // Outer ring — tilted, spinning
    if (ringRef.current) {
      ringRef.current.rotation.x += 0.025;
      ringRef.current.rotation.z += 0.012;
      const targetOp = isHovered ? 0.55 + Math.sin(t*3)*0.1 : 0;
      ringRef.current.material.opacity += (targetOp - ringRef.current.material.opacity) * 0.1;
    }

    // Inner ring — opposite spin
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y += 0.03;
      ring2Ref.current.rotation.x -= 0.015;
      const targetOp2 = isHovered ? 0.3 + Math.sin(t*4 + 1)*0.08 : 0;
      ring2Ref.current.material.opacity += (targetOp2 - ring2Ref.current.material.opacity) * 0.1;
    }

    // Core white glow
    if (coreRef.current) {
      coreRef.current.material.opacity = isHovered
        ? 0.7 + Math.sin(t*4)*0.2
        : 0.5 + Math.sin(t*1.5 + node.id)*0.12;
    }
  });

  return (
    <group ref={groupRef} position={[node.x, node.y, node.z]}>
      {/* Outer glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[node.size*2.8, 12, 12]} />
        <primitive object={glowMat} attach="material" />
      </mesh>

      {/* Outer spinning ring */}
      <mesh ref={ringRef} rotation={[Math.PI/3, 0, Math.PI/6]}>
        <torusGeometry args={[node.size*2.1, 0.025, 8, 48]} />
        <primitive object={ringMat} attach="material" />
      </mesh>

      {/* Inner spinning ring */}
      <mesh ref={ring2Ref} rotation={[Math.PI/5, Math.PI/4, 0]}>
        <torusGeometry args={[node.size*1.55, 0.018, 8, 40]} />
        <primitive object={ring2Mat} attach="material" />
      </mesh>

      {/* Main orb */}
      <mesh ref={orbRef} material={orbMat}
        onPointerOver={(e) => { e.stopPropagation(); onHover(node.id); document.body.style.cursor="pointer"; }}
        onPointerOut={() => { onHover(null); document.body.style.cursor="default"; }}
        onClick={(e) => { e.stopPropagation(); onClick(node.link); }}
      >
        <sphereGeometry args={[node.size, 28, 28]} />
      </mesh>

      {/* Inner hot core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[node.size*0.22, 8, 8]} />
        <primitive object={coreMat} attach="material" />
      </mesh>

      {/* Label */}
      <Text position={[0, -node.size-0.38, 0]} fontSize={0.155}
        color={isHovered ? "#ffffff" : "#c09070"}
        anchorX="center" anchorY="top" letterSpacing={0.09}
        outlineWidth={isHovered ? 0.008 : 0}
        outlineColor={node.color}>
        {node.label}
      </Text>

      {/* Emoji */}
      <Text position={[0, node.size+0.28, 0]} fontSize={0.28}
        anchorX="center" anchorY="bottom">
        {node.emoji}
      </Text>
    </group>
  );
}

// ─── Stea căzătoare în 3D ─────────────────────────────────────────────────────
function ShootingStars({ count = 5 }) {
  const refs = useRef(Array.from({ length: count }, () => React.createRef()));
  const data = useMemo(() => Array.from({ length: count }, (_, i) => ({
    speed: 0.07 + Math.random()*0.06,
    slope: -(0.3 + Math.random()*0.25),
    length: 1.0 + Math.random()*1.5,
    period: 14 + i * 6.5,
    phaseOffset: Math.random() * 30,
    color: ["#ffe8b0", "#fff0d0", "#ffcc88", "#ffddaa"][i % 4],
    startX: -12 + Math.random()*4,
    startY: 5 - Math.random()*4,
  })), [count]);

  const geometries = useMemo(() => data.map((s) => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array([0,0,-3, s.length,s.slope*s.length,-3]);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }), [data]);

  const materials = useMemo(() => data.map((s) => new THREE.LineBasicMaterial({
    color: s.color, transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false,
  })), [data]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    data.forEach((s, i) => {
      const phase = ((t + s.phaseOffset) % s.period) / s.period;
      const active = phase < 0.18;
      const progress = active ? phase / 0.18 : 0;
      const mat = materials[i];

      if (!refs.current[i]?.current) return;
      const mesh = refs.current[i].current;

      if (active) {
        const px = s.startX + progress * 20;
        const py = s.startY + progress * s.slope * 10;
        mesh.position.set(px, py, -3);
        mat.opacity = progress < 0.15 ? progress / 0.15 * 0.85
                    : progress > 0.8  ? (1 - (progress - 0.8)/0.2) * 0.85
                    : 0.85;
      } else {
        mat.opacity = 0;
      }
    });
  });

  return (
    <>
      {geometries.map((geo, i) => (
        <line key={i} ref={refs.current[i]} geometry={geo} material={materials[i]} />
      ))}
    </>
  );
}

// Workaround: need React imported for createRef
import React from "react";

// ─── Scenă ────────────────────────────────────────────────────────────────────
function Scene({ onNodeHover, hoveredNode, onNodeClick }) {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => { camera.position.set(0, 0, 7); }, [camera]);

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX/window.innerWidth  - 0.5)*2;
      mouse.current.y = -(e.clientY/window.innerHeight - 0.5)*2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    camera.position.x += (mouse.current.x*0.9 - camera.position.x)*0.028;
    camera.position.y += (mouse.current.y*0.6 - camera.position.y)*0.028;
    camera.lookAt(0, 0, -1);
  });

  return (
    <>
      <ambientLight intensity={0.12} color="#ff3300" />
      <pointLight position={[0,   5,  8]} color="#ff6020" intensity={3.0} distance={35} />
      <pointLight position={[-5, -3,  5]} color="#ff2200" intensity={1.5} distance={25} />
      <pointLight position={[5,   3,  5]} color="#ff9900" intensity={1.0} distance={22} />
      <pointLight position={[0,   0,  3]} color="#ff5500" intensity={0.6} distance={15} />

      <ParticleField />
      <EmberParticles />
      <ShootingStars count={5} />

      {EDGES.map(([a,b], i) => (
        <GlowEdge key={i} from={NODES[a]} to={NODES[b]} hoveredNode={hoveredNode} />
      ))}

      {NODES.map(node => (
        <GearNode key={node.id} node={node}
          onHover={onNodeHover} hovered={hoveredNode} onClick={onNodeClick} />
      ))}
    </>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function GearConstellation() {
  const navigate    = useNavigate();
  const [hoveredNode, setHoveredNode] = useState(null);
  const [mounted,     setMounted]     = useState(false);
  const [tooltipVis,  setTooltipVis]  = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (hoveredNode !== null) {
      const t = setTimeout(() => setTooltipVis(true), 60);
      return () => clearTimeout(t);
    } else {
      setTooltipVis(false);
    }
  }, [hoveredNode]);

  const activeNode = hoveredNode !== null ? NODES[hoveredNode] : null;

  return (
    <section style={{
      position: "relative", width: "100%", height: "100vh", minHeight: "650px",
      background: `radial-gradient(ellipse at 50% 35%, #2d0a00 0%, #1c0500 40%, ${C.bg} 100%)`,
      overflow: "hidden",
    }}>
      {/* Hex grid overlay */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none", zIndex:0,
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='104'%3E%3Cpolygon points='30,2 58,17 58,47 30,62 2,47 2,17' fill='none' stroke='rgba(255,60,10,0.04)' stroke-width='1'/%3E%3Cpolygon points='30,62 58,77 58,107 30,122 2,107 2,77' fill='none' stroke='rgba(255,60,10,0.04)' stroke-width='1'/%3E%3C/svg%3E")`,
        backgroundSize: "60px 104px",
      }} />

      {/* Canvas */}
      <Canvas
        style={{ position: "absolute", inset: 0, zIndex: 1 }}
        camera={{ fov: 50, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <Scene onNodeHover={setHoveredNode} hoveredNode={hoveredNode} onNodeClick={navigate} />
        </Suspense>
      </Canvas>

      {/* Vignette */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:2,
        background:"radial-gradient(ellipse at center, transparent 22%, rgba(5,2,0,0.75) 100%)" }} />
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:2,
        background:"linear-gradient(180deg, rgba(12,4,2,0.55) 0%, transparent 14%, transparent 78%, rgba(12,4,2,0.92) 100%)" }} />

      {/* Scanlines */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:2,
        backgroundImage:"repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 3px)",
        opacity:0.4 }} />

      {/* Center UI */}
      <div style={{
        position:"absolute", inset:0, display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center", pointerEvents:"none",
        zIndex:3,
        transition:"all 1.5s cubic-bezier(0.22,1,0.36,1)",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(30px)",
      }}>
        {/* Flame icon above title */}
        <div style={{ marginBottom:"0.5rem", fontSize:"2.8rem", lineHeight:1,
          filter:"drop-shadow(0 0 30px rgba(255,80,10,0.9))",
          animation:"emberFloat 3s ease-in-out infinite",
        }}>🔥</div>

        <div style={{ textAlign:"center", marginBottom:"2.2rem" }}>
          <div style={{
            fontFamily:"'Cinzel','Georgia',serif", fontSize:"clamp(2.4rem,6vw,4.5rem)",
            fontWeight:900, color:"#fff", letterSpacing:"0.12em", lineHeight:1.0,
            textShadow:`0 0 80px ${C.primary}44, 0 4px 8px rgba(0,0,0,0.95)`,
          }}>FAR BEYOND</div>
          <div className="hero-title-gear" style={{
            fontFamily:"'Cinzel','Georgia',serif", fontSize:"clamp(2.4rem,6vw,4.5rem)",
            fontWeight:900, color:C.primary, letterSpacing:"0.12em", lineHeight:1.0,
          }}>GEAR</div>

          <div style={{
            margin:"1.2rem auto 0", width:"120px", height:"2px",
            background:`linear-gradient(90deg, transparent, ${C.primary}dd, ${C.gold}dd, ${C.primary}dd, transparent)`,
            borderRadius:"1px", boxShadow:`0 0 24px ${C.primary}88`,
          }} />

          <div style={{
            marginTop:"1rem", fontFamily:"'DM Sans','Inter',sans-serif",
            fontSize:"clamp(0.78rem,1.3vw,0.95rem)", color:"rgba(255,255,255,0.85)",
            letterSpacing:"0.4em", textTransform:"uppercase",
            textShadow:"0 0 20px rgba(255,100,30,0.5)",
          }}>Foc · Metal · Sunet</div>
        </div>

        {/* CTAs */}
        <div style={{ display:"flex", gap:"1.2rem", flexWrap:"wrap", justifyContent:"center", pointerEvents:"auto" }}>
          <Link to="/products" className="hero-cta-primary" style={{
            display:"inline-flex", alignItems:"center", gap:"10px",
            padding:"15px 38px",
            background:`linear-gradient(135deg, ${C.primary}, ${C.accent})`,
            color:"#fff", fontWeight:700, fontSize:"0.95rem",
            textDecoration:"none", borderRadius:"6px",
            boxShadow:`0 0 50px ${C.primary}66, 0 6px 20px rgba(0,0,0,0.5)`,
            transition:"all 0.3s cubic-bezier(0.22,1,0.36,1)",
            letterSpacing:"0.06em", fontFamily:"'DM Sans','Inter',sans-serif",
            border:`1px solid ${C.primary}88`,
          }}>🔥 Explorează Catalogul →</Link>

          <Link to="/brands" className="hero-cta-secondary" style={{
            display:"inline-flex", alignItems:"center", gap:"10px",
            padding:"15px 36px", background:"rgba(255,60,10,0.06)",
            color:"#ffb080", fontWeight:600, fontSize:"0.95rem",
            textDecoration:"none", borderRadius:"6px",
            border:"1px solid rgba(255,80,20,0.22)",
            transition:"all 0.3s cubic-bezier(0.22,1,0.36,1)",
            letterSpacing:"0.06em", fontFamily:"'DM Sans','Inter',sans-serif",
            backdropFilter:"blur(8px)",
          }}>Branduri Premium</Link>
        </div>

        <div className="hero-hint" style={{
          marginTop:"3.5rem", fontSize:"0.7rem",
          color:"rgba(255,150,80,0.35)", letterSpacing:"0.3em",
          textTransform:"uppercase", fontFamily:"'DM Sans','Inter',sans-serif",
        }}>↑ Hover pe noduri pentru a explora</div>
      </div>

      {/* Tooltip */}
      {activeNode && tooltipVis && (
        <div style={{
          position:"absolute", bottom:"3rem", left:"50%",
          transform:"translateX(-50%)",
          background:"rgba(10,4,1,0.95)",
          border:`1px solid ${activeNode.color}44`,
          borderTop:`3px solid ${activeNode.color}`,
          padding:"18px 32px", borderRadius:"12px",
          backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)",
          pointerEvents:"all", zIndex:10,
          boxShadow:`0 0 60px ${activeNode.color}20, 0 25px 50px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)`,
          maxWidth:"380px", textAlign:"center",
          animation:"heroTooltipUp 0.25s cubic-bezier(0.22,1,0.36,1)",
        }}>
          {/* Glow accent line */}
          <div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:"1px",
            background:`linear-gradient(90deg, transparent, ${activeNode.color}cc, transparent)`,
            boxShadow:`0 0 15px ${activeNode.color}88`, borderRadius:"1px" }} />

          <Link to={activeNode.link} style={{ textDecoration:"none" }}>
            <div style={{
              fontFamily:"'Cinzel',serif", fontSize:"1.1rem",
              color:activeNode.color, fontWeight:700,
              letterSpacing:"0.1em", marginBottom:"7px",
              textShadow:`0 0 20px ${activeNode.color}88`,
            }}>{activeNode.emoji} {activeNode.label}</div>
            <div style={{
              fontFamily:"'DM Sans',sans-serif", fontSize:"0.82rem",
              color:"rgba(255,200,170,0.7)", lineHeight:1.5, marginBottom:"10px",
            }}>{activeNode.desc}</div>
            <div style={{
              fontSize:"0.68rem", color:activeNode.color,
              letterSpacing:"0.2em", textTransform:"uppercase",
              fontWeight:700, opacity:0.9,
              textShadow:`0 0 10px ${activeNode.color}66`,
            }}>Explorează →</div>
          </Link>
        </div>
      )}

      {/* Scroll indicator */}
      <div style={{
        position:"absolute", bottom:"1.5rem", right:"2rem", zIndex:4,
        display:"flex", flexDirection:"column", alignItems:"center", gap:"6px",
        opacity:0.3, pointerEvents:"none",
        animation:"heroScrollBounce 2.5s ease-in-out infinite",
      }}>
        <div style={{ width:"1px", height:"50px", background:"linear-gradient(to bottom, transparent, #ff6030)" }} />
        <div style={{ fontSize:"8px", letterSpacing:"0.3em", color:"#ff6030", textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif" }}>Scroll</div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');

        @keyframes heroTooltipUp {
          from { opacity:0; transform:translateX(-50%) translateY(16px); }
          to   { opacity:1; transform:translateX(-50%) translateY(0); }
        }
        @keyframes emberFloat {
          0%,100% { transform:translateY(0) scale(1); filter:drop-shadow(0 0 30px rgba(255,80,10,0.9)); }
          50%     { transform:translateY(-8px) scale(1.05); filter:drop-shadow(0 0 50px rgba(255,120,10,1.0)); }
        }
        .hero-title-gear {
          text-shadow: 0 0 100px #ff6030, 0 0 50px #ff6030bb, 0 0 200px #ff603088;
          animation: heroGlowPulse 3.5s ease-in-out infinite;
        }
        @keyframes heroGlowPulse {
          0%,100% { text-shadow: 0 0 80px #ff6030, 0 0 40px #ff9900bb, 0 0 160px #ff603066; }
          50%     { text-shadow: 0 0 160px #ff6030, 0 0 90px #ff9900ff, 0 0 320px #ff4400aa; }
        }
        .hero-hint { animation: heroPulse 4s ease-in-out infinite; }
        @keyframes heroPulse {
          0%,100% { opacity:0.25; } 50% { opacity:0.55; }
        }
        @keyframes heroScrollBounce {
          0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); }
        }
        .hero-cta-primary:hover {
          box-shadow: 0 0 80px rgba(255,80,20,0.7), 0 10px 30px rgba(0,0,0,0.5) !important;
          transform: translateY(-3px) scale(1.02) !important;
        }
        .hero-cta-secondary:hover {
          background: rgba(255,80,20,0.12) !important;
          border-color: rgba(255,100,40,0.55) !important;
          transform: translateY(-3px) !important;
          color: #ffcc99 !important;
        }
      `}</style>
    </section>
  );
}
