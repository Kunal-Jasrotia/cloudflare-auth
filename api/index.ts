import { Hono } from "hono";
import postgres from "postgres";

interface Env {
  Bindings: {
    HYPERDRIVE: {
      connectionString: string;
    };
    DB_AVAILABLE: boolean;
    SQL: any;
  };
}

const app = new Hono<Env>();

// Setup SQL client middleware
app.use("*", async (c, next) => {
  // Check if Hyperdrive binding is available
  if (c.env.HYPERDRIVE) {
    try {
      // Create SQL client
      const sql = postgres(c.env.HYPERDRIVE.connectionString, {
        max: 5,
        fetch_types: false,
      });

      c.env.SQL = sql;
      c.env.DB_AVAILABLE = true;

      // Process the request
      await next();

      // Close the SQL connection after the response is sent
      c.executionCtx.waitUntil(sql.end());
    } catch (error) {
      console.error("Database connection error:", error);
      return Response.json(
        { error: "Database connection error" },
        { status: 500 }
      );
    }
  } else {
    return Response.json(
      { error: "Hyperdrive binding not found" },
      { status: 500 }
    );
  }
});
const Router = new Hono();

Router.get("/test", async (c) => {
  return Response.json({
    message: "API is running",
  });
});
app.route("/api", Router);

export default {
  fetch: app.fetch,
};
