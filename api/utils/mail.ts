export async function sendOtpEmail(to: string, otp: string) {
  const domain = "sandbox476938a25f664667806eabd1666a8c15.mailgun.org";
  const apiKey = "8541062c0fda3ede51a63d0a480e52df-e71583bb-a6776353";

  const auth = btoa(`api:${apiKey}`);

  const res = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      from: `<postmaster@${domain}>`,
      to,
      subject: "Your OTP Code",
      html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 15 minutes.</p>`,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Mailgun error:", err);
    throw new Error("Failed to send OTP email");
  }
}
