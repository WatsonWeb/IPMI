import { profileModal, waitForProfilePhoto } from "./profile-modal";

type Speaker = Partial<
  Record<"name" | "accolades" | "job-title" | "company-organization" | "biography", string>
> & {
  "profile-photo"?: { url: string };
};
export function parseSpeaker(value: unknown): Speaker {
  if (typeof value !== "object" || value === null) return {};
  const raw = value as Record<string, unknown>;
  const speaker: Speaker = {};
  for (const field of [
    "name",
    "accolades",
    "job-title",
    "company-organization",
    "biography",
  ] as const) {
    if (typeof raw[field] === "string") speaker[field] = raw[field];
  }
  const photo = raw["profile-photo"];
  if (
    typeof photo === "object" &&
    photo !== null &&
    "url" in photo &&
    typeof photo.url === "string"
  ) {
    speaker["profile-photo"] = { url: photo.url };
  }
  return speaker;
}

const initializedLinks = new WeakSet<Element>();

export function initSpeakerModal(): void {
  const modal = document.querySelector<HTMLElement>("#profile-modal");
  if (!modal) return;
  const lifecycle = profileModal(modal);
  document.querySelectorAll(".modal-link").forEach((link) => {
    if (initializedLinks.has(link)) return;
    initializedLinks.add(link);
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const item = link.closest(".w-dyn-item");
      const cmsId = item?.querySelector(".cms-id")?.textContent.trim();
      if (!cmsId) return;
      const request = lifecycle.begin(Array.from(item?.querySelectorAll(".loading") ?? []), 300);
      void (async () => {
        try {
          const response = await fetch(
            "https://ipmi-express-server.vercel.app/cms-items/" + encodeURIComponent(cmsId),
            { signal: request.signal },
          );
          if (!response.ok) throw new Error(`Speaker response failed: HTTP ${response.status}`);
          const value: unknown = await response.json();
          if (!request.isCurrent()) return;
          const speaker = parseSpeaker(value);
          const photo = speaker["profile-photo"];
          modal
            .querySelectorAll(".bio-photo-wrap")
            .forEach((element) => element.classList.toggle("hidden", !photo));
          const photoReady = photo
            ? waitForProfilePhoto(
                modal.querySelector<HTMLImageElement>(".bio-photo"),
                photo.url,
                request.signal,
              )
            : Promise.resolve();
          const fields = [
            ["name", ".bio-name"],
            ["accolades", ".bio-accolades"],
            ["job-title", ".bio-job-title"],
            ["company-organization", ".bio-company"],
          ] as const;
          for (const [field, selector] of fields) {
            modal.querySelectorAll(selector).forEach((element) => {
              element.classList.toggle("hidden", speaker[field] === undefined);
              if (speaker[field] !== undefined) element.textContent = speaker[field];
            });
          }
          modal
            .querySelectorAll(".bio-content")
            .forEach((element) =>
              element.classList.toggle("hidden", speaker.biography === undefined),
            );
          // Biography is trusted CMS rich text, as in the existing Webflow modal.
          modal.querySelectorAll<HTMLElement>(".bio-text").forEach((element) => {
            if (speaker.biography !== undefined) element.innerHTML = speaker.biography;
            element.scrollTop = 0;
          });
          await photoReady;
          if (request.isCurrent()) modal.classList.add("open");
        } catch {
          if (request.isCurrent()) console.error("Error loading Speaker Bio");
        } finally {
          request.finish();
        }
      })();
    });
  });
}
