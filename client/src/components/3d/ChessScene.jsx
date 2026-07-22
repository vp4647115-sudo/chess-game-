import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { ChessBoard3D } from './ChessBoard3D';
import { ChessPiece3D } from './ChessPiece3D';
import { BoardControls } from './BoardControls';
import { Effects } from './Effects';
import { useGameStore } from '../../store/useGameStore';
import { useGraphicsStore } from '../../store/useGraphicsStore';
import { useThemeStore } from '../../store/useThemeStore';

/**
 * Robust Error Boundary to catch WebGL context lost or creation failures
 * and present a clean recovery UI rather than crashing the interface.
 */
export class WebGLErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("WebGL Canvas failed to load:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl text-center space-y-4 w-full h-[550px] max-w-[1920px]">
          <div className="p-4 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20">
            <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-100">3D Graphics Context Error</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Your browser has run out of WebGL contexts or your graphics card has suspended acceleration. Close any duplicate 3D chess tabs and click the reload button below.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            Reload Tab
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export const ChessScene = () => {
  const controlsRef = useRef();
  const { chess, playerColor, selectedSquare, checkSquare, selectSquare } = useGameStore();
  const { hdr, shadows } = useGraphicsStore();
  const theme = useThemeStore((state) => state.theme);

  // Extract piece objects from chess.js board state
  const board = chess.board();
  const pieces = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p) {
        const sq = String.fromCharCode(97 + c) + (8 - r);
        pieces.push({
          id: `${sq}_${p.type}_${p.color}`,
          square: sq,
          type: p.type,
          color: p.color
        });
      }
    }
  }

  const cameraPos = playerColor === 'b' ? [0, 7.5, -7.5] : [0, 7.5, 7.5];

  return (
    <div className="relative w-full h-full min-h-[500px] flex-1 rounded-2xl overflow-hidden glass-panel">
      <WebGLErrorBoundary>
        <Canvas
          camera={{ position: cameraPos, fov: 45 }}
          shadows={shadows}
          gl={{ antialias: true, alpha: true }}
        >
          {/* Lighting Setup */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[6, 12, 8]}
            intensity={1.3}
            castShadow={shadows}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-bias={-0.0001}
          />
          <pointLight position={[-6, 8, -6]} intensity={0.4} color={theme.highlightSelect} />

          {hdr && <Environment preset="city" />}

          {/* 3D Board and Pieces */}
          <ChessBoard3D />

          {pieces.map((p) => (
            <ChessPiece3D
              key={p.id}
              type={p.type}
              color={p.color}
              square={p.square}
              isSelected={selectedSquare === p.square}
              isCheck={checkSquare === p.square}
              onClick={selectSquare}
            />
          ))}

          {shadows && (
            <ContactShadows position={[0, -0.46, 0]} opacity={0.6} scale={12} blur={1.5} far={4} />
          )}

          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            minDistance={4}
            maxDistance={14}
            maxPolarAngle={Math.PI / 2 - 0.05}
          />

          <Effects />
        </Canvas>
      </WebGLErrorBoundary>

      <BoardControls controlsRef={controlsRef} />
    </div>
  );
};
