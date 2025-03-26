import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Collapse,
  styled,
  Divider,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAuth } from "../context/AuthProvider";

const EventCard = ({
  title,
  date,
  description,
  image,
  latitude,
  longitude,
  id,
  pvotes,
  nvotes,
  uservote,
}) => {
  const [vote, setVote] = useState(uservote === "positive" ? "upvote" : uservote === "negative" ? "downvote" : null);
  const [upvotes, setUpvotes] = useState(pvotes);
  const [downvotes, setDownvotes] = useState(nvotes);
  const [expanded, setExpanded] = useState(false);
  const { access } = useAuth();

  const ExpandMore = styled(IconButton)(({ theme }) => ({
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
    transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
  }));

  const sendVoteToBackend = async (voteType) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/votes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({
          event: id,
          vote_type: voteType,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to send vote to the backend");
      }
    } catch (error) {
      console.error("Error sending vote:", error);
    }
  };

  const handleVote = (type) => {
    if (vote === type) return;
    if (type === "upvote") {
      setUpvotes((prev) => prev + 1);
      if (vote === "downvote") setDownvotes((prev) => prev - 1);
    } else {
      setDownvotes((prev) => prev + 1);
      if (vote === "upvote") setUpvotes((prev) => prev - 1);
    }
    setVote(type);
    sendVoteToBackend(type === "upvote" ? "positive" : "negative");
  };

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ display: "flex", flexDirection: "column", maxWidth: 800, mb: 2 }}>
      <Box sx={{ display: "flex" }}>
        <CardMedia component="img" sx={{ width: 185 }} image={image || "/placeholder.jpg"} alt={title} />
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, alignItems: "center" }}>
              <Typography variant="h6">{title}</Typography>
              <Typography variant="body2" color="text.secondary">
                <LocationOnIcon sx={{ mr: 0.5 }} />
                {latitude}, {longitude}
              </Typography>
              <Typography variant="body2" color="text.secondary">{date}</Typography>
            </Box>
          </CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}>
            <Typography>
              Expand desription: 
            </Typography>
            <ExpandMore onClick={handleExpand} aria-expanded={expanded} aria-label="show more">
              <ExpandMoreIcon />
            </ExpandMore>
            <IconButton onClick={() => handleVote("upvote")} color={vote === "upvote" ? "success" : "default"}>
              <ThumbUpIcon />
            </IconButton>
            <Typography variant="body2">{upvotes}</Typography>
            <IconButton onClick={() => handleVote("downvote")} color={vote === "downvote" ? "error" : "default"}>
              <ThumbDownIcon />
            </IconButton>
            <Typography variant="body2">{downvotes}</Typography>
          </Box>
        </Box>
      </Box>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <CardContent>
          <Typography> Description: {description}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default EventCard;
