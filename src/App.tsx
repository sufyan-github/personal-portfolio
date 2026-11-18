import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Secondary routes load on demand so home-page visitors do not download
// the PDF viewer or the sitemap page.
const Sitemap = lazy(() => import("./pages/Sitemap"));
const Resume = lazy(() => import("./pages/Resume"));

const RouteFallback = () => (
  <div className="min-h-screen bg-background" role="status" aria-label="Loading page" />
);

// The admin dashboard is a separate page (admin.html) with its own styling.
// Cloudflare Pages serves it at /admin directly; this covers local development.
const AdminRedirect = () => {
  useEffect(() => {
    window.location.replace("/admin.html");
  }, []);
  return <RouteFallback />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/sitemap" element={<Sitemap />} />
              <Route path="/admin" element={<AdminRedirect />} />
              <Route path="/resume" element={<Resume />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
