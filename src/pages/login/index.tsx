import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";

const LoginPage = () => {
  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    const { identifier, password } = form;

    if (!identifier || !password) {
      return setError("Please enter your email/phone and password.");
    }

    // Determine whether identifier is an email or phone
    const isEmail = /\S+@\S+\.\S+/.test(identifier);
    const isPhone = /^[0-9]{10,15}$/.test(identifier);

    if (!isEmail && !isPhone) {
      return setError("Please enter a valid email or phone number.");
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: isEmail ? identifier : undefined,
          phone: isPhone ? identifier : undefined,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        throw new Error(data.message || "Login failed");
      }

      // Save token and redirect to profile
      localStorage.setItem("token", data.token);
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      <Box sx={{ width: "100%", textAlign: "center" }}>
        <Typography fontWeight="bold" fontSize="32px" color="black">
          Login
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
          label="Email or Phone"
          name="identifier"
          value={form.identifier}
          onChange={handleChange}
          sx={{ gridColumn: "span 4" }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          sx={{ gridColumn: "span 4" }}
        />

        {error && (
          <Typography
            sx={{
              color: "red",
              gridColumn: "span 4",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            {error}
          </Typography>
        )}

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
            onClick={handleLogin}
            disabled={loading}
            sx={{
              backgroundColor: "primary.main",
              color: "black",
            }}
          >
            {loading ? "Logging In..." : "Login"}
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
            Login with Google
          </Button>
        </Box>

        <Box
          sx={{
            gridColumn: "span 4",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "14px",
          }}
        >
          <Typography
            sx={{
              color: "primary.main",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => {
              window.location.href = "/forgot-password";
            }}
          >
            Forgot Password?
          </Typography>
          <Typography
            sx={{
              color: "primary.main",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => {
              window.location.href = "/signup";
            }}
          >
            Don't have an account? Sign up
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
