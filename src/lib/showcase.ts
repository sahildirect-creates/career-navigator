import { supabaseAdmin } from "./supabase";

export interface RoadmapNode {
  id: string;
  label: string;
  description: string;
  type: string;
  estimatedTime: string;
}

export interface Resource {
  title: string;
  url: string;
  type: string;
  platform: string;
  free: boolean;
  forNodes?: string[];
}

export interface ShowcaseNavigator {
  role_title: string;
  mode: string;
  roadmap_json: {
    nodes: RoadmapNode[];
    edges: { source: string; target: string }[];
  };
  resources_json: Resource[];
  public_slug: string;
  is_fallback: boolean;
}

// Pinned slugs for the three homepage showcase navigators.
// Generate via the dashboard while signed in as the project owner, then paste the
// resulting public_slug values below. Until populated, the homepage falls back to
// the hardcoded sample data further down.
const SHOWCASE_SLUGS = {
  "Product Designer":   "",
  "Content Strategist": "",
  "Brand Marketer":     "",
} as const;

export const SHOWCASE_ROLES = [
  "Product Designer",
  "Content Strategist",
  "Brand Marketer",
] as const;

export type ShowcaseRole = (typeof SHOWCASE_ROLES)[number];

// ─── Hardcoded fallbacks ──────────────────────────────────────────────────
// Used when the pinned slug is empty or the DB fetch fails. Keeps the homepage
// fully renderable even before the real showcases are generated.

const fallback = (
  role: string,
  nodes: RoadmapNode[],
  resources: Resource[]
): ShowcaseNavigator => ({
  role_title: role,
  mode: "title",
  roadmap_json: {
    nodes,
    edges: nodes.slice(0, -1).map((n, i) => ({
      source: n.id,
      target: nodes[i + 1].id,
    })),
  },
  resources_json: resources,
  public_slug: "",
  is_fallback: true,
});

const productDesignerFallback = fallback(
  "Product Designer",
  [
    { id: "1",  label: "UX Foundations",          description: "Core principles of user-centered design.",         type: "foundation", estimatedTime: "2 weeks" },
    { id: "2",  label: "Visual Design Basics",    description: "Color, type, layout, hierarchy.",                  type: "foundation", estimatedTime: "2 weeks" },
    { id: "3",  label: "Figma · Daily",           description: "Build fluency in the standard PD tool.",           type: "skill",      estimatedTime: "3 weeks" },
    { id: "4",  label: "Wireframing",             description: "Low-fidelity sketches that explore many ideas.",   type: "skill",      estimatedTime: "2 weeks" },
    { id: "5",  label: "First Portfolio Piece",   description: "Ship a small case study end to end.",              type: "skill",      estimatedTime: "3 weeks" },
    { id: "6",  label: "User Research 101",       description: "Interviews, surveys, usability testing.",          type: "skill",      estimatedTime: "2 weeks" },
    { id: "7",  label: "Design Systems",          description: "Tokens, components, documentation.",               type: "milestone",  estimatedTime: "3 weeks" },
    { id: "8",  label: "Three Case Studies",      description: "Round out a portfolio with breadth.",              type: "milestone",  estimatedTime: "6 weeks" },
    { id: "9",  label: "Interviewing Practice",   description: "Whiteboard, take-homes, behavioural.",             type: "skill",      estimatedTime: "2 weeks" },
    { id: "10", label: "Apply: Junior PD",        description: "Target junior product design roles.",              type: "goal",       estimatedTime: "Ongoing" },
  ],
  [
    { title: "Google UX Design Certificate",        url: "https://www.coursera.org/professional-certificates/google-ux-design", type: "course",    platform: "Coursera",     free: true,  forNodes: ["1"] },
    { title: "Refactoring UI",                       url: "https://www.refactoringui.com/",                                       type: "book",      platform: "Tailwind Labs", free: false, forNodes: ["2"] },
    { title: "Figma Learn",                          url: "https://help.figma.com/hc/en-us/categories/360002051613-Learn-design", type: "course",    platform: "Figma",         free: true,  forNodes: ["3"] },
    { title: "Daily UI Challenge",                   url: "https://www.dailyui.co/",                                              type: "tool",      platform: "Daily UI",      free: true,  forNodes: ["5"] },
    { title: "The User Experience Team of One",      url: "https://rosenfeldmedia.com/books/the-user-experience-team-of-one/",     type: "book",      platform: "Rosenfeld",     free: false, forNodes: ["6"] },
    { title: "Material Design Guidelines",           url: "https://m3.material.io/",                                              type: "tool",      platform: "Google",        free: true,  forNodes: ["7"] },
    { title: "Bestfolios",                           url: "https://www.bestfolios.com/",                                          type: "community", platform: "Bestfolios",    free: true,  forNodes: ["8"] },
    { title: "Designer Hangout Slack",               url: "https://www.designerhangout.co/",                                      type: "community", platform: "Slack",         free: true,  forNodes: ["9"] },
    { title: "ADPList Mentorship",                   url: "https://adplist.org/",                                                 type: "community", platform: "ADPList",       free: true,  forNodes: ["10"] },
    { title: "Don Norman: The Design of Everyday Things", url: "https://www.nngroup.com/books/design-everyday-things-revised/",   type: "book",      platform: "Basic Books",   free: false, forNodes: ["1"] },
  ]
);

