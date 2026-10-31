"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import { RotateCcw, RotateCw } from "lucide-react";
import { ModelErrorBoundary } from "@/components/studio/ModelErrorBoundary";
import { useMediaQuery, useReducedMotion } from "@/lib/gsap";
import { jetbrains } from "@/app/fonts";

const MODEL_URL = "/models/noir-gt.glb";

/** Starting three-quarter angle. */
const BASE_ROTATION = Math.PI * 0.22;

export type SceneStatus = "loading" | "ready" | "error" | "unsupported";

type Props = {
  onStatus: (status: SceneStatus) => void;
  onProgress: (value: number) => void;
  failed: boolean;
  onFail: () => void;
};

/* ── Vehicle ───────────────────────────────────────────────── */

function Vehicle({
  rotation,
  autoRotate,
  interacting,
}: {
  rotation: RefObject<{ current: number; target: number }>;
  autoRotate: boolean;
  interacting: RefObject<boolean>;
}) {
  // Self-hosted Draco decoder — no third-party CDN dependency.
  const { scene } = useGLTF(MODEL_URL, "/draco/");
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);

  const prepared = useMemo(() => {
    const model = scene.clone(true);
    const applied = new Set<THREE.Material>();

    const toPhysical = (
      source: THREE.Material,
      overrides: Partial<THREE.MeshPhysicalMaterialParameters>
    ) => {
      const base = source as THREE.MeshStandardMaterial;
      const physical = new THREE.MeshPhysicalMaterial({
        color: base.color?.clone() ?? new THREE.Color("#0b0b0d"),
        map: base.map ?? null,
        roughness: base.roughness ?? 0.5,
        metalness: base.metalness ?? 0.2,
        transparent: base.transparent,
        opacity: base.opacity,
        side: base.side,
        emissive: base.emissive?.clone() ?? new THREE.Color("#000000"),
        emissiveMap: base.emissiveMap ?? null,
        envMapIntensity: 1.5,
        ...overrides,
      });
      physical.name = base.name;
      return physical;
    };

    model.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      const meshName = (mesh.name || "").toLowerCase();
      const source = mesh.material as THREE.MeshStandardMaterial;
      if (!source) return;
      const materialName = (source.name || "").toLowerCase();

      let next: THREE.MeshPhysicalMaterial;

      if (/rim|wheel|nut|brake_(?!light)|disc/.test(meshName)) {
        // Forged graphite wheels, crimson calipers.
        next = /caliper|brake/.test(meshName) && !/disc|rotor/.test(meshName)
          ? toPhysical(source, {
              color: new THREE.Color("#6d1220"),
              metalness: 0.55,
              roughness: 0.42,
            })
          : toPhysical(source, {
              color: new THREE.Color("#1b1c1f"),
              metalness: 0.96,
              roughness: 0.3,
            });
      } else if (/body/.test(materialName) || /body/.test(meshName)) {
        // Obsidian clearcoat over carbon.
        next = toPhysical(source, {
          color: new THREE.Color("#08080a"),
          metalness: 0.82,
          roughness: 0.19,
          clearcoat: 1,
          clearcoatRoughness: 0.06,
        });
      } else if (/glass/.test(materialName)) {
        next = toPhysical(source, {
          color: new THREE.Color("#0a0d11"),
          metalness: 0.95,
          roughness: 0.04,
          transparent: true,
          opacity: 0.62,
        });
      } else if (
        /taillight|led|lights_red|turn_signal/.test(materialName) ||
        /led|lights_red/.test(meshName)
      ) {
        next = toPhysical(source, {
          color: new THREE.Color("#5c0410"),
          emissive: new THREE.Color("#b51224"),
          emissiveIntensity: 2.4,
          metalness: 0.2,
          roughness: 0.3,
        });
      } else if (/chrome|metal/.test(materialName)) {
        next = toPhysical(source, {
          color: new THREE.Color("#9ba0a7"),
          metalness: 1,
          roughness: 0.24,
        });
      } else if (/tire/.test(materialName) || /tire/.test(meshName)) {
        next = toPhysical(source, {
          color: new THREE.Color("#0a0a0b"),
          metalness: 0.05,
          roughness: 0.92,
        });
      } else if (/leather_red/.test(materialName)) {
        next = toPhysical(source, {
          color: new THREE.Color("#3a0c11"),
          metalness: 0.1,
          roughness: 0.72,
        });
      } else if (
        /ferrari|yellow|blue|dodger/.test(materialName) ||
        /yellow|blue|centre/.test(meshName)
      ) {
        // Remove third-party brand colours — this is a NOIR concept study.
        next = toPhysical(source, {
          color: new THREE.Color("#0a0a0b"),
          metalness: 0.7,
          roughness: 0.35,
        });
      } else if (/interior|carpet|leather/.test(materialName)) {
        next = toPhysical(source, {
          color: new THREE.Color("#101012"),
          metalness: 0.1,
          roughness: 0.85,
        });
      } else {
        next = toPhysical(source, {
          color: new THREE.Color("#131316"),
          metalness: 0.6,
          roughness: 0.45,
        });
      }

      applied.add(source);
      applied.add(next);
      mesh.material = next;
    });

    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const longest = Math.max(size.x, size.y, size.z) || 1;
    const scale = 5.7 / longest;

    return {
      model,
      scale,
      center,
      height: size.y * scale,
      dispose: () => applied.forEach((material) => material.dispose()),
    };
  }, [scene]);

  // Free GPU memory when the studio unmounts (and drop the loader cache).
  useEffect(() => {
    const model = prepared.model;
    const dispose = prepared.dispose;
    return () => {
      model.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry?.dispose();
      });
      dispose();
    };
  }, [prepared.model, prepared.dispose]);

  useEffect(() => () => useGLTF.clear(MODEL_URL), []);

  useFrame((_, delta) => {
    const state = rotation.current;
    if (!state) return;
    if (autoRotate && !interacting.current) {
      state.target += delta * 0.16;
    }
    state.current = THREE.MathUtils.damp(
      state.current,
      state.target,
      5.5,
      delta
    );
    if (group.current) group.current.rotation.y = state.current;
  });

  return (
    <group
      ref={group}
      position={[0, 0, 0]}
      rotation={[0, BASE_ROTATION, 0]}
    >
      <group
        ref={inner}
        scale={prepared.scale}
        position={[
          -prepared.center.x * prepared.scale,
          prepared.height / 2 - prepared.center.y * prepared.scale,
          -prepared.center.z * prepared.scale,
        ]}
      >
        <primitive object={prepared.model} />
      </group>
    </group>
  );
}

