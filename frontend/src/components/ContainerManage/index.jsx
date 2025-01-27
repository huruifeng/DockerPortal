import { useEffect, useState } from "react";
import {commit_container, get_containers, operate_container} from "../../apis/apis.js";
import {
    Alert,
    Box,
    Button,
    Paper,
    Snackbar,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead, TableRow,
    Typography
} from "@mui/material";


const ContainerManage = () => {
  const [containers, setContainers] = useState([]);
  const [message, setMessage] = useState(null);
  const [severity, setSeverity] = useState("success");
  const [isStopping, setIsstopping] = useState({});


  // Fetch Docker images
  const fetchContainers = async () => {
    try {
      const data = await get_containers();
      if (data.containers) {
        setContainers(data.containers);
        setMessage("Containers information were retrieved.");
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

  useEffect(() => {
    fetchContainers();
  }, []);

  const handleAction = async (id, action, state) => {

      if(action === "remove" && state === "running") {
          alert("Stop the container first before removing it !")
          return;
      }

    if(action === "stop"){
        setIsstopping((prev) => ({ ...prev, [id]: true })); // Set stopping status for this container
    }

    const data = await operate_container(id,action)
      if (data.message) {
      setMessage(data.message);
      setSeverity(data.message.includes("Error") ? "error" : "success");
      setIsstopping((prev) => ({ ...prev, [id]: false })); // Reset stopping status for this container
      fetchContainers();
    } else {
      setMessage("Error occurred!");
      setSeverity("error");
      setIsstopping((prev) => ({ ...prev, [id]: false })); // Reset stopping status
    }
  };
  const handleCommit = (id, tag) => {
    const data = commit_container(id,tag)
      setMessage(data.message)
  };

  return (
    <Box sx={{ p: 3 }} className="container-manage-container">
      <Typography variant="h4" gutterBottom>
        Container Management
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

      {/* List Images */}
     <Box>
      <Typography variant="h6" sx={{ pt: 1 }}>
        All containers
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Names</strong></TableCell>
              <TableCell><strong>Image</strong></TableCell>
              <TableCell><strong>CreatedAt</strong></TableCell>
              <TableCell><strong>Mounts</strong></TableCell>
              <TableCell><strong>Networks</strong></TableCell>
              <TableCell><strong>Ports</strong></TableCell>
              <TableCell><strong>RunningFor</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>State</strong></TableCell>
              <TableCell><strong>Remove</strong></TableCell>
              <TableCell><strong>Commit</strong></TableCell>
                <TableCell><strong>Start/Stop</strong></TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {containers.map((container) => (
              <TableRow key={container.ID}>
                <TableCell>{container.ID}</TableCell>
                <TableCell>{container.Names}</TableCell>
                <TableCell>{container.Image}</TableCell>
                <TableCell>{container.CreatedAt}</TableCell>
                <TableCell>{container.Mounts}</TableCell>
                <TableCell>{container.Networks}</TableCell>
                <TableCell>{container.Ports.replaceAll("0.0.0.0:","")}</TableCell>
                <TableCell>{container.RunningFor}</TableCell>
                <TableCell>{container.Status}</TableCell>
                <TableCell>{container.State}</TableCell>

                <TableCell align="center">
                    <Button variant="contained" color={'error'} size="small" onClick={() => handleAction(container.ID, "remove",container.State)}>Remove</Button>
                </TableCell>

                <TableCell align="center">
                    <Button variant="outlined" color={'primary'} size="small" onClick={() => handleCommit(container.ID, container.Names)}>Commit</Button>
                </TableCell>
                  <TableCell align="center">
                    {container.State === "running" &&
                        <Button variant="contained" color={'warning'} size="small" disabled={isStopping[container.ID]} onClick={() => handleAction(container.ID, "stop", container.State)}>
                        {isStopping[container.ID] ? "Stopping..." : "Stop"}
                    </Button>}
                    {container.State === "exited" && <Button variant="contained" color={'success'} size="small" onClick={() => handleAction(container.ID, "start", container.State)}>Start</Button>}
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

export default ContainerManage;
