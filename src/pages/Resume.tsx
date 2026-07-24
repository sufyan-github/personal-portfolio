import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, ExternalLink, Loader2 } from "lucide-react";
import { fetchContent } from "@/lib/contentClient";

// Load pdf.js worker from CDN (matches the installed pdfjs-dist version).
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const FALLBACK_URL = "/assets/cv/Abu_Sufyan_CV.pdf";

const Resume = () => {
  const [pdfUrl, setPdfUrl] = useState<string>(FALLBACK_URL);
  const [numPages, setNumPages] = useState<number>(0);
  const [width, setWidth] = useState<number>(800);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Resume — Md. Abu Sufyan";
    fetchContent<{ url?: string }>("cv_url", {}).then((v) => {
      if (v?.url) setPdfUrl(v.url);
    });
  }, []);

  useEffect(() => {
    const compute = () => {
      const container = document.getElementById("pdf-container");
      const w = container ? container.clientWidth : window.innerWidth;
      setWidth(Math.min(1000, w - 32));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "Abu_Sufyan_CV.pdf";
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [pdfUrl]);

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

      <main className="flex-1">
        <div
          id="pdf-container"
          className="container mx-auto px-4 py-6 flex flex-col items-center gap-4"
        >
          <Document
            file={pdfUrl}
            onLoadSuccess={({ numPages }) => {
              setNumPages(numPages);
              setLoadError(null);
            }}
            onLoadError={(err) => {
              console.error("PDF load error:", err);
              setLoadError(err?.message || "Failed to load PDF");
            }}
            loading={
              <div className="flex items-center gap-2 text-muted-foreground py-16">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading resume...
              </div>
            }
            error={
              <div className="text-center py-16">
                <p className="mb-4 text-muted-foreground">
                  Couldn't display the PDF in this browser.
                  {loadError ? ` (${loadError})` : ""}
                </p>
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open(pdfUrl, "_blank", "noopener,noreferrer")
                    }
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Open in new tab
                  </Button>
                  <Button onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-1" />
                    Download PDF
                  </Button>
                </div>
              </div>
            }
          >
            {Array.from({ length: numPages }, (_, i) => (
              <div
                key={`page_${i + 1}`}
                className="mb-4 shadow-lg rounded-md overflow-hidden bg-white"
              >
                <Page
                  pageNumber={i + 1}
                  width={width}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
              </div>
            ))}
          </Document>
        </div>
      </main>
    </div>
  );
};

export default Resume;
