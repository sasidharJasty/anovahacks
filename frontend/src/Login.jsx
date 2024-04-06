import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import pattern from "./assets/pattern.png"
import "./Login.css"



export default function Login () {
    const [LoginEmail, setLoginEmail] = useState("");
    const [LoginPassword, setLoginPassword] = useState("");
    const [err, seterr] = useState("‎ ");
    const history = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setemail] = useState("");

    const handleSignup = async (e) => {
      e.preventDefault();
      console.log
      try {
        const response = await axios.post("http://127.0.0.1:8000/04D2430AAFE10AA4/signup/", {
          email: email,
          username: username,
          password: password,
        });
        history("/");
        seterr("‎ ");
        const token = response.data.token;
        localStorage.setItem("token", JSON.stringify(token));
        axios.defaults.headers.common["Authorization"] = `Token ${token}`;
        localStorage.setItem("Data", JSON.stringify(response.data));
      } catch (error) {
        seterr(error.response.data["error"]);
      }
    };
  
    const handleLogin = async (e) => {
      e.preventDefault();
  
      try {
        const response = await axios.post("http://127.0.0.1:8000/04D2430AAFE10AA4/login/", {
          username: LoginEmail,
          password: LoginPassword,
        });
  
        history("/");
        seterr("‎ ");
        const token = response.data.token;
  
        axios.defaults.headers.common["Authorization"] = `Token ${token}`;
        localStorage.setItem("token", JSON.stringify(token));
        localStorage.setItem("Data", JSON.stringify(response.data));
      } catch (error) {
        seterr(error.response.data["error"]);
      }
    };
    return (<>
    <img src={pattern} style={{height:"100vh"}} className="absolute right-0" ></img>
      <div className = "main absolute mt-10">
          <input type = "checkbox" id ="chk" aria-hidden="true"/>

          <div className= "signup">
            <form onSubmit={handleSignup}>
              <label className="text-black" for="chk" >Sign Up</label>
              <p className="text-red-600  font-bold text-center mb-5 ">{err}</p>
              <input className="py-5 m-auto mb-5" type = "text" name = "txt" placeholder="User Name: " required="" onChange={(e) => setUsername(e.target.value)}/>
              <input className="py-5 m-auto mb-5" type = "email" name = "email" placeholder="Email: " required="" onChange={(e) => setemail(e.target.value)}/>
              <input className="py-5 m-auto mb-5" type = "Password" name = "pswd" placeholder="Password" required="" onChange={(e) => setPassword(e.target.value)}/>
              <button className="m-auto button" type="submit">Sign Up</button>
            </form>
          </div>

          <div className= "login">
            <form onSubmit={handleLogin}>
              <label for="chk" aria-hidden="true">Login</label>
              <p className="text-red-600  font-bold text-center mb-5 ">{err}</p>
              <input className="py-5 m-auto mb-5" type = "email" name = "email" placeholder="Email: " required="" onChange={(e) => setLoginEmail(e.target.value)}/>
              <input className="py-5 m-auto mb-5" type = "Password" name = "pswd" placeholder="Password" required="" onChange={(e) => setLoginPassword(e.target.value)}/>
              <button className="button" type="submit">Log In</button>
            </form>
          </div>
        </div>
        <Navbar />

        </>
    ) 
}