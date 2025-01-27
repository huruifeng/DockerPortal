import React, { useState, useEffect } from "react";
import {Box, Typography, TextField, Button, Snackbar, Alert,} from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

import {get_images, operate_image, push_image} from "../../apis/apis.js";
import {delay} from "../../apis/utils.js"
import { useNavigate } from "react-router-dom"; // For navigation
import "./ImageManage.css";
import useImageStore from "../../store/useImageStore.js";

const ImageManage = () => {
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState(null);
  const [severity, setSeverity] = useState("success");


  const [imageName, setImageName] = useState("");
  const [logs, setLogs] = useState([]); // Log messages
  const [isPulling, setIsPulling] = useState(false);

  const { setSelectedImage } = useImageStore(); // Access the setSelectedImage function

  const navigate = useNavigate(); // To navigate between routes

  // Fetch Docker images
  const fetchImages = async () => {
    try {
      const data = await get_images();
      if (data.images) {
        setImages(data.images);
        setMessage("Image information were retrieved.");
        setSeverity("success");
      } else {
        setMessage("Failed to fetch images.");
        setSeverity("error");
      }
    } catch (error) {
      setMessage("Failed to fetch images.");
      setSeverity("error");
      console.error("Failed to fetch images:", error);
    }
  };

  // Pull a Docker image
  // const pullImage = async () => {
  //   setIsPulling(true);
  //   try {
  //     const data = await pull_image(imageName);
  //     if (!data.success) {
  //       setMessage("Failed to pull image.");
  //       setSeverity("error");
  //        setIsPulling(false);
  //       return;
  //     }
  //     setMessage(`Image "${imageName}" pulled successfully!`);
  //     setSeverity("success");
  //     setIsPulling(false);
  //   } catch (error) {
  //     setMessage(`Failed to pull image "${imageName}".`);
  //     setSeverity("error");
  //     setIsPulling(false);
  //   }
  // };
const [ws, setWs] = useState(null); // Store WebSocket reference
const pullImage = () => {
    if (!imageName) return;

    setLogs([]); // Clear previous logs
    setLogs((prevLogs) => [...prevLogs, `Pulling image...${imageName}`]);
    setIsPulling(true);

    const websocket = new WebSocket('ws://127.0.0.1:8000/ws/pull_image'); // Replace with your FastAPI WebSocket URL
    setWs(websocket); // Store WebSocket reference

    websocket.onopen = () => {
        websocket.send(imageName); // Send the image name to the backend
    };

    websocket.onmessage = (event) => {
        setLogs((prevLogs) => [...prevLogs, event.data]); // Append new log
    };

    websocket.onclose = () => {
        fetchImages();
        delay(3000)
        setIsPulling(false);
    };

    websocket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setLogs((prevLogs) => [...prevLogs, "Error: Unable to pull image."]);
        setIsPulling(false);
        fetchImages();
    };
};

const handleClose = () => {
    if (ws) {
      ws.close(); // Explicitly close WebSocket when React stops or on cleanup
    }
  };

 // Make sure WebSocket is closed properly when the component unmounts
  React.useEffect(() => {
    return () => {
      handleClose();
    };
  }, []);

  // Handle container run
  const handleRunContainer = (image) => {
      setSelectedImage(image); // Store the image info in Zustand
    // Navigate to container configuration page for the selected image
    navigate(`/images/create/${image.ID}`);
  };

  const deleteImage = (imageID) => {
      const data = operate_image(imageID,"remove");
      if (data.message){
          setMessage(data.message);
          setSeverity(data.success);
      }
      fetchImages();
  };

  const pushImage = (imageID) => {
      const data = push_image(imageID);
      if (data.message){
          setMessage(data.message);
          setSeverity(data.success);
      }
      fetchImages();
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <Box sx={{ p: 3 }} className="image-manage-container">
      <Typography variant="h4" gutterBottom>
        Images Management
      </Typography>

       {/* Snackbar for messages */}
      <Snackbar open={Boolean(message)} autoHideDuration={4000} onClose={() => setMessage(null)}
        anchorOrigin={{
          vertical: "top", // Options: "top" or "bottom"
          horizontal: "center", // Options: "left", "center", or "right"
        }}
      >
        <Alert severity={severity} onClose={() => setMessage(null)}>
          {message}
        </Alert>
      </Snackbar>

      <hr style={{ width: "100%", marginBottom: "20px" }} />

      {/* Pull Image */}
     <Box sx={{ mb: 3, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Pull a Docker Image (from Docker Hub):
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center",mb:2 }}>
          <TextField
            className="pull-image-input"
            label="Image Name"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            size="small"
            sx={{ mr: 2, width: "400px" }}
          />
          <Button variant="contained" color="primary" onClick={pullImage} disabled={isPulling} sx={{ width: "200px" }}>
              {isPulling ? "Pulling..." : "Pull a image"}
          </Button>
      </Box>

         {/* Log Output */}
         {isPulling ? (
      <Paper sx={{ p: 2, backgroundColor: "#f9f9f9", height: "100px", overflowY: "auto" }}>
          {logs.map((log, index) => (
            <Typography key={index} variant="body2" sx={{ mb: 1 }}>{log}</Typography>
          ))}
      </Paper>): ""}
    </Box>


      {/* List Images */}
     <Box>
      <Typography variant="h6" sx={{ pt: 1 }}>
        Available Images
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Repository</strong></TableCell>
              <TableCell><strong>Tags</strong></TableCell>
              <TableCell><strong>CreatedAt</strong></TableCell>
              <TableCell><strong>CreatedSince</strong></TableCell>
              <TableCell><strong>Size</strong></TableCell>
              <TableCell><strong>Containers</strong></TableCell>
              <TableCell align="center"><strong>Remove</strong></TableCell>
                <TableCell align="center"><strong>Push</strong></TableCell>
                <TableCell align="center"><strong>New</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {images.map((image) => (
              <TableRow key={image.ID}>
                <TableCell>{image.ID}</TableCell>
                <TableCell>{image.Repository}</TableCell>
                <TableCell>{image.Tag}</TableCell>
                <TableCell>{image.CreatedAt}</TableCell>
                <TableCell>{image.CreatedSince}</TableCell>
                <TableCell>{image.Size}</TableCell>
                <TableCell>{image.Containers}</TableCell>

                <TableCell align="center">
                  <Button variant="contained" color={'error'} size="small" onClick={() => deleteImage(image.ID)}>Remove</Button>
                </TableCell>
                <TableCell align="center">
                  <Button variant="outlined" color={'primary'} size="small" onClick={() => pushImage(image.ID)}>Push</Button>
                </TableCell>
                  <TableCell align="center">
                  <Button variant="outlined" color={'success'} size="small" onClick={() => handleRunContainer(image)}>New container</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>
    </Box>
  );
};

export default ImageManage;
