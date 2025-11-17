import { customAlphabet } from 'nanoid';

// Generate 6-digit alphanumeric code (uppercase letters and numbers)
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);

export const generateAccessCode = (): string => {
  return nanoid();
};

// Generate unique invite link token
const linkNanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 32);

export const generateInviteToken = (): string => {
  return linkNanoid();
};
