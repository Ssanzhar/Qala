import {
  Box,
  Button,
  Card,
  Container,
  CssBaseline,
  Grid,
  Paper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { theme } from "../components/theme";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: "background.primary", minHeight: "100vh" }}>
        <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
          <Paper
            elevation={3}
            sx={{
              borderRadius: 4,
              py: 8,
              px: 4,
              textAlign: "center",
              bgcolor: "white",
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: "bold",
                mb: 2,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                maxWidth: "800px",
                mx: "auto",
              }}
            >
              &#10024;Solve pressing issues of your city!
            </Typography>

            <Typography
              variant="h6"
              color="text.primary"
              sx={{
                mb: 4,
                maxWidth: "700px",
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              &#128205;Report the problems of you city for officials to resolve.
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                mb: 6,
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "black",
                  "&:hover": { bgcolor: "#333" },
                  borderRadius: "4px",
                  px: 3,
                  py: 1.5,
                  textTransform: "none",
                }}
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Sign Up
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "#e0e0e0",
                  color: "text.primary",
                  "&:hover": { borderColor: "#bdbdbd" },
                  borderRadius: "4px",
                  px: 3,
                  py: 1.5,
                  textTransform: "none",
                }}
                onClick={() => {
                  navigate("/login");
                }}
              >
                Sign In
              </Button>
            </Box>
          </Paper>
        </Container>
        <Container maxWidth="lg" sx={{ mb: 8 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 4, height: "100%", borderRadius: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <h1>&#128269;</h1>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{ fontWeight: "bold", mb: 1 }}
                  >
                    Report Accidents & Issues
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    &#128221; Add a title, description, and images to provide
                    details.
                  </Typography>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 4, height: "100%", borderRadius: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <h1>&#128101;</h1>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{ fontWeight: "bold", mb: 1 }}
                  >
                    Community Engagement
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    &#128077; Vote on issues to highlight importance.
                  </Typography>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 4, height: "100%", borderRadius: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <h1>&#129309;</h1>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{ fontWeight: "bold", mb: 1 }}
                  >
                    Verification & Trust
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                  &#128272; Admin-approved incident verification.
                    status.
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
