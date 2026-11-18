// Shared helpers for the admin dashboard's form-based editors.
// Editors are generated from the shape of each collection, so every field is
// manageable through controls and nothing has to be edited as raw data.

export type ContentValue =
  | string
  | number
  | boolean
  | null
  | ContentValue[]
  | { [key: string]: ContentValue };

export type ContentObject = { [key: string]: ContentValue };

export const isObject = (value: unknown): value is ContentObject =>
  !!value && typeof value === "object" && !Array.isArray(value);

// ─── Labels ────────────────────────────────────────────────────────────────
const LABELS: Record<string, string> = {
  id: "ID",
  q: "Question",
  a: "Answer",
  cgpa: "CGPA",
  href: "Link",
  url: "Link",
  github_url: "GitHub link",
  demo_url: "Live demo link",
  image_url: "Image",
  image: "Image",
  logo: "Logo",
  avatar_url: "Photo",
  featured_image: "Cover image",
  paperUrl: "Paper link",
  conferenceUrl: "Conference link",
  profileUrl: "Profile link",
  profile_url: "Profile link",
  verificationUrl: "Verification link",
  credentialId: "Credential ID",
  cvUrl: "CV link",
  cvFileName: "CV file name",
  ctaText: "Button text",
  ctas: "Buttons",
  targetId: "Scrolls to section",
  project_type: "Project type",
  org: "Organization",
  en: "English",
  bn: "Bangla",
  nav: "Navigation",
  cta: "Button",
  systemPrompt: "Assistant instructions",
  siteTitle: "Site title",
  deptLine: "Department",
  ra_profile: "Research assistant profile",
  ai_profile: "Assistant knowledge",
  faq: "FAQ",
  contactInfo: "Contact details",
  impact_stats: "Headline numbers",
  site_settings: "Site settings",
  enableActiveHighlight: "Highlight the active menu item",
  showBackgroundIcons: "Show background icons",
  assistantEnabled: "Show the AI assistant",
  analyticsEnabled: "Record visitor analytics",
  animatedBackground: "Animated background",
  display_order: "Display order",
};

export function humanize(key: string): string {
  if (LABELS[key]) return LABELS[key];
  const spaced = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

// ─── Field classification ──────────────────────────────────────────────────
const LONG_TEXT = /description|summary|content|bio|problem|methodology|impact|excerpt|tagline|prompt|message|about|^a$|roles$|^education$|^projects$|^research$|^skills$|^certifications$|^contact$/i;
const IMAGE_KEY = /image|logo|avatar|photo/i;
const LINK_KEY = /url$|link$|href$|website$/i;
// Fields whose value must be one of a known set; edited with a dropdown.
const CHOICE_KEY = /^(kind|icon|type)$/;
// Free-text fields that benefit from suggestions drawn from existing entries.
const SUGGEST_KEY = /^(category|project_type|phase|issuer|company|conference|location|platform|proficiency|org|institution)$/;
// List fields that always hold sentences, never short tags.
const SENTENCE_LIST = /description|highlights|impact|images/i;

export type StringKind = "long" | "image" | "link" | "choice" | "suggest" | "text";

export function stringKind(key: string, value: string): StringKind {
  if (CHOICE_KEY.test(key)) return "choice";
  if (IMAGE_KEY.test(key) && !/alt|caption/i.test(key)) return "image";
  if (LINK_KEY.test(key)) return "link";
  if (value.length > 90 || LONG_TEXT.test(key)) return "long";
  if (SUGGEST_KEY.test(key)) return "suggest";
  return "text";
}

/** Short keyword lists are edited as tags; lists of sentences as rows. */
export function isTagList(key: string, values: string[]): boolean {
  if (SENTENCE_LIST.test(key)) return false;
  return values.every((item) => item.length <= 40 && !item.includes(","));
}

// ─── Value helpers ─────────────────────────────────────────────────────────
export function emptyLike(value: ContentValue): ContentValue {
  if (Array.isArray(value)) return [];
  if (isObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, emptyLike(child)]));
  }
  if (typeof value === "boolean") return false;
  if (typeof value === "number") return 0;
  return "";
}

/** Every key used by any entry, so optional fields are offered on all of them. */
export function mergedShape(items: ContentValue[]): ContentObject | undefined {
  const objects = items.filter(isObject);
  if (objects.length === 0) return undefined;
  const shape: ContentObject = {};
  for (const item of objects) {
    for (const [key, child] of Object.entries(item)) {
      const known = shape[key];
      const knownIsEmpty =
        known === undefined || known === null || known === "" || (Array.isArray(known) && known.length === 0);
      if (knownIsEmpty) shape[key] = child;
    }
  }
  return shape;
}

const TITLE_KEYS = ["title", "name", "label", "platform", "q", "question", "text", "caption", "subject", "company", "institution", "value", "year"];
const SUBTITLE_KEYS = ["company", "issuer", "org", "institution", "role", "subtitle", "conference", "period", "date", "year", "position", "proficiency", "username", "short", "href", "label", "context", "a"];

const firstText = (item: ContentObject, keys: string[], skip?: string): string => {
  for (const key of keys) {
    const value = item[key];
    if (key !== skip && (typeof value === "string" || typeof value === "number") && String(value).trim()) {
      return String(value);
    }
  }
  return "";
};

export function entryTitle(item: ContentValue, index: number, noun: string): string {
  if (typeof item === "string") return item || `${noun} ${index + 1}`;
  if (!isObject(item)) return `${noun} ${index + 1}`;
  return firstText(item, TITLE_KEYS) || `${noun} ${index + 1}`;
}

export function entrySubtitle(item: ContentValue): string {
  if (!isObject(item)) return "";
  const titleKey = TITLE_KEYS.find((key) => {
    const value = item[key];
    return (typeof value === "string" || typeof value === "number") && String(value).trim();
  });
  const parts: string[] = [];
  for (const key of SUBTITLE_KEYS) {
    if (key === titleKey) continue;
    const value = item[key];
    if ((typeof value === "string" || typeof value === "number") && String(value).trim()) {
      parts.push(String(value));
      if (parts.length === 2) break;
    }
  }
  return parts.join(" · ");
}

/** Singular noun for an entry in a list, e.g. "projects" → "project". */
export function singular(label: string): string {
  const lower = label.toLowerCase();
  if (lower.endsWith("ies")) return `${lower.slice(0, -3)}y`;
  if (lower.endsWith("ses")) return lower.slice(0, -2);
  if (lower.endsWith("s") && !lower.endsWith("ss")) return lower.slice(0, -1);
  return lower;
}

/** Distinct values already used for a field anywhere in a collection. */
export function collectChoices(root: ContentValue): Record<string, string[]> {
  const found: Record<string, Set<string>> = {};
  const walk = (value: ContentValue) => {
    if (Array.isArray(value)) value.forEach(walk);
    else if (isObject(value)) {
      for (const [key, child] of Object.entries(value)) {
        if (typeof child === "string" && child.trim() && (CHOICE_KEY.test(key) || SUGGEST_KEY.test(key))) {
          (found[key] ??= new Set()).add(child);
        } else walk(child);
      }
    }
  };
  walk(root);
  return Object.fromEntries(Object.entries(found).map(([key, set]) => [key, [...set].sort()]));
}

export function countEntries(value: ContentValue): number | null {
  if (Array.isArray(value)) return value.length;
  if (isObject(value)) {
    const lists = Object.values(value).filter((child) => Array.isArray(child) && child.some(isObject)) as ContentValue[][];
    if (lists.length === 1) return lists[0].length;
  }
  return null;
}

export function formatDate(value: string | number | undefined | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
