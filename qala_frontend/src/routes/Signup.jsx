import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  ThemeProvider,
  CssBaseline,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { theme } from "../components/theme";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const postSignup = async (data) => {
    const response = await fetch("http://127.0.0.1:8000/api/signup/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Signup failed");
    }
    return response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await postSignup(formData);
        alert("Signup successful! Tokens retrieved.");
        setFormData({ username: "", email: "", password: "" });
      } catch (error) {
        setErrors({ general: error.message });
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: "#ffffff",
          padding: 4,
          borderRadius: 3,
          boxShadow: 3,
          marginTop: 7,
        }}
      >
        <Typography variant="h5" fontWeight={600} textAlign="center">
          Sign Up
        </Typography>
        <TextField
          margin="normal"
          autoFocus
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          value={formData.username}
          onChange={handleChange}
          error={!!errors.username}
          helperText={errors.username}
          sx={{ marginTop: -1 }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          sx={{ marginTop: -1 }}
        />
        <FormControlLabel control={<Checkbox />} label="Remember me" />
        <Typography
          variant="body2"
          color="primary"
          sx={{ cursor: "pointer", textAlign: "right" }}
        >
          Forgot password?
        </Typography>
        <Button
          variant="contained"
          type="submit"
          fullWidth
          sx={{ backgroundColor: "#151717", color: "white" }}
          onClick={handleSubmit}
        >
          Sign In
        </Button>
        <Typography variant="body2" textAlign="center">
          Have an account?{" "}
          <span
            style={{ color: "#2d79f3", cursor: "pointer" }}
            onClick={() => {
              navigate("/login");
            }}
          >
            Sign In
          </span>
        </Typography>
      </Box>
    </Container>
  );
};

export default SignupPage;
