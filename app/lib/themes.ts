// Theme configuration for landing page variants
// Each theme defines Tailwind classes for every section of the page

export interface StakeholderColorSet {
  bg: string;       // Light bg (icon area, hover)
  bgDark: string;   // Solid bg (card header bar)
  text: string;     // Text color
  check: string;    // Checkmark icon color
  border: string;   // Button border
  hoverBg: string;  // Button hover bg
}

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;

  // Logo & Header (hex values for CSS variables)
  logoFrom: string;
  logoTo: string;

  // Page
  pageBg: string;

  // Beta Banner
  bannerBg: string;
  bannerText: string;
  bannerBtn: string;
  bannerClose: string;

  // Hero
  heroBg: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtext: string;
  heroPrimaryBtn: string;
  heroSecondaryBtn: string;
  heroTrustText: string;
  heroTrustIcon: string;

  // Light sections (Who We Serve, Communication, How It Works)
  lightBg: string;
  lightBadgeBg: string;
  lightBadgeText: string;
  lightTitle: string;
  lightSubtext: string;
  lightCheckIcon: string;

  // Cards (light bg sections)
  cardShadow: string;
  cardText: string;
  cardSubtext: string;

  // Stakeholder card colors (one per stakeholder in order)
  stakeholderCardBorder: string;
  stakeholderColors: StakeholderColorSet[];

  // Gradient sections (Capabilities, Funding, CTA)
  gradientBg: string;
  gradientTitle: string;
  gradientSubtext: string;
  gradientBadgeBg: string;
  gradientBadgeText: string;
  gradientCardBg: string;
  gradientCardIconBg: string;
  gradientCardIconColor: string;
  gradientCardTitle: string;
  gradientCardText: string;
  gradientLiveBadgeBg: string;
  gradientLiveBadgeText: string;
  gradientPillBg: string;
  gradientPillBorder: string;
  gradientPillText: string;
  gradientPillIcon: string;
  gradientBtn: string;
  gradientBtnText: string;

  // Dark sections (AI Workflows, Roadmap)
  darkBg: string;
  darkTitle: string;
  darkSubtext: string;
  darkBadgeBg: string;
  darkBadgeText: string;
  darkCardBg: string;
  darkCardHover: string;
  darkIconBg: string;
  darkIconColor: string;
  darkCardTitle: string;
  darkCardText: string;

  // How It Works
  processStepBg: string;
  processStepText: string;
  processConnector: string;

  // Roadmap
  roadmapLiveBg: string;
  roadmapCardBg: string;
  roadmapLiveBadge: string;
  roadmapCheckColor: string;
  roadmapClockColor: string;

  // Communication visual
  commVisualBg: string;
  commVisualBorder: string;
  commCardBg: string;
  commCardBorder: string;

  // Funding sub-section (separate gradient possible)
  fundingGradientBg: string;
  fundingSubtext: string;
  fundingDetailText: string;
  fundingIconBg: string;
  fundingStepBg: string;
  fundingStepCircle: string;

  // Final CTA
  ctaGradientBg: string;
  ctaTitle: string;
  ctaSubtext: string;
  ctaBtn: string;
  ctaTrustText: string;
}

