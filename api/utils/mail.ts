export async function sendOtpEmail(
  to: string,
  otp: string,
  resendApiKey: string
) {
  const body = {
    from: "no-reply@yourdomain.com",
    to,
    subject: "Your OTP Code",
    html: `<p>Your OTP code is <strong>${otp}</strong>. It will expire in 15 minutes.</p>`,
  };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Failed to send OTP email:", text);
    throw new Error("Failed to send OTP email");
  }
}
