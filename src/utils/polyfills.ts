// Enhanced utilities for Node.js 18.x with native features

// Node.js 18+ has native structuredClone and crypto.randomUUID
// Only add fallbacks for very old browsers

// Ensure Array.at() is available (widely supported in modern browsers)
if (!Array.prototype.at) {
  Array.prototype.at = function(index: number) {
    if (index < 0) {
      return this[this.length + index];
    }
    return this[index];
  };
}

// Ensure String.at() is available
if (!String.prototype.at) {
  String.prototype.at = function(index: number) {
    if (index < 0) {
      return this[this.length + index];
    }
    return this[index];
  };
}

// Enhanced initialization for Node.js 18.x
export function initializePolyfills(): void {
  console.log('✅ Initializing Berlin Clock with Node.js 18.x optimizations');
  
  // Check for modern features
  const hasNativeStructuredClone = typeof structuredClone !== 'undefined';
  const hasNativeCryptoUUID = crypto?.randomUUID !== undefined;
  const hasNativeArrayAt = Array.prototype.at !== undefined;
  
  console.log('🚀 Native features available:', {
    structuredClone: hasNativeStructuredClone,
    cryptoRandomUUID: hasNativeCryptoUUID,
    arrayAt: hasNativeArrayAt,
    nodeVersion: 'browser'
  });
}

// Enhanced browser compatibility checks for modern features
export function checkCompatibility(): boolean {
  const features = {
    webgl: !!window.WebGLRenderingContext,
    webgl2: !!window.WebGL2RenderingContext,
    canvas: !!window.CanvasRenderingContext2D,
    indexedDB: !!window.indexedDB,
    serviceWorker: 'serviceWorker' in navigator,
    intersectionObserver: 'IntersectionObserver' in window,
    requestAnimationFrame: 'requestAnimationFrame' in window,
    requestIdleCallback: 'requestIdleCallback' in window,
    resizeObserver: 'ResizeObserver' in window,
    performanceObserver: 'PerformanceObserver' in window,
    // Modern features
    structuredClone: typeof structuredClone !== 'undefined',
    cryptoRandomUUID: crypto?.randomUUID !== undefined,
    arrayAt: Array.prototype.at !== undefined,
    bigInt: typeof BigInt !== 'undefined',
    weakRef: typeof WeakRef !== 'undefined'
  };

  const missingFeatures = Object.entries(features)
    .filter(([, supported]) => !supported)
    .map(([feature]) => feature);

  if (missingFeatures.length > 0) {
    console.warn('⚠️ Missing browser features:', missingFeatures);
    return false;
  }

  console.log('✅ All modern browser features available');
  return true;
}

// Enhanced performance monitoring with modern APIs
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
    elapsed: () => performance.now() - start,
    // Enhanced memory monitoring
    memory: () => {
      if ('memory' in performance) {
        return (performance as any).memory;
      }
      return null;
    },
    // Observer for performance entries
    observe: (callback: (entries: PerformanceEntry[]) => void) => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          callback(list.getEntries());
        });
        observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
        return observer;
      }
      return null;
    }
  };
}

// Advanced feature detection for 3D graphics
export function check3DCapabilities() {
  const canvas = document.createElement('canvas');
  const capabilities = {
    webgl: false,
    webgl2: false,
    extensions: [] as string[],
    maxTextureSize: 0,
    maxRenderbufferSize: 0,
    vendor: '',
    renderer: ''
  };

  // Check WebGL 1.0
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (gl) {
    capabilities.webgl = true;
    const webglContext = gl as WebGLRenderingContext;
    capabilities.maxTextureSize = webglContext.getParameter(webglContext.MAX_TEXTURE_SIZE);
    capabilities.maxRenderbufferSize = webglContext.getParameter(webglContext.MAX_RENDERBUFFER_SIZE);
    
    const debugInfo = webglContext.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      capabilities.vendor = webglContext.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      capabilities.renderer = webglContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    }
    
    capabilities.extensions = webglContext.getSupportedExtensions() || [];
  }

  // Check WebGL 2.0
  const gl2 = canvas.getContext('webgl2');
  if (gl2) {
    capabilities.webgl2 = true;
  }

  return capabilities;
}

// Modern clipboard API with fallback
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

// Advanced error reporting with context
export function setupAdvancedErrorReporting() {
  // Enhanced error tracking with more context
  window.addEventListener('error', (event) => {
    console.error('🚨 Global Error:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      stack: event.error?.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled Promise Rejection:', {
      reason: event.reason,
      promise: event.promise,
      timestamp: new Date().toISOString(),
      url: window.location.href
    });
  });

  // Report critical resource failures
  window.addEventListener('load', () => {
    const resources = performance.getEntriesByType('resource');
    const failedResources = resources.filter((resource: any) => 
      resource.transferSize === 0 && resource.name !== window.location.href
    );
    
    if (failedResources.length > 0) {
      console.warn('⚠️ Failed to load resources:', failedResources.map(r => r.name));
    }
  });
}

// Check if running in a secure context (required for many modern features)
export function isSecureContext(): boolean {
  return window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost';
}