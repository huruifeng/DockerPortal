import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ImageManage from "./components/ImageManage";
import ContainerManage from "./components/ContainerManage";
import NewContainer from "./components/NewContainer"
import Content from "./components/Content";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app">
        {/* Sidebar */}
        <Sidebar />

        {/* Content */}
        <div className="app-content">
          <Routes>
            {/* Define different routes here */}
            <Route path="/" element={<Content />} />
            <Route path="/images" element={<ImageManage />} />
            <Route path="/containers" element={<ContainerManage />} />
            <Route path="/images/create/:imageID" element={<NewContainer />} />
            {/* You can add more routes as needed */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