const contentStrategistFallback = fallback(
  "Content Strategist",
  [
    { id: "1",  label: "Writing Fundamentals",     description: "Plain language, structure, audience.",            type: "foundation", estimatedTime: "2 weeks" },
    { id: "2",  label: "Editorial Thinking",       description: "Pitching, narrative arcs, voice.",                type: "foundation", estimatedTime: "2 weeks" },
    { id: "3",  label: "Content Strategy 101",     description: "Audits, governance, content models.",             type: "skill",      estimatedTime: "3 weeks" },
    { id: "4",  label: "SEO Foundations",          description: "Keywords, search intent, on-page SEO.",           type: "skill",      estimatedTime: "2 weeks" },
    { id: "5",  label: "First Long-Form Article",  description: "Ship a 1500-word piece you'd link to.",           type: "skill",      estimatedTime: "2 weeks" },
    { id: "6",  label: "Analytics for Writers",    description: "Read GA4 / Plausible, write better next time.",   type: "skill",      estimatedTime: "1 week"  },
    { id: "7",  label: "Brand Voice & Style",      description: "Build a usable style guide.",                     type: "milestone",  estimatedTime: "2 weeks" },
    { id: "8",  label: "Content Calendar",         description: "Plan and ship a 6-week content series.",          type: "milestone",  estimatedTime: "6 weeks" },
    { id: "9",  label: "Portfolio Site",           description: "Three pieces, plain prose intro, contact.",       type: "skill",      estimatedTime: "2 weeks" },
    { id: "10", label: "Apply: Editorial / Content Role", description: "Target junior editorial or content jobs.", type: "goal",       estimatedTime: "Ongoing" },
  ],
  [
    { title: "On Writing Well",                     url: "https://www.harpercollins.com/products/on-writing-well-william-zinsser",    type: "book",      platform: "Harper",         free: false, forNodes: ["1"] },
    { title: "The Elements of Style",               url: "https://www.bartleby.com/lit-hub/the-elements-of-style/",                   type: "book",      platform: "Bartleby",       free: true,  forNodes: ["1"] },
    { title: "Nieman Storyboard",                   url: "https://niemanstoryboard.org/",                                             type: "community", platform: "Nieman",         free: true,  forNodes: ["2"] },
    { title: "Content Strategy 101 (Brain Traffic)",url: "https://www.braintraffic.com/insights",                                     type: "course",    platform: "Brain Traffic",  free: true,  forNodes: ["3"] },
    { title: "Ahrefs SEO Course for Beginners",     url: "https://ahrefs.com/academy/seo-training-course",                            type: "course",    platform: "Ahrefs",         free: true,  forNodes: ["4"] },
    { title: "GA4 for Beginners",                   url: "https://analytics.google.com/analytics/academy/",                           type: "course",    platform: "Google Academy", free: true,  forNodes: ["6"] },
    { title: "Mailchimp Content Style Guide",       url: "https://styleguide.mailchimp.com/",                                         type: "tool",      platform: "Mailchimp",      free: true,  forNodes: ["7"] },
    { title: "Notion Content Calendar Template",    url: "https://www.notion.so/templates/category/marketing",                        type: "tool",      platform: "Notion",         free: true,  forNodes: ["8"] },
    { title: "Read.cv",                             url: "https://read.cv/",                                                          type: "tool",      platform: "Read.cv",        free: true,  forNodes: ["9"] },
    { title: "Editorial Freelancers Association Rates", url: "https://www.the-efa.org/rates/",                                        type: "tool",      platform: "EFA",            free: true,  forNodes: ["10"] },
  ]
);

