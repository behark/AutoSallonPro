import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeSentry } from "./utils/errorMonitoring";
import { initializeGA } from "./utils/analytics";
import { isProd } from "./utils/environment";

// Initialize error monitoring and analytics
initializeSentry();

// Only initialize analytics in production to avoid affecting metrics during development
if (isProd()) {
  initializeGA();
}

// Start mock service worker in development mode
if (process.env.NODE_ENV === "development") {
  import("./mocks/browser").then(({ worker }) => {
    worker.start();
  });
}

// Performance mark for page load
performance.mark('app-start');

// Render the application
const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Performance measurement for total page initialization
performance.measure('app-initialization', 'app-start');

// Log initialization time in development
if (!isProd()) {
  const measurement = performance.getEntriesByName('app-initialization')[0];
  console.log(`App initialized in ${measurement.duration.toFixed(2)}ms`);
}
