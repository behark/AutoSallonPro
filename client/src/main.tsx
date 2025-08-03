import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// import { initializeSentry } from "./utils/errorMonitoring";
// import { initializeGA } from "./utils/analytics";
import { isProd } from "./utils/environment";

// Initialize error monitoring and analytics
// initializeSentry(); // Temporarily disabled due to compatibility issues

// Only initialize analytics in production to avoid affecting metrics during development
// if (isProd()) {
//   initializeGA(); // Temporarily disabled
// }

// Start mock service worker only in development mode
if (import.meta.env.MODE === "development") {
  import("./mocks/browser").then(({ worker }) => {
    worker.start({
      onUnhandledRequest: 'bypass'
    });
  }).catch(console.error);
}

// Performance mark for page load
performance.mark('app-start');

// Render the application
console.log("Starting React app initialization...");
const container = document.getElementById("root");
console.log("Container found:", container);
if (!container) {
  console.error("Root element not found!");
  throw new Error("Root element not found");
}

const root = createRoot(container);
console.log("Root created, rendering app...");
root.render(<App />);
console.log("App rendered successfully!");

// Performance measurement for total page initialization
performance.measure('app-initialization', 'app-start');

// Log initialization time in development
if (!isProd()) {
  const measurement = performance.getEntriesByName('app-initialization')[0];
  console.log(`App initialized in ${measurement.duration.toFixed(2)}ms`);
}