const brandMarketerFallback = fallback(
  "Brand Marketer",
  [
    { id: "1",  label: "Brand Foundations",        description: "Positioning, voice, identity, story.",            type: "foundation", estimatedTime: "2 weeks" },
    { id: "2",  label: "Marketing Principles",     description: "STP, 4 Ps, funnel basics.",                       type: "foundation", estimatedTime: "2 weeks" },
    { id: "3",  label: "Consumer Research",        description: "Persona work, JTBD interviews.",                  type: "skill",      estimatedTime: "2 weeks" },
    { id: "4",  label: "Brand Storytelling",       description: "Write copy that sounds like a brand.",            type: "skill",      estimatedTime: "2 weeks" },
    { id: "5",  label: "First Campaign Brief",     description: "Brief a small fictional campaign end to end.",    type: "skill",      estimatedTime: "2 weeks" },
    { id: "6",  label: "Social & Community",       description: "Run a content calendar for a month.",             type: "skill",      estimatedTime: "4 weeks" },
    { id: "7",  label: "Brand Identity Project",   description: "Visual + verbal system for a fictional brand.",   type: "milestone",  estimatedTime: "3 weeks" },
    { id: "8",  label: "Measurement & Reporting",  description: "Set goals, read dashboards, write learnings.",    type: "skill",      estimatedTime: "2 weeks" },
    { id: "9",  label: "Portfolio Case Studies",   description: "Three case studies, briefs and outcomes.",        type: "milestone",  estimatedTime: "4 weeks" },
    { id: "10", label: "Apply: Marketing Associate / Brand", description: "Target junior brand or marketing roles.",  type: "goal",      estimatedTime: "Ongoing" },
  ],
  [
    { title: "Building a StoryBrand (Donald Miller)",url: "https://storybrand.com/",                                                  type: "book",      platform: "StoryBrand",     free: false, forNodes: ["1"] },
    { title: "Marty Neumeier: The Brand Gap",        url: "https://www.martyneumeier.com/the-brand-gap",                              type: "book",      platform: "Martin Neumeier",free: false, forNodes: ["1"] },
    { title: "HubSpot Inbound Marketing Course",     url: "https://academy.hubspot.com/courses/inbound-marketing",                    type: "course",    platform: "HubSpot Academy",free: true,  forNodes: ["2"] },
    { title: "Strategyzer Value Proposition Canvas", url: "https://www.strategyzer.com/library/the-value-proposition-canvas",         type: "tool",      platform: "Strategyzer",    free: true,  forNodes: ["3"] },
    { title: "Copywriting Examples",                 url: "https://www.copywritingexamples.com/",                                     type: "community", platform: "Cop. Examples",  free: true,  forNodes: ["4"] },
    { title: "Buffer Library",                       url: "https://buffer.com/library",                                               type: "community", platform: "Buffer",         free: true,  forNodes: ["6"] },
    { title: "Brand New (Under Consideration)",      url: "https://www.underconsideration.com/brandnew/",                             type: "community", platform: "UnderCons.",     free: true,  forNodes: ["7"] },
    { title: "Google Analytics Academy",             url: "https://analytics.google.com/analytics/academy/",                          type: "course",    platform: "Google Academy", free: true,  forNodes: ["8"] },
    { title: "MarketingProfs",                       url: "https://www.marketingprofs.com/",                                          type: "community", platform: "MarketingProfs", free: true,  forNodes: ["9"] },
    { title: "We Work Remotely — Marketing Jobs",    url: "https://weworkremotely.com/categories/remote-marketing-jobs",              type: "tool",      platform: "WWR",            free: true,  forNodes: ["10"] },
  ]
);

const FALLBACKS: Record<ShowcaseRole, ShowcaseNavigator> = {
  "Product Designer":   productDesignerFallback,
  "Content Strategist": contentStrategistFallback,
  "Brand Marketer":     brandMarketerFallback,
};

// ─── Server-side fetcher ──────────────────────────────────────────────────

async function fetchBySlug(slug: string): Promise<ShowcaseNavigator | null> {
  if (!slug) return null;
  try {
    const { data, error } = await supabaseAdmin
      .from("navigators")
      .select("role_title, mode, roadmap_json, resources_json, public_slug")
      .eq("public_slug", slug)
      .eq("is_public", true)
      .single();

    if (error || !data) return null;
    return { ...data, is_fallback: false } as ShowcaseNavigator;
  } catch {
    return null;
  }
}

export async function getShowcase(role: ShowcaseRole): Promise<ShowcaseNavigator> {
  const slug = SHOWCASE_SLUGS[role];
  const fetched = await fetchBySlug(slug);
  return fetched ?? FALLBACKS[role];
}

export async function getAllShowcases(): Promise<ShowcaseNavigator[]> {
  return Promise.all(SHOWCASE_ROLES.map(getShowcase));
}
