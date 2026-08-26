import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import ForMunicipalities from "./pages/ForMunicipalities";
import MyReports from "./pages/MyReports";
import NewReport from "./pages/NewReport";
import OperationsDashboard from "./pages/OperationsDashboard";
import OperationsReport from "./pages/OperationsReport";
import PilotInvitation from "./pages/PilotInvitation";
import ReportDetail from "./pages/ReportDetail";
import SensePortal from "./pages/SensePortal";
import EcosystemExplorer from "./pages/EcosystemExplorer";
import DomainReadiness from "./pages/DomainReadiness";
import ProgressDashboard from "./pages/ProgressDashboard";
import AccessControl from "./pages/AccessControl";
import CitizenStart from "./pages/CitizenStart";
import GrowthJourney from "./pages/GrowthJourney";
import LoyaltyExplainer from "./pages/LoyaltyExplainer";
import RefugeeContext from "./pages/RefugeeContext";
import WorkCompass from "./pages/WorkCompass";
import NationalContinuity from "./pages/NationalContinuity";
import RecoveryIdentity from "./pages/RecoveryIdentity";
import { getRootView } from "./lib/sensePortalRoute";

function RootPage() {
  const rootView = getRootView(window.location.search);
  if (rootView === "urban") return <Home />;
  if (rootView === "sense") return <SensePortal />;
  if (rootView === "explore") return <EcosystemExplorer />;
  if (rootView === "domain") return <DomainReadiness />;
  if (rootView === "progress") return <ProgressDashboard />;
  if (rootView === "operations") return <OperationsDashboard />;
  if (rootView === "access") return <AccessControl />;
  if (rootView === "citizen") return <CitizenStart />;
  if (rootView === "growth") return <GrowthJourney />;
  if (rootView === "loyalty") return <LoyaltyExplainer />;
  if (rootView === "refugees") return <RefugeeContext />;
  if (rootView === "work-compass") return <WorkCompass />;
  if (rootView === "continuity") return <NationalContinuity />;
  if (rootView === "recovery") return <RecoveryIdentity />;
  return <SensePortal />;
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={RootPage} />
      <Route path={"/sense"} component={SensePortal} />
      <Route path={"/منظومة-sense"} component={SensePortal} />
      <Route path={"/كيف-تعمل"} component={HowItWorks} />
      <Route path={"/للبلديات"} component={ForMunicipalities} />
      <Route path={"/التجربة"} component={PilotInvitation} />
      <Route path={"/ابدأ-بلاغ"} component={CitizenStart} />
      <Route path={"/بلاغ-جديد"} component={NewReport} />
      <Route path={"/بلاغاتي"} component={MyReports} />
      <Route path={"/بلاغاتي/:id"} component={ReportDetail} />
      <Route path={"/العمليات"} component={OperationsDashboard} />
      <Route path={"/العمليات/:id"} component={OperationsReport} />
      <Route path={"/بوصلة-العمل"} component={WorkCompass} />
      <Route path={"/الاستمرارية-الوطنية"} component={NationalContinuity} />
      <Route path={"/هوية-المنتج"} component={RecoveryIdentity} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <div dir="rtl" className="min-h-screen bg-[#f6f8f7] font-['Cairo'] text-slate-900">
            <Toaster richColors position="top-center" />
            <Router />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
