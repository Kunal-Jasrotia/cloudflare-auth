import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

const container = document.getElementById("root") as HTMLElement;
createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);
