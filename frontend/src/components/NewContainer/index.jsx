import {useEffect, useState} from "react";
import {TextField, Checkbox, FormControlLabel, Button, Box, Typography, Snackbar, Alert} from "@mui/material";
import { useNavigate } from "react-router-dom";
import './NewContainer.css'; // Import the CSS file

import useImageStore from "../../store/useImageStore.js";
import {run_container} from "../../apis/apis.js"; // Import the store


const NewContainer = () => {
  const navigate = useNavigate();
  const { selectedImage } = useImageStore(); // Access the selectedImage from the store
  // console.log(selectedImage)
  // If there's no image selected, redirect or display a message
  useEffect(() => {
    if (!selectedImage) {
      navigate("/images"); // Navigate to images page if no image is selected
    }
  }, [selectedImage, navigate]);

  const [containerName, setContainerName] = useState("");
  const [useGPU, setUseGPU] = useState(false);
  const [password, setPassword] = useState("");
  const [portsMap, setPortsmap] = useState("");
  const [commands, setCommands] = useState("");
  const [mountFolder, setMountfolder] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState(null);
  const [severity, setSeverity] = useState("success");

  const handleRunContainer = async (e) => {
      e.preventDefault()
    // Function to run the container once it's created
    setLoading(true);

    const form_data = {
      container_name: containerName,
      password:password,
      ports_map: portsMap.trim() === "" ? [] : portsMap.split("\n"),
      commands: commands.trim() === "" ? [] : commands.split("\n"),
      mount_folder: mountFolder.trim() === "" ? [] : mountFolder.split("\n"),
      use_gpu: useGPU,
      image_id: selectedImage.ID,  // Use the selected image ID
    };

    try {
      // Replace this with your actual backend API call
      const data = await run_container(form_data)
      if (data.success) {
        setMessage(data.message);
        setSeverity('success')
        navigate("/containers");  // Redirect after success
      } else {
        setMessage("Error creating container: " + data.message);
      }
    } catch (error) {
      setMessage("Error in run a container: " + error.message)
        setSeverity('error')
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="newcontainer-form" sx={{ width: "100%", mminWidth: "800px", padding: 3 }}>
       <Typography variant="h4" gutterBottom>Create a New Container from Image</Typography>
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

      <hr style={{ width: "100%", marginBottom: "5px" }} />
      <Box>
          <Typography variant="h6" sx={{ pt: 1 }}>
            Images information
          </Typography>
      </Box>
       {/* Display Image Brief Information in a Row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body1" sx={{ whiteSpace: "nowrap", mr:2 }}><strong>Repository:</strong> {selectedImage?.Repository}</Typography>
        <Typography variant="body1" sx={{ whiteSpace: "nowrap", mr:2 }}><strong>Tag:</strong> {selectedImage?.Tag}</Typography>
        <Typography variant="body1" sx={{ whiteSpace: "nowrap", mr:2 }}><strong>ID:</strong> {selectedImage?.ID}</Typography>
      </Box>

      <Box sx = {{ width:"30%" }}>
          <Typography variant="h6" sx={{ pt: 1 }}>
            New container
          </Typography>
        <form onSubmit={handleRunContainer}>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ mb: 1 }}>Container Name</Typography>
            <TextField
              variant="outlined"
              required
              value={containerName}
              onChange={(e) => setContainerName(e.target.value)}
              size={'small'}
              sx={{ width: "100%" }} // Makes the input take the full width
            />
          </Box>

        <Box sx={{ mb: 2 }}>
          <Typography sx={{ mb: 1 }}>Set Password</Typography>
          <TextField
            type="password"
            variant="outlined"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ width: "100%" }} // Makes the input take the full width
              size={'small'}
          />
        </Box>

           <Box sx={{ mb: 2 }}>
          <Typography sx={{ mb: 1 }}>Ports mapping (one per line. e.g., 8022:22 )</Typography>
          <TextField
            variant="outlined"
            multiline
            rows={4}
            value={portsMap}
            onChange={(e) => setPortsmap(e.target.value)}
            sx={{ width: "100%" }}
            placeholder="Enter mapping, one per line. e.g., 8022:22 "
          />
        </Box>

           <Box sx={{ mb: 2 }}>
          <Typography sx={{ mb: 1 }}>Commands (one per line. e.g., service mysql start)</Typography>
          <TextField
            variant="outlined"
            multiline
            rows={4}
            value={commands}
            onChange={(e) => setCommands(e.target.value)}
            sx={{ width: "100%" }}
            placeholder="Enter commands, one per line. e.g., service mysql start"
          />
        </Box>

           <Box sx={{ mb: 2 }}>
          <Typography sx={{ mb: 1 }}>Mount folder (one per line, /host/path:/container/path )</Typography>
          <TextField
            variant="outlined"
            multiline
            rows={4}
            value={mountFolder}
            onChange={(e) => setMountfolder(e.target.value)}
            sx={{ width: "100%" }}
            placeholder="Enter mounts, one per line, /host/path:/container/path "
          />
        </Box>

          <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={useGPU}
                onChange={(e) => setUseGPU(e.target.checked)}
                color="primary"
                size={'small'}
              />
            }
            label="Use GPU"
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3}}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ flexGrow: 1, mr: 1 }}
          >
            {loading ? "Creating..." : "Create Container"}
          </Button>

        </Box>
      </form>
      </Box>
    </Box>
  );
};

export default NewContainer;
