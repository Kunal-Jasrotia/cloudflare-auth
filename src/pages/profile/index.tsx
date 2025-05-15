import { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";

type UserPayload = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
};

function WelcomePage() {
  const [user, setUser] = useState<UserPayload | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
      })
      .catch((err) => console.error("Failed to fetch user:", err));
  }, []);

  return (
    <Box
      sx={{
        maxWidth: "600px",
        margin: "5rem auto",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        background: "linear-gradient(to bottom, #ffffff, #f9f9f9)",
      }}
    >
      {user ? (
        <>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome, {user.full_name}!
          </Typography>
          <Paper
            elevation={0}
            sx={{
              background: "transparent",
              mt: 2,
              display: "grid",
              gap: "10px",
            }}
          >
            <Typography>
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography>
              <strong>Phone:</strong> {user.phone || "N/A"}
            </Typography>
            <Typography>
              <strong>Date of Birth:</strong> {user.date_of_birth || "N/A"}
            </Typography>
          </Paper>
        </>
      ) : (
        <Typography>Loading user information...</Typography>
      )}
    </Box>
  );
}

export default WelcomePage;
