import React, { useState, useEffect } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";
import { useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import "./hours.css";
import pattern from "./assets/pattern.png";

const Hours = () => {
  const [Hours, setHours] = useState("");
  const [TeamLead, setTeamLead] = useState("");
  const [Description, setDescription] = useState("");
  const [date, setdate] = useState("");
  const [resp, setresp] = useState([]);
  const [resp2, setresp2] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [popup1, setPopup1] = useState(false); // First popup state
  const [popup2, setPopup2] = useState(false); // Second popup state
  const [status, setstatus] = useState("loading");
  const [denHRS, setdenHRS] = useState(0);
  const [penHRS, setpenHRS] = useState(0);
  const [appHRS, setappHRS] = useState(0);
  const [err, seterr] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const usrData = JSON.parse(localStorage.getItem("Data") || '{"User":"Login","Username":"Login","Id":-999,"type":"Volunteer"}');
  const history = useNavigate();

  if (usrData["Id"] === -999) {
    history("/");
  }

  useEffect(() => {
    const updateHours = (item) => {
      if (item.approved === false) {
        if (item.denied === false) {
          setpenHRS((prev) => prev + item.hours);
        } else {
          setdenHRS((prev) => prev + item.hours);
        }
      } else {
        setappHRS((prev) => prev + item.hours);
      }
    };

    resp.forEach(updateHours);
  }, [resp]);

  const DateConverter = ({ dateString }) => {
    const dateObjectUTC = new Date(`${dateString}T24:00:00Z`);
    const dateObjectLocal = new Date(dateObjectUTC.toLocaleString());
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    const formattedDate = dateObjectLocal.toLocaleDateString(undefined, options);
    return formattedDate;
  };

  function Status(approved, denied) {
    if (approved === false) {
      if (denied === false) {
        setstatus("Pending");
      } else {
        setstatus("Denied");
      }
    } else {
      setstatus("Approved");
    }
  }

  const openPopup1 = (item) => { // Function to open first popup
    setSelectedItem(item);
    Status(item.approved, item.denied);
    setPopup1(true);
  };

  const closePopup1 = () => { // Function to close first popup
    setSelectedItem(null);
    setPopup1(false);
  };

  const openPopup2 = (item) => { // Function to open second popup
    setPopup2(true);
  };

  const closePopup2 = () => { // Function to close second popup
    setSelectedItem(null);
    setPopup2(false);
  };

  async function ren() {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/04D2430AAFE10AA4/Hours/?user_id=" + String(usrData["Id"])
      );

      setresp(response.data.reverse());

      const response2 = await axios.get(
        "http://127.0.0.1:8000/04D2430AAFE10AA4/"+ String(usrData["Id"])+"/getuserevents/" 
      );

      setresp2(response2.data.event);
      console.log(response2.data.event);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (usrData["Id"] === -999) {
      setIsLoggedIn(false);
    }
    ren();
  }, []);

  const handleHours = async (e) => {
    e.preventDefault();
    setButtonClicked(true);
  
    try {
  
      const utcDate = new Date(date).toISOString(); // Convert date to UTC format
      const response = await axios.post(
        "http://127.0.0.1:8000/04D2430AAFE10AA4/Hours/",
        {
          user_id: usrData["Id"],
          hours: Hours,
          work_description: Description,
          Organizer_Email: TeamLead,
          approved: false,
          denied: false,
          date: date,
        }
      );

      closePopup2();
  
      // Clear input fields after successful submission
      setHours("");
      setTeamLead("");
      setDescription("");
      setdate("");
  
      // Fetch updated data after submission
      ren();
    } catch (error) {
      console.error("Error:", error);
      seterr("An error occurred while submitting your hours.");
    }
  
    // Reset buttonClicked state after form submission
    setButtonClicked(false);
  
    // Redirect user if TeamLead is not provided
    if (TeamLead === "") {
      history("/hours");
    }
  };
  

  return (
    <>
      <img src={pattern} style={{ height: "100vh" }} className="absolute z-50 right-0 img" />
      {isLoggedIn ? (
        <div className="flex justify-center content-center w-auto h-auto bg-white">
          <Navbar />
          <div className="w-full h-auto rounded-lg mx-5 my-12 grid grid-cols-2 mt-20 text-black">
            <div className="">
              <div className="">
                
              
                
              </div>
              <div className=" Past-Hours">
  <h1 className={"font-black mt-5 -mb-5 text-2xl"}>Your Hours</h1>
  
  {resp.length === 0 ? (
    <p className=" mt-44 font-black text-red-500 ml-20">No hours recorded yet.</p>
  
  ) : (
    resp.map((item, index) => (
      <div
        className={
          " mt-7 border border-2 border-green-300 rounded-xl p-1 grid  grid-cols-4 gap-2 "
        }
        key={index}
        onClick={() => openPopup1(item)}
      >
        <div className="flex w-2/4 pl-3">
          <h1 className="font-black text-5xl">{item["hours"]}</h1>
          <h1>hrs</h1>
        </div>
        <div className="col-span-3">
          <h1 className="ml-6 text-xl">
            <DateConverter dateString={item["date"]} />
          </h1>
          <h1 className="ml-6 text-sm">
            {item["work_description"]}
          </h1>
        </div>
      </div>
    ))
  )}
</div>

            </div>
            
            <h1 className="font-black absolute top-32 text-2xl z-10 left-96 ml-44">Hours Graph</h1>
            <h1 className="font-black absolute top-32 text-2xl left-10">Signed up Events</h1>
            <div className="absolute left-5 top-40 scrollable-container">{resp2.map((obj) => (
          
          <div class="notification NotWidth mb-3 ">
          <div class="notiglow"></div>
          <div class="notiborderglow"></div>
          <div class="notititle">{obj["Event_Name"]}</div>
          <div class="notibody">{obj["Event_Description"]}</div>
          <div class="notibody">{obj["Event_Location"]}, by {obj["Organization_Name"]}</div>
        </div>
        ))}</div>
        {resp.length === 0 && (<p className="top-64 left-96 ml-44 font-black text-red-500 z-10 absolute">No hours recorded yet.</p>)}
            <div id="reactgooglegraph-1" className=" w-1/3 left-96 ml-8 bg-white top-12  text-center absolute   mr-0">
              <Chart 
                chartType="PieChart"
                width="90%"
                height="400px"
                data={[["Task", "Hours per Day",{ role: 'style' }],["Approved Hours",appHRS,"#00C99D"],["Pending Hours",penHRS,"blue"],["Denied Hours",denHRS,"red"]]}
                options={{
                  pieHole: 0.4,
                  is3D: false,
                  colors: ["red","blue","#00C99D"]
                }}
              />
            </div>
            <button className="font-black bg-purple border border-2 border-black absolute px-4 rounded-3xl right-96 mr-64 top-96 mt-10 z-5 +btn text-3xl" onClick={() => openPopup2()}>+</button>
          </div>
          {/* First Popup */}
          {popup1 && (
            <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center bg-gray-800 bg-opacity-75">
              <div className="bg-white p-6 rounded-lg">
                <h1 className="font-black text-lg">Details</h1>
                <h2># of hours recorded: {selectedItem.hours}</h2>
                <br />
                <p>Work description: {selectedItem.work_description}</p>
                <br />
                <br />
                <p className="flex">
                  Date: <DateConverter dateString={selectedItem.date} />
                </p>
                <p>Status: {status}</p>
                <br />
                <button onClick={closePopup1}>Close Popup </button>
              </div>
            </div>
          )}
          {/* Second Popup */}
          {popup2 && (
            <div className="absolute w-full h-full top-0 left-0 flex justify-center z-50 items-center bg-gray-800 bg-opacity-75">
              <div className="bg-white p-6 rounded-lg w-4/12">
                <h1 className="font-black text-lg">Log Hours</h1>
                <form onSubmit={handleHours}>
                  <div>
                    <p className="text-gray-600 text-xl font-medium mt-10 mb-5">
                      Enter information to Log Hours
                    </p>
                    <p className="text-red-600 text-lg font-bold mb-2">{err}</p>
                    <p className="w-1/ mb-1 text-gray-700 font-semibold">Hours</p>
                    <input
                      className="mb-3 rounded-md py-5 ml-3  w-11/12 pl-3 boo shadow-xl"
                      type="number"
                      name="enter Hours"
                      value={Hours}
                      required
                      min={0}
                      max={120}
                      onChange={(e) => setHours(parseInt(e.target.value, 10))}
                    />
                  </div>
                  <div>
                    <p className=" mb-1 text-gray-700 font-semibold">
                      Organizer Email
                    </p>
                    <input
                      className="mb-3 rounded-md py-5 ml-3 w-11/12  pl-3 boo shadow-xl"
                      type="email"
                      placeholder="Please enter Organizer Email"
                      value={TeamLead}
                      required
                      onChange={(e) => setTeamLead(e.target.value)}
                    />
                  </div>
                  <div>
                    <p className=" mb-1 text-gray-700 font-semibold">
                      Work Description
                    </p>
                    <input
                      className="mb-3 rounded-md py-5 ml-3 w-11/12 pl-3 boo shadow-xl"
                      type="text"
                      placeholder="Enter a short description of your work"
                      value={Description}
                      required
                      maxLength={500}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div>
                    <p className="mb-1 text-gray-700 font-semibold">Date</p>
                    <input
                      className="mb-3 rounded-md py-5 ml-3 w-11/12 pl-3 boo shadow-xl"
                      type="date"
                      placeholder="Enter a Date"
                      value={date}
                      required
                      onChange={(e) => setdate(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-400 px-20 py-1 mt-3 shadow-xl rounded-md  text-black "
                    disabled={buttonClicked}
                  >
                    Submit
                  </button>
                </form>
                <br />
                <button className="rounded-xl p-3" onClick={closePopup2}>Close Popup </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        history("/UnAuth")
      )}
    </>
  );
};

export default Hours;
