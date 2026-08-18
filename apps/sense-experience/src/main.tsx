import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { ProviderOnboardingApp } from "./ui/ProviderOnboardingApp.js";
import { TourismPublicSite } from "./ui/TourismPublicSite.js";

const root = document.getElementById("root");
if (!root) throw new Error("Missing root element.");

function AppRouter() {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const syncPath = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", syncPath);
    return () => window.removeEventListener("popstate", syncPath);
  }, []);

  function navigate(href: string) {
    window.history.pushState({}, "", href);
    setPathname(href);
  }

  if (pathname === "/انضم" || pathname === "/providers") return <ProviderOnboardingApp />;
  return <TourismPublicSite pathname={pathname} onNavigate={navigate} />;
}

createRoot(root).render(<StrictMode><AppRouter /></StrictMode>);
