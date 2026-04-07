export type AudienceId = "general" | "children" | "athletes" | "respiratory";

export const AUDIENCE_TABS: {
  id: AudienceId;
  label: string;
}[] = [
  { id: "general", label: "General" },
  { id: "children", label: "Children & Elderly" },
  { id: "athletes", label: "Athletes" },
  { id: "respiratory", label: "Respiratory" },
];

export type HealthBlock = {
  liveTitle: string;
  liveNote: string;
  warnTitle: string;
  warnBody: string;
  adviceTitle: string;
  adviceBody: string;
  gearTitle: string;
  gear: string[];
};

export const HEALTH_BY_AUDIENCE: Record<AudienceId, HealthBlock> = {
  general: {
    liveTitle: "Live Reading — Mumbai",
    liveNote:
      "PM₂.₅: 46 µg/m³ — 3.1× WHO limit. Sensitive groups should reduce outdoor exposure.",
    warnTitle: "⚠ Health Implications",
    warnBody:
      "Sensitive groups (children, elderly, cardiac patients) may experience health effects. General public is less likely affected at short exposures.",
    adviceTitle: "ℹ General Advice",
    adviceBody:
      "Keep windows closed during peak hours. Limit outdoor exertion 10am–4pm. Wear N95 masks for outdoor activities longer than 30 minutes.",
    gearTitle: "🛡 Recommended Gear",
    gear: ["N99 High-Filtration Mask", "HEPA Home Air Purifier", "Wearable Air Purifier"],
  },
  children: {
    liveTitle: "Current AQI — Mumbai",
    liveNote:
      "Children and elderly should avoid prolonged outdoor activity today.",
    warnTitle: "⚠ Health Implications",
    warnBody:
      "Children are more vulnerable to pollution-induced respiratory issues. Elderly with pre-existing conditions face increased cardiovascular risk.",
    adviceTitle: "ℹ Advice",
    adviceBody:
      "Reschedule outdoor playtime to before 7am. Schools should cancel outdoor sports. Elderly should avoid outdoor walks — indoor exercise is recommended.",
    gearTitle: "🛡 Protection Gear",
    gear: ["N95/N99 Mask (Kids Sizes)", "HEPA H13 Air Purifier", "Car Air Purifier"],
  },
  athletes: {
    liveTitle: "Current AQI — Mumbai",
    liveNote:
      "Not ideal for high-intensity outdoor training. Move sessions indoors.",
    warnTitle: "⚠ Health Implications",
    warnBody:
      "High-intensity exercise causes deeper inhalation, increasing PM₂.₅ lung penetration by up to 3×. Today's AQI increases respiratory strain risk.",
    adviceTitle: "ℹ Advice",
    adviceBody:
      "Train indoors with HEPA filtration. If outdoor training is unavoidable, wear N95 and keep sessions under 45 minutes. Avoid 8am–6pm window.",
    gearTitle: "🛡 Bio-Optimization",
    gear: ["Mask with Breathing Valve", "Indoor HEPA Tower", "Smart AQI Monitor"],
  },
  respiratory: {
    liveTitle: "Current AQI — Mumbai",
    liveNote:
      "High risk for asthma and COPD patients. Keep rescue inhalers accessible.",
    warnTitle: "⚠ Health Implications",
    warnBody:
      "PM₂.₅ at 46 µg/m³ can trigger acute asthma attacks and worsen COPD symptoms. Risk is significantly elevated for those with pre-existing lung conditions.",
    adviceTitle: "ℹ Advice",
    adviceBody:
      "Stay indoors with air purifier running. Keep rescue inhaler and nebulizer accessible. Call your pulmonologist if symptoms worsen. Wear N95 if outdoor exposure is unavoidable.",
    gearTitle: "🛡 Critical Defense",
    gear: ["N99 Higher filtration Mask", "Medical HEPA Purifier", "Portable Nebulizer"],
  },
};