// ─────────────────────────────────────────────
// Theme 1: Blue Steel (Current)
// ─────────────────────────────────────────────
const blueSteel: ThemeConfig = {
  id: "blue-steel",
  name: "Blue Steel",
  description: "Current blue-indigo theme",

  logoFrom: "#2563eb",
  logoTo: "#4f46e5",

  pageBg: "bg-white",

  bannerBg: "bg-blue-600",
  bannerText: "text-white",
  bannerBtn: "bg-white text-blue-600 hover:bg-blue-50",
  bannerClose: "hover:bg-white/20",

  heroBg: "bg-gradient-to-b from-slate-50 to-white",
  heroTitle: "text-slate-900",
  heroHighlight: "bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent",
  heroSubtext: "text-slate-600",
  heroPrimaryBtn: "bg-blue-600 hover:bg-blue-700 text-white",
  heroSecondaryBtn: "border-slate-300 text-slate-700 hover:bg-slate-50",
  heroTrustText: "text-slate-500",
  heroTrustIcon: "text-green-500",

  lightBg: "bg-gradient-to-b from-slate-50 to-white",
  lightBadgeBg: "bg-blue-100",
  lightBadgeText: "text-blue-700",
  lightTitle: "text-slate-900",
  lightSubtext: "text-slate-600",
  lightCheckIcon: "text-blue-500",

  cardShadow: "shadow-lg hover:shadow-xl",
  cardText: "text-slate-900",
  cardSubtext: "text-slate-600",
  stakeholderCardBorder: "border-0",
  stakeholderColors: [
    { bg: "bg-blue-50", bgDark: "bg-blue-600", text: "text-blue-600", check: "text-blue-500", border: "border-blue-200", hoverBg: "hover:bg-blue-50" },
    { bg: "bg-green-50", bgDark: "bg-green-600", text: "text-green-600", check: "text-green-500", border: "border-green-200", hoverBg: "hover:bg-green-50" },
    { bg: "bg-purple-50", bgDark: "bg-purple-600", text: "text-purple-600", check: "text-purple-500", border: "border-purple-200", hoverBg: "hover:bg-purple-50" },
    { bg: "bg-emerald-50", bgDark: "bg-emerald-600", text: "text-emerald-600", check: "text-emerald-500", border: "border-emerald-200", hoverBg: "hover:bg-emerald-50" },
  ],

  gradientBg: "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700",
  gradientTitle: "text-white",
  gradientSubtext: "text-blue-100",
  gradientBadgeBg: "bg-white/20",
  gradientBadgeText: "text-white",
  gradientCardBg: "bg-white/10 backdrop-blur-sm",
  gradientCardIconBg: "bg-white/20",
  gradientCardIconColor: "text-white",
  gradientCardTitle: "text-white",
  gradientCardText: "text-blue-100",
  gradientLiveBadgeBg: "bg-green-500",
  gradientLiveBadgeText: "text-white",
  gradientPillBg: "bg-white/10 backdrop-blur-sm",
  gradientPillBorder: "border-white/20",
  gradientPillText: "text-white",
  gradientPillIcon: "text-blue-200",
  gradientBtn: "bg-white",
  gradientBtnText: "text-blue-600",

  darkBg: "bg-slate-900",
  darkTitle: "text-white",
  darkSubtext: "text-slate-400",
  darkBadgeBg: "bg-indigo-500/20",
  darkBadgeText: "text-indigo-300",
  darkCardBg: "bg-slate-800",
  darkCardHover: "hover:bg-slate-700/80",
  darkIconBg: "bg-indigo-500/20",
  darkIconColor: "text-indigo-400",
  darkCardTitle: "text-white",
  darkCardText: "text-slate-400",

  processStepBg: "bg-blue-600",
  processStepText: "text-white",
  processConnector: "bg-slate-200",

  roadmapLiveBg: "bg-blue-600",
  roadmapCardBg: "bg-slate-800",
  roadmapLiveBadge: "bg-white/20 text-white",
  roadmapCheckColor: "text-green-400",
  roadmapClockColor: "text-slate-500",

  commVisualBg: "bg-slate-50",
  commVisualBorder: "border-slate-200",
  commCardBg: "bg-white",
  commCardBorder: "border-slate-100",

  fundingGradientBg: "bg-gradient-to-br from-blue-600 to-indigo-700",
  fundingSubtext: "text-blue-100",
  fundingDetailText: "text-blue-200",
  fundingIconBg: "bg-white/10",
  fundingStepBg: "bg-white/10",
  fundingStepCircle: "bg-white/20",

  ctaGradientBg: "bg-gradient-to-br from-blue-600 to-indigo-700",
  ctaTitle: "text-white",
  ctaSubtext: "text-blue-100",
  ctaBtn: "bg-white text-blue-600 hover:bg-blue-50",
  ctaTrustText: "text-blue-200",
};

