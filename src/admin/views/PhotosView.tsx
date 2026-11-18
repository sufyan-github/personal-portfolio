import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@cloudflare/kumo/components/badge";
import { Button } from "@cloudflare/kumo/components/button";
import { Dialog } from "@cloudflare/kumo/components/dialog";
import { Empty } from "@cloudflare/kumo/components/empty";
import { Input, InputArea } from "@cloudflare/kumo/components/input";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { Loader } from "@cloudflare/kumo/components/loader";
import { Select } from "@cloudflare/kumo/components/select";
import { Switch } from "@cloudflare/kumo/components/switch";
import { ArrowsClockwiseIcon, CopyIcon, ImageIcon, ImagesIcon, PencilSimpleIcon, TrashIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import {
  adminDeletePhoto,
  adminListPhotos,
  adminUpdatePhoto,
  adminUploadPhoto,
  type PhotoCategory,
  type PortfolioPhoto,
} from "@/lib/contentClient";
import { notify, useConfirm } from "../feedback";

const CATEGORIES: Record<PhotoCategory, string> = {
  gallery: "Gallery",
  hero: "Hero highlights",
  profile: "Profile",
  asset: "Certificate or project image",
};

const BADGE: Record<PhotoCategory, "blue" | "orange" | "purple" | "teal"> = {
  gallery: "blue",
  hero: "orange",
  profile: "teal",
  asset: "purple",
};

export function PhotosView() {
  const confirm = useConfirm();
  const fileInput = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<PortfolioPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PhotoCategory | "all">("all");

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState<PhotoCategory>("gallery");
  const [eventName, setEventName] = useState("");
  const [uploading, setUploading] = useState(false);

  const [editing, setEditing] = useState<PortfolioPhoto | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setPhotos(await adminListPhotos());
    } catch (e) {
      notify.error("Could not load photos", (e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const choose = (next: File | null) => {
    setFile(next);
    setPreview(next ? URL.createObjectURL(next) : null);
  };

  const upload = async () => {
    if (!file || !caption.trim()) return;
    setUploading(true);
    try {
      await adminUploadPhoto(file, caption.trim(), tagline.trim(), category, eventName.trim() || undefined);
      notify.success("Photo uploaded", "It is now available on the site.");
      choose(null);
      setCaption("");
      setTagline("");
      setEventName("");
      if (fileInput.current) fileInput.current.value = "";
      await load();
    } catch (e) {
      notify.error("Upload failed", (e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const remove = async (photo: PortfolioPhoto) => {
    const ok = await confirm({
      title: "Delete this photo?",
      description: `“${photo.caption}” will be removed from the site and from storage. This cannot be undone.`,
    });
    if (!ok) return;
    try {
      await adminDeletePhoto(photo.id);
      setPhotos((list) => list.filter((item) => item.id !== photo.id));
      notify.success("Photo deleted");
    } catch (e) {
      notify.error("Could not delete", (e as Error).message);
    }
  };

  const copyAddress = async (photo: PortfolioPhoto) => {
    try {
      await navigator.clipboard.writeText(new URL(photo.url, window.location.origin).href);
      notify.success("Address copied", "Paste it into an image field in any section.");
    } catch {
      notify.error("Could not copy the address");
    }
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSavingEdit(true);
    try {
      await adminUpdatePhoto(editing.id, {
        caption: editing.caption,
        tagline: editing.tagline,
        published: editing.published,
        display_order: editing.display_order,
      });
      notify.success("Photo updated");
      setEditing(null);
      await load();
    } catch (e) {
      notify.error("Could not update", (e as Error).message);
    } finally {
      setSavingEdit(false);
    }
  };

  const shown = filter === "all" ? photos : photos.filter((photo) => photo.category === filter);

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1 className="adm-h1">Photos</h1>
          <p className="adm-muted">Upload images, set captions and order, and choose which ones are visible.</p>
        </div>
      </div>

      <LayerCard className="adm-card">
        <div className="adm-card-title adm-card-title-inset">Upload a photo</div>
        <div className="adm-upload">
          <div
            className="adm-dropzone"
            role="button"
            tabIndex={0}
            aria-label="Choose a photo"
            onClick={() => fileInput.current?.click()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                fileInput.current?.click();
              }
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              choose(event.dataTransfer.files?.[0] ?? null);
            }}
          >
            {preview ? (
              <img src={preview} alt="Selected photo preview" />
            ) : (
              <>
                <ImageIcon size={32} />
                <span>Click to choose, or drop an image here</span>
                <span className="adm-muted adm-small">JPG, PNG or WebP · up to 5 MB</span>
              </>
            )}
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={(event) => choose(event.target.files?.[0] ?? null)}
            />
          </div>
          <div className="adm-fields">
            <div className="adm-field adm-field-wide">
              <Input label="Caption" value={caption} placeholder="e.g. ML Workshop – Varendra University" onChange={(event) => setCaption(event.target.value)} />
            </div>
            <div className="adm-field adm-field-wide">
              <InputArea label="Description" value={tagline} minRows={2} autoResize maxRows={6} onValueChange={(next: string) => setTagline(next)} />
            </div>
            <div className="adm-field">
              <Select label="Used for" value={category} onValueChange={(next) => setCategory(((next as PhotoCategory | null) ?? "gallery"))} items={CATEGORIES} />
            </div>
            <div className="adm-field">
              <Input label="Event name" value={eventName} placeholder="Optional" onChange={(event) => setEventName(event.target.value)} />
            </div>
            <div className="adm-field adm-field-wide">
              <Button variant="primary" icon={<UploadSimpleIcon />} disabled={!file || !caption.trim()} loading={uploading} onClick={upload}>
                Upload photo
              </Button>
              {file && <span className="adm-muted adm-small adm-inline-note">{file.name} · {Math.round(file.size / 1024)} KB</span>}
            </div>
          </div>
        </div>
      </LayerCard>

      <LayerCard className="adm-card">
        <div className="adm-list-head">
          <span className="adm-list-title">Uploaded photos</span>
          <Badge variant="neutral">{photos.length}</Badge>
          <span className="adm-grow" />
          <div className="adm-filter">
            <Select
              aria-label="Filter photos"
              size="sm"
              value={filter}
              onValueChange={(next) => setFilter(((next as PhotoCategory | "all" | null) ?? "all"))}
              items={{ all: "All photos", ...CATEGORIES }}
            />
          </div>
          <Button variant="ghost" shape="square" size="sm" aria-label="Refresh" title="Refresh" icon={<ArrowsClockwiseIcon />} onClick={load} />
        </div>

        {loading ? (
          <div className="adm-center"><Loader size="lg" /></div>
        ) : shown.length === 0 ? (
          <Empty size="sm" icon={<ImagesIcon size={32} />} title="No photos here yet" description="Upload a photo above to get started." />
        ) : (
          <div className="adm-photo-grid">
            {shown.map((photo) => (
              <div key={photo.id} className="adm-photo">
                <div className="adm-photo-frame">
                  <img src={photo.url} alt={photo.caption} loading="lazy" />
                  <span className="adm-photo-badges">
                    <Badge variant={BADGE[photo.category] ?? "neutral"}>{CATEGORIES[photo.category] ?? photo.category}</Badge>
                    {!photo.published && <Badge variant="neutral">Hidden</Badge>}
                  </span>
                </div>
                <div className="adm-photo-meta">
                  <span className="adm-photo-caption" title={photo.caption}>{photo.caption}</span>
                  {photo.event_name && <span className="adm-muted adm-small">{photo.event_name}</span>}
                </div>
                <div className="adm-photo-actions">
                  <Button variant="secondary" size="sm" icon={<PencilSimpleIcon />} onClick={() => setEditing(photo)}>Edit</Button>
                  <Button variant="ghost" shape="square" size="sm" aria-label="Copy address" title="Copy address" icon={<CopyIcon />} onClick={() => copyAddress(photo)} />
                  <Button variant="ghost" shape="square" size="sm" aria-label="Delete photo" title="Delete" icon={<TrashIcon />} onClick={() => remove(photo)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </LayerCard>

      <Dialog.Root open={editing !== null} onOpenChange={(open) => { if (!open) setEditing(null); }}>
        <Dialog className="adm-dialog" size="base">
          <Dialog.Title className="adm-dialog-title">Edit photo</Dialog.Title>
          {editing && (
            <div className="adm-fields adm-dialog-body">
              <div className="adm-field adm-field-wide">
                <Input label="Caption" value={editing.caption} onChange={(event) => setEditing({ ...editing, caption: event.target.value })} />
              </div>
              <div className="adm-field adm-field-wide">
                <InputArea label="Description" value={editing.tagline ?? ""} minRows={2} autoResize maxRows={6} onValueChange={(next: string) => setEditing({ ...editing, tagline: next })} />
              </div>
              <div className="adm-field">
                <Input type="number" label="Display order" description="Lower numbers appear first." value={String(editing.display_order ?? 0)} onChange={(event) => setEditing({ ...editing, display_order: Number(event.target.value) || 0 })} />
              </div>
              <div className="adm-field adm-switch">
                <Switch label="Visible on the site" checked={editing.published} onCheckedChange={(checked: boolean) => setEditing({ ...editing, published: checked })} />
              </div>
            </div>
          )}
          <div className="adm-dialog-actions">
            <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
            <Button variant="primary" loading={savingEdit} onClick={saveEdit}>Save photo</Button>
          </div>
        </Dialog>
      </Dialog.Root>
    </div>
  );
}
