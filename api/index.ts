import { Hono } from "hono";
import postgres from "postgres";
import { jwt } from "hono/jwt";
import { Env } from "./env";
import googleRouter from "./routes/goolge";

const app = new Hono<Env>();

// SQL client middleware
app.use("*", async (c, next) => {
  let connectionString =
    c.env.HYPERDRIVE?.connectionString || c.env.DATABASE_URL;

  if (!connectionString) {
    console.error("No database connection string provided");
    return c.json({ error: "Database config missing" }, 500);
  }

  try {
    const sql = postgres(connectionString, {
      max: 5,
      fetch_types: false,
      ssl: true,
      
    });

    c.env.SQL = sql;
    c.env.DB_AVAILABLE = true;
    await next();
    c.executionCtx.waitUntil(sql.end());
  } catch (error) {
    console.error("Database connection error:", error);
    return c.json({ error: "Database connection error" }, 500);
  }
});

// Public router (no auth)
const publicRouter = new Hono();

publicRouter.get("/test", (c) => {
  return c.json({ message: "API is running" });
});

app.route("/api", publicRouter);
app.route("/api/google", googleRouter);

export default {
  fetch: app.fetch,
};
