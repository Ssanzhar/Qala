import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { theme } from "../components/theme";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
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

    if (!formData.username || !formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await login(formData.username, formData.password);
    } catch (error) {
      console.error("Login failed:", error.message);
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
            padding: 4,
            borderRadius: 3,
            boxShadow: 3,
            marginTop: 7,
            bgcolor: "background.default",
            color: "text.primary",
          }}
        >
          <Typography
            variant="h5"
            fontWeight={600}
            textAlign="center"
            color="text.primary"
          >
            Welcome Back!
          </Typography>
          <TextField
            margin="normal"
            fullWidth
            id="username"
            label={<Typography color="text.primary">Username</Typography>}
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
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
            Sign In
          </Button>
          <Typography variant="body2" textAlign="center" color="text.primary">
            Don't have an account?{" "}
            <span
              style={{ color: "#2d79f3", cursor: "pointer" }}
              onClick={() => {
                navigate("/signup");
              }}
            >
              Sign Up
            </span>
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default LoginPage;
