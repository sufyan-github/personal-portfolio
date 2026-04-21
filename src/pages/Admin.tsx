import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  adminGet,
  adminList,
  adminLogin,
  adminSave,
  adminUploadCV,
  getAdminToken,
  setAdminToken,
} from "@/lib/contentClient";
import { Lock, Save, Upload, LogOut, FileText, Loader2 } from "lucide-react";

// All content keys that the admin can edit (same as src/data/*.json filenames)
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

// Fallback: bundled JSON
async function loadFallback(key: string): Promise<unknown> {
  try {
    const mod = await import(`../data/${key}.json`);
    return mod.default ?? mod;
  } catch {
    return null;
  }
}

const Admin = () => {
  const { toast } = useToast();
  const [authed, setAuthed] = useState<boolean>(!!getAdminToken());
  const [passphrase, setPassphrase] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeKey, setActiveKey] = useState<string>("hero");
  const [editor, setEditor] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [uploadingCv, setUploadingCv] = useState(false);

  // Load list of already-saved keys (so admin sees what's customised)
  useEffect(() => {
    if (!authed) return;
    adminList()
      .then((items) => setSavedKeys(new Set(items.map((i) => i.content_key))))
      .catch(() => {});
  }, [authed]);

  // Load value when key changes
  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    (async () => {
      try {
        const r = await adminGet(activeKey);
        let value = r.value;
        if (value == null) value = await loadFallback(activeKey);
        setEditor(JSON.stringify(value ?? {}, null, 2));
      } catch (e) {
        toast({
          title: "Failed to load",
          description: (e as Error).message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [activeKey, authed, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    try {
      await adminLogin(passphrase);
      setAuthed(true);
      setPassphrase("");
      toast({ title: "Welcome back", description: "Admin session active." });
    } catch (err) {
      toast({
        title: "Login failed",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoggingIn(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const parsed = JSON.parse(editor);
      await adminSave(activeKey, parsed);
      setSavedKeys((s) => new Set(s).add(activeKey));
      toast({
        title: "Saved",
        description: `'${activeKey}' updated. Refresh the public site to see changes.`,
      });
    } catch (err) {
      toast({
        title: "Save failed",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUploadCv = async () => {
    if (!cvFile) return;
    setUploadingCv(true);
    try {
      const r = await adminUploadCV(cvFile);
      toast({
        title: "CV uploaded",
        description: "New CV is now available for download.",
      });
      setCvFile(null);
    } catch (err) {
      toast({
        title: "Upload failed",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setUploadingCv(false);
    }
  };

  const handleLogout = () => {
    setAdminToken(null);
    setAuthed(false);
  };

  if (!authed) {
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
              <Input
                type="password"
                placeholder="Secret passphrase"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                autoFocus
                required
              />
              <Button type="submit" className="w-full" disabled={loggingIn}>
                {loggingIn ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Lock className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Portfolio Admin</h1>
              <p className="text-xs text-muted-foreground">
                Edit any section, upload your CV, save instantly.
              </p>
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
            <TabsTrigger value="cv">CV / Resume</TabsTrigger>
          </TabsList>

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
                      <span className="capitalize">
                        {k.replace(/_/g, " ")}
                      </span>
                      {savedKeys.has(k) && (
                        <Badge variant="secondary" className="text-[10px]">
                          edited
                        </Badge>
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
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
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

          <TabsContent value="cv">
            <Card className="border-border/50 max-w-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4 text-primary" />
                  Update CV / Resume PDF
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Upload a new PDF — visitors will download the latest version
                  immediately.
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
                <Button
                  onClick={handleUploadCv}
                  disabled={!cvFile || uploadingCv}
                >
                  {uploadingCv ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
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
