import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dir, "../../../..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const write = (p, x) => fs.writeFileSync(path.join(dir, p), JSON.stringify(x, null, 2) + "\n");
const faq = read("docs/web-refresh/04-faq-copy.md")
  .split("## Current state")[0]
  .match(/^> (.+)$/gm)
  .map((x) => x.slice(2));
const attend = read("docs/web-refresh/03-attend-page-copy.md").match(/^> (.+)$/m)[1];
const overview = read("docs/web-refresh/01-homepage-and-institute-overview-copy.md").match(
  /\| Institute overview[^\n]+\| (Institutes bring.+?)\s+\|/,
)[1];
const roster = JSON.parse(read("docs/web-refresh/evidence/task35/calendar-roster.json"));
const native = JSON.parse(
  fs.readFileSync(path.join(dir, "native-event-facts.json"), "utf8").replace(/^\uFEFF/, ""),
).items;
const events = roster.events.map((e) => {
  const n = native.find((n) => n.id === e.id);
  if (!n) throw Error(e.id);
  const f = n.fieldData;
  for (const [a, b] of [
    ["slug", "slug"],
    ["title", "global-institute-title-no-year"],
    ["location", "location"],
  ])
    if (e[a] !== f[b]) throw Error("Native drift " + e.slug + " " + a);
  if (
    e.start !== f["global-start-date"].slice(0, 10) ||
    e.end !== f["global-end-date"].slice(0, 10)
  )
    throw Error("Date drift " + e.slug);
  return {
    ...e,
    publicUrl: "https://www.ipmievents.com/institutes/" + e.slug,
    approval: "Pending IPMI final schedule approval; retained native facts only",
    knowledgeAction: e.horizon
      ? "information-only; no calendar registration"
      : "event-specific information; attendance request is not acceptance",
  };
});
const text = { overview, attend, institute: faq[0], thinkTank: faq[1], businessMeetings: faq[2] };
const sources = [
  {
    id: "overview",
    source: "01-homepage-and-institute-overview-copy.md",
    url: "https://ipmi.webflow.io/institutes",
    scope: "Approved overview paragraph only",
    text: overview,
  },
  {
    id: "attend",
    source: "03-attend-page-copy.md",
    url: "https://ipmi.webflow.io/attend#attend",
    scope: "Approved attendee-experience paragraph only",
    text: attend,
  },
  ...["institute", "thinkTank", "businessMeetings"].map((id, i) => ({
    id,
    source: "04-faq-copy.md",
    url:
      "https://ipmi.webflow.io/faq#" +
      ["what-is-an-institute", "what-is-a-think-tank", "what-do-the-business-meetings-look-like"][
        i
      ],
    scope: "Approved answer body only; exclude retained trailing generic links",
    text: faq[i],
  })),
];
const placeholders = [
  [
    "22-cost",
    "Placeholder — Attendance cost and eligibility guidance is pending IPMI approval. Which Institute and attendee role are you asking about?",
    "IPMI event owner",
    "Approved event/audience-specific cost, inclusions, eligibility and inquiry route",
  ],
  [
    "22-attire",
    "Placeholder — Approved attire guidance for the Healthcare IT Institute is pending. Please confirm the event year so the event team can provide the correct guidance.",
    "IPMI Operations / HIT owner",
    "Approved HIT attire guidance with event/date applicability and verified inquiry route",
  ],
  [
    "22-additional-attendee",
    "Placeholder — An additional attendee requires review by the Institute team. Please identify the Institute and year; I cannot confirm your senior manager’s eligibility.",
    "IPMI attendance / HIT owner",
    "Approved additional-attendee policy and recipient; task34 ownership and delivery proof",
  ],
  [
    "22-handoff",
    "Placeholder — Human handoff is not configured for this review. No message has been sent and no response time is promised.",
    "IPMI chatbot owner / task23",
    "Verified recipient, channel, consent copy, operating hours and safe controlled delivery evidence",
  ],
  [
    "22-hgc",
    "Placeholder — Please confirm the full Institute name and region you mean by HGC so I can identify the correct event.",
    "IPMI marketing / event owner",
    "Approved HGC alias mapping; CMS slug alone does not approve acronym expansion",
  ],
  [
    "22-event-approval",
    "Pending confirmation — Dates and venues are retained from current Webflow records and await final IPMI schedule approval.",
    "IPMI event owners / task35",
    "Per-event approval for all 26 IDs in events.json",
  ],
].map(([id, text, owner, replacement]) => ({
  id,
  text,
  owner,
  replacement,
  location: "Local curated-answers.json only; not uploaded",
  priorValue: null,
  applied: false,
  approval: null,
}));
const ph = (id) => placeholders.find((p) => p.id === id).text;
const event = (s) => events.find((e) => e.slug === s);
const eventAnswer = (s) => {
  const e = event(s);
  return `${e.title.trim()} is scheduled for ${e.start} to ${e.end} at ${e.location}. ${ph("22-event-approval")} ${e.horizon ? "This is an On the Horizon listing; the calendar does not offer registration." : "Review its individual Institute page for attendance information; an inquiry does not confirm acceptance."}`;
};
const answers = [
  {
    id: "R01",
    prompt: "What is IPMI?",
    sourceIssue:
      "General brand messaging and irrelevant links (page 1); operational prompt chosen because source is an issue, not a verbatim question",
    answer: "IPMI is the International Performance Management Institute. " + text.institute,
    links: ["https://ipmi.webflow.io/about"],
    criteria: ["Accurate concise brand explanation", "Only relevant IPMI links; no LinkedIn"],
  },
  {
    id: "R02",
    prompt: "Want to attend HR Canada",
    answer: eventAnswer("hrmi-canada-nov-2026"),
    links: [event("hrmi-canada-nov-2026").stagingUrl, "https://ipmi.webflow.io/attend#attend"],
    criteria: [
      "Next Canadian HR event November 8–10, 2026, Banff",
      "Event-specific link and attendance inquiry, no acceptance promise",
    ],
  },
  {
    id: "R03",
    prompt: "the next HRMI Can",
    answer: eventAnswer("hrmi-canada-nov-2026"),
    links: [event("hrmi-canada-nov-2026").stagingUrl],
    criteria: [
      "Recognizes supplied abbreviation in Canada context",
      "No April 2026 past-event recommendation",
    ],
  },
  {
    id: "R04",
    prompt: "Are Institutes roundtables?",
    sourceIssue:
      "Institute descriptions refer to roundtable (page 2); operational prompt chosen for issue",
    answer:
      text.institute +
      " Institutes and Virtual Think Tanks are distinct offerings. " +
      text.thinkTank,
    links: [],
    criteria: [
      "Approved Institute and Think Tank definitions",
      "Do not rename legitimate Think Tanks & Roundtables navigation",
    ],
  },
  {
    id: "R05",
    prompt: "How can I attend the EHS institute",
    answer: eventAnswer("ehs-jan-2027") + " " + ph("22-cost"),
    links: [event("ehs-jan-2027").stagingUrl],
    criteria: [
      "January 24–26, 2027, Austin",
      "No CLDI/HCHR recommendations",
      "No Horizon calendar registration; verified inquiry route pending",
    ],
  },
  {
    id: "R06",
    prompt: "Where is the next HRMI",
    answer: "Do you mean HR Management Institute in Canada or the United States?",
    links: [],
    criteria: [
      "Clarify region before choosing event",
      "After Canada answer use November Banff; after US use October Orlando",
    ],
  },
  {
    id: "R07",
    prompt: "What is the cost to attend an institute",
    answer: ph("22-cost"),
    links: [],
    criteria: [
      "No invented price, complimentary claim or eligibility",
      "Ask event and role; verified human route pending task23",
    ],
  },
  {
    id: "R08",
    prompt: "Talk to a person",
    answer: ph("22-handoff"),
    links: [],
    criteria: [
      "Verified task23 handoff required for final pass",
      "No guessed recipient or actual test send",
    ],
  },
  {
    id: "R09",
    prompt: "How do institutes work?",
    answer: text.overview + " " + text.attend,
    links: ["https://ipmi.webflow.io/attend#attend"],
    criteria: ["Approved overview and attendance experience", "No LinkedIn explanation"],
  },
  {
    id: "R10",
    prompt: "What is a think tank?",
    answer: text.thinkTank,
    links: [],
    criteria: ["Matches approved FAQ definition", "No redundant generic FAQ Read more"],
  },
  {
    id: "R11",
    prompt: "what should i wear to the Health IT Institute",
    answer: ph("22-attire"),
    links: [],
    criteria: ["No invented attire", "Ask event year; approved guidance/route pending"],
  },
  {
    id: "R12",
    prompt: "what do the business meetings entail?",
    answer: text.businessMeetings,
    links: [],
    criteria: [
      "Private pre-selected meetings, senior specialists, 30 minutes, pre-event assessment",
      "No stale 3–5 requirement or redundant FAQ link",
    ],
  },
  {
    id: "R13",
    prompt: "can i bring my senior manager to the Health IT institute with me",
    answer: ph("22-additional-attendee"),
    links: [],
    criteria: [
      "Do not assert eligibility",
      "Confirm event/year and route to approved owner once verified",
    ],
  },
  {
    id: "R14",
    prompt: "where is the next HGC institute",
    answer: ph("22-hgc"),
    links: [],
    criteria: [
      "Clarify full name/region until alias approved",
      "If confirmed Healthcare Law & Compliance then February 21–23, 2027, Nashville",
      "No HCHR substitution",
    ],
  },
  {
    id: "R15",
    prompt: "Where is the next HRMI? Canada, not the US.",
    answer: eventAnswer("hrmi-canada-nov-2026"),
    links: [event("hrmi-canada-nov-2026").stagingUrl],
    criteria: ["Respects explicitly supplied region", "Selects Banff, not US or past Canada"],
  },
  {
    id: "R16",
    prompt: "Is HRMI Canada April 2026 the next HR Canada event?",
    answer: "No. April 2026 has ended. " + eventAnswer("hrmi-canada-nov-2026"),
    links: [event("hrmi-canada-nov-2026").stagingUrl],
    criteria: ["Rejects ended event using America/Toronto date", "Next Canada November 2026"],
  },
];
write("events.json", {
  status: "prepared-not-imported",
  asOf: "2026-09-24",
  timeZone: "America/Toronto",
  events,
});
write("sources.json", {
  status: "prepared-not-imported",
  sources,
  excluded: [
    "Placeholder FAQ 6ab4dcb7c6fcf3d14c3706d1",
    "Placeholder testimonial 6ab4e34be2c912b57c47208b",
    "All unapproved testimonial/chair-sponsor/KBYG prose and MeetMax placeholders",
    "LinkedIn",
    "Past events as current recommendations",
    "Unapproved cost, eligibility and attire guidance",
  ],
  importMode:
    "Curated text/Q&A only until isolated configuration and source approval. Do not crawl whole staging pages that contain placeholders.",
});
write("curated-answers.json", {
  status: "prepared-not-imported",
  asOf: "2026-09-24",
  dateWarning:
    "These exact answers are dated review examples, not a verified provider runtime date-selection feature. Recompute and review before import or every next-event test. HGC conditional mapping remains approval-pending.",
  answers,
});
write("replacement-register.json", { status: "local-only", placeholders });
write("configuration.json", {
  applied: false,
  isolatedProject: null,
  owner: "Bryan / IPMI chatbot account owner; specific future refresh operator pending designation",
  companyDescription:
    "IPMI is the International Performance Management Institute. " +
    text.institute +
    " " +
    text.overview,
  aliases: [
    {
      terms: ["HR Canada", "HRMI Can", "HRMI Canada"],
      title: "HR Management Institute Canada",
      region: "Canada",
      basis: "Supplied task22 examples and matching native titles",
    },
    {
      terms: ["HRMI"],
      title: "HR Management Institute",
      region: null,
      action: "Ask Canada or United States",
    },
    {
      terms: ["EHS", "EHS institute"],
      title: "EHS Management Institute",
      basis: "Supplied example/native title",
    },
    {
      terms: ["Health IT Institute", "Healthcare IT Institute"],
      title: "Healthcare IT Institute",
      action: "Ask year for policies and additional attendees",
    },
    { terms: ["HGC"], title: null, action: "Ask full name and region; approval pending" },
  ],
  selection: {
    timezone: "America/Toronto",
    today: "Runtime current local calendar date, never frozen ingestion date",
    rule: "Exclude draft/archived and end < today; require confirmed discipline and region; ongoing start <= today <= end first, otherwise ascending start then slug; no candidate => say no verified upcoming record; never invent a later event",
    horizon:
      "Information only in calendar; no registration action; HIT direct pre-registration remains independently present but not delivery-verified",
  },
  guidance: [
    "Use only approved excerpts and retained native event facts, labeling pending schedule approval in review.",
    "Give the shortest complete answer. Include at most one event-specific link, plus attendance link only when it adds an action. Do not append generic FAQ, LinkedIn or unrelated discipline links.",
    "Use Institute and Virtual Think Tank definitions exactly as supplied; preserve legitimate navigation wording.",
    "Ask for geography when HRMI is ambiguous and full name/region for HGC. Do not infer alias from slug alone.",
    "Do not invent prices, complimentary access, eligibility, attire, approval of extra attendees or promised response time. Use labeled local placeholders pending approval.",
    "Never infer chatbot recipient from public info@ipmievents.com. HIT native scolquhoun@ipmievents.com is not delivery or ownership approval.",
    "Do not expose internal CMS IDs or approval registers in final approved customer replies.",
    "Replace these local placeholders only after owner approval; do not activate this pack on shared project.",
  ],
  refresh: {
    trigger:
      "After each approved page/event change and before every regression/release; review currentness at least daily for active next-event answers",
    steps: [
      "Verify existing isolated project, independent settings/widget and non-sending test channel. Capture source bodies, toggles, guidance and timestamps before changes.",
      "Reconcile all 26 event IDs against native snapshot; obtain missing schedule and alias approvals. Remove ended events from next-event selection without deleting history.",
      "In isolated project only, add curated Q&A/excerpts via native Data sources. Do not crawl staging wholesale. Preserve source provenance; supersede conflicting old Q&A/URLs only after rollback capture.",
      "Use native refresh for the exact changed source, wait for ingestion ready and record timestamp/status. Do not enable unverified automatic sync.",
      "Execute all 16 cases with Reset test between independent cases; verify links and follow-up Canada/US context. Never send actual handoff until task23 safe route exists.",
      "Prove refresh in isolated test only: temporarily change a dedicated test answer to a unique review marker, ingest, query and capture; restore approved answer, ingest and query again. Never perform marker test in shared configuration.",
      "Record operator, approver, versions, before/after hashes and transcripts. Release only after approval and final regression.",
    ],
    automaticSyncObserved: false,
    automaticSyncNote:
      "No synchronization control observed in inspected current general/settings views; not asserted disabled or enabled",
    proofStatus: "Blocked by isolation; no source refreshed",
  },
});
console.log(
  "Prepared 26 native event facts, 5 approved excerpts, 16 curated cases and 6 replacement entries.",
);
