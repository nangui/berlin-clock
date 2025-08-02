import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { StoreProvider } from './stores/settingsStore';
import { 
  initializePolyfills, 
  checkCompatibility, 
  setupAdvancedErrorReporting,
  check3DCapabilities,
  isSecureContext
} from './utils/polyfills';

// Enhanced initialization for Node.js 18.x
initializePolyfills();

// Setup advanced error reporting
setupAdvancedErrorReporting();

// Check browser capabilities
const isCompatible = checkCompatibility();
const is3DCapable = check3DCapabilities();
const isSecure = isSecureContext();

console.log('🎮 Berlin Clock Initialization Report:', {
  compatible: isCompatible,
  secure: isSecure,
  webgl: is3DCapable.webgl,
  webgl2: is3DCapable.webgl2,
  maxTextureSize: is3DCapable.maxTextureSize,
  vendor: is3DCapable.vendor,
  renderer: is3DCapable.renderer
});

if (!isCompatible) {
  console.warn('⚠️ Some advanced features may not work optimally in this environment');
}

if (!isSecure) {
  console.warn('⚠️ Running in insecure context - some PWA features may be limited');
}

// Enhanced service worker registration with error handling
if ('serviceWorker' in navigator && isSecure) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service Worker registered successfully:', registration.scope);
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        console.log('🔄 Service Worker update found');
      });
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  });
}

// Performance monitoring setup
const perfMonitor = performance.mark ? (() => {
  performance.mark('app-init-start');
  return {
    markReady: () => performance.mark('app-ready'),
    measureInit: () => {
      try {
        performance.measure('app-initialization', 'app-init-start', 'app-ready');
        const measure = performance.getEntriesByName('app-initialization')[0];
        console.log(`⚡ App initialization took ${measure.duration.toFixed(2)}ms`);
      } catch (error) {
        console.warn('Performance measurement failed:', error);
      }
    }
  };
})() : null;

// React 18 concurrent features setup
const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>
);

// Mark app as ready for performance measurement
if (perfMonitor) {
  setTimeout(() => {
    perfMonitor.markReady();
    perfMonitor.measureInit();
  }, 100);
}