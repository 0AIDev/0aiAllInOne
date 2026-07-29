export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && process.env.NODE_ENV === "production") {
    try {
      const { initTelemetry } = await import("@/lib/telemetry");
      initTelemetry();
    } catch {
      // Silently ignore telemetry initialization errors
    }
  }
}
