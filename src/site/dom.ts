export function onReady(callback: () => void, doc: Document = document): void {
  if (doc.readyState === "loading")
    doc.addEventListener("DOMContentLoaded", callback, { once: true });
  else callback();
}

export function onLoaded(callback: () => void): void {
  if (document.readyState === "complete") callback();
  else window.addEventListener("load", callback, { once: true });
}
