// Presentation-only legacy URL gate; this is not authentication. The CMS value
// is public page data. Sensitive downloads require server-side access control.
export function unlockRecap(doc: Document = document, search = window.location.search): boolean {
  const password =
    doc.querySelector<HTMLMetaElement>('meta[name="ipmi-download-password"]')?.content ?? "";
  const supplied = new URLSearchParams(search).get("p");
  const matches = password.length > 0 && supplied === password;
  if (matches) doc.body.classList.remove("locked");
  return matches;
}
