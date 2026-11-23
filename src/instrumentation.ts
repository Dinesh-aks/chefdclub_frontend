const PING_INTERVAL_MS = 10 * 60 * 1000;

/** Self-pings the deployed URL every 10 minutes so Render's free tier doesn't spin down from inactivity. */
export function register() {
  if (process.env.KEEP_ALIVE_ENABLED === "false") return;

  const keepAliveUrl = process.env.NEXT_FRONTEND_URL;
  if (!keepAliveUrl) return;

  const url = `${keepAliveUrl.replace(/\/$/, "")}/api/health`;

  setInterval(() => {
    fetch(url).catch((error) => {
      console.warn("Keep-alive ping failed", error);
    });
  }, PING_INTERVAL_MS);

  console.info(`Keep-alive enabled, pinging ${url} every 10 minutes`);
}