// ─────────────────────────────────────────────
// Theme 2: Gradient Glass (Capabilities-style hero)
// ─────────────────────────────────────────────
const gradientGlass: ThemeConfig = {
  id: "gradient-glass",
  name: "Gradient Glass",
  description: "Platform capabilities style throughout",

  logoFrom: "#6366f1",
  logoTo: "#a855f7",

  pageBg: "bg-slate-950",

  bannerBg: "bg-indigo-600",
  bannerText: "text-white",
  bannerBtn: "bg-white text-indigo-600 hover:bg-indigo-50",
  bannerClose: "hover:bg-white/20",

  heroBg: "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700",
  heroTitle: "text-white",
  heroHighlight: "text-white underline decoration-white/40 decoration-4 underline-offset-8",
  heroSubtext: "text-blue-100",
  heroPrimaryBtn: "bg-white text-indigo-600 hover:bg-blue-50",
  heroSecondaryBtn: "border-white/30 text-white hover:bg-white/10",
  heroTrustText: "text-blue-200",
  heroTrustIcon: "text-green-400",

  lightBg: "bg-slate-950",
  lightBadgeBg: "bg-indigo-500/20",
  lightBadgeText: "text-indigo-300",
  lightTitle: "text-white",
  lightSubtext: "text-slate-400",
  lightCheckIcon: "text-indigo-400",

  cardShadow: "shadow-xl shadow-indigo-500/5",
  cardText: "text-white",
  cardSubtext: "text-slate-300",
  stakeholderCardBorder: "border border-white/10 bg-white/5 backdrop-blur-sm",
  stakeholderColors: [
    { bg: "bg-indigo-500/20", bgDark: "bg-indigo-600", text: "text-indigo-300", check: "text-indigo-400", border: "border-indigo-500/30", hoverBg: "hover:bg-indigo-500/10" },
    { bg: "bg-violet-500/20", bgDark: "bg-violet-600", text: "text-violet-300", check: "text-violet-400", border: "border-violet-500/30", hoverBg: "hover:bg-violet-500/10" },
    { bg: "bg-cyan-500/20", bgDark: "bg-cyan-600", text: "text-cyan-300", check: "text-cyan-400", border: "border-cyan-500/30", hoverBg: "hover:bg-cyan-500/10" },
    { bg: "bg-fuchsia-500/20", bgDark: "bg-fuchsia-600", text: "text-fuchsia-300", check: "text-fuchsia-400", border: "border-fuchsia-500/30", hoverBg: "hover:bg-fuchsia-500/10" },
  ],

  gradientBg: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600",
  gradientTitle: "text-white",
  gradientSubtext: "text-indigo-100",
  gradientBadgeBg: "bg-white/20",
  gradientBadgeText: "text-white",
  gradientCardBg: "bg-white/10 backdrop-blur-md",
  gradientCardIconBg: "bg-white/20",
  gradientCardIconColor: "text-white",
  gradientCardTitle: "text-white",
  gradientCardText: "text-indigo-100",
  gradientLiveBadgeBg: "bg-green-500",
  gradientLiveBadgeText: "text-white",
  gradientPillBg: "bg-white/10 backdrop-blur-sm",
  gradientPillBorder: "border-white/20",
  gradientPillText: "text-white",
  gradientPillIcon: "text-indigo-200",
  gradientBtn: "bg-white",
  gradientBtnText: "text-indigo-600",

  darkBg: "bg-slate-950",
  darkTitle: "text-white",
  darkSubtext: "text-slate-400",
  darkBadgeBg: "bg-purple-500/20",
  darkBadgeText: "text-purple-300",
  darkCardBg: "bg-white/5 backdrop-blur-sm border border-white/10",
  darkCardHover: "hover:bg-white/10",
  darkIconBg: "bg-indigo-500/20",
  darkIconColor: "text-indigo-400",
  darkCardTitle: "text-white",
  darkCardText: "text-slate-400",

  processStepBg: "bg-indigo-600",
  processStepText: "text-white",
  processConnector: "bg-white/20",

  roadmapLiveBg: "bg-indigo-600",
  roadmapCardBg: "bg-white/5 border border-white/10",
  roadmapLiveBadge: "bg-white/20 text-white",
  roadmapCheckColor: "text-green-400",
  roadmapClockColor: "text-slate-500",

  commVisualBg: "bg-white/5",
  commVisualBorder: "border-white/10",
  commCardBg: "bg-white/10 backdrop-blur-sm",
  commCardBorder: "border-white/10",

  fundingGradientBg: "bg-gradient-to-br from-purple-600 to-pink-600",
  fundingSubtext: "text-purple-100",
  fundingDetailText: "text-purple-200",
  fundingIconBg: "bg-white/10",
  fundingStepBg: "bg-white/10",
  fundingStepCircle: "bg-white/20",

  ctaGradientBg: "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700",
  ctaTitle: "text-white",
  ctaSubtext: "text-blue-100",
  ctaBtn: "bg-white text-indigo-600 hover:bg-blue-50",
  ctaTrustText: "text-blue-200",
};

