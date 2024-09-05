import CryptoJS from "crypto-js";
import Cookies from "js-cookie";

const encryptionKey = "my-secret-key"; // Ideally, store this in your .env file

function encryptData(data: string) {
  // Encrypt the data using AES encryption
  return CryptoJS.AES.encrypt(data, encryptionKey).toString();
}
export function setEncryptedCookie(data: string) {
  const encryptedData = encryptData(data);

  // Store the encrypted data in a cookie
  Cookies.set("privateKey", encryptedData, {
    secure: true,
    sameSite: "Strict",
    expires: 1, // Expires in 1 day (you can adjust as needed)
  });
}

function decryptData(encryptedData: string) {
  const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function getDecryptedCookie() {
  const encryptedData = Cookies.get("privateKey");
  if (encryptedData) {
    return decryptData(encryptedData);
  }
  return null;
}
