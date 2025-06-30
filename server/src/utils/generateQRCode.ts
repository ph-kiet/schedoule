import crypto from "crypto";
import QRCode from "qrcode";

export default async function generateQRCode(businessId: string, salt: string) {
  const token = crypto
    .createHmac("sha256", salt) // salt from redis
    .update(businessId)
    .digest("hex")
    .slice(0, 10); // Shorten for simplicity

  console.log(token);
  const qrURL = `${process.env.CLIENT_URL}/attendance?token=${token}`;

  return await QRCode.toDataURL(qrURL, {
    errorCorrectionLevel: "L",
    type: "image/png",
    scale: 10,
  });
}
