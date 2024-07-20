import crypto from "crypto";

export const generateUuid = (opts?: crypto.RandomUUIDOptions) => {
  return crypto.randomUUID(opts);
};
