import { Hono } from "hono";
import { Env } from "../env";
import hashPassword from "../utils/encyypt";
import { sendOtpEmail } from "../utils/mail";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
}

const forgotPasswordRouter = new Hono<Env>();

forgotPasswordRouter.post("/", async (c) => {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({ error: "Email or phone is required" }, { status: 400 });
    }

    // Find user
    const user = await c.env.DB.prepare(
      "SELECT id, email FROM users WHERE email = ?"
    )
      .bind(email)
      .first<{ id: number; email?: string; phone?: string }>();

    if (!user) {
      return c.json({ error: "User not found" }, { status: 404 });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins expiry

    await c.env.DB.prepare(
      "INSERT INTO password_otps (user_id, otp, expires_at) VALUES (?, ?, ?)"
    )
      .bind(user.id, otp, expiresAt)
      .run();

    // TODO: Send OTP via email or SMS (console.log for now)
    if (user.email) {
      await sendOtpEmail(user.email, otp, c.env.MAILGUN_API_KEY);

      // integrate email sending here
    }

    return c.json({ message: "OTP sent " });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return c.json({ error: "Failed to send OTP" }, { status: 500 });
  }
});

forgotPasswordRouter.post("/verify", async (c) => {
  try {
    const { email, otp, new_password } = await c.req.json();

    if (!email || !otp || !new_password) {
      return c.json(
        { error: "Email or phone, OTP and new password are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await c.env.DB.prepare("SELECT id FROM users WHERE email = ?")
      .bind(email)
      .first<{ id: number }>();

    if (!user) {
      return c.json({ error: "User not found" }, { status: 404 });
    }

    // Validate OTP
    const otpRow = await c.env.DB.prepare(
      `SELECT * FROM password_otps WHERE user_id = ? AND otp = ? AND expires_at > datetime('now')`
    )
      .bind(user.id, otp)
      .first();

    if (!otpRow) {
      return c.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // Update password
    const hashed = await hashPassword(new_password);
    await c.env.DB.prepare("UPDATE users SET password = ? WHERE id = ?")
      .bind(hashed, user.id)
      .run();

    // Invalidate OTP
    await c.env.DB.prepare("DELETE FROM password_otps WHERE user_id = ?")
      .bind(user.id)
      .run();

    return c.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return c.json({ error: "Failed to send OTP" }, { status: 500 });
  }
});

export default forgotPasswordRouter;
