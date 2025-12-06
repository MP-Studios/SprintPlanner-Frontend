'use client';

import { useEffect } from 'react';
import { initializePaletteStyles } from '../colors/classColors';

export default function PaletteInitializer() {
  useEffect(() => {
    initializePaletteStyles();
  }, []);

  return null;
}