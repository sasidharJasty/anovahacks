import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import pattern from "./assets/pattern.png";
import "./Login.css";
import "./opps.css";

export default function Organization() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [purpose, setPurpose] = useState("");
  const [dataURI, setDataURI] = useState("");
  const [err, setErr] = useState("");
  const history = useNavigate();

  // Get user data from localStorage
  const usrData = JSON.parse(localStorage.getItem("Data") || '{"User":"Login","Username":"Login","Id":-999,"type":"Volunteer"}');
  console.log(usrData);

  useEffect(() => {
    // Redirect if user type is "Volunteer"
    if (usrData["type"] === "Volunteer") {
      history("/");
    }
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const dataUri = e.target.result;
      setDataURI(dataUri);
    };

    reader.readAsDataURL(file);
  };

  const handleOrg = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/04D2430AAFE10AA4/org/", {
        user_id: usrData["Id"],
        name: name,
        email: email,
        description: purpose,
        headers: {
          Authorization: `Token ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      const token = response.data.token;

      axios.defaults.headers.common["Authorization"] = `Token ${token}`;
      localStorage.setItem("token", JSON.stringify(token));
      history("/");
      setErr("");
    } catch (error) {
      console.log(error);
      setErr("Error occurred while signing up organization.");
    }
  };

  return (
    <>
      <img src={pattern} style={{ height: "100vh" }} className="absolute right-0" />
      <div className="main absolute mt-10">
        <input type="checkbox" id="chk" aria-hidden="true" />

        <div className="signup">
          <form onSubmit={handleOrg} className="mb-20 form">
            <label className="text-black" >
              Create an Organization
            </label>

            <p className="text-red-600 font-bold text-center mb-5">{err}</p>
            <input className="py-5 m-auto mb-5" type="text" name="txt" placeholder="Organization Name" required="" onChange={(e) => setName(e.target.value)} />
            <input className="py-5 m-auto mb-5" type="email" name="email" placeholder="Organization Email" required="" onChange={(e) => setEmail(e.target.value)} />
            <input className="py-5 mx-auto mb-5 " type="text" name="pswd" placeholder="Organization Purpose" required="" rows={5} onChange={(e) => setPurpose(e.target.value)} />
            <input className="m-auto mb-16 pb-7 file" type="file" onChange={handleFileInputChange} accept="image/*" required />

            <button className="m-auto button" type="submit">
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <Navbar />
    </>
  );
}
