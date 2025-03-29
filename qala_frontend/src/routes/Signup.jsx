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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            color: "text.primary",
            bgcolor: "background.default",
            padding: 4,
            borderRadius: 3,
            boxShadow: 3,
            marginTop: 7,
          }}
        >
          <Typography
            variant="h5"
            fontWeight={600}
            textAlign="center"
            color="text.primary"
          >
            Sign Up
          </Typography>
          <TextField
            margin="normal"
            autoFocus
            fullWidth
            id="email"
            label={<Typography color="text.primary">Email Address</Typography>}
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "text.primary" },
                "&:hover fieldset": { borderColor: "text.primary" },
                "&.Mui-focused fieldset": { borderColor: "text.primary" },
              },
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            id="username"
            label={<Typography color="text.primary">Username</Typography>}
            name="username"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
            sx={{
              marginTop: -1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "text.primary" },
                "&:hover fieldset": { borderColor: "text.primary" },
                "&.Mui-focused fieldset": { borderColor: "text.primary" },
              },
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label={<Typography color="text.primary">Password</Typography>}
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            sx={{
              marginTop: -1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "text.primary" },
                "&:hover fieldset": { borderColor: "text.primary" },
                "&.Mui-focused fieldset": { borderColor: "text.primary" },
              },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                sx={{
                  color: "text.primary",
                  "&.Mui-checked": {
                    color: "text.primary",
                  },
                }}
              />
            }
            label={<Typography color="text.primary">Remember me</Typography>}
          />
          <Typography
            variant="body2"
            color="blue"
            sx={{ cursor: "pointer", textAlign: "right", color: "#2d79f3" }}
          >
            Forgot password?
          </Typography>
          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{
              backgroundColor: "#151717",
              color: "text.secondary",
              textTransform: "none",
            }}
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
          <Typography variant="body2" textAlign="center" color="text.primary">
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
    </ThemeProvider>
  );
};

export default SignupPage;
