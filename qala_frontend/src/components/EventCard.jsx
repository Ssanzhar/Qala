// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardMedia,
//   Typography,
//   Box,
//   IconButton,
//   Collapse,
//   styled,
//   Divider,
//   ThemeProvider,
//   CssBaseline,
//   Button,
//   CardActionArea,
// } from "@mui/material";
// import ThumbUpIcon from "@mui/icons-material/ThumbUp";
// import ThumbDownIcon from "@mui/icons-material/ThumbDown";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { useAuth } from "../context/AuthProvider";
// import { theme } from "./theme";
// import chess from '../images_test/chess.jpg';

// const EventCard = ({
//   title,
//   date,
//   description,
//   image,
//   latitude,
//   longitude,
//   id,
//   pvotes,
//   nvotes,
//   uservote,
// }) => {
//   const [vote, setVote] = useState(uservote === "positive" ? "upvote" : uservote === "negative" ? "downvote" : null);
//   const [upvotes, setUpvotes] = useState(pvotes);
//   const [downvotes, setDownvotes] = useState(nvotes);
//   const [expanded, setExpanded] = useState(false);
//   const { access } = useAuth();

//   const ExpandMore = styled(IconButton)(({ theme }) => ({
//     marginLeft: "auto",
//     transition: theme.transitions.create("transform", {
//       duration: theme.transitions.duration.shortest,
//     }),
//     transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
//   }));

//   const sendVoteToBackend = async (voteType) => {
//     try {
//       const response = await fetch("http://127.0.0.1:8000/api/votes/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${access}`,
//         },
//         body: JSON.stringify({
//           event: id,
//           vote_type: voteType,
//         }),
//       });
//       if (!response.ok) {
//         throw new Error("Failed to send vote to the backend");
//       }
//     } catch (error) {
//       console.error("Error sending vote:", error);
//     }
//   };

//   const handleVote = (type) => {
//     if (vote === type) return;
//     if (type === "upvote") {
//       setUpvotes((prev) => prev + 1);
//       if (vote === "downvote") setDownvotes((prev) => prev - 1);
//     } else {
//       setDownvotes((prev) => prev + 1);
//       if (vote === "upvote") setUpvotes((prev) => prev - 1);
//     }
//     setVote(type);
//     sendVoteToBackend(type === "upvote" ? "positive" : "negative");
//   };

//   const handleExpand = () => {
//     setExpanded(!expanded);
//   };

