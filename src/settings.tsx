import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Settings } from "@/pages/Settings.tsx";
import { ThemeProvider } from "./components/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark">
      <Settings />
    </ThemeProvider>
  </StrictMode>,
);
