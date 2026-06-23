const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

export async function initSentry() {
  if (!SENTRY_DSN || typeof window === "undefined") return;
  try {
    const Sentry = await import("@sentry/react");
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: import.meta.env.MODE,
      integrations: [Sentry.browserTracingIntegration()],
      tracesSampleRate: 0.1,
    });
  } catch {
    console.warn("Sentry not installed — set VITE_SENTRY_DSN after adding @sentry/react");
  }
}
