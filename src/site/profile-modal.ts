interface ActiveRequest {
  controller: AbortController;
  loading: Element[];
  timer?: ReturnType<typeof setTimeout>;
}

export interface ProfileRequest {
  signal: AbortSignal;
  isCurrent(): boolean;
  finish(): void;
}

interface ProfileModal {
  begin(loading: Element[], cleanupDelay?: number): ProfileRequest;
}

const controllers = new WeakMap<HTMLElement, ProfileModal>();

/** One request/close lifecycle per modal, shared by the JSON and HTML loaders. */
export function profileModal(modal: HTMLElement): ProfileModal {
  const existing = controllers.get(modal);
  if (existing) return existing;
  let active: ActiveRequest | undefined;
  const removeLoading = (request: ActiveRequest) => {
    request.loading.forEach((element) => element.classList.remove("opening"));
  };
  const cancel = () => {
    if (!active) return;
    active.controller.abort();
    if (active.timer !== undefined) clearTimeout(active.timer);
    removeLoading(active);
    active = undefined;
  };
  modal.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const closeButton = target.closest(".modal-close");
    if (closeButton && modal.contains(closeButton)) event.preventDefault();
    else if (target.closest(".profile-wrap")) {
      event.stopPropagation();
      return;
    }
    cancel();
    modal.classList.remove("open");
  });
  const controller: ProfileModal = {
    begin(loading, cleanupDelay = 0) {
      cancel();
      const request: ActiveRequest = { controller: new AbortController(), loading };
      active = request;
      loading.forEach((element) => element.classList.add("opening"));
      return {
        signal: request.controller.signal,
        isCurrent: () => active === request && !request.controller.signal.aborted,
        finish() {
          if (active !== request) return;
          if (cleanupDelay > 0) {
            request.timer = setTimeout(() => {
              if (active === request) removeLoading(request);
            }, cleanupDelay);
          } else removeLoading(request);
        },
      };
    },
  };
  controllers.set(modal, controller);
  return controller;
}

export function waitForProfilePhoto(
  image: HTMLImageElement | null,
  url: string,
  signal: AbortSignal,
): Promise<void> {
  if (!image || signal.aborted) return Promise.resolve();
  return new Promise((resolve) => {
    const finish = () => {
      image.removeEventListener("load", finish);
      image.removeEventListener("error", finish);
      signal.removeEventListener("abort", finish);
      resolve();
    };
    image.addEventListener("load", finish);
    image.addEventListener("error", finish);
    signal.addEventListener("abort", finish, { once: true });
    image.src = url;
    if (image.complete) finish();
  });
}
