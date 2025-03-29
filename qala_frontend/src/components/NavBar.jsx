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
import { Link } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import { useAuth } from "../context/AuthProvider";
import { theme } from "./theme";

const NavBar = () => {
  const { city, setCity } = useContext(GlobalContext);
  const { access, logout } = useAuth();
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
        sx={{ bgcolor: "#F0FDFA", color: "#066B7D" }}
        elevation={1}
      >
        <Toolbar sx={{ marginTop: "0.7vh" }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "inherit",
              flexGrow: 1,
            }}
          >
            Qala
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl sx={{ m: 1, minWidth: 80 }}>
              <InputLabel id="select">City</InputLabel>
              <Select id="select" value={city} onChange={handleCity}>
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {cities.map((el) => (
                  <MenuItem value={el} key={el}>
                    {el}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button component={Link} to="/map" color="inherit">
              Map
            </Button>
            <Button component={Link} to="/events" color="inherit">
              Events
            </Button>
            {access ? (
              <>
                <Button component={Link} to="/profile" color="inherit">
                  Profile
                </Button>
                <Button color="inherit" onClick={logout}>
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} to="/login" color="inherit">
                  Log In
                </Button>
                <Button component={Link} to="/signup" color="inherit">
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
