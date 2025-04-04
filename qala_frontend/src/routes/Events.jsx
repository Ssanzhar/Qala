import {
  Container,
  CssBaseline,
  ThemeProvider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  InputBase,
  Box,
} from "@mui/material";
import EventCard from "../components/EventCard";
import { theme } from "../components/theme";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { useAuth } from "../context/AuthProvider";
import { data } from "../data/data";
import SearchIcon from "@mui/icons-material/Search";

export default function Events() {
  const { city } = useContext(GlobalContext);
  const { access } = useAuth();
  const [events, setEvents] = useState([]);
  const [sortBy, setSortBy] = useState("Smart Search");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSmartSearch = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/smart-search/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ query: searchQuery }),
      });
      const result = await response.json();
      const arr = result['results'];
      setEvents(arr);
      console.log(events)
    } catch (error) {
      console.error("Smart search failed:", error);
    }
  };


  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setEvents((prevEvents) =>
      [...prevEvents].sort((a, b) => {
        if (event.target.value === "date") {
          return new Date(a.date) - new Date(b.date);
        } else if (event.target.value === "popularity") {
          return b.pos_votes - a.pos_votes;
        }
        return 0;
      })
    );
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const getEventsByDate = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/filter-by-city/?city_id=${
          city ? data[city].id : 2
        }`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${access}` },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const getEventsByPopularity = async () => {
    try {
      const response = await fetch( 
        `http://127.0.0.1:8000/api/sorted-by-votes/?city_id=${
          city ? data[city].id : 2
        }`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );

      const result = await response.json();

      return result;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    const fetchEventsByDate = async () => {
      const eventsData = await getEventsByDate();
      setEvents(eventsData);
    };

    const fetchEventsByPopularity = async () => {
      const eventsData = await getEventsByPopularity();
      setEvents(eventsData);
    };

    if (sortBy === "date") {
      fetchEventsByDate();
    } else {
      fetchEventsByPopularity();
    }
  }, [access, city, data, sortBy]);

  // const filteredEvents = events.filter(
  //   (event) =>
  //     event.name.toLowerCase().includes(searchQuery) ||
  //     event.description.toLowerCase().includes(searchQuery)
  // );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        sx={{
          mt: 2,
          ml: 5,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexDirection: 'row'
          }}
        >
          {sortBy === "Smart Search" && (
            <Paper
              component="form"
              sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: "50vh", borderRadius: "16px" }}
              onSubmit={(e) => {
                e.preventDefault();
                handleSmartSearch();
              }}
            >
              <SearchIcon sx={{ p: 1, color: "action.active" }} fontSize="large" />
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search events..."
                inputProps={{ "aria-label": "search events" }}
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </Paper>
          )}
          <FormControl
            sx={{
              minWidth: 200,
              height: "100%",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "black !important",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "black !important",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "black !important",
              },
            }}
          >
            <InputLabel
              sx={{
                color: "black !important",
                "&.Mui-focused": {
                  color: "black !important",
                },
              }}
            >
              Sort by
            </InputLabel>
            <Select value={sortBy} onChange={handleSortChange} label="Sort by">
              <MenuItem value="Smart Search">Smart Search</MenuItem>
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="popularity">Popularity</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{display: 'flex', flexDirection: 'row'}}>
          {events.length > 0 ? (
            events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.name}
                date={event.date}
                description={event.description}
                image={event.image}
                latitude={event.latitude}
                longitude={event.longitude}
                pvotes={event.pos_votes}
                nvotes={event.neg_votes}
                uservote={event.user_vote}
              />
            ))
          ) : (
            <p>No events found for the selected city.</p>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

