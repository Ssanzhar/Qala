import {
  Box,
  CssBaseline,
  ThemeProvider,
  Modal,
  TextField,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import { theme } from "../components/theme";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useContext, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import RoomIcon from "@mui/icons-material/Room";
import { GlobalContext } from "../context/GlobalContext";
import { data } from "../data/data";
import { useAuth } from "../context/AuthProvider";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";

const MapUpdater = ({ marker }) => {
  const map = useMap();

  useEffect(() => {
    if (marker) {
      map.setView(marker, 13);
    }
  }, [marker, map]);

  return null;
};

const MapWithForm = () => {
  const { access } = useAuth();
  const { city } = useContext(GlobalContext);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    latitude: null,
    longitude: null,
    image: null,
    city: city ? data[city]?.id : 1,
  });
  const [markers, setMarkers] = useState([]);
  const marker = city
    ? [data[city]["latitude"], data[city]["longitude"]]
    : [43.222, 76.851];

  useEffect(() => {
    if (city) {
      setFormData((prevData) => ({
        ...prevData,
        city: data[city].id,
      }));
    }
  }, [city]);

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/filter-by-city/?city_id=${
            city ? data[city].id : 2
          }`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.statusText}`);
        }

        const result = await response.json();
        setMarkers(result);
      } catch (error) {
        console.error("Error fetching markers:", error);
      }
    };

    fetchMarkers();
  }, [access, city]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setFormData((prev) => ({
          ...prev,
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        }));
        setFormOpen(true);
      },
    });
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("latitude", formData.latitude);
    formDataToSend.append("longitude", formData.longitude);
    formDataToSend.append("image", formData.image);
    formDataToSend.append("city", formData.city);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/events/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      const newMarker = {
        name: formData.name,
        description: formData.description,
        latitude: formData.latitude,
        longitude: formData.longitude,
        image: formData.image,
        city: formData.city,
      };

      setMarkers((prev) => [...prev, newMarker]);
      setFormOpen(false);
      setFormData({
        name: "",
        description: "",
        latitude: null,
        longitude: null,
        image: null,
        city: city ? data[city]?.id : 1,
      });
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const customIcon = L.divIcon({
    className: "custom-icon",
    html: ReactDOMServer.renderToString(
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "transparent",
          width: "40px",
          height: "40px",
        }}
      >
        <RoomIcon
          style={{
            color: "#f50057",
            fontSize: "40px",
          }}
        />
      </div>
    ),
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          border: "1px solid gray",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <MapContainer
          center={[43.222, 76.851]}
          zoom={13}
          style={{ height: "89.7vh", width: "202vh" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
          />
          <MapUpdater marker={marker} />
          <MapClickHandler />
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={[marker.latitude, marker.longitude]}
              icon={customIcon}
            >
              <Popup>
                <Typography variant="h6" sx={{color: "text.primary"}}>Name: {marker.name}</Typography>
                <Typography variant="body2" color="text.primary">
                  Description: {marker.description}
                </Typography>
                {marker.image && (
                  <img
                    src={marker.image}
                    alt={marker.name}
                    style={{ width: "200px", height: "auto", marginTop: "8px" }}
                  />
                )}
                <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                  <Typography variant="h6">Votes: </Typography>
                  <IconButton aria-label="like">
                    <ThumbUpIcon />
                  </IconButton>
                  <Typography variant="body2" color="text.primary">
                    {marker.pos_votes}
                  </Typography>
                  <IconButton aria-label="dislike">
                    <ThumbDownIcon />
                  </IconButton>
                  <Typography variant="body2" color="text.primary">
                    {marker.neg_votes}
                  </Typography>
                </Box>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
      <Modal open={formOpen} onClose={() => setFormOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Add Event Details
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleInputChange}
              required
              sx={{ mb: 2, '& .MuiInputLabel-root': { color: 'text.primary' } }}
            />
            <TextField
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              required
              sx={{ mb: 2, '& .MuiInputLabel-root': { color: 'text.primary' } }}
            />
            <Button variant="contained" component="label" sx={{ mb: 2 }}>
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </Button>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button variant="contained" color="primary" type="submit">
                Save
              </Button>
              <Button variant="contained" onClick={() => setFormOpen()}>
                Cancel
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default MapWithForm;
