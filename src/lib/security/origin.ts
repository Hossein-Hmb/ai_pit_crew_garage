export function isAllowedOrigin(req: Request): boolean {
  const origin = req.headers.get("origin") || "";
  if (!origin) return true; // allow same-origin/no-origin
  const site =
    process.env.NEXT_PUBLIC_SITE_ORIGIN ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "";
  try {
    const o = new URL(origin);
    if (site) {
      try {
        const s = new URL(site);
        return o.host === s.host;
      } catch {
        return origin.startsWith(site);
      }
    }
    return true;
  } catch {
    return false;
  }
}
