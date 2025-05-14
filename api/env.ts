import postgres from "postgres";

export interface Env {
  Bindings: {
    HYPERDRIVE: {
      connectionString: string;
    };
    GOOGLE_REDIRECT_URI: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    JWT_SECRET: string;
    SQL: postgres.Sql<{}>;
    DB_AVAILABLE: boolean;
    DATABASE_URL: string;
  };
}
