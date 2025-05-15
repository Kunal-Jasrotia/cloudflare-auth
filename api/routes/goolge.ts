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

  const user = await c.env.DB.prepare("SELECT * FROM users").first<{
    id: string;
  }>();

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

    let user = await c.env.DB.prepare("SELECT * FROM users WHERE email = ?")
      .bind(email)
      .first<{ id: string }>();

    if (!user?.id) {
      user = (await c.env.DB.prepare(
        "INSERT INTO users (full_name, email, oauth_used) VALUES (?, ?,?) RETURNING id"
      )
        .bind(name, email, true)
        .first<{ id: string }>()) as { id: string };
    }
    console.log(user);

    const userId = user[0]?.id;
    const token = await sign(
      {
        userId,
      },
      c.env.JWT_SECRET
    );

    return Response.json({ message: "User info fetched successfully", token });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return Response.json(
      { error: "Error fetching user info", message: error.message },
      { status: 500 }
    );
  }
});

export default googleRouter;
