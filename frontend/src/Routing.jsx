import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Team from "./Team"
import Login from "./Login"




const Routing = () => {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<App />} />
        <Route path="/OurTeam" element={<Team />} />
        <Route path="/Login" element={<Login />} />

      </Routes>
    </Router>
  );
};

export default Routing;