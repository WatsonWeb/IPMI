export type Audience = "delegate" | "sponsor";
export type Cleanup = () => void;

/** Raw CMS/calendar attributes are deliberately validated at the boundary. */
export interface CalendarInput {
  title?: unknown;
  summary?: unknown;
  start?: unknown;
  startDate?: unknown;
  end?: unknown;
  endDate?: unknown;
  allDay?: unknown;
  context?: unknown;
  eventId?: unknown;
  id?: unknown;
  description?: unknown;
  location?: unknown;
  url?: unknown;
  filename?: unknown;
  uid?: unknown;
}

export interface CalendarIdentity {
  context: string;
  eventId: string;
  title: string;
  startValue: string;
  endValue: string;
  allDay: boolean;
  location: string;
  description: string;
}

export interface NormalizedCalendarEvent extends CalendarIdentity {
  url: string;
  filename: string;
  uid: string;
  utc?: boolean;
}

export interface CalendarOptions {
  now?: Date | string | number;
}

export interface LightboxModule {
  ready?: () => void;
}

export interface WebflowRuntime {
  push?: (callback: () => void) => unknown;
  require?: (name: "lightbox") => LightboxModule | null | undefined;
}

export interface KbygWindow extends Window {
  FontAwesome?: { dom?: { i2svg?: (options: { node: HTMLElement }) => Promise<void> | void } };
  Webflow?: WebflowRuntime;
  Blob?: typeof Blob;
  URL?: typeof URL;
  webkitURL?: typeof URL;
}

export interface InitOptions {
  document?: Document;
  window?: KbygWindow;
}

export interface NavigationOptions {
  behavior?: ScrollBehavior;
  updateHash?: boolean;
}

export interface SectionRecord {
  element: HTMLElement;
  id: string;
  keys: Set<string>;
}

export interface NavigationController {
  sections: SectionRecord[];
  controls: HTMLElement[];
  navigateTo: (key: unknown, options?: NavigationOptions) => boolean;
  refresh: () => void;
  destroy: () => void;
}

export interface AccordionRecord {
  item: HTMLElement;
  trigger: HTMLElement;
  panel: HTMLElement;
}

export interface AccordionController {
  items: AccordionRecord[];
  open: (index: number) => boolean;
  closeAll: () => void;
}

export interface KeyDatesRecord {
  grid: HTMLElement;
  control: HTMLElement;
  cards: HTMLElement[];
  items: HTMLElement[];
  expanded: boolean;
}

export interface KbygInstance {
  page: HTMLElement;
  navigation: NavigationController;
  accordions: AccordionController;
  calendars: { controls: HTMLElement[] };
  keyDates: { records: KeyDatesRecord[] };
  venueLinks: { links: HTMLElement[] };
  hubLinks: { links: HTMLElement[] };
  venueLightboxes: { links: HTMLElement[] };
  fontAwesome: { replacedImages: HTMLElement[] };
  audience: Audience;
  responsiveWelcomeTitle: { title: HTMLElement; mediaQuery: MediaQueryList } | null;
  destroy: () => void;
}
