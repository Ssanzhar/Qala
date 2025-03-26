import { useRoutes } from "react-router-dom";
import Home from "./routes/Home";
import NavBar from "./components/NavBar";
import Maps from "./routes/Map";
import SignupPage from "./routes/Signup";
import LoginPage from "./routes/Login";
import { Box } from "@mui/material";
import { AuthProvider } from "./context/AuthProvider";
import AccountDashboard from "./routes/Profile";

function App() {
  const routes = useRoutes([
    {
      path: "/",
      element: <Home />,
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
    <Box>
      <AuthProvider>
        <NavBar />
        {routes}
      </AuthProvider>
    </Box>
  );
}

export default App;