/* ── Studio environment ────────────────────────────────────── */

function StudioRig({ isMobile }: { isMobile: boolean }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(3.95, 1.5, 5.05);
    camera.lookAt(0, 0.52, 0);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = isMobile ? 38 : 31;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile]);

  return null;
}

function Scene({
  rotation,
  autoRotate,
  interacting,
  isMobile,
}: {
  rotation: RefObject<{ current: number; target: number }>;
  autoRotate: boolean;
  interacting: RefObject<boolean>;
  isMobile: boolean;
}) {
  return (
    <>
      <color attach="background" args={["#070708"]} />
      <fog attach="fog" args={["#070708", 12, 30]} />
      <StudioRig isMobile={isMobile} />

      <ambientLight intensity={0.32} />
      <directionalLight
        position={[-4, 6, 4]}
        intensity={2.1}
        color="#e9edf4"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      />
      <directionalLight
        position={[5, 2.5, -3]}
        intensity={0.55}
        color="#bfc2c7"
      />
      <spotLight
        position={[-2.6, 3.4, -5]}
        angle={0.7}
        penumbra={1}
        intensity={26}
        distance={22}
        color="#b51224"
      />
      <pointLight position={[0, 0.35, 2.4]} intensity={4} color="#8f9299" />
      <pointLight position={[0, 0.2, -2.6]} intensity={5} color="#b51224" />

      <Environment resolution={isMobile ? 64 : 128} frames={1}>
        <color attach="background" args={["#050505"]} />
        <Lightformer
          form="rect"
          intensity={2.6}
          position={[0, 6, 0]}
          scale={[12, 6, 1]}
          rotation-x={Math.PI / 2}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={1.1}
          position={[-7, 2.4, 2]}
          scale={[9, 2.6, 1]}
          rotation-y={Math.PI / 2}
          color="#d6dae1"
        />
        <Lightformer
          form="rect"
          intensity={0.55}
          position={[7, 2, 1]}
          scale={[9, 2.2, 1]}
          rotation-y={-Math.PI / 2}
          color="#9aa0a8"
        />
        <Lightformer
          form="rect"
          intensity={3.2}
          position={[2.5, 1.1, -7]}
          scale={[8, 1.05, 1]}
          color="#b51224"
        />
        <Lightformer
          form="circle"
          intensity={1.4}
          position={[-2, 4.5, 1]}
          scale={[2.4, 2.4, 1]}
          color="#ffffff"
        />
      </Environment>

      <Vehicle
        rotation={rotation}
        autoRotate={autoRotate}
        interacting={interacting}
      />

      {/* Floor */}
      <mesh rotation-x={-Math.PI / 2} position-y={0} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial
          color="#0a0a0c"
          roughness={0.52}
          metalness={0.55}
          envMapIntensity={0.42}
        />
      </mesh>

      <ContactShadows
        position={[0, 0.003, 0]}
        opacity={0.72}
        scale={13}
        blur={2.6}
        far={4.2}
        resolution={isMobile ? 256 : 512}
        color="#000000"
        frames={1}
      />
    </>
  );
}

/* ── Loader overlay ────────────────────────────────────────── */

