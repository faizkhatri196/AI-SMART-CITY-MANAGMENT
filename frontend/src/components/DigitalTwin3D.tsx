"use client";

import React, { useRef, useState, useMemo, Component, ErrorInfo, ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { Activity, ShieldAlert, Zap, Hospital, Car, Sun, Moon, Box, Building2, AlertCircle } from "lucide-react";

interface BuildingData {
  id: string;
  name: string;
  category: "Government" | "Hospital" | "Power" | "Police" | "Fire" | "Commercial" | "Park";
  pos: [number, number, number];
  size: [number, number, number];
  color: string;
  temperature_c: number;
  occupancy_pct: number;
  structural_integrity: number;
}

const CITY_BUILDINGS: BuildingData[] = [
  { id: "b1", name: "One World Trade AI Center", category: "Government", pos: [0, 8, 0], size: [3, 16, 3], color: "#00f2fe", temperature_c: 21.4, occupancy_pct: 88, structural_integrity: 100 },
  { id: "b2", name: "Metro General Hospital", category: "Hospital", pos: [-6, 5, -5], size: [4, 10, 4], color: "#06d6a0", temperature_c: 22.1, occupancy_pct: 92, structural_integrity: 98 },
  { id: "b3", name: "Empire Power Substation #4", category: "Power", pos: [6, 6, -4], size: [3.5, 12, 3.5], color: "#ffb703", temperature_c: 38.5, occupancy_pct: 45, structural_integrity: 95 },
  { id: "b4", name: "Police & SWAT Central HQ", category: "Police", pos: [-7, 4, 5], size: [4, 8, 4], color: "#3b82f6", temperature_c: 20.8, occupancy_pct: 76, structural_integrity: 99 },
  { id: "b5", name: "Central Fire Dispatch Tower", category: "Fire", pos: [7, 4.5, 6], size: [3.5, 9, 3.5], color: "#ef4444", temperature_c: 24.2, occupancy_pct: 60, structural_integrity: 97 },
  { id: "b6", name: "Central Park Green Sector", category: "Park", pos: [0, 0.2, -8], size: [10, 0.4, 6], color: "#10b981", temperature_c: 19.5, occupancy_pct: 30, structural_integrity: 100 },
  { id: "b7", name: "Financial District Tower A", category: "Commercial", pos: [-3, 7, 3], size: [2.5, 14, 2.5], color: "#6366f1", temperature_c: 23.0, occupancy_pct: 82, structural_integrity: 96 },
  { id: "b8", name: "Tech Innovation Hub B", category: "Commercial", pos: [4, 6.5, 2], size: [2.5, 13, 2.5], color: "#8b5cf6", temperature_c: 22.8, occupancy_pct: 85, structural_integrity: 99 },
];

// Error Boundary for WebGL Unsupported or Canvas Failure
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("WebGL 3D Canvas Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Animated 3D Traffic Particle Stream
const TrafficParticles: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 60;

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const axis = Math.random() > 0.5 ? "x" : "z";
      const speed = 0.05 + Math.random() * 0.08;
      const roadOffset = (Math.floor(Math.random() * 5) - 2) * 4;
      temp.push({ axis, speed, roadOffset, pos: (Math.random() - 0.5) * 30 });
    }
    return temp;
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    particles.forEach((p, i) => {
      p.pos += p.speed;
      if (p.pos > 15) p.pos = -15;
      
      if (p.axis === "x") {
        dummy.position.set(p.pos, 0.3, p.roadOffset);
      } else {
        dummy.position.set(p.roadOffset, 0.3, p.pos);
      }
      dummy.scale.set(0.2, 0.2, 0.2);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.3, 8, 8]} />
      <meshBasicMaterial color="#00f2fe" />
    </instancedMesh>
  );
};

// 3D Building Mesh Component
const BuildingMesh: React.FC<{
  data: BuildingData;
  isSelected: boolean;
  onSelect: (b: BuildingData) => void;
}> = ({ data, isSelected, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (meshRef.current && isSelected) {
      const t = clock.getElapsedTime();
      meshRef.current.position.y = data.pos[1] + Math.sin(t * 3) * 0.15;
    }
  });

  return (
    <group position={data.pos as [number, number, number]}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(data);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={data.size} />
        <meshStandardMaterial
          color={isSelected ? "#ff4b4b" : (hovered ? "#00f2fe" : data.color)}
          roughness={0.15}
          metalness={0.85}
          emissive={isSelected ? "#ff0000" : (hovered ? "#00f2fe" : "#0f172a")}
          emissiveIntensity={isSelected ? 0.9 : (hovered ? 0.5 : 0.1)}
        />
      </mesh>

      {/* Building Label Header */}
      {(hovered || isSelected) && (
        <Html position={[0, data.size[1] / 2 + 1.2, 0]} center>
          <div className="bg-darkBg/90 backdrop-blur-md px-3 py-1 rounded-lg border border-cyanGlow/40 text-[10px] font-mono text-cyanGlow whitespace-nowrap shadow-xl">
            {data.name} ({data.temperature_c}°C)
          </div>
        </Html>
      )}
    </group>
  );
};