// ─────────────────────────────────────────────
// Theme 3: Burnt Orange (Logo colors)
// ─────────────────────────────────────────────
const burntOrange: ThemeConfig = {
  id: "burnt-orange",
  name: "Burnt Orange",
  description: "Orange primary, blue secondary, purple accent",

  logoFrom: "#f97316",
  logoTo: "#ea580c",

  pageBg: "bg-white",

  bannerBg: "bg-orange-600",
  bannerText: "text-white",
  bannerBtn: "bg-white text-orange-600 hover:bg-orange-50",
  bannerClose: "hover:bg-white/20",

  heroBg: "bg-gradient-to-b from-orange-50 to-white",
  heroTitle: "text-slate-900",
  heroHighlight: "bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent",
  heroSubtext: "text-slate-600",
  heroPrimaryBtn: "bg-orange-500 hover:bg-orange-600 text-white",
  heroSecondaryBtn: "border-orange-200 text-orange-700 hover:bg-orange-50",
  heroTrustText: "text-slate-500",
  heroTrustIcon: "text-orange-500",

  lightBg: "bg-gradient-to-b from-orange-50/50 to-white",
  lightBadgeBg: "bg-orange-100",
  lightBadgeText: "text-orange-700",
  lightTitle: "text-slate-900",
  lightSubtext: "text-slate-600",
  lightCheckIcon: "text-orange-500",

  cardShadow: "shadow-lg hover:shadow-xl",
  cardText: "text-slate-900",
  cardSubtext: "text-slate-600",
  stakeholderCardBorder: "border-0",
  stakeholderColors: [
    { bg: "bg-orange-50", bgDark: "bg-orange-500", text: "text-orange-600", check: "text-orange-500", border: "border-orange-200", hoverBg: "hover:bg-orange-50" },
    { bg: "bg-blue-50", bgDark: "bg-blue-600", text: "text-blue-600", check: "text-blue-500", border: "border-blue-200", hoverBg: "hover:bg-blue-50" },
    { bg: "bg-purple-50", bgDark: "bg-purple-600", text: "text-purple-600", check: "text-purple-500", border: "border-purple-200", hoverBg: "hover:bg-purple-50" },
    { bg: "bg-emerald-50", bgDark: "bg-emerald-600", text: "text-emerald-600", check: "text-emerald-500", border: "border-emerald-200", hoverBg: "hover:bg-emerald-50" },
  ],

  gradientBg: "bg-gradient-to-br from-orange-500 via-orange-600 to-blue-700",
  gradientTitle: "text-white",
  gradientSubtext: "text-orange-100",
  gradientBadgeBg: "bg-white/20",
  gradientBadgeText: "text-white",
  gradientCardBg: "bg-white/10 backdrop-blur-sm",
  gradientCardIconBg: "bg-white/20",
  gradientCardIconColor: "text-white",
  gradientCardTitle: "text-white",
  gradientCardText: "text-orange-100",
  gradientLiveBadgeBg: "bg-green-500",
  gradientLiveBadgeText: "text-white",
  gradientPillBg: "bg-white/10 backdrop-blur-sm",
  gradientPillBorder: "border-white/20",
  gradientPillText: "text-white",
  gradientPillIcon: "text-orange-200",
  gradientBtn: "bg-white",
  gradientBtnText: "text-orange-600",

  darkBg: "bg-slate-900",
  darkTitle: "text-white",
  darkSubtext: "text-slate-400",
  darkBadgeBg: "bg-orange-500/20",
  darkBadgeText: "text-orange-300",
  darkCardBg: "bg-slate-800",
  darkCardHover: "hover:bg-slate-700/80",
  darkIconBg: "bg-orange-500/20",
  darkIconColor: "text-orange-400",
  darkCardTitle: "text-white",
  darkCardText: "text-slate-400",

  processStepBg: "bg-orange-500",
  processStepText: "text-white",
  processConnector: "bg-orange-200",

  roadmapLiveBg: "bg-orange-500",
  roadmapCardBg: "bg-slate-800",
  roadmapLiveBadge: "bg-white/20 text-white",
  roadmapCheckColor: "text-green-400",
  roadmapClockColor: "text-slate-500",

  commVisualBg: "bg-orange-50",
  commVisualBorder: "border-orange-200",
  commCardBg: "bg-white",
  commCardBorder: "border-orange-100",

  fundingGradientBg: "bg-gradient-to-br from-blue-600 to-purple-700",
  fundingSubtext: "text-blue-100",
  fundingDetailText: "text-blue-200",
  fundingIconBg: "bg-white/10",
  fundingStepBg: "bg-white/10",
  fundingStepCircle: "bg-white/20",

  ctaGradientBg: "bg-gradient-to-br from-orange-500 to-orange-700",
  ctaTitle: "text-white",
  ctaSubtext: "text-orange-100",
  ctaBtn: "bg-white text-orange-600 hover:bg-orange-50",
  ctaTrustText: "text-orange-200",
};

