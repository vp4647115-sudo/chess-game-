import React from 'react';
import { Text } from '@react-three/drei';
import { useThemeStore } from '../../store/useThemeStore';
import { useGameStore } from '../../store/useGameStore';
import { useGraphicsStore } from '../../store/useGraphicsStore';

export const ChessBoard3D = () => {
  const theme = useThemeStore((state) => state.theme);
  const { selectedSquare, legalMoves, lastMove, selectSquare, suggestedHint } = useGameStore();
  const { shadows } = useGraphicsStore();

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  return (
    <group>
      {/* Outer Board Frame / Border */}
      <mesh position={[0, -0.25, 0]} receiveShadow={shadows}>
        <boxGeometry args={[9.2, 0.4, 9.2]} />
        <meshStandardMaterial
          color={theme.border}
          roughness={theme.roughness || 0.4}
          metalness={theme.metalness || 0.3}
        />
      </mesh>

      {/* 8x8 Board Tiles */}
      {Array.from({ length: 8 }).map((_, rankIdx) =>
        Array.from({ length: 8 }).map((_, fileIdx) => {
          const fileChar = files[fileIdx];
          const rankNum = 8 - rankIdx;
          const square = `${fileChar}${rankNum}`;

          const isDark = (rankIdx + fileIdx) % 2 === 1;
          const isSelected = selectedSquare === square;
          const isLegal = legalMoves.includes(square);
          const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);
          const isHintSource = suggestedHint && suggestedHint.from === square;
          const isHintTarget = suggestedHint && suggestedHint.to === square;

          let tileColor = isDark ? theme.darkSquare : theme.lightSquare;
          if (isSelected) tileColor = theme.highlightSelect;
          else if (isLastMove) tileColor = theme.highlightMove;
          else if (isHintSource) tileColor = '#d97706'; // Amber/gold for starting piece
          else if (isHintTarget) tileColor = '#059669'; // Emerald for destination square

          const posX = fileIdx - 3.5;
          const posZ = rankIdx - 3.5;

          return (
            <group key={square} position={[posX, 0, posZ]}>
              <mesh
                receiveShadow={shadows}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  selectSquare(square);
                }}
              >
                <boxGeometry args={[0.98, 0.1, 0.98]} />
                <meshStandardMaterial
                  color={tileColor}
                  roughness={theme.roughness}
                  metalness={theme.metalness}
                  transparent={theme.id === 'glass'}
                  opacity={theme.id === 'glass' ? 0.75 : 1}
                />
              </mesh>

              {/* Valid Move Indicator Ring / Dot */}
              {isLegal && (
                <mesh position={[0, 0.06, 0]}>
                  <cylinderGeometry args={[0.2, 0.2, 0.02, 16]} />
                  <meshBasicMaterial color="#00ffcc" transparent opacity={0.8} />
                </mesh>
              )}

              {/* Hint source indicator disk */}
              {isHintSource && (
                <mesh position={[0, 0.055, 0]}>
                  <cylinderGeometry args={[0.35, 0.35, 0.015, 16]} />
                  <meshBasicMaterial color="#fbbf24" transparent opacity={0.8} />
                </mesh>
              )}

              {/* Hint target indicator disk */}
              {isHintTarget && (
                <mesh position={[0, 0.055, 0]}>
                  <cylinderGeometry args={[0.35, 0.35, 0.015, 16]} />
                  <meshBasicMaterial color="#34d399" transparent opacity={0.8} />
                </mesh>
              )}
            </group>
          );
        })
      )}

      {/* Rank & File Notation Labels */}
      {files.map((file, idx) => (
        <React.Fragment key={file}>
          <Text
            position={[idx - 3.5, 0.08, 4.2]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.28}
            color="#94a3b8"
          >
            {file.toUpperCase()}
          </Text>
          <Text
            position={[-4.2, 0.08, idx - 3.5]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.28}
            color="#94a3b8"
          >
            {8 - idx}
          </Text>
        </React.Fragment>
      ))}
    </group>
  );
};
