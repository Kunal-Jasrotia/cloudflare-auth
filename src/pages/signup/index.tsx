import { Box, Button, TextField, Typography } from "@mui/material";

const SignupPage = () => {
  return (
    <>
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
        <Box sx={{ width: "100%", textAlign: "center" }}>
          <Typography fontWeight="bold" fontSize="32px" color="black">
            Sign Up
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
          <TextField
            label="Full Name"
            name="full_name"
            required
            sx={{ gridColumn: "span 4" }}
          />
          <TextField
            label="Email"
            name="email"
            required
            sx={{ gridColumn: "span 4" }}
          />
          <TextField
            label="Phone"
            name="phone"
            required
            sx={{ gridColumn: "span 4" }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            required
            sx={{ gridColumn: "span 4" }}
          />
          <TextField
            label="Confirm Password"
            name="confirm_password"
            type="password"
            required
            sx={{ gridColumn: "span 4" }}
          />
          <TextField
            label="Date of Birth (optional)"
            name="dob"
            type="date"
            InputLabelProps={{ shrink: true }}
            sx={{ gridColumn: "span 4" }}
          />

          <Box
            sx={{
              gridColumn: "span 4",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Button
              fullWidth
              sx={{
                backgroundColor: "primary.main",
                color: "black",
              }}
            >
              Sign Up
            </Button>
            <Button
              fullWidth
              sx={{
                backgroundColor: "#FF5B61",
                color: "black",
              }}
              onClick={() => {
                window.location.href = "/google";
              }}
            >
              Sign Up with Google
            </Button>
          </Box>

          <Typography
            sx={{
              gridColumn: "span 4",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            Already have an account?{" "}
            <span
              style={{
                color: "#1976d2",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => {
                window.location.href = "/login";
              }}
            >
              Login
            </span>
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default SignupPage;
