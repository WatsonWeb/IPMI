# KBYG CMS rendering release

The runtime enhances interactions without replacing CMS headings, editorial copy,
CTA labels, or separate Hub and Support destinations. Native Webflow bindings
remain the source of event, staff, and content-block data.

## Webflow custom code

1. Remove the old audience script from the KBYG template Head. It uses the URL
   suffix and a MutationObserver to delete branches before the CMS audience can
   be read. Use `Page HTML/KBYG Pages/KBYG-Head.html`: retain robots and the native
   `kbyg-industry` field chip, with case-insensitive audience CSS.
2. Point the existing single deferred footer script to
   `https://cdn.jsdelivr.net/gh/WatsonWeb/IPMI@RELEASE_SHA/dist/ipmi-kbyg.js`.
3. Point the existing single Custom Styles embed import to
   `https://cdn.jsdelivr.net/gh/WatsonWeb/IPMI@RELEASE_SHA/ipmi-kbyg-styles.css`.
   Preserve both native Institute color chips after the import. Do not replace
   those chips by pasting plain exported token text.
4. Bind `.kbyg-page[data-audience]` to the Page Audience option. The runtime accepts
   `Delegate`/`Sponsor` in any case; URL inference applies only when this value is
   absent or invalid. Keep native conditional visibility on audience branches.

## Native field adapters

- Bind `.kbyg-hero__event` to Institute title without year, and root
  `data-kbyg-event-year` to Institute Year. The runtime prefixes the year once.
- Bind root `data-kbyg-map-query` to Institute Map Query. If it is blank, the
  runtime uses `[data-kbyg-address]` text, then the first hotel-card venue title.
  A per-iframe `data-kbyg-map-query` overrides the root query.
- A native Lightbox with `data-kbyg-cms-gallery="true"` can bind its Media directly
  to Institute Venue Image Thumbnails (MultiImage). Its published `.w-json` is
  authoritative. Runtime leaves that source JSON intact, hides its source link
  outside native lightbox grouping, and creates one ordered thumbnail/lightbox per
  image with its caption, alt text, metadata, and group. An empty CMS gallery
  produces no thumbnails. Remove static thumbnail children and extra demo links.
- Alternatively, each venue gallery item can bind `.kbyg-travel-gallery__image` `src` and `alt`.
  Its lightbox uses that current image, replacing stale native JSON. Optionally
  bind `data-kbyg-full-image-src` on the image or enclosing lightbox link for a
  different full image. Empty native images are hidden and excluded.
- Bind calendar `data-kbyg-start`/`data-kbyg-end` to Calendar Start/End, using
  `YYYY-MM-DD` for all-day values and ISO timestamps for timed values. Bind
  `data-kbyg-all-day` to All-day. Explicit dates win over display copy; English
  display dates are accepted only as a fallback when no start is supplied.
- When native date attributes omit the time, add a hidden sibling inside each
  `.kbyg-date-card` with `data-kbyg-calendar-source` and
  `data-kbyg-calendar-timezone="America/Toronto"` (the verified site timezone).
  Use native Embed field chips to populate that element's `data-kbyg-start` and
  `data-kbyg-end`, both formatted `YYYY-MM-DD H:mm`. The runtime converts these
  local timestamps to UTC before using their UTC dates for all-day events or
  their instants for timed events. Nonempty source values take precedence;
  empty values retain the control's existing date. Invalid, nonexistent, or
  ambiguous local timestamps fail the download rather than use stale dates.
  A source value with an explicit ISO offset or `Z` is also accepted directly.
- Bind each CTA's own `href`. A root `data-kbyg-hub-url` no longer overrides both
  Hub and Support. An optional per-link `data-kbyg-hub-url` can supply an HTTP URL.
- The Sponsor Experience meeting-method list can render the first three items
  separately while its grid renders the complete native multi-reference list.
  If all three leading grid titles match the method titles in order, the runtime
  removes those duplicate grid items. An already-offset grid remains intact.
- Set both Key Dates Collection Lists' native Empty State text to
  `Check back soon for Key Dates & Deliverables!`. Webflow displays this only
  when no items are available. The runtime hides View All Key Dates for empty
  lists, including published empty states where Webflow omits the grid.
- Bind both Reservation Details rich text elements to the current KBYG Page's
  `KBYG Reservation Details`, so Delegate and Sponsor copy can be edited
  independently. Reservation URL, hotel intro, and transportation remain on
  the referenced Institute.
- For body-based sections, add `data-kbyg-empty-message` with the desired notice
  text to an always-present container. Mark only meaningful fields inside it
  with `data-kbyg-content`: a bound rich text body, the Operations Lead name,
  or a CTA whose destination can serve as the available content. Any populated
  marked field suppresses the notice. Empty, conditionally hidden, or blank
  rich text and links without a destination do not count. The generated
  `.kbyg-empty-notice` inherits the section's text color. Apply this contract to
  Welcome copy, Hub copy, hotel/reservation/transport details, Support copy,
  and Operations Lead cards as appropriate. Leave optional photos and contact
  channels unmarked so they do not generate individual notices.
- Keep native Collection List Empty States for Preparation, Key Dates, Agenda,
  Experience, and FAQ. To avoid duplicate Sponsor Experience notices, mark its
  two native Empty State wrappers with `data-kbyg-empty-notice` and the same
  `data-kbyg-empty-group="sponsor-experience"`. The runtime retains the first
  visible notice and hides additional notices in that group. Native empty
  states hidden because their lists are populated remain hidden.
- Empty link fields hide their CTAs; calendar and date-toggle action links remain
  available. Empty hotel-details rich text hides its optional card unless the
  card carries `data-kbyg-empty-message`, in which case it displays its notice.
  Empty phone and email links hide the corresponding contact row. Native
  conditional visibility may also be used for these optional fields.

## Build and validation

`vp build` emits the runtime and styles into `dist/`; the release also contains
the matching root `ipmi-kbyg-styles.css` for the existing Designer import path.
The global `ipmi-custom-styles.css` artifact is not changed. Run `vp run verify`
after updating the reviewed KBYG CSS baseline. Browser verification must cover
both audiences and an event with different name, year, venue, and optional data.
