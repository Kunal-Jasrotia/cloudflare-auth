import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleEmailSubmit = async () => {
    if (!email) return;
    const res = await fetch("/api/forget-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Something went wrong");
      return;
    }

    setStep(2);
  };

  const handleOtpAndPasswordSubmit = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const res = await fetch("/api/forget-password/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, new_password: newPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to reset password");
      return;
    }

    alert("Password changed successfully");
    window.location.href = "/login";
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordsMatch(value === newPassword);
  };

  return (
    <Box
      sx={{
        mx: "auto",
        width: "100%",
        maxWidth: "500px",
        mt: "5rem",
        borderRadius: "12px",
        p: "2rem",
        background: "linear-gradient(to bottom, #ffffff, #f2f2f2)",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Typography fontWeight="bold" fontSize="32px" color="black">
          Forgot Password
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: "30px",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          mt: "2rem",
        }}
      >
        {step === 1 && (
          <>
            <TextField
              label="Enter your Email"
              fullWidth
              sx={{ gridColumn: "span 4" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              fullWidth
              onClick={handleEmailSubmit}
              sx={{
                gridColumn: "span 4",
                backgroundColor: "primary.main",
                color: "black",
              }}
            >
              Send OTP
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <TextField
              label="Enter OTP"
              fullWidth
              sx={{ gridColumn: "span 4" }}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              sx={{ gridColumn: "span 4" }}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordsMatch(e.target.value === confirmPassword);
              }}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              sx={{ gridColumn: "span 4" }}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={!passwordsMatch && confirmPassword !== ""}
              helperText={
                !passwordsMatch && confirmPassword !== ""
                  ? "Passwords do not match"
                  : ""
              }
            />
            <Button
              fullWidth
              onClick={handleOtpAndPasswordSubmit}
              sx={{
                gridColumn: "span 4",
                backgroundColor: "primary.main",
                color: "black",
              }}
            >
              Verify OTP & Reset Password
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;
