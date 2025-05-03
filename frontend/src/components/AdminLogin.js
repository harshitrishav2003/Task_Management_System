import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Container, TextField, Button, Typography, Alert, Box, Card, CardContent, CircularProgress, Grid, Divider, InputAdornment } from "@mui/material";
import { motion } from "framer-motion";
import { Email, Lock } from "@mui/icons-material";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post("http://localhost:5005/api/login", { email, password });
      const { token } = response.data;
      localStorage.setItem("jwtToken", token);

      const decodedToken = jwtDecode(token);
      if (decodedToken.role === "admin") {
        window.location.href = "/dashboard";
      } else {
        setError("Unauthorized access.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 12, display: "flex", justifyContent: "center", alignItems: "center" }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card sx={{ boxShadow: 8, borderRadius: 4, px: 5, py: 6, width: "500px" }}>
          <CardContent>
            <Typography variant="h4" fontWeight="bold" gutterBottom align="center" color="primary">
              Admin Login
            </Typography>
            <Divider sx={{ mb: 3 }} />
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
              </motion.div>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <TextField
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ height: 48, fontSize: 18, fontWeight: "bold", textTransform: "none" }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={26} color="inherit" /> : "Sign In"}
                </Button>
              </motion.div>
            </Box>
            {/* <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Forgot password?
              </Typography>
            </Grid> */}
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
};

export default AdminLogin;
