
// Simple client-side obfuscation/encryption for short links
// In a production environment, this should ideally be signed by a backend, 
// but this works for a client-side demo to prevent casual URL tampering.

const SECRET_KEY = "E2S_RESELLER_SECURE_KEY_2025"; 

interface ResellerData {
  aid: string; // Affiliate ID
  p: number;   // Price
}

export const encryptResellerData = (affiliateId: string, price: number): string => {
  try {
    const data: ResellerData = { aid: affiliateId, p: price };
    const json = JSON.stringify(data);
    
    // Simple XOR Cipher
    let result = "";
    for(let i = 0; i < json.length; i++) {
      result += String.fromCharCode(json.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
    }
    
    // Convert to Base64 URL Safe
    return btoa(result)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (e) {
    console.error("Encryption failed", e);
    return "";
  }
};

export const decryptResellerData = (encoded: string): ResellerData | null => {
  try {
    // Restore Base64
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    
    const text = atob(base64);
    let result = "";
    for(let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
    }
    
    return JSON.parse(result);
  } catch (e) {
    // console.error("Decryption failed", e); // Silent fail is better for UI
    return null;
  }
};
