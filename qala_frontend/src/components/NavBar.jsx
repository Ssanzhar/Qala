import { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import { useAuth } from "../context/AuthProvider";
import { theme } from "./theme";
import logo from "../images_test/qala_b.png";

const NavBar = () => {
  const { city, setCity } = useContext(GlobalContext);
  const { access, logout } = useAuth();
  const navigate = useNavigate();
  const cities = [
    "Almaty",
    "Astana",
    "Shymkent",
    "Karaganda",
    "Aktobe",
    "Ust-Kamenogorsk",
    "Semey",
    "Taraz",
  ];

  const handleCity = (e) => {
    setCity(e.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="static"
        sx={{
          height: "10vh",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
        elevation={1}
      >
        <Toolbar>
          {/* <Box
            component="img"
            src={logo}
            sx={{ height: "90px" }}
            onClick={() => {
              navigate("/");
            }}
          ></Box> */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              flexGrow: 1,
              color: "text.primary",
              marginLeft: 10,
              fontSize: 35,
              fontWeight: 600,
            }}
          >
            Qala
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl sx={{ minWidth: 80 }}>
              <InputLabel id="select" sx={{ color: "text.primary" }}>
                City
              </InputLabel>
              <Select
                id="select"
                value={city}
                onChange={handleCity}
                sx={{
                  color: "text.primary",
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: "primary",
                      color: "text.secondary",
                    },
                  },
                }}
              >
                <MenuItem value="" sx={{ color: "text.secondary" }}>
                  <em>None</em>
                </MenuItem>
                {cities.map((el) => (
                  <MenuItem
                    value={el}
                    key={el}
                    sx={{ color: "text.secondary" }}
                  >
                    {el}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              component={Link}
              to="/map"
              sx={{ color: "text.primary", textTransform: "none" }}
            >
              Map
            </Button>
            <Button
              component={Link}
              to="/events"
              sx={{ color: "text.primary", textTransform: "none" }}
            >
              Events
            </Button>
            {access ? (
              <>
                <Button
                  component={Link}
                  to="/profile"
                  sx={{ color: "text.primary" }}
                >
                  Profile
                </Button>
                <Button
                  sx={{ color: "text.primary", textTransform: "none" }}
                  onClick={logout}
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  sx={{ color: "text.primary", textTransform: "none" }}
                >
                  Log In
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  sx={{ color: "text.primary", textTransform: "none" }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default NavBar;
