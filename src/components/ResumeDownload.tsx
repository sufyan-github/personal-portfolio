import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { fetchContent } from "@/lib/contentClient";

const FALLBACK_URL = "/assets/cv/Abu_Sufyan_CV.pdf";

const ResumeDownload = () => {
  const { toast } = useToast();
  const [pdfUrl, setPdfUrl] = useState<string>(FALLBACK_URL);

  useEffect(() => {
    fetchContent<{ url?: string }>("cv_url", {}).then((v) => {
      if (v?.url) setPdfUrl(v.url);
    });
  }, []);

  const trackEvent = (event_type: string) => {
    try {
      (supabase.from as any)("analytics").insert([
        {
          event_type,
          metadata: {
            time: new Date().toISOString(),
            user_agent: navigator.userAgent,
          },
        },
      ]);
    } catch {
      /* best-effort */
    }
  };

  const handleView = () => {
    trackEvent("resume_view");
    // Open the in-app viewer in a new tab (same-origin, not blocked by ad blockers).
    window.open("/resume", "_blank", "noopener,noreferrer");
  };

  const handleDownload = () => {
    try {
      trackEvent("resume_download");
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "Abu_Sufyan_CV.pdf";
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: "Downloading Resume",
        description: "Thanks for your interest — the CV is downloading.",
      });
    } catch {
      toast({
        title: "Download Error",
        description: "Failed to download resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        onClick={handleView}
        size="lg"
        className="bg-gradient-primary hover:shadow-glow transition-all duration-300 group"
      >
        <Eye className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" />
        View Resume
      </Button>
      <Button
        onClick={handleDownload}
        size="lg"
        variant="outline"
        className="group"
        aria-label="Download Resume PDF"
      >
        <Download className="h-5 w-5 mr-2 transition-transform group-hover:translate-y-0.5" />
        Download
      </Button>
    </div>
  );
};

export default ResumeDownload;