// 2D High-Tech Fallback View when WebGL is unavailable
const Fallback2DView: React.FC<{ buildings: BuildingData[]; onSelect: (b: BuildingData) => void }> = ({ buildings, onSelect }) => {
  return (
    <div className="w-full h-full p-6 flex flex-col justify-between bg-darkBg/95 font-mono text-xs space-y-4 overflow-y-auto">
      <div className="flex items-center space-x-2 text-cyanGlow">
        <Building2 className="w-5 h-5 text-cyanGlow" />
        <span className="font-bold">2D/3D HYBRID DIGITAL TWIN INFRASTRUCTURE MATRIX</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {buildings.map((b) => (
          <div
            key={b.id}
            onClick={() => onSelect(b)}
            className="p-4 rounded-xl glass-panel border border-white/10 hover:border-cyanGlow/50 cursor-pointer space-y-2 transition-all group"
          >
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-white group-hover:text-cyanGlow transition">{b.name}</h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyanGlow/20 text-cyanGlow border border-cyanGlow/30">
                {b.category}
              </span>
            </div>
            <div className="text-[11px] text-gray-300 space-y-1">
              <div className="flex justify-between">
                <span>Thermal:</span>
                <span className="text-amber-300 font-bold">{b.temperature_c}°C</span>
              </div>
              <div className="flex justify-between">
                <span>Occupancy:</span>
                <span className="text-cyanGlow font-bold">{b.occupancy_pct}%</span>
              </div>
              <div className="flex justify-between">
                <span>Integrity:</span>
                <span className="text-emerald-400 font-bold">{b.structural_integrity}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DigitalTwin3D: React.FC = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingData | null>(null);
  const [dayNight, setDayNight] = useState<"day" | "night">("night");

  return (
    <div className="w-full h-full min-h-[520px] rounded-2xl overflow-hidden glass-panel relative flex flex-col">
      {/* 3D Toolbar Header */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-3">
        <div className="bg-darkBg/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-xs font-mono">
          <span className="text-cyanGlow font-bold block">ULTRA 3D DIGITAL TWIN SPATIAL MESH</span>
          <span className="text-gray-400 text-[10px]">Real-World Building Extrusions & Live Traffic Streams</span>
        </div>

        <button
          onClick={() => setDayNight(dayNight === "night" ? "day" : "night")}
          className="bg-darkBg/90 backdrop-blur-md p-2 rounded-xl border border-white/10 text-gray-300 hover:text-cyanGlow transition"
          title="Toggle Day/Night Lighting"
        >
          {dayNight === "night" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyanGlow" />}
        </button>
      </div>

      {/* Selected Building Telemetry Drawer */}
      {selectedBuilding && (
        <div className="absolute top-4 right-4 z-20 bg-darkBg/95 backdrop-blur-md p-4 rounded-xl border border-cyanGlow/40 w-72 space-y-3 font-mono text-xs shadow-2xl animate-in slide-in-from-right duration-200">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <h4 className="font-bold text-cyanGlow truncate">{selectedBuilding.name}</h4>
            <button
              onClick={() => setSelectedBuilding(null)}
              className="text-gray-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>
          <div className="space-y-1.5 text-gray-300">
            <div className="flex justify-between">
              <span>CATEGORY:</span>
              <span className="text-white font-bold">{selectedBuilding.category}</span>
            </div>
            <div className="flex justify-between">
              <span>THERMAL TEMP:</span>
              <span className="text-amber-300 font-bold">{selectedBuilding.temperature_c}°C</span>
            </div>
            <div className="flex justify-between">
              <span>OCCUPANCY:</span>
              <span className="text-cyanGlow font-bold">{selectedBuilding.occupancy_pct}%</span>
            </div>
            <div className="flex justify-between">
              <span>STRUCTURAL:</span>
              <span className="text-emerald-400 font-bold">{selectedBuilding.structural_integrity}% OPTIMAL</span>
            </div>
          </div>
        </div>
      )}

      {/* Three.js Canvas wrapped in ErrorBoundary */}
      <WebGLErrorBoundary fallback={<Fallback2DView buildings={CITY_BUILDINGS} onSelect={setSelectedBuilding} />}>
        <Canvas camera={{ position: [20, 20, 20], fov: 45 }}>
          <color attach="background" args={[dayNight === "night" ? "#090d16" : "#1e293b"]} />
          <ambientLight intensity={dayNight === "night" ? 0.3 : 0.8} />
          <directionalLight position={[30, 40, 20]} intensity={dayNight === "night" ? 0.8 : 1.5} color="#ffffff" />
          <pointLight position={[0, 15, 0]} intensity={1.5} color="#00f2fe" distance={30} />

          {/* 3D Road Grid */}
          <gridHelper args={[40, 40, "#00f2fe", "#1e293b"]} position={[0, 0, 0]} />

          {/* Animated Moving Traffic Particles */}
          <TrafficParticles />

          {/* Buildings */}
          {CITY_BUILDINGS.map((b) => (
            <BuildingMesh
              key={b.id}
              data={b}
              isSelected={selectedBuilding?.id === b.id}
              onSelect={setSelectedBuilding}
            />
          ))}

          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} maxPolarAngle={Math.PI / 2.1} />
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
};
