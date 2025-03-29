// import React, { useContext, useState } from "react";
// import {
//   Box,
//   Button,
//   Container,
//   TextField,
//   Typography,
//   Paper,
//   ThemeProvider,
//   CssBaseline,
// } from "@mui/material";
// import { theme } from "../components/theme";
// import { GlobalContext } from "../context/GlobalContext";
// import { useAuth } from "../context/AuthProvider";

// const LoginPage = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//   });
//   const [errors, setErrors] = useState({});
//   const { login } = useAuth();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.username || !formData.username.trim()) {
//       newErrors.username = "Username is required";
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters long";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     try {
//       await login(formData.username, formData.password);
//     } catch (error) {
//       console.error("Login failed:", error.message);
//     }
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Container component="main" maxWidth="xs">
//         <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
//           <Typography component="h1" variant="h5" align="center">
//             Login
//           </Typography>
//           <Box
//             component="form"
//             onSubmit={handleSubmit}
//             noValidate
//             sx={{ mt: 1 }}
//           >
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="username"
//               label="Username"
//               name="username"
//               autoComplete="username"
//               autoFocus
//               value={formData.username}
//               onChange={handleChange}
//               error={!!errors.username}
//               helperText={errors.username}
//             />
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               name="password"
//               label="Password"
//               type="password"
//               id="password"
//               autoComplete="current-password"
//               value={formData.password}
//               onChange={handleChange}
//               error={!!errors.password}
//               helperText={errors.password}
//             />
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2 }}
//             >
//               Login
//             </Button>
//           </Box>
//         </Paper>
//       </Container>
//     </ThemeProvider>
//   );
// };

// export default LoginPage;

import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

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
          Sign In
        </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={formData.username}
          onChange={handleChange}
          error={!!errors.username}
          helperText={errors.username}
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
  );
};

export default LoginPage;
