import { verify } from "hono/jwt";

const jwtMiddleware = async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Missing or invalid Authorization header" }, 401);
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    c.set("user", payload);
    await next();
  } catch (err) {
    console.error("JWT error:", err);
    return c.json({ error: "Invalid or expired token" }, 401);
  }
};

export default jwtMiddleware;
