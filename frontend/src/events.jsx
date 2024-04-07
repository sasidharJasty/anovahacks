import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import pattern from "./assets/pattern.png";
import "./Login.css";
import "./events.css";

export default function Event() {
  const usrData = JSON.parse(localStorage.getItem("Data") || '{"User":"Login","Username":"Login","Id":-999,"type":"Volunteer"}');
  const [selectedOrg, setSelectedOrg] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [restrictions, setRestrictions] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [resp, setResp] = useState([]);
  const [events, setEvents] = useState([]);
  const [err, setErr] = useState("");
  const history = useNavigate();

  async function fetchData() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://127.0.0.1:8000/04D2430AAFE10AA4/Org/?user_id=${usrData.Id}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      const response2 = await axios.get(
        `http://127.0.0.1:8000/04D2430AAFE10AA4/events/?user_id=${usrData.Id}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setResp(response.data);
      setEvents(response2.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (usrData["type"] === "Volunteer") {
      history("/");
    }

    

    fetchData();
  }, []);


  const handleEvent = async (e) => {
    e.preventDefault();

    if (!selectedOrg || !name || !description || !restrictions || !location || !date) {
      setErr("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/04D2430AAFE10AA4/orgevent/",
        {
          user_id: usrData.Id,
          Organization_Name: selectedOrg,
          Event_Name: name,
          Event_Description: description,
          Event_Restrictions: restrictions,
          Event_Location: location,
          Event_Time: date,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      fetchData();
      setErr("");
    } catch (error) {
      console.log(error);
      setErr("Error occurred while signing up event.");
    }
  };

  return (
    <>
      <img src={pattern} style={{ height: "100vh" }} className="absolute right-0" />
      <h1 className="green-txt absolute text-3xl font-black ml-10 mt-5 left-40 top-20"> Your Events</h1>
      <div className="absolute left-10 w-2/5 top-20 mt-20 scrollable-container">
        {events.map((obj) => (
          
          <div class="notification mb-3 ">
          <div class="notiglow"></div>
          <div class="notiborderglow"></div>
          <div class="notititle">{obj["Event_Name"]}</div>
          <div class="notibody">{obj["Event_Description"]}</div>
          <div class="notibody">{obj["Event_Location"]}, by {obj["Organization_Name"]}</div>
        </div>
        ))}
      </div>

      
      
      <div className="main2 absolute mt-10">
        <input type="checkbox" id="chk" aria-hidden="true" />
        <div className="signup">
          <form onSubmit={handleEvent} className="mb-20 form">
            <label className="text-black">Create an Event</label>
            <p className="text-red-600 font-bold text-center mb-5">{err}</p>
            <select
              className="border border-2 float-right rounded-md placeholder-black select-dropdown"
              value={selectedOrg}
              required
              onChange={(e) => setSelectedOrg(e.target.value)}
            >
              <option value="" disabled>Select an Organization</option>
              {resp.map((org) => (
                <option key={org.id} value={org.id}>{org.Organization_Name}</option>
              ))}
            </select>
            <input
              className="py-5 m-auto mb-5 placeholder-black"
              type="text"
              name="text"
              value={name}
              placeholder="Event Name"
              required=""
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="py-5 m-auto mb-5 placeholder-black"
              type="text"
              name="pswd"
              value={description}
              placeholder="Event Description"
              required=""
              rows={5}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              className="py-5 m-auto mb-5 placeholder-black"
              type="text"
              name="email"
              value={restrictions}
              placeholder="Event Restrictions"
              required=""
              onChange={(e) => setRestrictions(e.target.value)}
            />
            <input
              className="py-5 m-auto mb-5 placeholder-black"
              type="text"
              name="text"
              value={location}
              placeholder="Event Location"
              required=""
              onChange={(e) => setLocation(e.target.value)}
            />
            <input
              className="py-5 m-auto mb-5 placeholder-black"
              type="datetime-local"
              name="pswd"
              value={date}
              placeholder="Event Time"
              required=""
              rows={5}
              onChange={(e) => setDate(e.target.value)}
            />
            <button className="m-auto button" type="submit">
              Post Event
            </button>
          </form>
        </div>
      </div>
      <Navbar />
    </>
  );
}
