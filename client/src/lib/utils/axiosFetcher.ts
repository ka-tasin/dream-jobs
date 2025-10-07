// client/src/lib/utils/fetchClient.ts
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface FetchClientOptions extends Omit<RequestInit, "body"> {
  body?: any;
}

export interface FetchClientError {
  message: string;
  status: number;
  data: any;
}

const fetchClient = async <T = any>(
  endpoint: string,
  { method = "GET", headers = {}, body, ...rest }: FetchClientOptions = {}
): Promise<T> => {
  try {
    const config: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      ...rest,
    };

    if (body && method !== "GET") {
      config.body = JSON.stringify(body);
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, config);

    const data = await res.json();

    if (!res.ok) {
      throw {
        message: data?.message || "An error occurred",
        status: res.status,
        data,
      } as FetchClientError;
    }

    return data as T;
  } catch (error: any) {
    throw {
      message: error.message || "Network error",
      status: error.status || 500,
      data: error.data || null,
    } as FetchClientError;
  }
};

export default fetchClient;
