export interface Rect {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
}

export interface Position {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface PositionedElement {
  rect: Rect;
  id?: string;
  priority?: number;
}

export function rectToObject(element: HTMLElement): Rect {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

export function checkCollision(rect1: Rect, rect2: Rect, padding: number = 0): boolean {
  return !(
    rect1.right + padding < rect2.left ||
    rect1.left - padding > rect2.right ||
    rect1.bottom + padding < rect2.top ||
    rect1.top - padding > rect2.bottom
  );
}

export function isInViewport(rect: Rect, viewportPadding: number = 0): boolean {
  const viewport = {
    top: viewportPadding,
    right: window.innerWidth - viewportPadding,
    bottom: window.innerHeight - viewportPadding,
    left: viewportPadding,
  };

  return (
    rect.top >= viewport.top &&
    rect.left >= viewport.left &&
    rect.bottom <= viewport.bottom &&
    rect.right <= viewport.right
  );
}

export type PositionPreference = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';

interface FindSafePositionOptions {
  elementSize: { width: number; height: number };
  preferences?: PositionPreference[];
  obstacles?: PositionedElement[];
  margin?: number;
  viewportPadding?: number;
}

export function findSafePosition(options: FindSafePositionOptions): Position {
  const {
    elementSize,
    preferences = ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
    obstacles = [],
    margin = 24,
    viewportPadding = 16,
  } = options;

  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const calculatePosition = (pref: PositionPreference): { position: Position; rect: Rect } => {
    let top: number | undefined;
    let right: number | undefined;
    let bottom: number | undefined;
    let left: number | undefined;

    switch (pref) {
      case 'bottom-right':
        right = margin;
        bottom = margin;
        break;
      case 'bottom-left':
        left = margin;
        bottom = margin;
        break;
      case 'top-right':
        right = margin;
        top = margin;
        break;
      case 'top-left':
        left = margin;
        top = margin;
        break;
      case 'center':
        top = (viewport.height - elementSize.height) / 2;
        left = (viewport.width - elementSize.width) / 2;
        break;
    }

    const rect: Rect = {
      top: top ?? (pref.includes('top') ? margin : viewport.height - elementSize.height - margin),
      right: right ?? (pref.includes('right') ? margin : viewport.width - elementSize.width - margin),
      bottom: bottom ?? (pref.includes('bottom') ? margin : viewport.height - margin),
      left: left ?? (pref.includes('left') ? margin : viewport.width - elementSize.width - margin),
      width: elementSize.width,
      height: elementSize.height,
    };

    if (top === undefined) rect.top = viewport.height - elementSize.height - margin;
    if (left === undefined) rect.left = viewport.width - elementSize.width - margin;
    if (bottom === undefined) rect.bottom = margin;
    if (right === undefined) rect.right = margin;

    return { position: { top, right, bottom, left }, rect };
  };

  const elementRect: Rect = {
    top: 0,
    right: elementSize.width,
    bottom: elementSize.height,
    left: 0,
    width: elementSize.width,
    height: elementSize.height,
  };

  for (const pref of preferences) {
    const { rect: testRect } = calculatePosition(pref);
    
    const finalRect: Rect = {
      ...elementRect,
      top: testRect.top,
      right: testRect.right,
      bottom: testRect.bottom,
      left: testRect.left,
    };

    const hasCollision = obstacles.some((obstacle) =>
      checkCollision(finalRect, obstacle.rect, margin)
    );

    if (!hasCollision && isInViewport(finalRect, viewportPadding)) {
      const { position } = calculatePosition(pref);
      return position;
    }
  }

  return calculatePosition('bottom-right').position;
}

export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: Parameters<T>) => void>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getScaledSize(baseSize: number, zoomLevel: number): number {
  const scaleFactor = 1 / clamp(zoomLevel, 0.5, 2);
  return baseSize * scaleFactor;
}
