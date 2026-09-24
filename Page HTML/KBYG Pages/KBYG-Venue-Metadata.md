# Native venue image metadata source

The KBYG template includes one native Collection List at Body level, outside both
audience branches. Its ID is `kbyg-venue-metadata`; native Visibility is Hidden and
**Keep in HTML when hidden** is enabled. It contains no links or controls.

- Outer source: Institutes. Filter **Backend - Institute Label equals KBYG Pages →
  Institute → Backend - Institute Label**. No sort, pagination, or artificial item limit.
- Nested source: **Institute Details - Venue Image Thumbnails** (Multi-image).
- Nested item: native Image bound to that current multi-image value, using native
  asset alt text. Maintain the per-image descriptions in the Institute CMS editor.
- Native wrapper ID after the Body-level move:
  `a494526d-199c-454a-97c0-ef781be51e93`.

Webflow's Lightbox JSON omits Multi-image alt metadata. The runtime reads this
hidden native image list, matches exact full URLs (including the known Webflow host
alias), and supplies missing thumbnail/link descriptions. The shared photo helper
then describes the opened full-size viewer. Existing Lightbox media URLs, order,
group, explicit alt/caption, and omission behavior remain authoritative.

The metadata is ignored if the outer list matches multiple Institutes, if the
wrapper is duplicated, or if descriptions conflict for the same URL. Blank or
unmatched entries retain the existing fallback. Never substitute filenames or
array positions for verified image descriptions.
