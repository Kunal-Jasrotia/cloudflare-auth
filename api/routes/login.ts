import { Hono } from "hono";
import { Env } from "../env";
import { sign } from "hono/jwt";
import hashPassword from "../utils/encyypt";

const loginRouter = new Hono<Env>();

loginRouter.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const { email, phone, password } = body;

    if ((!email && !phone) || !password) {
      return c.json(
        { error: "Email or phone and password are required" },
        { status: 400 }
      );
    }

    // Query by email or phone
    const query = email
      ? "SELECT id, password FROM users WHERE email = ?"
      : "SELECT id, password FROM users WHERE phone = ?";

    const identifier = email || phone;
    const user = await c.env.DB.prepare(query)
      .bind(identifier)
      .first<{ id: number; password: string }>();

    if (!user) {
      return c.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const hashedInput = await hashPassword(password);
    if (hashedInput !== user.password) {
      return c.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await sign({ userId: user.id }, c.env.JWT_SECRET);

    return c.json({ token, message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    return c.json(
      { error: "Login failed", message: error.message },
      { status: 500 }
    );
  }
});

export default loginRouter;
