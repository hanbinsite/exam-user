const BASE_URL = 'https://exam-server.hanbin123.com/api/v1';

const STORAGE_KEY = 'auth_session';
const OBFUSCATE_KEY = 0x5a;

function obfuscate(str) {
  return btoa(
    String.fromCharCode(...[...str].map((c) => c.charCodeAt(0) ^ OBFUSCATE_KEY))
  );
}

function deobfuscate(encoded) {
  try {
    const raw = atob(encoded);
    return String.fromCharCode(...[...raw].map((c) => c.charCodeAt(0) ^ OBFUSCATE_KEY));
  } catch {
    return null;
  }
}

let token = (function hydrate() {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored) {
    return deobfuscate(stored);
  }
  return null;
})();

let onUnauthorized = null;

export function setToken(t) {
  token = t;
  if (t) {
    sessionStorage.setItem(STORAGE_KEY, obfuscate(t));
  } else {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

export function getToken() {
  return token;
}

export function setOnUnauthorized(fn) {
  onUnauthorized = fn;
}

function clearSession() {
  token = null;
  sessionStorage.removeItem(STORAGE_KEY);
  if (onUnauthorized) onUnauthorized();
}

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, config);
  const json = await res.json();

  if (json.code !== 200) {
    if (res.status === 401) {
      clearSession();
    }
    throw new Error(json.message || 'Request failed');
  }
  return json.data;
}

export function get(path) {
  return request('GET', path);
}

export function post(path, body) {
  return request('POST', path, body);
}

export function put(path, body) {
  return request('PUT', path, body);
}

export function del(path) {
  return request('DELETE', path);
}
