import { writeFileSync } from "node:fs";
const dir = new URL("./", import.meta.url);
const put = (name, value) =>
  writeFileSync(new URL(name, dir), JSON.stringify(value, null, 2) + "\n");
const messages = {
  "23-preview":
    "Preview only — human handoff is not configured for this review. Nothing has been sent to a person. Please do not enter contact details here.",
  "23-general":
    "You’d like to speak with someone at IPMI. Which Institute or topic is your question about? Preview only — no message will be sent to a person.",
  "23-cost":
    "Which Institute, year and region are you asking about, and are you interested in attending, speaking or sponsoring? Cost and eligibility need confirmation from the relevant IPMI team. Preview only — no inquiry will be sent.",
  "23-additional":
    "Which Healthcare IT Institute year do you mean, and would your senior manager attend as a delegate? Additional attendance requires IPMI’s review; this is not approval. Preview only — no inquiry will be sent.",
  "23-hit":
    "Your question concerns attending Healthcare IT Institute 2027. The human contact route is awaiting approval. Preview only — no inquiry will be sent.",
  "23-hgc":
    "Please confirm the full Institute name, year and region you mean by HGC. I cannot choose an event contact from that abbreviation alone. Preview only — no inquiry will be sent.",
  "23-offline":
    "Human handoff is unavailable in this preview. Nothing has been sent, queued or assigned. You can continue asking general event questions without sharing contact details.",
  "23-contact-link":
    "Open IPMI’s Contact page to review its contact options. Opening the page does not send this chat or submit an inquiry.",
  "23-consent":
    "May I share your question, confirmed event and attendance role with the approved IPMI contact shown here? Share only the contact details needed for a reply. Sending is disabled in this preview.",
  "23-failure":
    "I could not confirm the handoff. Please do not assume your inquiry was delivered. No response time is confirmed.",
};
put(
  "replacement-register.json",
  Object.entries(messages).map(([id, exactText]) => ({
    id,
    exactText,
    location: "Local routing-matrix.json messages; future isolated Lyro Handoff/Guidance only",
    priorValue: null,
    applied: false,
    approval: null,
    owner: "IPMI event/contact owner approves copy; Bryan implements after isolation",
    replacementNeeded:
      "Approved destination, scope, consent/privacy wording and proven state before replacing preview label. Existing provider defaults are separately captured in provider-observations.json.",
  })),
);
const rows = [
  [
    "23-general",
    "Talk to a person / general inquiry",
    "Any or unknown event",
    "Any; clarify role if relevant",
    null,
    "IPMI general inquiry owner pending",
    "23-general",
  ],
  [
    "23-cost",
    "Cost",
    "Confirmed event/year/region required",
    "Attend / Speak / Sponsor must be clarified",
    null,
    "Relevant event/category owner pending",
    "23-cost",
  ],
  [
    "23-eligibility",
    "Attendance eligibility",
    "Confirmed event/year/region required",
    "Delegate; never grant eligibility",
    null,
    "Relevant attendance owner pending",
    "23-cost",
  ],
  [
    "23-additional",
    "Additional Healthcare IT attendee",
    "Healthcare IT Institute; ask year",
    "Additional delegate; never substitute social guest policy",
    null,
    "Healthcare IT attendance owner pending",
    "23-additional",
  ],
  [
    "23-hit-2027",
    "HIT 2027 attendee inquiry",
    "Healthcare IT Institute 2027 / hit-2027 / 6a062fba0e49a14badf21c95",
    "Attend only; exclude Speak/Sponsor",
    "scolquhoun@ipmievents.com",
    "Sam Colquhoun association corroborated in Tidio; scope/approval pending task34",
    "23-hit",
  ],
  [
    "23-hit-other",
    "HIT other year/category",
    "Healthcare IT Institute other/unknown year or category",
    "Clarify; preserve native category routes",
    null,
    "Relevant event/category owner pending",
    "23-cost",
  ],
  [
    "23-hgc",
    "HGC-specific contact",
    "Unresolved abbreviation; require full name/year/region",
    "Clarify role; do not infer HCHR or Healthcare GCI",
    null,
    "Matching event owner pending after clarification",
    "23-hgc",
  ],
];
put("routing-matrix.json", {
  status: "prepared-not-configured",
  messages,
  routes: rows.map(([id, intent, eventScope, audience, native, owner, messageId]) => ({
    id,
    intent,
    eventScope,
    audience,
    owner,
    messageId,
    applied: false,
    approval: null,
    actualPriorValue: {
      defaultOnline: "Transfer conversation to agent",
      defaultOffline: "Transfer conversation to agent",
      eventSpecificProviderRecipient: null,
      handoffGuidance: "None (0 total)",
      preservedNativeFormRecipient: native,
    },
    proposedPendingValue: {
      previewAction: "Keep conversation (no transfer to agent)",
      destinationType:
        "none in preview; approved native assignment or separately approved event contact link after verification",
      agentId: null,
      departmentId: null,
      notificationEmail: null,
      contactUrl: null,
      ticketInbox: null,
    },
    fallback: {
      messageId: "23-contact-link",
      url: "https://www.ipmievents.com/contact",
      behavior:
        "Navigation only, no chat transfer, form submission or delivery claim; no event-specific owner implied",
    },
    offline: "23-offline",
    noAvailability: "23-offline",
    consent: "23-consent; decline/missing consent prevents sending",
    minimalPayload: [
      "confirmed event title/year/region",
      "visitor-selected role",
      "visitor question",
      "explicit sharing consent",
      "reply email only if an approved asynchronous route requires it",
    ],
    unknownRecipient: "Fail closed: no send, ticket, public-email or login-email substitution",
  })),
  precedence: [
    "Ambiguous event/region/year/HGC: clarify without handoff",
    "HIT 2027 Attend: task34 scope; additional-attendee intent still needs review",
    "Confirmed event-specific request: matching approved category route",
    "Other/general: approved general route only",
    "Missing isolation, consent, recipient or availability proof: fail closed",
  ],
  destinationTypes: {
    contactLink: "Opens page/composer; no automatic sending or chat transfer",
    notificationEmail: "Alert preference; neither case assignment nor delivery evidence",
    liveAgentAssignment:
      "Provider conversation transfer; receipt must establish actual inbox and assignee",
    ticket: "Separate asynchronous record; verified inbox and reply handling required",
  },
  preserve: [
    "All shared-provider current values",
    "HIT native canonical recipient in direct/Horizon/Attend scopes",
    "Other native event/category recipient baselines",
    "Task22 actual baseline transcripts",
  ],
});
put("delivery-test.json", {
  status: "not-executed",
  networkEnabled: false,
  isolatedProject: null,
  isolatedWidget: null,
  approvedTestDestination: null,
  authorization: null,
  fixture: {
    testId: "IPMI-T23-SYNTHETIC-001",
    displayName: "Synthetic handoff reviewer",
    replyEmail: "reviewer@example.invalid",
    question:
      "SYNTHETIC REVIEW ONLY: May an additional delegate attend Healthcare IT Institute 2027?",
    event: "Healthcare IT Institute 2027",
    audience: "Attend / additional delegate",
    consent: false,
  },
  fixtureWarning:
    "Deliberately nondeliverable/local-only. Replace identity only with explicitly approved controlled test identity; never submit to shared Tidio.",
  requiredReceiptFields: [
    "testId",
    "isolatedProjectId",
    "isolatedWidgetId",
    "confirmedEvent",
    "audience",
    "exactQuestion",
    "consentTimestamp",
    "channel",
    "conversationOrTicketId",
    "actualInbox",
    "actualAssignedAgentOrDepartment",
    "notificationRecipients",
    "providerAcceptedTimestamp",
    "receivingTimestamp",
    "receiptObserver",
    "visitorVisibleState",
    "duplicateCount",
    "productionRecipientsUnaffectedEvidence",
  ],
  cases: [
    "online general",
    "offline asynchronous",
    "all agents unavailable",
    "cost clarified event/role",
    "eligibility without approval",
    "additional delegate versus social guest",
    "HIT 2027 Attend versus Sponsor/other year",
    "ambiguous HGC",
    "unknown recipient",
    "consent declined",
    "provider rejection/timeout",
    "retry without duplicate",
    "desktop/mobile keyboard and links",
  ],
  preconditions: [
    "Existing independent configuration/widget and notification isolation verified",
    "Dated owner approval of exact test recipient/inbox/agent and scope",
    "Explicit authorization for specific controlled send",
    "No production email, integration, agent or notification affected",
    "Capture isolated prior rules/messages/notifications/hours for rollback",
  ],
});
