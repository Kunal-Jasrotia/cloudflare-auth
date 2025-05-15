import { Hono } from "hono";
import { Env } from "../env";
import { sign } from "hono/jwt";
import hashPassword from "../utils/encyypt";

const signupRouter = new Hono<Env>();

signupRouter.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const { full_name, email, phone, password, date_of_birth } = body;

    if (!full_name || !email || !phone || !password) {
      return c.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await c.env.DB.prepare(
      "SELECT id FROM users WHERE email = ? OR phone = ?"
    )
      .bind(email, phone)
      .first<{ id: number }>();

    if (existingUser) {
      return c.json(
        { message: "User already exists please login" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const { results } = await c.env.DB.prepare(
      "INSERT INTO users (full_name, email, phone, password, date_of_birth) VALUES (?, ?, ?, ?, ?) RETURNING id"
    )
      .bind(full_name, email, phone, hashedPassword, date_of_birth || null)
      .run();

    const userId = results[0].id;
    const token = await sign(
      {
        userId,
      },
      c.env.JWT_SECRET
    );

    return c.json({ token, message: "Signup successful" });
  } catch (error) {
    console.error("Signup error:", error);
    return c.json(
      { error: "Error signing up", message: error.message },
      { status: 500 }
    );
  }
});

export default signupRouter;
