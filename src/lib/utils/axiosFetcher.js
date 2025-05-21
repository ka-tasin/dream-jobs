// lib/api.js

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Helper to handle fetch requests
const fetchClient = async (
  endpoint,
  { method = "GET", body, headers = {} } = {}
) => {
  try {
    const config = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    // Attach body only if present and not GET
    if (body && method !== "GET") {
      config.body = JSON.stringify(body);
    }

    // Future token logic can be added here:
    // const token = getAuthToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}${endpoint}`, config);

    const data = await res.json();

    if (!res.ok) {
      throw {
        message: data?.message || "An error occurred",
        status: res.status,
        data,
      };
    }

    return data;
  } catch (error) {
    // Format error consistently
    throw {
      message: error.message || "Network error",
      status: error.status || 500,
      data: error.data || null,
    };
  }
};

export default fetchClient;