function Loader({ onStatus, onProgress }: Pick<Props, "onStatus" | "onProgress">) {
  const { progress, active } = useProgress();

  useEffect(() => {
    const id = window.requestAnimationFrame(() => onProgress(progress));
    return () => window.cancelAnimationFrame(id);
  }, [progress, onProgress]);

  useEffect(() => {
    if (progress < 100 || active) return;
    const id = window.requestAnimationFrame(() => onStatus("ready"));
    return () => window.cancelAnimationFrame(id);
  }, [progress, active, onStatus]);

  return null;
}

/* ── Public component ──────────────────────────────────────── */

export default function VehicleScene({
  onStatus,
  onProgress,
  failed,
  onFail,
}: Props) {
  const rotation = useRef({ current: BASE_ROTATION, target: BASE_ROTATION });
  const interacting = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lastX = useRef(0);
  const dragging = useRef(false);
  const resumeTimer = useRef<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const reduced = useReducedMotion();
  const [autoRotate, setAutoRotate] = useState(!reduced);

  // Respect a change of preference mid-session.
  useEffect(() => {
    setAutoRotate(!reduced);
  }, [reduced]);

  useEffect(() => {
    return () => {
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    };
  }, []);

  const beginDrag = (clientX: number) => {
    dragging.current = true;
    interacting.current = true;
    lastX.current = clientX;
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
  };

  const moveDrag = (clientX: number) => {
    if (!dragging.current) return;
    const delta = clientX - lastX.current;
    lastX.current = clientX;
    if (rotation.current) rotation.current.target += delta * 0.0085;
  };

  const endDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;
    resumeTimer.current = window.setTimeout(() => {
      interacting.current = false;
    }, 1200);
  };

  if (failed) return null;

  return (
    <div className="relative h-full w-full">
      <div
        ref={wrapperRef}
        role="group"
        tabIndex={0}
        aria-label="Interactive three-dimensional model of the NOIR N-01. Drag horizontally or use the left and right arrow keys to rotate the vehicle."
        className="relative h-full w-full cursor-grab touch-pan-y outline-none active:cursor-grabbing"
        onPointerDown={(e) => {
          beginDrag(e.clientX);
          e.currentTarget.setPointerCapture?.(e.pointerId);
        }}
        onPointerMove={(e) => moveDrag(e.clientX)}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onKeyDown={(e) => {
          if (!rotation.current) return;
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            rotation.current.target -= 0.22;
          }
          if (e.key === "ArrowRight") {
            e.preventDefault();
            rotation.current.target += 0.22;
          }
        }}
      >
        <ModelErrorBoundary onError={onFail} fallback={null}>
          <Canvas
            shadows
            dpr={[1, isMobile ? 1.25 : 1.75]}
            gl={{
              antialias: true,
              powerPreference: "high-performance",
              alpha: false,
            }}
            camera={{ position: [3.95, 1.5, 5.05], fov: isMobile ? 42 : 35, near: 0.1, far: 60 }}
            onCreated={({ gl }) => {
              gl.toneMappingExposure = 1.05;
            }}
          >
            <Suspense fallback={null}>
              <Scene
                rotation={rotation}
                autoRotate={autoRotate}
                interacting={interacting}
                isMobile={isMobile}
              />
              <Loader onStatus={onStatus} onProgress={onProgress} />
            </Suspense>
          </Canvas>
        </ModelErrorBoundary>
      </div>

      {/* Controls */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 md:p-6">
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAutoRotate((v) => !v)}
            aria-pressed={autoRotate}
            className="hairline-btn !bg-void/60 backdrop-blur-sm"
          >
            <RotateCw
              size={12}
              strokeWidth={1.4}
              aria-hidden="true"
              className={autoRotate ? "text-crimson" : "text-ash"}
            />
            {autoRotate ? "Auto" : "Manual"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (!rotation.current) return;
              const base = BASE_ROTATION;
              const current = rotation.current.current;
              const turns = Math.round((current - base) / (Math.PI * 2));
              rotation.current.target = base + turns * Math.PI * 2;
            }}
            className="hairline-btn !bg-void/60 backdrop-blur-sm"
          >
            <RotateCcw size={12} strokeWidth={1.4} aria-hidden="true" />
            Reset
          </button>
        </div>

        <div className="pointer-events-auto hidden items-center gap-3 sm:flex">
          <span
            className={`${jetbrains.className} text-[0.5rem] uppercase tracking-[0.3em] text-ash`}
          >
            Orbit
          </span>
          <input
            type="range"
            min={-180}
            max={180}
            step={1}
            defaultValue={0}
            aria-label="Rotate the vehicle"
            onChange={(e) => {
              if (!rotation.current) return;
              rotation.current.target =
                BASE_ROTATION + Number(e.target.value) * (Math.PI / 180);
            }}
            className="h-1 w-28 cursor-ew-resize appearance-none rounded-full bg-white/20 accent-crimson outline-none [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-bone"
          />
        </div>
      </div>
    </div>
  );
}
