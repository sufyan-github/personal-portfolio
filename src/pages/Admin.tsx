import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  adminGet,
  adminList,
  adminLogin,
  adminSave,
  adminUploadCV,
  adminUploadPhoto,
  adminListPhotos,
  adminDeletePhoto,
  getAdminToken,
  setAdminToken,
  type PortfolioPhoto,
  type PhotoCategory,
} from "@/lib/contentClient";
import {
  Lock,
  Save,
  Upload,
  LogOut,
  FileText,
  Loader2,
  Image as ImageIcon,
  Trash2,
  Camera,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";

// ─── Content sections the admin can edit ──────────────────────────────────
const CONTENT_KEYS = [
  "hero",
  "about",
  "experience",
  "skills",
  "projects",
  "certifications",
  "achievements",
  "memberships",
  "publications",
  "research_interests",
  "ra_profile",
  "gallery",
  "faq",
  "availability",
  "coding_profiles",
  "contactInfo",
  "github",
  "navigation",
  "translations",
];

async function loadFallback(key: string): Promise<unknown> {
  try {
    const mod = await import(`../data/${key}.json`);
    return mod.default ?? mod;
  } catch {
    return null;
  }
}

// ─── Login screen ─────────────────────────────────────────────────────────
const LoginCard = ({
  onLogin,
}: {
  onLogin: () => void;
}) => {
  const { toast } = useToast();
  const [passphrase, setPassphrase] = useState("");
  const [loggingIn, setLoggingIn]   = useState(false);
  const [show, setShow]             = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    try {
      await adminLogin(passphrase);
      onLogin();
      setPassphrase("");
      toast({ title: "Welcome back", description: "Admin session active." });
    } catch (err) {
      toast({
        title:       "Login failed",
        description: (err as Error).message,
        variant:     "destructive",
      });
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border/50 shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Admin Access</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your secret passphrase to manage portfolio content.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Input
                type={show ? "text" : "password"}
                placeholder="Secret passphrase"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                autoFocus
                required
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShow((s) => !s)}
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button type="submit" className="w-full" disabled={loggingIn}>
              {loggingIn ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// ─── Photo Manager Tab ─────────────────────────────────────────────────────
const PhotoManager = () => {
  const { toast }    = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photos,      setPhotos]      = useState<PortfolioPhoto[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [uploading,   setUploading]   = useState(false);
  const [deleting,    setDeleting]    = useState<string | null>(null);
  const [filterCat,   setFilterCat]   = useState<PhotoCategory | "all">("all");

  // Upload form state
  const [file,      setFile]      = useState<File | null>(null);
  const [preview,   setPreview]   = useState<string | null>(null);
  const [caption,   setCaption]   = useState("");
  const [tagline,   setTagline]   = useState("");
  const [category,  setCategory]  = useState<PhotoCategory>("gallery");
  const [eventName, setEventName] = useState("");

  const loadPhotos = async () => {
    setLoading(true);
    try {
      const all = await adminListPhotos();
      setPhotos(all);
    } catch (err) {
      toast({ title: "Failed to load photos", description: (err as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPhotos(); }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    if (!caption.trim()) { toast({ title: "Caption required", variant: "destructive" }); return; }
    setUploading(true);
    try {
      await adminUploadPhoto(file, caption, tagline, category, eventName || undefined);
      toast({ title: "Photo uploaded!", description: "Photo is now visible on the site." });
      // Reset form
      setFile(null);
      setPreview(null);
      setCaption("");
      setTagline("");
      setEventName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadPhotos();
    } catch (err) {
      toast({ title: "Upload failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this photo? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await adminDeletePhoto(id);
      setPhotos((p) => p.filter((x) => x.id !== id));
      toast({ title: "Photo deleted" });
    } catch (err) {
      toast({ title: "Delete failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setDeleting(null);
    }
  };

  const displayed = filterCat === "all" ? photos : photos.filter((p) => p.category === filterCat);

  return (
    <div className="space-y-6">
      {/* Upload Panel */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Camera className="h-4 w-4 text-primary" />
            Upload New Photo
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            JPG, PNG, or WebP — max 5 MB. Photos immediately appear on the site.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File picker + preview */}
            <div className="space-y-3">
              <div
                className="relative border-2 border-dashed border-border/60 hover:border-primary/50 rounded-xl flex flex-col items-center justify-center h-48 cursor-pointer transition-all group"
                onClick={() => fileInputRef.current?.click()}
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <>
                    <ImageIcon className="h-10 w-10 text-muted-foreground/40 group-hover:text-primary/60 mb-2 transition-colors" />
                    <p className="text-sm text-muted-foreground">Click to choose image</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">or drag & drop</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              {file && (
                <p className="text-xs text-muted-foreground">
                  {file.name} — {(file.size / 1024).toFixed(0)} KB
                </p>
              )}
            </div>

            {/* Form fields */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Caption *</label>
                <Input
                  placeholder="e.g. ML Workshop Trainers – VU CSE"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Tagline / Description</label>
                <Textarea
                  placeholder="Short description shown as overlay on the photo..."
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  rows={3}
                  className="resize-none text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Category</label>
                  <Select value={category} onValueChange={(v) => setCategory(v as PhotoCategory)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gallery">Gallery</SelectItem>
                      <SelectItem value="hero">Hero / Achievements</SelectItem>
                      <SelectItem value="profile">Profile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Event Name</label>
                  <Input
                    placeholder="e.g. VU Workshop 2025"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                  />
                </div>
              </div>
              <Button
                className="w-full"
                onClick={handleUpload}
                disabled={!file || !caption.trim() || uploading}
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                {uploading ? "Uploading…" : "Upload Photo"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photo Grid */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" />
              Uploaded Photos
              <Badge variant="secondary" className="ml-1">{photos.length}</Badge>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Manage your portfolio photos</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filterCat} onValueChange={(v) => setFilterCat(v as PhotoCategory | "all")}>
              <SelectTrigger className="w-32 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="gallery">Gallery</SelectItem>
                <SelectItem value="hero">Hero</SelectItem>
                <SelectItem value="profile">Profile</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" onClick={loadPhotos} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : displayed.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Camera className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No photos yet. Upload your first photo above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {displayed.map((photo) => (
                <motion.div
                  key={photo.id}
                  className="relative group rounded-xl overflow-hidden aspect-square bg-muted/20"
                  whileHover={{ scale: 1.03 }}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover"
                  />

                  {/* Category badge */}
                  <div className="absolute top-1.5 left-1.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium border ${
                      photo.category === "hero"    ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/40" :
                      photo.category === "gallery" ? "bg-blue-500/20 text-blue-300 border-blue-500/40" :
                      "bg-purple-500/20 text-purple-300 border-purple-500/40"
                    }`}>
                      {photo.category}
                    </span>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    <p className="text-white text-xs font-medium text-center line-clamp-2 leading-tight">
                      {photo.caption}
                    </p>
                    {photo.event_name && (
                      <p className="text-white/60 text-[10px] text-center">{photo.event_name}</p>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-7 text-xs mt-1"
                      onClick={() => handleDelete(photo.id)}
                      disabled={deleting === photo.id}
                    >
                      {deleting === photo.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3 mr-1" />
                      )}
                      Delete
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ─── Main Admin Page ───────────────────────────────────────────────────────
const Admin = () => {
  const { toast } = useToast();
  const [authed,     setAuthed]     = useState<boolean>(!!getAdminToken());
  const [activeKey,  setActiveKey]  = useState<string>("hero");
  const [editor,     setEditor]     = useState<string>("");
  const [loading,    setLoading]    = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [savedKeys,  setSavedKeys]  = useState<Set<string>>(new Set());
  const [cvFile,     setCvFile]     = useState<File | null>(null);
  const [uploadingCv,setUploadingCv]= useState(false);

  useEffect(() => {
    if (!authed) return;
    adminList()
      .then((items) => setSavedKeys(new Set(items.map((i) => i.content_key))))
      .catch(() => {});
  }, [authed]);

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    (async () => {
      try {
        const r     = await adminGet(activeKey);
        let value   = r.value;
        if (value == null) value = await loadFallback(activeKey);
        setEditor(JSON.stringify(value ?? {}, null, 2));
      } catch (e) {
        toast({ title: "Failed to load", description: (e as Error).message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  }, [activeKey, authed, toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const parsed = JSON.parse(editor);
      await adminSave(activeKey, parsed);
      setSavedKeys((s) => new Set(s).add(activeKey));
      toast({ title: "Saved", description: `'${activeKey}' updated. Refresh the public site.` });
    } catch (err) {
      toast({ title: "Save failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleUploadCv = async () => {
    if (!cvFile) return;
    setUploadingCv(true);
    try {
      await adminUploadCV(cvFile);
      toast({ title: "CV uploaded", description: "New CV is now available for download." });
      setCvFile(null);
    } catch (err) {
      toast({ title: "Upload failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setUploadingCv(false);
    }
  };

  const handleLogout = () => { setAdminToken(null); setAuthed(false); };

  if (!authed) {
    return <LoginCard onLogin={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Lock className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Portfolio Admin</h1>
              <p className="text-xs text-muted-foreground">Edit content, manage photos & CV</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList>
            <TabsTrigger value="content">Content sections</TabsTrigger>
            <TabsTrigger value="photos">
              <Camera className="h-4 w-4 mr-1.5" />
              Photos
            </TabsTrigger>
            <TabsTrigger value="cv">CV / Resume</TabsTrigger>
          </TabsList>

          {/* ── Content Editor ── */}
          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-12 gap-4">
              {/* Sidebar */}
              <Card className="col-span-12 lg:col-span-3 border-border/50">
                <CardHeader>
                  <CardTitle className="text-sm">Sections</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 max-h-[60vh] overflow-y-auto">
                  {CONTENT_KEYS.map((k) => (
                    <button
                      key={k}
                      onClick={() => setActiveKey(k)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                        activeKey === k
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted text-foreground/80"
                      }`}
                    >
                      <span className="capitalize">{k.replace(/_/g, " ")}</span>
                      {savedKeys.has(k) && (
                        <Badge variant="secondary" className="text-[10px]">edited</Badge>
                      )}
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Editor */}
              <Card className="col-span-12 lg:col-span-9 border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-base capitalize">
                      {activeKey.replace(/_/g, " ")}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      Edit the JSON below and save. Invalid JSON will be rejected.
                    </p>
                  </div>
                  <Button onClick={handleSave} disabled={saving || loading}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save changes
                  </Button>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : (
                    <Textarea
                      value={editor}
                      onChange={(e) => setEditor(e.target.value)}
                      className="font-mono text-xs h-[60vh] resize-none"
                      spellCheck={false}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Photo Manager ── */}
          <TabsContent value="photos">
            <PhotoManager />
          </TabsContent>

          {/* ── CV Upload ── */}
          <TabsContent value="cv">
            <Card className="border-border/50 max-w-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4 text-primary" />
                  Update CV / Resume PDF
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Upload a new PDF — visitors will download the latest version immediately.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
                />
                {cvFile && (
                  <p className="text-xs text-muted-foreground">
                    Selected: {cvFile.name} ({Math.round(cvFile.size / 1024)} KB)
                  </p>
                )}
                <Button onClick={handleUploadCv} disabled={!cvFile || uploadingCv}>
                  {uploadingCv ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                  Upload new CV
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
