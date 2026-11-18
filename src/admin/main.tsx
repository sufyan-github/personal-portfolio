import { createRoot } from "react-dom/client";
// Kumo's precompiled stylesheet first, then the dashboard's own layout rules.
import "@cloudflare/kumo/styles/standalone";
import "./admin.css";
import { AdminApp } from "./AdminApp";

createRoot(document.getElementById("admin-root")!).render(<AdminApp />);
