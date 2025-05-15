import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailSubmit = () => {
    if (!email) return;
    // Call backend to send OTP
    console.log("Send OTP to:", email);
    setStep(2);
  };

  const handleOtpSubmit = () => {
    if (!otp) return;
    // Verify OTP with backend
    console.log("Verify OTP:", otp);
    setStep(3);
  };

  const handlePasswordReset = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Call backend to reset password
    console.log("Reset password for:", email, newPassword);
    alert("Password changed successfully");
    window.location.href = "/login";
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
            <Button
              fullWidth
              onClick={handleOtpSubmit}
              sx={{
                gridColumn: "span 4",
                backgroundColor: "primary.main",
                color: "black",
              }}
            >
              Verify OTP
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <TextField
              label="New Password"
              type="password"
              fullWidth
              sx={{ gridColumn: "span 4" }}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              sx={{ gridColumn: "span 4" }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              fullWidth
              onClick={handlePasswordReset}
              sx={{
                gridColumn: "span 4",
                backgroundColor: "primary.main",
                color: "black",
              }}
            >
              Reset Password
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;
