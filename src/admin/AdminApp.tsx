import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@cloudflare/kumo/components/button";
import { Input } from "@cloudflare/kumo/components/input";
import { LayerCard } from "@cloudflare/kumo/components/layer-card";
import { Sidebar } from "@cloudflare/kumo/components/sidebar";
import { Toasty } from "@cloudflare/kumo/components/toast";
import { TooltipProvider } from "@cloudflare/kumo/components/tooltip";
import {
  ArrowSquareOutIcon,
  EnvelopeSimpleIcon,
  EyeIcon,
  EyeSlashIcon,
  FilePdfIcon,
  HouseIcon,
  ImagesIcon,
  LockKeyIcon,
  MoonIcon,
  NotePencilIcon,
  QuotesIcon,
  SignOutIcon,
  SunIcon,
} from "@phosphor-icons/react";
import { adminLogin, getAdminToken, setAdminToken } from "@/lib/contentClient";
import { ConfirmProvider, notify, toastManager, useConfirm } from "./feedback";
import { GROUPS, SECTIONS, sectionByKey } from "./sections";
import { ContentView } from "./views/ContentView";
import { InboxView } from "./views/InboxView";
import { OverviewView } from "./views/OverviewView";
import { PhotosView } from "./views/PhotosView";
import { RecordsView } from "./views/RecordsView";
import { ResumeView } from "./views/ResumeView";

