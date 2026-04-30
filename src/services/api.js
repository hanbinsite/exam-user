const BASE_URL = 'https://exam-server.hanbin123.com/api/v1';

let token = localStorage.getItem('auth_token');
let onUnauthorized = null;

export function setToken(t) {
  token = t;
  if (t) {
    localStorage.setItem('auth_token', t);
  } else {
    localStorage.removeItem('auth_token');
  }
}

export function getToken() {
  return token;
}

export function setOnUnauthorized(fn) {
  onUnauthorized = fn;
}

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, config);
  const json = await res.json();

  if (json.code !== 200) {
    if (res.status === 401 && onUnauthorized) {
      setToken(null);
      onUnauthorized();
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
