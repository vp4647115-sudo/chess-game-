import React from 'react';
import { EffectComposer, Bloom, SSAO } from '@react-three/postprocessing';
import { useGraphicsStore } from '../../store/useGraphicsStore';

export const Effects = () => {
  const { bloom, ambientOcclusion } = useGraphicsStore();

  if (!bloom && !ambientOcclusion) return null;

  return (
    <EffectComposer>
      {bloom && <Bloom intensity={0.4} luminanceThreshold={0.8} luminanceSmoothing={0.9} />}
      {ambientOcclusion && <SSAO samples={12} radius={0.2} intensity={8} />}
    </EffectComposer>
  );
};
