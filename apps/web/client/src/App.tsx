import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import MyReports from "./pages/MyReports";
import NewReport from "./pages/NewReport";
import OperationsDashboard from "./pages/OperationsDashboard";
import OperationsReport from "./pages/OperationsReport";
import ForMunicipalities from "./pages/ForMunicipalities";
import HowItWorks from "./pages/HowItWorks";
import PilotInvitation from "./pages/PilotInvitation";
import ReportDetail from "./pages/ReportDetail";
import SensePortal from "./pages/SensePortal";
import EcosystemExplorer from "./pages/EcosystemExplorer";
import DomainReadiness from "./pages/DomainReadiness";
import ProgressDashboard from "./pages/ProgressDashboard";
import { getRootView } from "./lib/sensePortalRoute";

function RootPage() {
  const rootView = getRootView(window.location.search);
  if (rootView === "sense") return <SensePortal />;
  if (rootView === "explore") return <EcosystemExplorer />;
  if (rootView === "domain") return <DomainReadiness />;
  if (rootView === "progress") return <ProgressDashboard />;
  if (rootView === "operations") return <OperationsDashboard />;
  return <Home />;
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
      <Route path={"/بلاغ-جديد"} component={NewReport} />
      <Route path={"/بلاغاتي"} component={MyReports} />
      <Route path={"/بلاغاتي/:id"} component={ReportDetail} />
      <Route path={"/العمليات"} component={OperationsDashboard} />
      <Route path={"/العمليات/:id"} component={OperationsReport} />
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
