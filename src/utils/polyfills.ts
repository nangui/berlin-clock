// Polyfills and compatibility utilities for Node.js 16.x

// Ensure structuredClone is available (Node 16 doesn't have it natively)
if (typeof globalThis !== 'undefined' && !globalThis.structuredClone) {
  globalThis.structuredClone = function<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  };
}

// Ensure crypto.randomUUID is available for older environments
if (typeof globalThis !== 'undefined' && globalThis.crypto && !globalThis.crypto.randomUUID) {
  globalThis.crypto.randomUUID = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
}

// Polyfill for Array.at() if not available
if (!Array.prototype.at) {
  Array.prototype.at = function(index: number) {
    if (index < 0) {
      return this[this.length + index];
    }
    return this[index];
  };
}

// Polyfill for String.at() if not available
if (!String.prototype.at) {
  String.prototype.at = function(index: number) {
    if (index < 0) {
      return this[this.length + index];
    }
    return this[index];
  };
}

// Export a function to initialize polyfills
export function initializePolyfills(): void {
  // Any additional initialization logic can go here
  console.log('Polyfills initialized for Node.js 16.x compatibility');
}

// Browser compatibility checks
export function checkCompatibility(): boolean {
  const features = {
    webgl: !!window.WebGLRenderingContext,
    canvas: !!window.CanvasRenderingContext2D,
    indexedDB: !!window.indexedDB,
    serviceWorker: 'serviceWorker' in navigator,
    intersectionObserver: 'IntersectionObserver' in window,
    requestAnimationFrame: 'requestAnimationFrame' in window
  };

  const missingFeatures = Object.entries(features)
    .filter(([, supported]) => !supported)
    .map(([feature]) => feature);

  if (missingFeatures.length > 0) {
    console.warn('Missing browser features:', missingFeatures);
    return false;
  }

  return true;
}

// Performance monitoring for older environments
export function createPerformanceMonitor() {
  const start = performance.now();
  
  return {
    mark: (name: string) => {
      if (performance.mark) {
        performance.mark(name);
      }
    },
    measure: (name: string, startMark: string, endMark: string) => {
      if (performance.measure) {
        try {
          performance.measure(name, startMark, endMark);
        } catch (e) {
          console.warn('Performance measurement failed:', e);
        }
      }
    },
    elapsed: () => performance.now() - start
  };
}