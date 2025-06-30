import { Request, Response } from "express";
import { redisGet, redisSet, redisTTL } from "../config/redis-client";
import { generateSalt } from "../utils/passwordHasher";
import generateQRCode from "../utils/generateQRCode";

export const getQRCode = async (req: Request, res: Response) => {
  const businessId = req.userId;
  const value = await redisGet(`qr-code:${businessId}`);

  if (!value) {
    const salt = generateSalt();
    const qrCode = await generateQRCode(businessId, salt);
    await redisSet(
      `qr-code:${businessId}`,
      JSON.stringify({ salt, qrCode }),
      30
    );
    res.status(200).json({
      new: true,
      qrCode: qrCode,
    });
    return;
  }
  const { qrCode } = JSON.parse(value);
  res.status(200).json({
    new: false,
    qrCode: qrCode,
    ttl: await redisTTL(`qr-code:${businessId}`),
  });

  try {
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
