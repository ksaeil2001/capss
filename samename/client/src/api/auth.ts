import { apiRequest } from "@/lib/queryClient";

/**
 * Request an anonymous JWT token from the server
 * @returns {Promise<string>} The JWT token
 */
export async function getAnonymousToken(): Promise<string> {
  try {
    const res = await apiRequest("POST", "/api/auth/issue", {});
    const data = await res.json();
    return data.token;
  } catch (error) {
    console.error("Failed to get anonymous token:", error);
    throw new Error("Failed to get authorization token");
  }
}

/**
 * Store JWT token in local storage
 * @param {string} token The JWT token to store
 */
export function saveToken(token: string): void {
  localStorage.setItem("jwt_token", token);
}

/**
 * Retrieve JWT token from local storage
 * @returns {string|null} The JWT token or null if not found
 */
export function getToken(): string | null {
  return localStorage.getItem("jwt_token");
}

/**
 * Check if a JWT token exists in local storage
 * @returns {boolean} True if token exists, false otherwise
 */
export function hasToken(): boolean {
  return !!getToken();
}

/**
 * Remove JWT token from local storage
 */
export function removeToken(): void {
  localStorage.removeItem("jwt_token");
}
