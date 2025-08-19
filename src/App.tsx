import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { WelcomeHero } from "@/components/WelcomeHero";
import Dashboard from "./pages/Dashboard";
import FileManagement from "./pages/FileManagement";
import Scanner from "./pages/Scanner";
import LocationManagement from "./pages/LocationManagement";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<WelcomeHero />} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/files" element={<Layout><FileManagement /></Layout>} />
          <Route path="/scanner" element={<Layout><Scanner /></Layout>} />
          <Route path="/locations" element={<Layout><LocationManagement /></Layout>} />
          <Route path="/reports" element={<Layout><Reports /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
