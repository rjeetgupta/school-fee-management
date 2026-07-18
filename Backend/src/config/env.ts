import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  port: number;
  nodeEnv: string;
  mongoUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  adminEmail: string;
  adminPassword: string;
  razorpayKeyId: string;
  razorpayKeySecret: string;
  razorpayWebhookSecret: string;
}

function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env: EnvConfig = {
  port: Number(getEnvVar("PORT", "5000")),
  nodeEnv: getEnvVar("NODE_ENV", "development"),
  mongoUri: getEnvVar("MONGO_URI", "mongodb://127.0.0.1:27017/school_fee_management"),
  jwtSecret: getEnvVar("JWT_SECRET"),
  jwtExpiresIn: getEnvVar("JWT_EXPIRES_IN", "1d"),
  adminEmail: getEnvVar("ADMIN_EMAIL"),
  adminPassword: getEnvVar("ADMIN_PASSWORD"),
  razorpayKeyId: getEnvVar("RAZORPAY_KEY_ID"),
  razorpayKeySecret: getEnvVar("RAZORPAY_KEY_SECRET"),
  razorpayWebhookSecret: getEnvVar("RAZORPAY_WEBHOOK_SECRET"),
};
