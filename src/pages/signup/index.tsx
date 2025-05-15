import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";

const SignupPage = () => {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    dob: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updatedForm = { ...prev, [name]: value };
      if (name === "password" || name === "confirm_password") {
        setPasswordsMatch(
          updatedForm.password === updatedForm.confirm_password
        );
      }
      return updatedForm;
    });
  };

  const handleSubmit = async () => {
    const { full_name, email, phone, password, confirm_password, dob } = form;

    // Basic validations
    if (!full_name || !email || !phone || !password || !confirm_password) {
      return setError("Please fill all required fields.");
    }

    if (!passwordsMatch) {
      return setError("Passwords do not match.");
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name,
          email,
          phone,
          password,
          date_of_birth: dob || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        throw new Error(data.message || "Signup failed");
      }

      const token = data.token;
      localStorage.setItem("token", token);

      alert("Signup successful!");
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
          value={form.full_name}
          onChange={handleChange}
          required
          sx={{ gridColumn: "span 4" }}
        />
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          sx={{ gridColumn: "span 4" }}
        />
        <TextField
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          sx={{ gridColumn: "span 4" }}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          sx={{ gridColumn: "span 4" }}
        />
        <TextField
          label="Confirm Password"
          name="confirm_password"
          type="password"
          value={form.confirm_password}
          onChange={handleChange}
          required
          error={!passwordsMatch && form.confirm_password !== ""}
          helperText={
            !passwordsMatch && form.confirm_password !== ""
              ? "Passwords do not match"
              : ""
          }
          sx={{ gridColumn: "span 4" }}
        />
        <TextField
          label="Date of Birth (optional)"
          name="dob"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={form.dob}
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
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              backgroundColor: "primary.main",
              color: "black",
            }}
          >
            {loading ? "Signing Up..." : "Sign Up"}
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
  );
};

export default SignupPage;
