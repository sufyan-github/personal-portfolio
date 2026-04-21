import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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

  const handleDownload = async () => {
    try {
      // Track download analytics (best-effort)
      (supabase.from as any)("analytics").insert([
        {
          event_type: "resume_download",
          metadata: {
            download_time: new Date().toISOString(),
            user_agent: navigator.userAgent,
          },
        },
      ]);

      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = "Abu_Sufyan_CV.pdf";
      link.target = "_blank";
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Resume Downloaded!",
        description:
          "Thank you for your interest. The resume has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download Error",
        description: "Failed to download resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleDownload}
      size="lg"
      className="bg-gradient-primary hover:shadow-glow transition-all duration-300 group"
    >
      <Download className="h-5 w-5 mr-2 transition-transform group-hover:translate-y-0.5" />
      <FileText className="h-5 w-5 mr-2" />
      Download Resume
    </Button>
  );
};

export default ResumeDownload;
