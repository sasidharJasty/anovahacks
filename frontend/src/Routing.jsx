import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./Login"
import Organization from "./Organization";

import Event from "./events";
import Hours from "./dashboard";
import Opportunities from "./Opportunities";




const Routing = () => {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<App />} />

        <Route path="/Login" element={<Login />} />
        
        <Route path="/Org" element={<Organization />} />
        <Route path="/hours" element={<Hours />} />
        <Route path="/orgevent" element={<Event />} />
        <Route path="/dashboard" element={<Hours />} />
        <Route path="/opportunities" element={<Opportunities />} />


      </Routes>
    </Router>
  );
};

export default Routing;