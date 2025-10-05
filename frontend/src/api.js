// src/api.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

async function request(path, opts = {}) {
  const url = `${API_URL}${path}`;
  const headers = opts.headers ? { ...opts.headers } : {};

  // If body is not FormData and exists, stringify and set header
  if (opts.body && !(opts.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    ...opts,
    headers,
    credentials: 'include', // IMPORTANT: allow cookies from server
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // no json
  }

  if (!res.ok) {
    const message =
      (data && (data.error || data.message || (Array.isArray(data) && data[0]?.msg))) ||
      'Request failed';
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) =>
    request(path, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: (path, body) =>
    request(path, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  del: (path) => request(path, { method: 'DELETE' }),
};
