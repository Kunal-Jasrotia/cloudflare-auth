import { D1Database } from "@cloudflare/workers-types";

export interface Env {
  Bindings: {
    GOOGLE_REDIRECT_URI: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    JWT_SECRET: string;
    DB: D1Database;
    MAILGUN_API_KEY: string;
  };
}
