import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import usePageStore from "../../store/usePageStore";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically
  const setSelectedPage = usePageStore((state) => state.setSelectedPage); // Update selected page

  return (
    <div className="sidebar">
      <Typography variant="h6" className="sidebar-title" onClick={() => {
        setSelectedPage("home");
        navigate("/"); // Navigate to home
      }}>
        DockerPortal
      </Typography>
      <List>
        <ListItem onClick={() => {
          setSelectedPage("images");
          navigate("/images"); // Navigate to images management
        }}>
          <ListItemText primary="Images Management" />
        </ListItem>
        <ListItem onClick={() => {
          setSelectedPage("containers");
          navigate("/containers"); // Navigate to containers management
        }}>
          <ListItemText primary="Containers Management" />
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;
