import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
// const TAG_LENGTH = 16;

export const generateEncryptionKey = (): string => {
  return randomBytes(KEY_LENGTH).toString('hex');
};

export const encryptFile = (buffer: Buffer, key: string): { encrypted: Buffer; iv: string; tag: string } => {
  const keyBuffer = Buffer.from(key, 'hex');
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, keyBuffer, iv);
  
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const tag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: tag.toString('hex')
  };
};

export const decryptFile = (encryptedBuffer: Buffer, key: string, iv: string, tag: string): Buffer => {
  const keyBuffer = Buffer.from(key, 'hex');
  const ivBuffer = Buffer.from(iv, 'hex');
  const tagBuffer = Buffer.from(tag, 'hex');
  
  const decipher = createDecipheriv(ALGORITHM, keyBuffer, ivBuffer);
  decipher.setAuthTag(tagBuffer);
  
  return Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
};