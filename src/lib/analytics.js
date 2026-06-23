const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN;

export function track(event, props = {}) {
  if (typeof window === "undefined") return;
  if (PLAUSIBLE_DOMAIN && window.plausible) {
    window.plausible(event, { props });
  }
  if (import.meta.env.DEV) {
    console.debug("[analytics]", event, props);
  }
}
