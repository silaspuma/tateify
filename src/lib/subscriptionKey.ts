/**
 * Derives a Firebase-safe key from a push subscription endpoint URL.
 * The endpoint is base64-encoded and non-alphanumeric characters replaced with underscores.
 */
export function subscriptionKey(endpoint: string): string {
  return Buffer.from(endpoint).toString('base64').replace(/[^a-zA-Z0-9]/g, '_');
}