// ─────────────────────────────────────────────
// Theme 4: Dark Navy (Logo background style)
// ─────────────────────────────────────────────
const darkNavy: ThemeConfig = {
  id: "dark-navy",
  name: "Dark Navy",
  description: "Dark navy with orange accents from logo",

  logoFrom: "#f97316",
  logoTo: "#f59e0b",

  pageBg: "bg-[#0B1426]",

  bannerBg: "bg-orange-500",
  bannerText: "text-white",
  bannerBtn: "bg-[#0B1426] text-orange-400 hover:bg-[#162033]",
  bannerClose: "hover:bg-white/20",

  heroBg: "bg-gradient-to-b from-[#0B1426] to-[#111D32]",
  heroTitle: "text-white",
  heroHighlight: "bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent",
  heroSubtext: "text-slate-400",
  heroPrimaryBtn: "bg-orange-500 hover:bg-orange-600 text-white",
  heroSecondaryBtn: "border-slate-600 text-slate-300 hover:bg-white/5",
  heroTrustText: "text-slate-500",
  heroTrustIcon: "text-orange-400",

  lightBg: "bg-[#0F1A2E]",
  lightBadgeBg: "bg-orange-500/15",
  lightBadgeText: "text-orange-400",
  lightTitle: "text-white",
  lightSubtext: "text-slate-400",
  lightCheckIcon: "text-orange-400",

  cardShadow: "shadow-xl shadow-black/20",
  cardText: "text-white",
  cardSubtext: "text-slate-400",
  stakeholderCardBorder: "border border-white/10 bg-[#162033]",
  stakeholderColors: [
    { bg: "bg-orange-500/15", bgDark: "bg-orange-500", text: "text-orange-400", check: "text-orange-400", border: "border-orange-500/30", hoverBg: "hover:bg-orange-500/10" },
    { bg: "bg-amber-500/15", bgDark: "bg-amber-600", text: "text-amber-400", check: "text-amber-400", border: "border-amber-500/30", hoverBg: "hover:bg-amber-500/10" },
    { bg: "bg-blue-500/15", bgDark: "bg-blue-600", text: "text-blue-400", check: "text-blue-400", border: "border-blue-500/30", hoverBg: "hover:bg-blue-500/10" },
    { bg: "bg-teal-500/15", bgDark: "bg-teal-600", text: "text-teal-400", check: "text-teal-400", border: "border-teal-500/30", hoverBg: "hover:bg-teal-500/10" },
  ],

  gradientBg: "bg-gradient-to-br from-[#162033] via-[#1a2744] to-[#1e2d52]",
  gradientTitle: "text-white",
  gradientSubtext: "text-slate-300",
  gradientBadgeBg: "bg-orange-500/20",
  gradientBadgeText: "text-orange-300",
  gradientCardBg: "bg-white/5 backdrop-blur-sm border border-white/10",
  gradientCardIconBg: "bg-orange-500/20",
  gradientCardIconColor: "text-orange-400",
  gradientCardTitle: "text-white",
  gradientCardText: "text-slate-300",
  gradientLiveBadgeBg: "bg-green-500",
  gradientLiveBadgeText: "text-white",
  gradientPillBg: "bg-white/5",
  gradientPillBorder: "border-white/10",
  gradientPillText: "text-slate-300",
  gradientPillIcon: "text-orange-400",
  gradientBtn: "bg-orange-500 hover:bg-orange-600",
  gradientBtnText: "text-white",

  darkBg: "bg-[#080F1D]",
  darkTitle: "text-white",
  darkSubtext: "text-slate-500",
  darkBadgeBg: "bg-orange-500/15",
  darkBadgeText: "text-orange-400",
  darkCardBg: "bg-[#0F1A2E] border border-white/5",
  darkCardHover: "hover:bg-[#162033]",
  darkIconBg: "bg-orange-500/15",
  darkIconColor: "text-orange-400",
  darkCardTitle: "text-white",
  darkCardText: "text-slate-500",

  processStepBg: "bg-orange-500",
  processStepText: "text-white",
  processConnector: "bg-white/10",

  roadmapLiveBg: "bg-orange-500",
  roadmapCardBg: "bg-[#0F1A2E] border border-white/5",
  roadmapLiveBadge: "bg-white/10 text-white",
  roadmapCheckColor: "text-green-400",
  roadmapClockColor: "text-slate-600",

  commVisualBg: "bg-[#162033]",
  commVisualBorder: "border-white/10",
  commCardBg: "bg-[#0F1A2E]",
  commCardBorder: "border-white/5",

  fundingGradientBg: "bg-gradient-to-br from-[#162033] to-[#1e2d52]",
  fundingSubtext: "text-slate-300",
  fundingDetailText: "text-slate-400",
  fundingIconBg: "bg-orange-500/15",
  fundingStepBg: "bg-white/5",
  fundingStepCircle: "bg-orange-500/20",

  ctaGradientBg: "bg-gradient-to-br from-orange-600 to-orange-800",
  ctaTitle: "text-white",
  ctaSubtext: "text-orange-100",
  ctaBtn: "bg-white text-orange-600 hover:bg-orange-50",
  ctaTrustText: "text-orange-200",
};

