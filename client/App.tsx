import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import Activities from "./pages/Activities";
import Achievements from "./pages/Achievements";
import Battles from "./pages/Battles";
import Staking from "./pages/Staking";
import Profile from "./pages/Profile";
import SpinWin from "./pages/SpinWin";
import Runner from "./pages/Runner";
import { Web3Provider } from "@/components/wallet/Web3Provider";
import { AppLayout } from "@/components/layout/AppLayout";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="dark" storageKey="asimply-ui-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Web3Provider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Landing page without layout */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Dashboard and app routes with layout */}
              <Route path="/dashboard" element={
                <AppLayout>
                  <Index />
                </AppLayout>
              } />
              <Route path="/activities" element={
                <AppLayout>
                  <Activities />
                </AppLayout>
              } />
              <Route path="/achievements" element={
                <AppLayout>
                  <Achievements />
                </AppLayout>
              } />
              <Route path="/battles" element={
                <AppLayout>
                  <Battles />
                </AppLayout>
              } />
              <Route path="/staking" element={
                <AppLayout>
                  <Staking />
                </AppLayout>
              } />
              <Route path="/profile" element={
                <AppLayout>
                  <Profile />
                </AppLayout>
              } />
              <Route path="/games/spin-win" element={
                <AppLayout>
                  <SpinWin />
                </AppLayout>
              } />
              <Route path="/games/runner" element={
                <AppLayout>
                  <Runner />
                </AppLayout>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </Web3Provider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
