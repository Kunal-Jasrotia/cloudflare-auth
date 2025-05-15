import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { Env } from "./env";
import googleRouter from "./routes/goolge";
import profileRouter from "./routes/profile";
import loginRouter from "./routes/login";
import signupRouter from "./routes/signup";
import forgotPasswordRouter from "./routes/forget-password";
import jwtMiddleware from "./middleware/auth";

const app = new Hono<Env>();

type UserPayload = {
  userId: string;
};

declare module "hono" {
  interface ContextVariableMap {
    user: UserPayload;
  }
}

// Public router (no auth)
const test = new Hono();

test.get("/test", (c) => {
  return c.json({ message: "API is running" });
});

app.route("/api", test);
app.route("/api/google", googleRouter);
app.route("/api/profile", profileRouter);
app.route("/api/login", loginRouter);
app.route("/api/signup", signupRouter);
app.route("/api/forget-password", forgotPasswordRouter);

export default {
  fetch: app.fetch,
};
