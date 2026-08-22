/**
 * api.js — Centralised fetch wrapper.
 * - Prepends /api to all paths.
 * - Sends credentials (httpOnly cookie for refresh token).
 * - Parses JSON and normalises errors into the §6.3 envelope shape.
 * - Automatically retries once with a token refresh on 401.
 *
 * Usage:
 *   import { api } from '../lib/api';
 *   const data = await api.get('/trips');
 *   const created = await api.post('/trips', { name: 'Euro Trip', ... });
 */

const BASE = '/api';

// Holds the in-memory access token (never persisted to localStorage/sessionStorage)
let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function clearAccessToken() {
  accessToken = null;
}

// ── Core fetch helper ──────────────────────────────────────────────────────────
async function request(path, options = {}, retry = true) {
  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include', // send httpOnly refresh cookie
    ...options,
    headers,
  });

  // Attempt silent token refresh on 401
  if (res.status === 401 && retry) {
    const refreshed = await silentRefresh();
    if (refreshed) {
      return request(path, options, false); // retry once
    }
    // Refresh failed → clear token and let the caller handle it
    clearAccessToken();
    throw new ApiError({ code: 'UNAUTHORIZED', message: 'Session expired. Please log in again.' }, 401);
  }

  // Parse response
  let body;
  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    body = await res.json();
  } else {
    body = await res.text();
  }

  if (!res.ok) {
    // Normalise to the §6.3 error envelope
    const errorPayload = body?.error ?? { code: 'INTERNAL', message: String(body) };
    throw new ApiError(errorPayload, res.status);
  }

  return body;
}

// ── Silent refresh ─────────────────────────────────────────────────────────────
async function silentRefresh() {
  try {
    const body = await request('/auth/refresh', { method: 'POST' }, false);
    if (body?.data?.accessToken) {
      setAccessToken(body.data.accessToken);
      return true;
    }
  } catch {
    /* refresh failed */
  }
  return false;
}

// ── Public API ─────────────────────────────────────────────────────────────────
export const api = {
  get: (path, options) => request(path, { method: 'GET', ...options }),
  post: (path, body, options) =>
    request(path, { method: 'POST', body: JSON.stringify(body), ...options }),
  patch: (path, body, options) =>
    request(path, { method: 'PATCH', body: JSON.stringify(body), ...options }),
  put: (path, body, options) =>
    request(path, { method: 'PUT', body: JSON.stringify(body), ...options }),
  delete: (path, options) => request(path, { method: 'DELETE', ...options }),

  /** For multipart form uploads (no Content-Type so the browser sets the boundary) */
  upload: (path, formData, options) =>
    request(path, {
      method: 'POST',
      body: formData,
      headers: {}, // override default JSON content-type
      ...options,
    }),
};

// ── Error class ────────────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(payload, status) {
    super(payload.message ?? 'An error occurred');
    this.name = 'ApiError';
    this.code = payload.code;
    this.status = status;
    this.details = payload.details ?? [];
  }

  /** Return field-level errors keyed by field name for react-hook-form */
  fieldErrors() {
    return Object.fromEntries(this.details.map((d) => [d.field, { message: d.message }]));
  }
}
