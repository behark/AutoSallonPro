import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

if (process.env.NODE_ENV === "development") {
  import("./mocks/browser").then(({ worker }) => {
    worker.start();
  });
}

createRoot(document.getElementById("root")!).render(<App />);
