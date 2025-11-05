import {DecodedJWT} from '../types';

/**
 * Decode a JWT token into its components
 * @param token - The JWT token to decode
 * @returns Decoded JWT with header, payload, and signature
 */
export const decodeJWT = (token: string): DecodedJWT => {
  try {
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    const [headerPart, payloadPart, signaturePart] = parts;

    // Decode header
    const header = JSON.parse(base64UrlDecode(headerPart));
    
    // Decode payload
    const payload = JSON.parse(base64UrlDecode(payloadPart));

    return {
      header,
      payload,
      signature: signaturePart,
    };
  } catch (error) {
    throw new Error(`Failed to decode JWT: ${error}`);
  }
};

/**
 * Base64 URL decode
 * @param str - Base64 URL encoded string
 * @returns Decoded string
 */
const base64UrlDecode = (str: string): string => {
  // Replace base64url chars with base64 chars
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  
  // Pad with '=' characters if needed
  const padLength = 4 - (base64.length % 4);
  if (padLength !== 4) {
    base64 += '='.repeat(padLength);
  }
  
  // Decode base64
  return atob(base64);
};

/**
 * Format timestamp to human readable date
 * @param timestamp - Unix timestamp
 * @returns Formatted date string
 */
export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString();
};

/**
 * Check if JWT is expired
 * @param payload - JWT payload
 * @returns True if expired, false otherwise
 */
export const isJWTExpired = (payload: any): boolean => {
  if (!payload.exp) {
    return false; // No expiration claim
  }
  
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
};

/**
 * Get token expiration time in minutes
 * @param payload - JWT payload
 * @returns Minutes until expiration, or null if no expiration
 */
export const getTokenExpirationMinutes = (payload: any): number | null => {
  if (!payload.exp) {
    return null;
  }
  
  const now = Math.floor(Date.now() / 1000);
  const diffSeconds = payload.exp - now;
  
  if (diffSeconds <= 0) {
    return 0; // Already expired
  }
  
  return Math.floor(diffSeconds / 60);
};

/**
 * Extract common claims from JWT payload
 * @param payload - JWT payload
 * @returns Object with common claims
 */
export const extractCommonClaims = (payload: any) => {
  return {
    subject: payload.sub || 'N/A',
    issuer: payload.iss || 'N/A',
    audience: payload.aud || 'N/A',
    issuedAt: payload.iat ? formatTimestamp(payload.iat) : 'N/A',
    expiresAt: payload.exp ? formatTimestamp(payload.exp) : 'N/A',
    notBefore: payload.nbf ? formatTimestamp(payload.nbf) : 'N/A',
    jwtId: payload.jti || 'N/A',
    scope: payload.scope || 'N/A',
    email: payload.email || 'N/A',
    username: payload.username || payload.preferred_username || 'N/A',
    name: payload.name || 'N/A',
    roles: payload.roles || payload.realm_access?.roles || [],
    groups: payload.groups || [],
  };
};