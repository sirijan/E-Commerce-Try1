const API_URL = import.meta.env.VITE_API_URL || "";

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/api${endpoint}`, {
    ...options,
    headers,
  });

  // Read response as text first
  const text = await response.text();

  let data = {};

  // Convert to JSON only if the response contains something
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (error) {
      console.error("Server returned non-JSON response:", text);
      throw new Error("Server returned an invalid response.");
    }
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
};