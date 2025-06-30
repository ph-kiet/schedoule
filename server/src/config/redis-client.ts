import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
  url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:6379`,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

redisClient.connect();

export const redisSet = async (
  key: string,
  value: string,
  ex: number
): Promise<void> => {
  await redisClient.set(key, value, { expiration: { type: "EX", value: ex } });
};

export const redisGet = async (key: string): Promise<string | null> => {
  return redisClient.get(key);
};

export const redisDelete = async (key: string) => {
  await redisClient.del(key);
};

export const redisTTL = async (key: string): Promise<number> => {
  return await redisClient.ttl(key);
};
