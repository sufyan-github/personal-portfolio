import type { Icon } from "@phosphor-icons/react";
import {
  AddressBookIcon,
  ArticleIcon,
  BooksIcon,
  BriefcaseIcon,
  CalendarCheckIcon,
  CertificateIcon,
  ChartBarIcon,
  ChatsCircleIcon,
  CodeIcon,
  CompassIcon,
  FactoryIcon,
  FlaskIcon,
  GearIcon,
  GithubLogoIcon,
  GraduationCapIcon,
  HandHeartIcon,
  HandshakeIcon,
  IdentificationCardIcon,
  ImagesIcon,
  ListBulletsIcon,
  MedalIcon,
  PathIcon,
  QuestionIcon,
  RobotIcon,
  RocketLaunchIcon,
  StarIcon,
  TargetIcon,
  TranslateIcon,
  TrophyIcon,
  UserFocusIcon,
  UsersThreeIcon,
  WrenchIcon,
} from "@phosphor-icons/react";
import { humanize } from "./content";

export interface SectionMeta {
  key: string;
  label: string;
  group: string;
  description: string;
  icon: Icon;
}

export const GROUPS = ["Profile", "Career", "Work", "Research", "Credentials", "Community", "Site"] as const;

type Entry = [group: (typeof GROUPS)[number], label: string, description: string, icon: Icon];

const REGISTRY: Record<string, Entry> = {
  hero: ["Profile", "Hero", "The first screen: name, title, summary, chips and buttons.", RocketLaunchIcon],
  about: ["Profile", "About", "Personal details, interests, languages and soft skills.", UserFocusIcon],
  contactInfo: ["Profile", "Contact details", "Email, phone, location and social links.", AddressBookIcon],
  availability: ["Profile", "Availability", "What you are open to, shown near the contact form.", CalendarCheckIcon],
  impact_stats: ["Profile", "Headline numbers", "The four figures shown under the hero.", ChartBarIcon],
  organizations: ["Profile", "Organizations", "The organization strip under the hero.", HandshakeIcon],

  experience: ["Career", "Experience", "Roles, employers, dates and responsibilities.", BriefcaseIcon],
  education: ["Career", "Education", "Degrees and schools.", GraduationCapIcon],
  timeline: ["Career", "Journey", "Milestones on the journey timeline.", PathIcon],
  industrial_attachment: ["Career", "Industrial training", "The industrial attachment section.", FactoryIcon],
  achievements: ["Career", "Achievements", "Achievement and milestone cards.", TrophyIcon],

  projects: ["Work", "Projects", "Project cards with technologies and links.", CodeIcon],
  skills: ["Work", "Skills", "Skill categories and the skills in each.", WrenchIcon],
  coding_profiles: ["Work", "Coding profiles", "LeetCode, Codeforces, HackerRank and GitHub cards.", TargetIcon],
  github: ["Work", "GitHub activity", "GitHub username and the activity section.", GithubLogoIcon],

  publications: ["Research", "Publications", "Papers with problem, method and result.", ArticleIcon],
  research_interests: ["Research", "Research interests", "Topics listed under research.", CompassIcon],
  ra_profile: ["Research", "Research assistant profile", "Group, department and supervisor.", FlaskIcon],

  certifications: ["Credentials", "Certificates", "Courses, recognitions and participation records.", CertificateIcon],

  memberships: ["Community", "Memberships", "Communities and professional engagement.", UsersThreeIcon],
  community_impact: ["Community", "Community impact", "Service statistics and initiatives.", HandHeartIcon],
  gallery: ["Community", "Gallery events", "Events and the photos shown for each.", ImagesIcon],

  navigation: ["Site", "Menu", "Menu items, site title and CV link.", ListBulletsIcon],
  translations: ["Site", "Translations", "English and Bangla interface text.", TranslateIcon],
  faq: ["Site", "FAQ", "Questions and answers used by the assistant.", QuestionIcon],
  ai_profile: ["Site", "Assistant knowledge", "Facts the AI assistant is allowed to use.", RobotIcon],
  site_settings: ["Site", "Site settings", "Turn the assistant, analytics and animation on or off.", GearIcon],
};

const FALLBACK_ICONS: Icon[] = [BooksIcon, StarIcon, MedalIcon, IdentificationCardIcon, ChatsCircleIcon];

// Every bundled collection is manageable. Collections added later appear
// automatically under "Site" without any change here.
export const CONTENT_KEYS = Object.keys(import.meta.glob("../data/*.json"))
  .map((path) => path.split("/").pop()!.replace(".json", ""))
  .sort();

// Sidebar order follows the registry above; unlisted collections come last.
const ORDER = Object.keys(REGISTRY);
const rank = (key: string) => (ORDER.includes(key) ? ORDER.indexOf(key) : ORDER.length);

export const SECTIONS: SectionMeta[] = [...CONTENT_KEYS].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b)).map((key, index) => {
  const entry = REGISTRY[key];
  if (entry) return { key, group: entry[0], label: entry[1], description: entry[2], icon: entry[3] };
  return {
    key,
    group: "Site",
    label: humanize(key),
    description: "Content shown on the public site.",
    icon: FALLBACK_ICONS[index % FALLBACK_ICONS.length],
  };
});

export const sectionByKey = (key: string) => SECTIONS.find((section) => section.key === key);

export async function loadBundled(key: string): Promise<unknown> {
  try {
    const mod = await import(`../data/${key}.json`);
    return mod.default ?? mod;
  } catch {
    return null;
  }
}
