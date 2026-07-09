import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  port: number;
  nodeEnv: string;
  mongoUri: string;
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
};
