import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useThemeStore } from '../../store/useThemeStore';
import { useGraphicsStore } from '../../store/useGraphicsStore';
import { useSoundStore } from '../../store/useSoundStore';
import { playSound } from '../../utils/soundEngine';

/**
 * Realistic Staunton Chess Pieces — LatheGeometry Profiles
 * Each piece is built from a revolution curve to create the classic turned-wood look.
 */

// Helper to create a lathe geometry from a profile array of [radius, height] points
const createLathePoints = (profile) => {
  return profile.map(([r, y]) => new THREE.Vector2(r, y));
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAWN — Short, compact piece with spherical head
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const PawnMesh = ({ material }) => {
  const geometry = useMemo(() => {
    const pts = createLathePoints([
      [0.00, 0.00],   // bottom center
      [0.38, 0.00],   // base outer edge
      [0.38, 0.04],   // base top edge
      [0.34, 0.06],   // base bevel
      [0.20, 0.08],   // base to shaft transition
      [0.16, 0.12],   // shaft bottom
      [0.14, 0.30],   // shaft mid
      [0.12, 0.42],   // shaft narrowing
      [0.18, 0.44],   // collar flare out
      [0.20, 0.46],   // collar top
      [0.18, 0.48],   // collar inward
      [0.14, 0.50],   // neck
      [0.22, 0.56],   // head bottom sphere start
      [0.26, 0.64],   // head widest
      [0.24, 0.72],   // head upper
      [0.18, 0.78],   // head narrowing
      [0.10, 0.82],   // head top curve
      [0.04, 0.84],   // tip
      [0.00, 0.85],   // top center
    ]);
    return new THREE.LatheGeometry(pts, 32);
  }, []);

  return (
    <mesh geometry={geometry} material={material} castShadow receiveShadow />
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ROOK — Castle tower with battlement notches
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const RookMesh = ({ material }) => {
  const bodyGeometry = useMemo(() => {
    const pts = createLathePoints([
      [0.00, 0.00],
      [0.40, 0.00],   // wide base
      [0.40, 0.06],
      [0.36, 0.08],
      [0.22, 0.10],   // base taper
      [0.18, 0.14],   // shaft bottom
      [0.20, 0.18],   // slight ridge
      [0.18, 0.20],
      [0.16, 0.50],   // tall straight shaft
      [0.18, 0.52],   // collar
      [0.22, 0.54],   // collar flare
      [0.24, 0.56],
      [0.22, 0.58],
      [0.18, 0.60],   // neck
      [0.26, 0.62],   // tower flare start
      [0.30, 0.66],   // tower body
      [0.32, 0.76],   // tower top rim
      [0.34, 0.78],   // rim outer
      [0.34, 0.82],   // battlement base
      [0.28, 0.82],   // inner rim
      [0.28, 0.76],   // hollowed inside
      [0.00, 0.76],   // center hollow
    ]);
    return new THREE.LatheGeometry(pts, 32);
  }, []);

  return (
    <group>
      <mesh geometry={bodyGeometry} material={material} castShadow receiveShadow />
      {/* Battlement blocks on top */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              0.31 * Math.cos(angle),
              0.88,
              0.31 * Math.sin(angle)
            ]}
            material={material}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.10, 0.12, 0.14]} />
          </mesh>
        );
      })}
    </group>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// KNIGHT — Horse head profile (lathe body + sculpted head)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const KnightMesh = ({ material }) => {
  const baseGeometry = useMemo(() => {
    const pts = createLathePoints([
      [0.00, 0.00],
      [0.38, 0.00],
      [0.38, 0.06],
      [0.34, 0.08],
      [0.20, 0.10],
      [0.16, 0.14],
      [0.18, 0.18],
      [0.16, 0.20],
      [0.14, 0.30],
      [0.00, 0.30],
    ]);
    return new THREE.LatheGeometry(pts, 32);
  }, []);

  return (
    <group>
      {/* Turned base */}
      <mesh geometry={baseGeometry} material={material} castShadow receiveShadow />
      {/* Horse neck/chest — tall curved box */}
      <mesh position={[0, 0.56, 0.02]} rotation={[0.15, 0, 0]} material={material} castShadow receiveShadow>
        <boxGeometry args={[0.30, 0.52, 0.32]} />
      </mesh>
      {/* Horse head — angled snout */}
      <mesh position={[0, 0.80, 0.18]} rotation={[-0.35, 0, 0]} material={material} castShadow receiveShadow>
        <boxGeometry args={[0.24, 0.26, 0.40]} />
      </mesh>
      {/* Muzzle */}
      <mesh position={[0, 0.68, 0.34]} rotation={[-0.5, 0, 0]} material={material} castShadow receiveShadow>
        <boxGeometry args={[0.18, 0.14, 0.20]} />
      </mesh>
      {/* Ears */}
      <mesh position={[-0.06, 0.96, 0.04]} rotation={[0, 0, -0.15]} material={material} castShadow receiveShadow>
        <coneGeometry args={[0.04, 0.14, 8]} />
      </mesh>
      <mesh position={[0.06, 0.96, 0.04]} rotation={[0, 0, 0.15]} material={material} castShadow receiveShadow>
        <coneGeometry args={[0.04, 0.14, 8]} />
      </mesh>
      {/* Mane ridge along neck */}
      <mesh position={[0, 0.72, -0.14]} rotation={[0.3, 0, 0]} material={material} castShadow receiveShadow>
        <boxGeometry args={[0.04, 0.40, 0.08]} />
      </mesh>
    </group>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BISHOP — Tall mitre-shaped head with slit
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const BishopMesh = ({ material }) => {
  const geometry = useMemo(() => {
    const pts = createLathePoints([
      [0.00, 0.00],
      [0.38, 0.00],   // base
      [0.38, 0.06],
      [0.34, 0.08],
      [0.20, 0.10],   // base taper
      [0.16, 0.14],
      [0.18, 0.18],   // ridge
      [0.16, 0.20],
      [0.13, 0.40],   // tall shaft
      [0.15, 0.42],   // collar
      [0.20, 0.44],   // collar flare
      [0.22, 0.46],
      [0.20, 0.48],
      [0.15, 0.50],   // neck
      [0.22, 0.56],   // mitre head start
      [0.24, 0.64],   // mitre widest
      [0.22, 0.74],   // mitre taper
      [0.16, 0.84],   // mitre narrowing
      [0.08, 0.92],   // mitre tip approach
      [0.03, 0.96],   // near tip
      [0.00, 0.98],   // point
    ]);
    return new THREE.LatheGeometry(pts, 32);
  }, []);

  return (
    <group>
      <mesh geometry={geometry} material={material} castShadow receiveShadow />
      {/* Top finial ball */}
      <mesh position={[0, 1.04, 0]} material={material} castShadow receiveShadow>
        <sphereGeometry args={[0.05, 16, 16]} />
      </mesh>
      {/* Diagonal slit/notch on mitre */}
      <mesh position={[0, 0.76, 0.12]} rotation={[0.3, 0, 0]} material={material} castShadow receiveShadow>
        <boxGeometry args={[0.04, 0.20, 0.02]} />
      </mesh>
    </group>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// QUEEN — Crown with arches and cross/ball finial
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const QueenMesh = ({ material }) => {
  const geometry = useMemo(() => {
    const pts = createLathePoints([
      [0.00, 0.00],
      [0.42, 0.00],   // wide base
      [0.42, 0.06],
      [0.38, 0.08],
      [0.22, 0.10],
      [0.18, 0.14],
      [0.20, 0.18],   // ridge
      [0.18, 0.20],
      [0.14, 0.48],   // tall shaft
      [0.16, 0.50],   // collar
      [0.22, 0.52],   // collar flare
      [0.24, 0.54],
      [0.22, 0.56],
      [0.16, 0.58],   // neck
      [0.24, 0.64],   // crown body start
      [0.28, 0.72],   // crown widest
      [0.30, 0.80],   // crown body
      [0.28, 0.88],   // crown taper
      [0.22, 0.94],   // crown rim approach
      [0.26, 0.96],   // rim flare
      [0.28, 0.98],   // rim outer
      [0.26, 1.00],   // rim top
      [0.14, 1.00],   // rim inner
      [0.06, 0.98],   // inner taper
      [0.00, 0.98],   // center
    ]);
    return new THREE.LatheGeometry(pts, 32);
  }, []);

  return (
    <group>
      <mesh geometry={geometry} material={material} castShadow receiveShadow />
      {/* Crown points/arches */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <group key={i}>
            <mesh
              position={[
                0.22 * Math.cos(angle),
                1.06,
                0.22 * Math.sin(angle)
              ]}
              material={material}
              castShadow
              receiveShadow
            >
              <sphereGeometry args={[0.04, 12, 12]} />
            </mesh>
          </group>
        );
      })}
      {/* Top ball finial */}
      <mesh position={[0, 1.10, 0]} material={material} castShadow receiveShadow>
        <sphereGeometry args={[0.06, 16, 16]} />
      </mesh>
    </group>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// KING — Tallest piece, crown with cross on top
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const KingMesh = ({ material }) => {
  const geometry = useMemo(() => {
    const pts = createLathePoints([
      [0.00, 0.00],
      [0.44, 0.00],   // widest base
      [0.44, 0.06],
      [0.40, 0.08],
      [0.24, 0.10],
      [0.20, 0.14],
      [0.22, 0.18],   // ridge
      [0.20, 0.20],
      [0.16, 0.55],   // very tall shaft
      [0.18, 0.57],   // collar
      [0.24, 0.59],   // collar flare
      [0.26, 0.61],
      [0.24, 0.63],
      [0.18, 0.65],   // neck
      [0.26, 0.71],   // crown body start
      [0.30, 0.80],   // crown widest
      [0.32, 0.88],   // crown body
      [0.30, 0.96],   // crown taper
      [0.24, 1.02],   // crown rim approach
      [0.28, 1.04],   // rim flare
      [0.30, 1.06],   // rim outer
      [0.28, 1.08],   // rim top
      [0.16, 1.08],   // rim inner
      [0.08, 1.06],   // inner taper
      [0.00, 1.06],   // center
    ]);
    return new THREE.LatheGeometry(pts, 32);
  }, []);

  return (
    <group>
      <mesh geometry={geometry} material={material} castShadow receiveShadow />
      {/* Crown arch points */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              0.24 * Math.cos(angle),
              1.14,
              0.24 * Math.sin(angle)
            ]}
            material={material}
            castShadow
            receiveShadow
          >
            <sphereGeometry args={[0.04, 12, 12]} />
          </mesh>
        );
      })}
      {/* BOLD CROSS ON TOP — the King's signature */}
      {/* Vertical arm */}
      <mesh position={[0, 1.26, 0]} material={material} castShadow receiveShadow>
        <boxGeometry args={[0.06, 0.28, 0.06]} />
      </mesh>
      {/* Horizontal arm */}
      <mesh position={[0, 1.32, 0]} material={material} castShadow receiveShadow>
        <boxGeometry args={[0.20, 0.06, 0.06]} />
      </mesh>
    </group>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN PIECE COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const ChessPiece3D = ({ type, color, square, isSelected, isCheck, onClick }) => {
  const groupRef = useRef();
  const theme = useThemeStore((state) => state.theme);
  const { shadows } = useGraphicsStore();
  const { soundEnabled, soundVolume } = useSoundStore();

  const file = square.charCodeAt(0) - 97; // 0..7
  const rank = parseInt(square[1], 10) - 1; // 0..7
  
  // Calculate Target World Position
  const targetX = file - 3.5;
  const targetZ = 3.5 - rank;
  const targetY = isSelected ? 0.35 : 0;

  // Material — realistic wood-like look with high contrast
  const material = useMemo(() => {
    // Soft ivory/cream for white pieces to prevent high specularity burn; rich dark ebony for black
    const baseColor = color === 'w' 
      ? (theme.whitePiece === '#f0e2cc' ? '#dfd4be' : theme.whitePiece || '#dfd4be') 
      : (theme.blackPiece || '#1a1008');

    return new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: color === 'w' ? 0.55 : 0.4, // white pieces are more matte (ivory-like), black pieces are satin-wood
      metalness: color === 'w' ? 0.02 : 0.05,
      emissive: isCheck ? '#ff1100' : isSelected ? (theme.highlightSelect || '#baca44') : '#000000',
      emissiveIntensity: isCheck ? 0.4 : isSelected ? 0.25 : 0,
    });
  }, [color, theme, isSelected, isCheck]);

  // Smooth position interpolation
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 15, delta);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targetZ, 15, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 12, delta);

    if (isSelected) {
      groupRef.current.rotation.y += delta * 1.2;
    }
  });

  const handlePointerDown = (e) => {
    e.stopPropagation();
    playSound('click', soundEnabled, soundVolume);
    onClick(square);
  };

  const renderPieceMesh = () => {
    switch (type) {
      case 'p': return <PawnMesh material={material} />;
      case 'r': return <RookMesh material={material} />;
      case 'n': return <KnightMesh material={material} />;
      case 'b': return <BishopMesh material={material} />;
      case 'q': return <QueenMesh material={material} />;
      case 'k': return <KingMesh material={material} />;
      default:  return <PawnMesh material={material} />;
    }
  };

  return (
    <group
      ref={groupRef}
      position={[targetX, targetY, targetZ]}
      onPointerDown={handlePointerDown}
    >
      {renderPieceMesh()}
    </group>
  );
};
