import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Button,
  Container,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import { theme } from "../components/theme";
import { useAuth } from "../context/AuthProvider";
import { data } from "../data/data";

const userAccount = {
  username: "",
  email: "",
  profilePic: "",
};

const AccountDashboard = () => {
  const [user, setUser] = useState(userAccount);
  const [eventsData, setEventsData] = useState([]);
  const [newData, setNewData] = useState(data);
  const { access, logout } = useAuth() || {};
  
  const getUserEvents = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/user-events/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch user events");
      return await response.json();
    } catch (error) {
      console.error("Error fetching user events:", error);
      return [];
    }
  };

  const getUser = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch user");
      return await response.json();
    } catch (error) {
      console.error("Error fetching user:", error);
      return userAccount;
    }
  };

  useEffect(() => {
    if (!access) return;
    const fetchData = async () => {
      const events = await getUserEvents();
      setEventsData(events);
      const userData = await getUser();
      setUser(userData);
    };
    fetchData();
  }, [access]);

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/events/${eventId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete event");
      setEventsData((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
      console.log("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting the event:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container style={{ marginTop: 20 }}>
        <Card style={{ marginBottom: 20 }}>
          <CardContent style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              alt={user.username}
              src={user.profilePic}
              style={{ width: 80, height: 80, marginRight: 16 }}
            />
            <div>
              <Typography variant="h5">{user.username}</Typography>
              <Typography variant="body1">{user.email}</Typography>
            </div>
          </CardContent>
        </Card>
        <Card style={{ marginBottom: 20 }}>
          <CardContent>
            <Typography variant="h6">Events You Created</Typography>
            <List>
              {eventsData.map((event) => (
                <ListItem key={event.id}>
                  <ListItemText
                    primary={`Title: ${event.name}`}
                    secondary={
                      <>
                        <Typography variant="body2">
                          Location: lat: {event.latitude}, lon: {event.longitude}, city: {Object.entries(data).find(([key, value]) => value.id === event.city)?.[0]}
                        </Typography>
                        <Typography variant="body2">
                          Upvotes: {event.pos_votes} | Downvotes: {event.neg_votes}
                        </Typography>
                      </>
                    }
                  />
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    Delete
                  </Button>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
        <Button variant="contained" color="primary" onClick={logout}>
          Log Out
        </Button>
      </Container>
    </ThemeProvider>
  );
};

export default AccountDashboard;
