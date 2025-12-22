// Define the Base URL from environment variables
// This will use localhost during dev and your Static IP on Vercel
const BASE_URL = import.meta.env.VITE_API_URL 

/**
 * A typed wrapper for the fetch API
 * @param path The endpoint path (e.g., '/api/trade/process-intent')
 * @param options Standard fetch options (method, headers, body)
 */
export const apiFetch = async <T = any>(
  path: string, 
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server Error: ${errorText}`);
  }

  return response.json();
};