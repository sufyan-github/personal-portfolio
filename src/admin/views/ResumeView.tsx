import { useCallback, useEffect, useRef, useState } from "react";
import { Banner } from "@cloudflare/kumo/components/banner";
import { Button } from "@cloudflare/kumo/components/button";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { ArrowSquareOutIcon, FilePdfIcon, InfoIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import { adminGet, adminUploadCV } from "@/lib/contentClient";
import { formatDate } from "../content";
import { notify } from "../feedback";

const BUNDLED_CV = "/assets/cv/Abu_Sufyan_CV.pdf";
const MAX_BYTES = 10 * 1024 * 1024;

export function ResumeView() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [current, setCurrent] = useState<{ url: string; updatedAt?: number } | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    try {
      const result = await adminGet("cv_url");
      const value = result.value as { url?: string; updatedAt?: number } | null;
      setCurrent(value?.url ? { url: value.url, updatedAt: value.updatedAt } : { url: BUNDLED_CV });
    } catch {
      setCurrent({ url: BUNDLED_CV });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const tooLarge = !!file && file.size > MAX_BYTES;
  const notPdf = !!file && file.type !== "application/pdf";

  const upload = async () => {
    if (!file || tooLarge || notPdf) return;
    setUploading(true);
    try {
      await adminUploadCV(file);
      notify.success("CV replaced", "Visitors now get the new file.");
      setFile(null);
      if (fileInput.current) fileInput.current.value = "";
      await load();
    } catch (e) {
      notify.error("Upload failed", (e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="adm-page adm-page-narrow">
      <div className="adm-page-head">
        <div>
          <h1 className="adm-h1">CV / Resume</h1>
          <p className="adm-muted">The PDF visitors open from “View Resume” and “Download”.</p>
        </div>
      </div>

      <LayerCard className="adm-card">
        <div className="adm-card-title adm-card-title-inset">Current CV</div>
        <div className="adm-cv-row">
          <FilePdfIcon size={28} />
          <div className="adm-cv-meta">
            <span className="adm-strong">{current ? decodeURIComponent(current.url.split("/").pop() ?? "CV") : "Loading…"}</span>
            <span className="adm-muted adm-small">
              {current?.updatedAt ? `Replaced ${formatDate(current.updatedAt)}` : "Original file shipped with the site"}
            </span>
          </div>
          <span className="adm-grow" />
          {current && (
            <a className="adm-button-link" href={current.url} target="_blank" rel="noreferrer">
              <ArrowSquareOutIcon size={16} /> Open
            </a>
          )}
        </div>
      </LayerCard>

      <LayerCard className="adm-card">
        <div className="adm-card-title adm-card-title-inset">Replace with a new PDF</div>
        <Banner
          variant="secondary"
          icon={<InfoIcon weight="fill" />}
          title="Check the dates before you upload"
          description="The CV is public. Make sure its roles, dates and CGPA match what the site shows."
        />
        <div className="adm-file-row">
          <input
            ref={fileInput}
            className="adm-file"
            type="file"
            accept="application/pdf"
            aria-label="Choose a PDF"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </div>
        {file && (
          <p className={tooLarge || notPdf ? "adm-error adm-small" : "adm-muted adm-small"}>
            {notPdf ? "Please choose a PDF file." : tooLarge ? "This file is larger than 10 MB." : `${file.name} · ${Math.round(file.size / 1024)} KB`}
          </p>
        )}
        <div>
          <Button variant="primary" icon={<UploadSimpleIcon />} disabled={!file || tooLarge || notPdf} loading={uploading} onClick={upload}>
            Upload and replace
          </Button>
        </div>
      </LayerCard>
    </div>
  );
}
