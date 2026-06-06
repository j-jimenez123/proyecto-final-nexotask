import { betterAuth } from "better-auth";
import { sqlite } from "../db";

export const auth = betterAuth({
  database: sqlite,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
});
