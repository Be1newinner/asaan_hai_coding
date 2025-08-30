export const API_BASE_URL = process.env.API_BASE_URL;
export const AUTH_COOKIE = "refresh_token";
export const REFRESH_TOKEN_COOKIE = AUTH_COOKIE;
export const ACCESS_TOKEN_COOKIE = AUTH_COOKIE;
export const COOKIE_MAX_AGE_SECONDS = 60 * 24 * 7;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function invariant(condition: any, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