// ─────────────────────────────────────────────
// Theme 5: Midnight Aurora (Creative)
// ─────────────────────────────────────────────
const midnightAurora: ThemeConfig = {
  id: "midnight-aurora",
  name: "Midnight Aurora",
  description: "Dark theme with vibrant teal-to-rose gradients",

  logoFrom: "#14b8a6",
  logoTo: "#f43f5e",

  pageBg: "bg-gray-950",

  bannerBg: "bg-gradient-to-r from-teal-600 to-cyan-600",
  bannerText: "text-white",
  bannerBtn: "bg-white text-teal-700 hover:bg-teal-50",
  bannerClose: "hover:bg-white/20",

  heroBg: "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950",
  heroTitle: "text-white",
  heroHighlight: "bg-gradient-to-r from-teal-400 via-cyan-400 to-rose-400 bg-clip-text text-transparent",
  heroSubtext: "text-gray-400",
  heroPrimaryBtn: "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white",
  heroSecondaryBtn: "border-gray-700 text-gray-300 hover:bg-white/5",
  heroTrustText: "text-gray-500",
  heroTrustIcon: "text-teal-400",

  lightBg: "bg-gray-950",
  lightBadgeBg: "bg-teal-500/15",
  lightBadgeText: "text-teal-400",
  lightTitle: "text-white",
  lightSubtext: "text-gray-400",
  lightCheckIcon: "text-teal-400",

  cardShadow: "shadow-xl shadow-teal-500/5",
  cardText: "text-white",
  cardSubtext: "text-gray-400",
  stakeholderCardBorder: "border border-gray-800 bg-gray-900/50",
  stakeholderColors: [
    { bg: "bg-teal-500/15", bgDark: "bg-teal-600", text: "text-teal-400", check: "text-teal-400", border: "border-teal-500/30", hoverBg: "hover:bg-teal-500/10" },
    { bg: "bg-cyan-500/15", bgDark: "bg-cyan-600", text: "text-cyan-400", check: "text-cyan-400", border: "border-cyan-500/30", hoverBg: "hover:bg-cyan-500/10" },
    { bg: "bg-rose-500/15", bgDark: "bg-rose-600", text: "text-rose-400", check: "text-rose-400", border: "border-rose-500/30", hoverBg: "hover:bg-rose-500/10" },
    { bg: "bg-violet-500/15", bgDark: "bg-violet-600", text: "text-violet-400", check: "text-violet-400", border: "border-violet-500/30", hoverBg: "hover:bg-violet-500/10" },
  ],

  gradientBg: "bg-gradient-to-br from-teal-600 via-cyan-700 to-blue-800",
  gradientTitle: "text-white",
  gradientSubtext: "text-teal-100",
  gradientBadgeBg: "bg-white/15",
  gradientBadgeText: "text-white",
  gradientCardBg: "bg-white/10 backdrop-blur-md",
  gradientCardIconBg: "bg-white/20",
  gradientCardIconColor: "text-white",
  gradientCardTitle: "text-white",
  gradientCardText: "text-teal-100",
  gradientLiveBadgeBg: "bg-green-500",
  gradientLiveBadgeText: "text-white",
  gradientPillBg: "bg-white/10 backdrop-blur-sm",
  gradientPillBorder: "border-white/20",
  gradientPillText: "text-white",
  gradientPillIcon: "text-teal-200",
  gradientBtn: "bg-white",
  gradientBtnText: "text-teal-700",

  darkBg: "bg-gray-950",
  darkTitle: "text-white",
  darkSubtext: "text-gray-500",
  darkBadgeBg: "bg-rose-500/15",
  darkBadgeText: "text-rose-400",
  darkCardBg: "bg-gray-900 border border-gray-800",
  darkCardHover: "hover:bg-gray-800/80",
  darkIconBg: "bg-rose-500/15",
  darkIconColor: "text-rose-400",
  darkCardTitle: "text-white",
  darkCardText: "text-gray-500",

  processStepBg: "bg-gradient-to-r from-teal-500 to-cyan-500",
  processStepText: "text-white",
  processConnector: "bg-gray-800",

  roadmapLiveBg: "bg-gradient-to-r from-teal-500 to-cyan-500",
  roadmapCardBg: "bg-gray-900 border border-gray-800",
  roadmapLiveBadge: "bg-white/15 text-white",
  roadmapCheckColor: "text-teal-400",
  roadmapClockColor: "text-gray-600",

  commVisualBg: "bg-gray-900",
  commVisualBorder: "border-gray-800",
  commCardBg: "bg-gray-800/50",
  commCardBorder: "border-gray-700",

  fundingGradientBg: "bg-gradient-to-br from-rose-600 via-pink-600 to-purple-700",
  fundingSubtext: "text-rose-100",
  fundingDetailText: "text-rose-200",
  fundingIconBg: "bg-white/10",
  fundingStepBg: "bg-white/10",
  fundingStepCircle: "bg-white/20",

  ctaGradientBg: "bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-700",
  ctaTitle: "text-white",
  ctaSubtext: "text-teal-100",
  ctaBtn: "bg-white text-teal-700 hover:bg-teal-50",
  ctaTrustText: "text-teal-200",
};