//   return (
//     // <Card sx={{ display: "flex", flexDirection: "column", maxWidth: 800, mb: 2 }}>
//     //   <Box sx={{ display: "flex" }}>
//     //     <CardMedia component="img" sx={{ width: 185 }} image={image || "/placeholder.jpg"} alt={title} />
//     //     <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
//     //       <CardContent>
//     //         <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, alignItems: "center" }}>
//     //           <Typography variant="h6">{title}</Typography>
//     //           <Typography variant="body2" color="text.secondary">
//     //             <LocationOnIcon sx={{ mr: 0.5 }} />
//     //             {latitude}, {longitude}
//     //           </Typography>
//     //           <Typography variant="body2" color="text.secondary">{date}</Typography>
//     //         </Box>
//     //       </CardContent>
//     //       <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}>
//     //         <Typography>
//     //           Expand desription: 
//     //         </Typography>
//     //         <ExpandMore onClick={handleExpand} aria-expanded={expanded} aria-label="show more">
//     //           <ExpandMoreIcon />
//     //         </ExpandMore>
//     //         <IconButton onClick={() => handleVote("upvote")} color={vote === "upvote" ? "success" : "default"}>
//     //           <ThumbUpIcon />
//     //         </IconButton>
//     //         <Typography variant="body2">{upvotes}</Typography>
//     //         <IconButton onClick={() => handleVote("downvote")} color={vote === "downvote" ? "error" : "default"}>
//     //           <ThumbDownIcon />
//     //         </IconButton>
//     //         <Typography variant="body2">{downvotes}</Typography>
//     //       </Box>
//     //     </Box>
//     //   </Box>
//     //   <Collapse in={expanded} timeout="auto" unmountOnExit>
//     //     <Divider />
//     //     <CardContent>
//     //       <Typography> Description: {description}</Typography>
//     //     </CardContent>
//     //   </Collapse>
//     // </Card>
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//     <Card
//   sx={{
//     maxWidth: 345,
//     borderRadius: 5,
//     border: "solid",
//     borderColor: "white",
//     marginTop: 3,
//     marginLeft: 3,
//     transition: "height 0.3s ease",
//   }}
// >
//   <CardActionArea>
//     <CardMedia component="img" height="350" image={chess} alt="chess" />
//   </CardActionArea>
//   <Collapse in={expanded} unmountOnExit>
//     <CardContent>
//       <Typography gutterBottom variant="h5" component="div">
//         Lizard
//       </Typography>
//       <Typography variant="body2" sx={{ color: "text.primary" }}>
//         Lizards are a widespread group of squamate reptiles, with over
//         6,000 species, ranging across all continents except Antarctica.
//       </Typography>
//       <Box display="flex" justifyContent="center" gap={2} marginTop={2}>
//         <Button variant="contained" color="primary" onClick={() => handleVote("upvote")}>Upvote</Button>
//         <Button variant="contained" color="error" onClick={() => handleVote("downvote")}>Downvote</Button>
//       </Box>
//     </CardContent>
//   </Collapse>
//   <Button
//     onClick={handleExpand}
//     variant="contained"
//     color="secondary"
//     sx={{
//       width: "100%",
//       borderTopLeftRadius: 0,
//       borderTopRightRadius: 0,
//     }}
//   >
//     {expanded ? "Hide Details" : "Show Details"}
//   </Button>
// </Card>
// </ThemeProvider>

//   );
// };

// export default EventCard;


import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Collapse,
  Button,
  CardActionArea,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
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
  const [vote, setVote] = useState(
    uservote === "positive" ? "upvote" : uservote === "negative" ? "downvote" : null
  );
  const [upvotes, setUpvotes] = useState(pvotes);
  const [downvotes, setDownvotes] = useState(nvotes);
  const [expanded, setExpanded] = useState(false);
  const { access } = useAuth();

  const sendVoteToBackend = async (voteType) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/votes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ event: id, vote_type: voteType }),
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

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}.${month}.${year}`;
  };

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      sx={{
        width: 400,
        // Set height only when expanded; otherwise, let it be auto
        height: expanded ? 500 : "auto",
        borderRadius: 5,
        border: "solid",
        borderColor: "white",
        marginTop: 3,
        marginLeft: 3,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "height 0.3s ease",
      }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          height="200"
          image={image}
          alt={title}
        />
      </CardActionArea>
      <CardContent>
        <Typography gutterBottom variant="h5">
          {title}
        </Typography>
      </CardContent>
      <Collapse in={expanded} unmountOnExit sx={{ flex: 1, overflowY: "auto", padding: 2 }}>
        <Typography variant="body2" color="text.primary">
          &#128205; lat: {latitude}, lng: {longitude}
        </Typography>
        <Typography variant="body2" color="text.primary">
          &#128197; {formatDate(date)}
        </Typography>
        <Typography variant="body2" color="text.primary">
          &#128221; Description: {description}
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" gap={2} p={2}>
          <IconButton onClick={() => handleVote("upvote")} color={vote === "upvote" ? "primary" : "default"}>
            <ThumbUpIcon />
          </IconButton>
          <Typography>{upvotes}</Typography>
          <IconButton onClick={() => handleVote("downvote")} color={vote === "downvote" ? "error" : "default"}>
            <ThumbDownIcon />
          </IconButton>
          <Typography>{downvotes}</Typography>
        </Box>
      </Collapse>
      <Button
        onClick={handleExpand}
        variant="contained"
        color="secondary"
        sx={{
          width: "100%",
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        {expanded ? "Hide Details" : "Show Details"}
      </Button>
    </Card>
  );
};

export default EventCard;