// ─── Routing (hash based, so the page works as a single static file) ───────
const readRoute = () => window.location.hash.replace(/^#\/?/, "") || "overview";

const ROUTE_TITLES: Record<string, string> = {
  overview: "Overview",
  photos: "Photos",
  resume: "CV / Resume",
  inbox: "Inbox",
  blog: "Blog",
  testimonials: "Testimonials",
};

// ─── Color mode ────────────────────────────────────────────────────────────
type Mode = "light" | "dark";
const currentMode = (): Mode => (document.documentElement.getAttribute("data-mode") === "dark" ? "dark" : "light");

function useMode(): [Mode, () => void] {
  const [mode, setMode] = useState<Mode>(currentMode);
  const toggle = () => {
    const next: Mode = mode === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-mode", next);
    try {
      localStorage.setItem("admin-theme", next);
    } catch {
      /* private browsing: the choice lasts for this visit only */
    }
    setMode(next);
  };
  return [mode, toggle];
}

// ─── Sign in ───────────────────────────────────────────────────────────────
function SignIn({ onSignedIn }: { onSignedIn: () => void }) {
  const [passphrase, setPassphrase] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await adminLogin(passphrase);
      setPassphrase("");
      onSignedIn();
    } catch (e) {
      setError((e as Error).message || "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-signin">
      <LayerCard className="adm-signin-card">
        <div className="adm-signin-mark"><LockKeyIcon size={22} weight="fill" /></div>
        <h1 className="adm-h1">Portfolio Admin</h1>
        <p className="adm-muted">Enter your passphrase to manage the site.</p>
        <form onSubmit={submit} className="adm-signin-form">
          <div className="adm-signin-field">
            <Input
              label="Passphrase"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              autoFocus
              required
              value={passphrase}
              error={error || undefined}
              onChange={(event) => setPassphrase(event.target.value)}
            />
            <button type="button" className="adm-signin-eye" aria-label={show ? "Hide passphrase" : "Show passphrase"} onClick={() => setShow((value) => !value)}>
              {show ? <EyeSlashIcon size={16} /> : <EyeIcon size={16} />}
            </button>
          </div>
          <Button type="submit" variant="primary" loading={busy} disabled={!passphrase}>Sign in</Button>
        </form>
        <a className="adm-muted adm-small adm-signin-back" href="/">← Back to the public site</a>
      </LayerCard>
    </div>
  );
}

// ─── Dashboard shell ───────────────────────────────────────────────────────
function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const confirm = useConfirm();
  const [route, setRoute] = useState(readRoute);
  const [edited, setEdited] = useState<Set<string>>(new Set());
  const [mode, toggleMode] = useMode();
  const dirty = useRef(false);
  const setDirty = useCallback((value: boolean) => {
    dirty.current = value;
  }, []);

  // Leaving a section with unsaved edits always asks first.
  const leaveOk = useCallback(async () => {
    if (!dirty.current) return true;
    return confirm({
      title: "Discard unsaved changes?",
      description: "You have changes that are not saved yet. If you leave now they are lost.",
      confirmLabel: "Discard changes",
    });
  }, [confirm]);

  const go = useCallback(async (next: string) => {
    if (next === readRoute()) return;
    if (!(await leaveOk())) return;
    dirty.current = false;
    window.location.hash = `/${next}`;
  }, [leaveOk]);

  useEffect(() => {
    const onHash = () => setRoute(readRoute());
    const onUnload = (event: BeforeUnloadEvent) => {
      if (dirty.current) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("hashchange", onHash);
    window.addEventListener("beforeunload", onUnload);
    return () => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("beforeunload", onUnload);
    };
  }, []);

  useEffect(() => {
    document.querySelector(".adm-main")?.scrollTo({ top: 0 });
  }, [route]);

  const signOut = async () => {
    if (!(await leaveOk())) return;
    setAdminToken(null);
    onSignOut();
  };

  const sectionKey = route.startsWith("content/") ? route.slice("content/".length) : null;
  const section = sectionKey ? sectionByKey(sectionKey) : undefined;
  const title = section?.label ?? ROUTE_TITLES[route] ?? "Overview";

  let view: JSX.Element;
  if (sectionKey && section) {
    view = <ContentView key={sectionKey} sectionKey={sectionKey} onDirtyChange={setDirty} onSaved={(key) => setEdited((set) => new Set(set).add(key))} />;
  } else if (route === "photos") view = <PhotosView />;
  else if (route === "resume") view = <ResumeView />;
  else if (route === "inbox") view = <InboxView />;
  else if (route === "blog") view = <RecordsView key="blog" table="blog_posts" onDirtyChange={setDirty} />;
  else if (route === "testimonials") view = <RecordsView key="testimonials" table="testimonials" onDirtyChange={setDirty} />;
  else view = <OverviewView go={go} />;

  return (
    <Sidebar.Provider defaultOpen className="adm-shell">
      <Sidebar>
        <Sidebar.Header>
          <div className="adm-brand">
            <span className="adm-brand-mark">AS</span>
            <span className="adm-brand-text">
              <span className="adm-strong">Portfolio Admin</span>
              <span className="adm-muted adm-small">abusufyan.online</span>
            </span>
          </div>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.Menu>
              <Sidebar.MenuButton icon={HouseIcon} tooltip="Overview" active={route === "overview"} onClick={() => go("overview")}>Overview</Sidebar.MenuButton>
            </Sidebar.Menu>
          </Sidebar.Group>

          {GROUPS.map((group) => {
            const items = SECTIONS.filter((item) => item.group === group);
            if (items.length === 0) return null;
            return (
              <Sidebar.Group key={group}>
                <Sidebar.GroupLabel>{group}</Sidebar.GroupLabel>
                <Sidebar.Menu>
                  {items.map((item) => (
                    <Sidebar.MenuButton
                      key={item.key}
                      icon={item.icon}
                      tooltip={item.label}
                      active={sectionKey === item.key}
                      onClick={() => go(`content/${item.key}`)}
                    >
                      {item.label}
                      {edited.has(item.key) && <span className="adm-dot" title="Saved in this session" />}
                    </Sidebar.MenuButton>
                  ))}
                </Sidebar.Menu>
              </Sidebar.Group>
            );
          })}

          <Sidebar.Group>
            <Sidebar.GroupLabel>Media</Sidebar.GroupLabel>
            <Sidebar.Menu>
              <Sidebar.MenuButton icon={ImagesIcon} tooltip="Photos" active={route === "photos"} onClick={() => go("photos")}>Photos</Sidebar.MenuButton>
              <Sidebar.MenuButton icon={FilePdfIcon} tooltip="CV / Resume" active={route === "resume"} onClick={() => go("resume")}>CV / Resume</Sidebar.MenuButton>
            </Sidebar.Menu>
          </Sidebar.Group>

          <Sidebar.Group>
            <Sidebar.GroupLabel>Engagement</Sidebar.GroupLabel>
            <Sidebar.Menu>
              <Sidebar.MenuButton icon={EnvelopeSimpleIcon} tooltip="Inbox" active={route === "inbox"} onClick={() => go("inbox")}>Inbox</Sidebar.MenuButton>
              <Sidebar.MenuButton icon={NotePencilIcon} tooltip="Blog" active={route === "blog"} onClick={() => go("blog")}>Blog</Sidebar.MenuButton>
              <Sidebar.MenuButton icon={QuotesIcon} tooltip="Testimonials" active={route === "testimonials"} onClick={() => go("testimonials")}>Testimonials</Sidebar.MenuButton>
            </Sidebar.Menu>
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Footer>
          <Sidebar.Menu>
            <Sidebar.MenuButton icon={SignOutIcon} tooltip="Sign out" onClick={signOut}>Sign out</Sidebar.MenuButton>
          </Sidebar.Menu>
        </Sidebar.Footer>
      </Sidebar>

      <div className="adm-main">
        <header className="adm-topbar">
          <Sidebar.Trigger />
          <span className="adm-crumb">
            <span className="adm-muted">{section ? section.group : "Admin"}</span>
            <span className="adm-muted">/</span>
            <span className="adm-strong">{title}</span>
          </span>
          <span className="adm-grow" />
          <a className="adm-button-link" href="/" target="_blank" rel="noreferrer">
            <ArrowSquareOutIcon size={16} /> <span className="adm-hide-narrow">View site</span>
          </a>
          <Button
            variant="ghost"
            shape="square"
            aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={mode === "dark" ? "Light mode" : "Dark mode"}
            icon={mode === "dark" ? <SunIcon /> : <MoonIcon />}
            onClick={toggleMode}
          />
        </header>
        <main className="adm-content">{view}</main>
      </div>
    </Sidebar.Provider>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────
export function AdminApp() {
  const [signedIn, setSignedIn] = useState(() => !!getAdminToken());

  useEffect(() => {
    const expire = () => {
      setSignedIn(false);
      notify.info("Session ended", "Please sign in again.");
    };
    window.addEventListener("admin-session-expired", expire);
    return () => window.removeEventListener("admin-session-expired", expire);
  }, []);

  return (
    <TooltipProvider>
      <Toasty toastManager={toastManager}>
        <ConfirmProvider>
          {signedIn ? (
            <Dashboard onSignOut={() => setSignedIn(false)} />
          ) : (
            <SignIn
              onSignedIn={() => {
                setSignedIn(true);
                notify.success("Signed in");
              }}
            />
          )}
        </ConfirmProvider>
      </Toasty>
    </TooltipProvider>
  );
}
