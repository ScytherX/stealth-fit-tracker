const RELOAD_FLAG = "chunk-reloaded";

function isChunkLoadError(message: string) {
  return (
    message.includes("Importing a module script failed") ||
    message.includes("Failed to fetch dynamically imported module") ||
    message.includes("error loading dynamically imported module") ||
    message.includes("Loading chunk") ||
    message.includes("Unable to preload CSS")
  );
}

function recover() {
  try {
    if (sessionStorage.getItem(RELOAD_FLAG)) return;
    sessionStorage.setItem(RELOAD_FLAG, "1");
  } catch {
    // sessionStorage unavailable — reload once anyway
  }
  window.location.reload();
}

export function installChunkRecovery() {
  if (typeof window === "undefined") return;

  window.addEventListener("vite:preloadError", () => {
    // Do not prevent the event's default behavior. Vite resolves the failed
    // import as `undefined` when it is cancelled, which makes TanStack Router
    // crash while reading the lazy route's default export.
    recover();
  });

  window.addEventListener("error", (event) => {
    if (typeof event.message === "string" && isChunkLoadError(event.message)) recover();
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    const message =
      typeof reason === "string" ? reason : ((reason as Error | undefined)?.message ?? "");
    if (isChunkLoadError(message)) recover();
  });

  window.addEventListener("load", () => {
    try {
      sessionStorage.removeItem(RELOAD_FLAG);
    } catch {
      // ignore
    }
  });
}
