import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { fetchContent } from "@/lib/contentClient";

const FALLBACK_URL = "/assets/cv/Abu_Sufyan_CV.pdf";

const Resume = () => {
  const [pdfUrl, setPdfUrl] = useState<string>(FALLBACK_URL);

  useEffect(() => {
    document.title = "Resume — Md. Abu Sufyan";
    fetchContent<{ url?: string }>("cv_url", {}).then((v) => {
      if (v?.url) setPdfUrl(v.url);
    });
  }, []);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "Abu_Sufyan_CV.pdf";
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link to="/" aria-label="Back to portfolio">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
            <h1 className="text-lg font-semibold">Resume — Md. Abu Sufyan</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(pdfUrl, "_blank", "noopener,noreferrer")}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Open PDF
            </Button>
            <Button size="sm" onClick={handleDownload} className="bg-gradient-primary">
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-2 sm:px-4 py-4">
        <div className="w-full h-[calc(100vh-8rem)] rounded-lg overflow-hidden border shadow-sm bg-muted">
          <object
            data={`${pdfUrl}#view=FitH`}
            type="application/pdf"
            className="w-full h-full"
            aria-label="Md. Abu Sufyan Resume PDF"
          >
            <iframe
              src={`${pdfUrl}#view=FitH`}
              title="Resume PDF"
              className="w-full h-full border-0"
            />
            <div className="p-8 text-center">
              <p className="mb-4 text-muted-foreground">
                Your browser can't display the PDF inline.
              </p>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download Resume
              </Button>
            </div>
          </object>
        </div>
      </main>
    </div>
  );
};

export default Resume;