// ─────────────────────────────────────────────
// Theme 6: Rose Gold (Elegant & warm)
// ─────────────────────────────────────────────
const roseGold: ThemeConfig = {
  id: "rose-gold",
  name: "Rose Gold",
  description: "Warm rose tones with golden accents",

  logoFrom: "#e11d48",
  logoTo: "#be185d",

  pageBg: "bg-white",

  bannerBg: "bg-rose-600",
  bannerText: "text-white",
  bannerBtn: "bg-white text-rose-600 hover:bg-rose-50",
  bannerClose: "hover:bg-white/20",

  heroBg: "bg-gradient-to-b from-rose-50 to-white",
  heroTitle: "text-slate-900",
  heroHighlight: "bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent",
  heroSubtext: "text-slate-600",
  heroPrimaryBtn: "bg-rose-600 hover:bg-rose-700 text-white",
  heroSecondaryBtn: "border-rose-200 text-rose-700 hover:bg-rose-50",
  heroTrustText: "text-slate-500",
  heroTrustIcon: "text-rose-500",

  lightBg: "bg-gradient-to-b from-rose-50/50 to-white",
  lightBadgeBg: "bg-rose-100",
  lightBadgeText: "text-rose-700",
  lightTitle: "text-slate-900",
  lightSubtext: "text-slate-600",
  lightCheckIcon: "text-rose-500",

  cardShadow: "shadow-lg hover:shadow-xl",
  cardText: "text-slate-900",
  cardSubtext: "text-slate-600",
  stakeholderCardBorder: "border-0",
  stakeholderColors: [
    { bg: "bg-rose-50", bgDark: "bg-rose-600", text: "text-rose-600", check: "text-rose-500", border: "border-rose-200", hoverBg: "hover:bg-rose-50" },
    { bg: "bg-pink-50", bgDark: "bg-pink-600", text: "text-pink-600", check: "text-pink-500", border: "border-pink-200", hoverBg: "hover:bg-pink-50" },
    { bg: "bg-amber-50", bgDark: "bg-amber-600", text: "text-amber-600", check: "text-amber-500", border: "border-amber-200", hoverBg: "hover:bg-amber-50" },
    { bg: "bg-violet-50", bgDark: "bg-violet-600", text: "text-violet-600", check: "text-violet-500", border: "border-violet-200", hoverBg: "hover:bg-violet-50" },
  ],

  gradientBg: "bg-gradient-to-br from-rose-600 via-pink-600 to-fuchsia-700",
  gradientTitle: "text-white",
  gradientSubtext: "text-rose-100",
  gradientBadgeBg: "bg-white/20",
  gradientBadgeText: "text-white",
  gradientCardBg: "bg-white/10 backdrop-blur-sm",
  gradientCardIconBg: "bg-white/20",
  gradientCardIconColor: "text-white",
  gradientCardTitle: "text-white",
  gradientCardText: "text-rose-100",
  gradientLiveBadgeBg: "bg-green-500",
  gradientLiveBadgeText: "text-white",
  gradientPillBg: "bg-white/10 backdrop-blur-sm",
  gradientPillBorder: "border-white/20",
  gradientPillText: "text-white",
  gradientPillIcon: "text-rose-200",
  gradientBtn: "bg-white",
  gradientBtnText: "text-rose-600",

  darkBg: "bg-slate-900",
  darkTitle: "text-white",
  darkSubtext: "text-slate-400",
  darkBadgeBg: "bg-rose-500/20",
  darkBadgeText: "text-rose-300",
  darkCardBg: "bg-slate-800",
  darkCardHover: "hover:bg-slate-700/80",
  darkIconBg: "bg-rose-500/20",
  darkIconColor: "text-rose-400",
  darkCardTitle: "text-white",
  darkCardText: "text-slate-400",

  processStepBg: "bg-rose-600",
  processStepText: "text-white",
  processConnector: "bg-rose-200",

  roadmapLiveBg: "bg-rose-600",
  roadmapCardBg: "bg-slate-800",
  roadmapLiveBadge: "bg-white/20 text-white",
  roadmapCheckColor: "text-green-400",
  roadmapClockColor: "text-slate-500",

  commVisualBg: "bg-rose-50",
  commVisualBorder: "border-rose-200",
  commCardBg: "bg-white",
  commCardBorder: "border-rose-100",

  fundingGradientBg: "bg-gradient-to-br from-pink-600 to-fuchsia-700",
  fundingSubtext: "text-pink-100",
  fundingDetailText: "text-pink-200",
  fundingIconBg: "bg-white/10",
  fundingStepBg: "bg-white/10",
  fundingStepCircle: "bg-white/20",

  ctaGradientBg: "bg-gradient-to-br from-rose-600 to-pink-700",
  ctaTitle: "text-white",
  ctaSubtext: "text-rose-100",
  ctaBtn: "bg-white text-rose-600 hover:bg-rose-50",
  ctaTrustText: "text-rose-200",
};

