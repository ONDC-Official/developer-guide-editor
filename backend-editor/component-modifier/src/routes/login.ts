import { Request, Response, NextFunction } from "express";
import express from "express";
import keytar from "keytar";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SERVICE_NAME = "dev-guide-editor";

const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.encryption_key, "hex");
const iv = Buffer.from(process.env.encryption_iv, "hex");

function encrypt(text: string) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text: string) {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

app.post("/createAccount", async (req: Request, res: Response) => {
  let { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }
  username = username.trim();
  password = password.trim();
  if (typeof password !== "string") {
    return res.status(400).send("Password must be a string");
  }
  if (typeof username !== "string") {
    return res.status(400).send("Username must be a string");
  }

  const existing = await keytar.getPassword(SERVICE_NAME, username);

  if (existing !== null) {
    return res.status(400).send("Username already exists");
  }

  const privateKey = crypto.randomBytes(32).toString("hex"); // Generate a private key
  const encryptedPassword = encrypt(password);

  await keytar.setPassword(SERVICE_NAME, username, encryptedPassword);
  await keytar.setPassword(
    SERVICE_NAME,
    `${username}_privateKey`,
    encrypt(privateKey)
  );

  res.json({ message: "Account created successfully" });
});

app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  const encryptedPassword = await keytar.getPassword(SERVICE_NAME, username);
  if (!encryptedPassword || decrypt(encryptedPassword) !== password) {
    return res.status(401).send("Invalid username or password");
  }

  const encryptedPrivateKey = await keytar.getPassword(
    SERVICE_NAME,
    `${username}_privateKey`
  );
  if (!encryptedPrivateKey) {
    return res.status(500).send("Failed to retrieve private key");
  }

  const privateKey = decrypt(encryptedPrivateKey);
  res.json({ privateKey });
});

app.post("/deleteAccount", async (req: Request, res: Response) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).send("Username is required");
  }

  await keytar.deletePassword(SERVICE_NAME, username);
  await keytar.deletePassword(SERVICE_NAME, `${username}_privateKey`);

  res.send("Account deleted successfully");
});
