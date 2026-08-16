const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/developer';

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204 || response.status === 205) return null;

  // The Spring Boot backend returns HTTP 200 with an empty body for
  // create, update, and delete operations. Do not try to parse JSON
  // when the response has no content.
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export function getEmployees(pageNumber = 0, pageSize = 8) {
  return request(`/getAllDeveloper?pageNumber=${pageNumber}&pageSize=${pageSize}`);
}

export function createEmployee(employee) {
  return request('/create', { method: 'POST', body: JSON.stringify(employee) });
}

export function updateEmployee(employee) {
  return request('/update', { method: 'PUT', body: JSON.stringify(employee) });
}

export function deleteEmployee(id) {
  return request(`/deleteById/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
