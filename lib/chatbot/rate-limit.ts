const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 60;
const requestLog = new Map<string, number[]>();
let missingConfigurationWarned = false;

function trustedIpHeader(): string | null {
  const configured = process.env.CHAT_TRUSTED_IP_HEADER?.trim().toLowerCase();
  if (!configured || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(configured)) return null;
  return configured;
}

function isHostedProduction(): boolean {
  return process.env.VERCEL === "1" || Boolean(process.env.VERCEL_ENV);
}

function requestHasConfiguredIdentity(request: Request, header: string): boolean {
  const value = request.headers.get(header)?.trim();
  return Boolean(value && !value.includes(",") && value.length <= 128);
}

export function hasTrustedRateLimitSource(request: Request): boolean {
  const header = trustedIpHeader();
  if (header) return requestHasConfiguredIdentity(request, header);
  return !isHostedProduction();
}

function getIdentifier(request: Request): string | null {
  const header = trustedIpHeader();
  const value = header
    ? request.headers.get(header)?.trim()
    : request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!value || value.length > 128) return null;
  return `${header ?? "local-forwarded-for"}:${value}`;
}

export function isChatRateLimited(request: Request): boolean {
  const identifier = getIdentifier(request);
  if (!identifier) {
    if (!missingConfigurationWarned && isHostedProduction()) {
      missingConfigurationWarned = true;
      console.warn(
        "Chat rate limiting is unavailable: configure CHAT_TRUSTED_IP_HEADER with a header rewritten by the trusted proxy.",
      );
    }
    return false;
  }

  const now = Date.now();
  const recent = (requestLog.get(identifier) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );
  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLog.set(identifier, recent);
    return true;
  }

  recent.push(now);
  requestLog.set(identifier, recent);

  if (requestLog.size > 500) {
    for (const [key, timestamps] of requestLog) {
      if (timestamps.every((timestamp) => now - timestamp >= RATE_LIMIT_WINDOW_MS)) {
        requestLog.delete(key);
      }
    }
  }
  return false;
}
