import { Typography } from "@mui/material";
import "./Content.css";

const Content = () => {
  return (
    <div className="content">
      <Typography variant="h4" gutterBottom>
        Welcome to DockerPortal
      </Typography>
      <Typography>
        Select an option from the sidebar to manage your Docker environment.
      </Typography>
    </div>
  );
};

export default Content;
