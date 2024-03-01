import crypto from "crypto";

function createHashPassword(authString) {
  const hmac = crypto.createHmac("sha256", process.env.SECRET_KEY);
  hmac.update(authString);
  return hmac.digest("hex");
}

export { createHashPassword };
