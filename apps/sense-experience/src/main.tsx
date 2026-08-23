import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "./accessibility.css";
import { AccessibilityControls } from "./ui/AccessibilityControls.js";
import { AccessPlanner } from "./ui/AccessPlanner.js";
import { ClaimRegistryWorkspace } from "./ui/ClaimRegistryWorkspace.js";
import { ExperienceStudio } from "./ui/ExperienceStudio.js";
import { ProviderOnboardingApp } from "./ui/ProviderOnboardingApp.js";
import { TourismPublicSite } from "./ui/TourismPublicSite.js";
import { normalizePathname, resolveSenseRoute } from "./routing.js";

const root = document.getElementById("root");
if (!root) throw new Error("Missing root element.");

function AppRouter() {
  const [pathname, setPathname] = useState(() => normalizePathname(window.location.pathname));

  useEffect(() => {
    const syncPath = () => setPathname(normalizePathname(window.location.pathname));
    window.addEventListener("popstate", syncPath);
    return () => window.removeEventListener("popstate", syncPath);
  }, []);

  function navigate(href: string) {
    window.history.pushState({}, "", href);
    setPathname(href);
  }

  const route = resolveSenseRoute(pathname);
  const content = route === "reviewer-queue" ? <ProviderOnboardingApp initialScreen="reviewer" />
    : route === "provider-onboarding" ? <ProviderOnboardingApp />
      : route === "experience-studio" ? <ExperienceStudio onNavigate={navigate} />
        : route === "access-planner" ? <AccessPlanner onNavigate={navigate} />
          : route === "claim-registry" ? <ClaimRegistryWorkspace onNavigate={navigate} />
            : <TourismPublicSite pathname={pathname} onNavigate={navigate} />;

  return <><a className="skip-link" href="#main-content">انتقل إلى المحتوى الرئيسي</a><AccessibilityControls />{content}</>;
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => { void navigator.serviceWorker.register("/service-worker.js"); });
}

createRoot(root).render(<StrictMode><AppRouter /></StrictMode>);
