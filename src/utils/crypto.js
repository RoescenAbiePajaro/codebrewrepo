import CryptoJS from 'crypto-js';

// Secret key for encryption/decryption
const secretKey = '12345678901234567890123456789012'; // In real-world apps, keep this safe

// Encryption function
export function encrypt(text) {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
}

// Decryption function
export function decrypt(encryptedText) {
    const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}
