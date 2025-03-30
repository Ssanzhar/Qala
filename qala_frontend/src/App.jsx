import { useRoutes } from "react-router-dom";
import Home from "./routes/Home";
import NavBar from "./components/NavBar";
import Maps from "./routes/Map";
import SignupPage from "./routes/Signup";
import LoginPage from "./routes/Login";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { AuthProvider } from "./context/AuthProvider";
import AccountDashboard from "./routes/Profile";
import Events from "./routes/Events";
import { theme } from "./components/theme";

function App() {
  const routes = useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/events",
      element: <Events />,
    },
    {
      path: "/map",
      element: <Maps />,
    },
    {
      path: "/signup",
      element: <SignupPage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/profile",
      element: <AccountDashboard />,
    },
  ]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          height: "100%",
          minHeight: "100vh",
          width: "100%",
          bgcolor: "background.primary",
        }}
      >
        <AuthProvider>
          <NavBar />
          {routes}
        </AuthProvider>
      </Box>
    </ThemeProvider>
  );
}

export default App;
