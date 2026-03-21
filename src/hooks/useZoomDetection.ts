import { useState, useEffect, useCallback, useRef } from 'react';

export interface ZoomState {
  level: number;
  isZoomed: boolean;
  isZoomedIn: boolean;
  isZoomedOut: boolean;
  devicePixelRatio: number;
  visualViewport: {
    scale: number;
    offsetLeft: number;
    offsetTop: number;
    pageLeft: number;
    pageTop: number;
    width: number;
    height: number;
  } | null;
}

export interface SafeZone {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface UseZoomDetectionReturn extends ZoomState {
  safeZone: SafeZone;
  effectiveScale: number;
}

function calculateSafeZone(zoomLevel: number): SafeZone {
  const baseMargin = 24;
  const minMargin = 12;
  const maxMargin = 48;
  const scaleFactor = 1 / Math.min(Math.max(zoomLevel, 0.5), 2);
  const margin = Math.max(minMargin, Math.min(maxMargin, baseMargin * scaleFactor));
  
  return {
    top: margin,
    right: margin,
    bottom: margin,
    left: margin,
  };
}

function getVisualViewport(): ZoomState['visualViewport'] {
  if (typeof window !== 'undefined' && 'visualViewport' in window) {
    const vv = window.visualViewport;
    if (vv) {
      return {
        scale: vv.scale,
        offsetLeft: vv.offsetLeft,
        offsetTop: vv.offsetTop,
        pageLeft: vv.pageLeft,
        pageTop: vv.pageTop,
        width: vv.width,
        height: vv.height,
      };
    }
  }
  return null;
}

function detectZoomLevel(): number {
  if (typeof window === 'undefined') return 1;

  if ('visualViewport' in window && window.visualViewport) {
    const vv = window.visualViewport;
    if (vv && vv.scale !== 1) {
      return vv.scale;
    }
  }

  const outerWidth = window.outerWidth || 1920;
  const innerWidth = window.innerWidth || 1920;
  const calculatedZoom = outerWidth / innerWidth;

  if (calculatedZoom > 0.1 && calculatedZoom < 10) {
    return calculatedZoom;
  }

  return 1;
}

export function useZoomDetection(): UseZoomDetectionReturn {
  const [zoomState, setZoomState] = useState<ZoomState>({
    level: 1,
    isZoomed: false,
    isZoomedIn: false,
    isZoomedOut: false,
    devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    visualViewport: getVisualViewport(),
  });

  const rafRef = useRef<number | undefined>(undefined);
  const updateZoom = useCallback(() => {
    if (rafRef.current !== undefined) {
      window.cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const level = detectZoomLevel();
      const devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
      const visualViewport = getVisualViewport();

      setZoomState({
        level,
        isZoomed: level !== 1,
        isZoomedIn: level > 1,
        isZoomedOut: level < 1,
        devicePixelRatio,
        visualViewport,
      });
    });
  }, []);

  useEffect(() => {
    updateZoom();

    const handleResize = () => updateZoom();
    const handleScroll = () => updateZoom();

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    if (typeof window !== 'undefined' && 'visualViewport' in window) {
      const vv = window.visualViewport;
      if (vv) {
        vv.addEventListener('resize', updateZoom, { passive: true });
        vv.addEventListener('scroll', updateZoom, { passive: true });
      }
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      
      if (typeof window !== 'undefined' && 'visualViewport' in window) {
        const vv = window.visualViewport;
        if (vv) {
          vv.removeEventListener('resize', updateZoom);
          vv.removeEventListener('scroll', updateZoom);
        }
      }
    };
  }, [updateZoom]);

  const safeZone = calculateSafeZone(zoomState.level);
  const effectiveScale = Math.min(Math.max(zoomState.level, 0.5), 2);

  return {
    ...zoomState,
    safeZone,
    effectiveScale,
  };
}

export default useZoomDetection;
