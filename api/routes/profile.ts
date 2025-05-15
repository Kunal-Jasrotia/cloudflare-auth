import { Hono } from "hono";
import { Env } from "../env";

const profileRouter = new Hono<Env>();

profileRouter.get("/", async (c) => {
  try {
    const user = c.get("user");
    const userId = user?.userId;

    const query = c.env.DB.prepare("SELECT * FROM users where id = ?").bind(
      userId
    );

    const { results } = await query.all();

    return Response.json({ message: "Profile fetched", user: results[0] });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return Response.json(
      { error: "Error fetching user info", message: error.message },
      { status: 500 }
    );
  }
});

export default profileRouter;
