import { Hono } from "hono";
import { Env } from "../env";
import axios from "axios";
import { sign } from "hono/jwt";

const googleRouter = new Hono<Env>();

googleRouter.get("/", async (c) => {
  const scope = ["openid ", "profile", "email"].join(" ");

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${
    c.env.GOOGLE_CLIENT_ID
  }&redirect_uri=${c.env.GOOGLE_REDIRECT_URI}&scope=${encodeURIComponent(
    scope
  )}&prompt=consent`;
  const sql = c.env.SQL;
  let user = await sql`SELECT * FROM user`;
  return Response.json({ message: authUrl, user: user });
});

googleRouter.get("/callback", async (c) => {
  const { code } = c.req.query();

  if (!code) return Response.json({ error: "Missing code" }, { status: 400 });
  console.log(code);

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      null,
      {
        params: {
          code,
          client_id: c.env.GOOGLE_CLIENT_ID,
          client_secret: c.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: c.env.GOOGLE_REDIRECT_URI,
          grant_type: "authorization_code",
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const { access_token } = tokenResponse.data;

    // Step 3: Use access token to fetch user info
    const userInfoResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const { name, email } = userInfoResponse.data;

    const sql = c.env.SQL;
    let user = await sql`SELECT * FROM user WHERE email = ${email}`;

    if (user.length === 0) {
      user =
        await sql`INSERT INTO user (full_name, email) VALUES (${name}, ${email}) RETURNING *`;
    }
    const userId = user[0].id;
    const token = await sign(
      {
        userId,
      },
      c.env.JWT_SECRET
    );

    // Step 4: Return token (or set it as a cookie if preferred)
    return c.json({
      message: "Login successful",
      token,
      user: { name, email },
    });

    return Response.json({ name, email });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return Response.json(
      { error: "Error fetching user info" },
      { status: 500 }
    );
  }
});

export default googleRouter;