// ─────────────────────────────────────────────
// Theme 7: Forest Emerald (Natural & premium)
// ─────────────────────────────────────────────
const forestEmerald: ThemeConfig = {
  id: "forest-emerald",
  name: "Forest Emerald",
  description: "Deep green with gold accents",

  logoFrom: "#059669",
  logoTo: "#047857",

  pageBg: "bg-[#0a1a14]",

  bannerBg: "bg-emerald-600",
  bannerText: "text-white",
  bannerBtn: "bg-white text-emerald-700 hover:bg-emerald-50",
  bannerClose: "hover:bg-white/20",

  heroBg: "bg-gradient-to-b from-[#0a1a14] to-[#0f2620]",
  heroTitle: "text-white",
  heroHighlight: "bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent",
  heroSubtext: "text-emerald-200/60",
  heroPrimaryBtn: "bg-emerald-600 hover:bg-emerald-700 text-white",
  heroSecondaryBtn: "border-emerald-700 text-emerald-300 hover:bg-white/5",
  heroTrustText: "text-emerald-300/50",
  heroTrustIcon: "text-emerald-400",

  lightBg: "bg-[#0d1f18]",
  lightBadgeBg: "bg-emerald-500/15",
  lightBadgeText: "text-emerald-400",
  lightTitle: "text-white",
  lightSubtext: "text-emerald-200/50",
  lightCheckIcon: "text-emerald-400",

  cardShadow: "shadow-xl shadow-emerald-500/5",
  cardText: "text-white",
  cardSubtext: "text-emerald-200/50",
  stakeholderCardBorder: "border border-emerald-800/50 bg-[#0f2620]",
  stakeholderColors: [
    { bg: "bg-emerald-500/15", bgDark: "bg-emerald-600", text: "text-emerald-400", check: "text-emerald-400", border: "border-emerald-500/30", hoverBg: "hover:bg-emerald-500/10" },
    { bg: "bg-teal-500/15", bgDark: "bg-teal-600", text: "text-teal-400", check: "text-teal-400", border: "border-teal-500/30", hoverBg: "hover:bg-teal-500/10" },
    { bg: "bg-amber-500/15", bgDark: "bg-amber-600", text: "text-amber-400", check: "text-amber-400", border: "border-amber-500/30", hoverBg: "hover:bg-amber-500/10" },
    { bg: "bg-blue-500/15", bgDark: "bg-blue-600", text: "text-blue-400", check: "text-blue-400", border: "border-blue-500/30", hoverBg: "hover:bg-blue-500/10" },
  ],

  gradientBg: "bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900",
  gradientTitle: "text-white",
  gradientSubtext: "text-emerald-100",
  gradientBadgeBg: "bg-white/15",
  gradientBadgeText: "text-white",
  gradientCardBg: "bg-white/10 backdrop-blur-sm",
  gradientCardIconBg: "bg-white/20",
  gradientCardIconColor: "text-white",
  gradientCardTitle: "text-white",
  gradientCardText: "text-emerald-100",
  gradientLiveBadgeBg: "bg-green-500",
  gradientLiveBadgeText: "text-white",
  gradientPillBg: "bg-white/10 backdrop-blur-sm",
  gradientPillBorder: "border-white/20",
  gradientPillText: "text-white",
  gradientPillIcon: "text-emerald-200",
  gradientBtn: "bg-white",
  gradientBtnText: "text-emerald-700",

  darkBg: "bg-[#071310]",
  darkTitle: "text-white",
  darkSubtext: "text-emerald-200/40",
  darkBadgeBg: "bg-amber-500/15",
  darkBadgeText: "text-amber-400",
  darkCardBg: "bg-[#0d1f18] border border-emerald-800/30",
  darkCardHover: "hover:bg-[#0f2620]",
  darkIconBg: "bg-amber-500/15",
  darkIconColor: "text-amber-400",
  darkCardTitle: "text-white",
  darkCardText: "text-emerald-200/40",

  processStepBg: "bg-emerald-600",
  processStepText: "text-white",
  processConnector: "bg-emerald-800/50",

  roadmapLiveBg: "bg-emerald-600",
  roadmapCardBg: "bg-[#0d1f18] border border-emerald-800/30",
  roadmapLiveBadge: "bg-white/15 text-white",
  roadmapCheckColor: "text-emerald-400",
  roadmapClockColor: "text-emerald-800",

  commVisualBg: "bg-[#0f2620]",
  commVisualBorder: "border-emerald-800/50",
  commCardBg: "bg-[#0d1f18]",
  commCardBorder: "border-emerald-800/30",

  fundingGradientBg: "bg-gradient-to-br from-teal-700 to-emerald-900",
  fundingSubtext: "text-teal-100",
  fundingDetailText: "text-teal-200",
  fundingIconBg: "bg-white/10",
  fundingStepBg: "bg-white/10",
  fundingStepCircle: "bg-white/20",

  ctaGradientBg: "bg-gradient-to-br from-emerald-600 to-teal-800",
  ctaTitle: "text-white",
  ctaSubtext: "text-emerald-100",
  ctaBtn: "bg-white text-emerald-700 hover:bg-emerald-50",
  ctaTrustText: "text-emerald-200",
};

// ─────────────────────────────────────────────
// Export all themes
// ─────────────────────────────────────────────
export const themes: ThemeConfig[] = [
  blueSteel,
  gradientGlass,
  burntOrange,
  darkNavy,
  midnightAurora,
  roseGold,
  forestEmerald,
];

export const defaultTheme = blueSteel;
