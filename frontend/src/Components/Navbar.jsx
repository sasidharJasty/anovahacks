import React, { useState, useEffect } from "react";
import Logo from "../assets/img2.png";
import axios from "axios";
import "./Nav.css";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const usrData = JSON.parse(localStorage.getItem("Data") || "{}");
  const [selectedItem, setSelectedItem] = useState(false);
  const [Selects, setSelect] = useState(false);
  const [user, setuser] = useState(JSON.parse(localStorage.getItem("Data") || "{}")["Id"]);
  const history = useNavigate();

  const closePopup = () => {
    setSelectedItem(false);
  };

  const openPopup = () => {
    setSelectedItem(true);
  };

  const handleOpen = () => {
    if (user === -999) {
      history("/login/");
    } else {
      setSelect((Selects) => !Selects);
    }
  };

  useEffect(() => {
    if (user === -999) {
      setuser(-999);
    }
  }, []);

  async function logout() {
    try {
      await axios.post("http://127.0.0.1:8000/04D2430AAFE10AA4/logout/");
      setSelect(false);
      setuser(-999);
      localStorage.removeItem("token");
      localStorage.clear();
      delete axios.defaults.headers.common["Authorization"];
      localStorage.setItem(
        "Data",
        JSON.stringify({
          User: "false",
          Username: "false",
          Id: -999,
          Group: "Student",
        })
      );
    } catch (error) {
      console.error("Logout failed:", error.response.data);
    }
  }

  return (
    <nav className="fixed border-gray-200 z-50 top-0 bg-transparent max-w-screen  pb-2 w-screen mb-40 justify-center justify-content-center text-center bg-opacity-80 dark:bg-opacity-95">
      <div className="w-screen flex flex-wrap items-center justify-between">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <h2 className="my-4 ml-20 Logo-txt verticalLine pr-2 font-black logo">
            <img src={Logo} className="NAV-Logo" alt="Logo" />
          </h2>
          <span className="text-left Logo-sd font-bold text-4xl  whitespace-nowrap text-black dark:text-black">
            BridgeHands
            </span>

        </a>
        <div className="items-center md:order-2 space-x-3 mr-80 rtl:space-x-reverse ">
          <div
            className="relative"
            onMouseEnter={() => setSelect(true)}
            onMouseLeave={() => setSelect(false)}
          >
            <button
              type="button"
              className="flex px-3 mr-40 py-2 btn-txt rounded-xl md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              id="user-menu-button"
              aria-expanded="false"
              data-dropdown-toggle="user-dropdown"
              data-dropdown-placement="bottom"
              onClick={handleOpen}
            >
              <span className="sr-only">Open user menu</span>
              <div className="">
                {user !== -999 ? (
                  <p className="">{usrData["Username"]} ▼</p>
                ) : (
                  <a className="green hover:text-white" href="/login/">
                    Log In
                  </a>
                )}
              </div>
            </button>
            {Selects && user !== -999 && (
              <div className="absolute top-full content left-0 mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow-xl dark:bg-white  dark:divide-gray-600">
                <div className="px-4 py-3">
                  <span className="block text-sm  ">
                    {usrData["User"]}
                  </span>
                  <span className="block text-sm  truncate dark:te  xt-gray-400">
                    {usrData["Id"]}
                  </span>
                </div>
                {usrData["type"]==="Organizer" ? (<ul className="py-2" aria-labelledby="user-menu-button">
                    <li>
                      <a
                        href="/dashboard"
                        className="block px-4 py-2 text-sm  hover:bg-gray-100 text-black"
                      >
                        Dashboard
                      </a>
                    </li>
                    <li>
                    <a href="/opportunities/"
                      className="block px-4 py-2 text-sm  hover:bg-gray-100 text-black"
                      onClick={openPopup}
                    >
                      Opportunity
                    </a>
                  </li>

                  
                  <li>
                    <a
                      href="/Org/"
                      className="block px-4 py-2 text-sm  hover:bg-gray-10 text-black"
                    >
                      Create an Organization
                    </a>
                  </li>
                  <li>
                    <a href="/Orgevent/"
                      className="block px-4 py-2 text-sm  hover:bg-gray-100 text-black"
                    >
                      Create an Event
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      onClick={logout}
                      className="block px-4 py-2 text-sm  hover:bg-gray-100 text-black"
                    >
                      Sign out
                    </a>
                  </li>
                </ul>):(<ul className="py-2" aria-labelledby="user-menu-button">
                    <li>
                      <a
                        href="/dashboard"
                        className="block px-4 py-2 text-sm  hover:bg-gray-100 text-black"
                      >
                        Dashboard
                      </a>
                    </li>
                  

                  <li>
                    <a href="/opportunities/"
                      className="block px-4 py-2 text-sm  hover:bg-gray-100 text-black"
                      onClick={openPopup}
                    >
                      Opportunity
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      onClick={logout}
                      className="block px-4 py-2 text-sm  hover:bg-gray-100 text-black"
                    >
                      Sign out
                    </a>
                  </li>
                </ul>)}
                
              </div>
            )}
          </div>
        </div>
        <div className="items-center justify-between hidden  md:flex md:w-auto md:order-1 ml-2 mr-2" id="navbar-user">
          <ul className="flex flex-col text-md font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 bg-opacity-80 dark:bg-opacity-95">
            <li>
              <a
                href="/"
                className="block py-2 px-3 text-black bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 bg-opacity-80 dark:bg-opacity-95"
                aria-current="page"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/soon/"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-black md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-black md:dark:hover:bg-transparent dark:border-gray-700"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="/soon/"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-black md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-black md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Programs
              </a>
            </li>
            <li>
              <a
                href="/soon/"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-black md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-black md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Membership
              </a>
            </li>
          </ul>
        </div>
      </div>
      {selectedItem && (
        <>
          <div className="overlay" onClick={closePopup} style={{ zIndex: 9998 }} />
          <div className="popup" style={{ zIndex: 9999 }}>
            <div className="popup-content text-center">
              <h1 className="font-black text-lg text-center">Information</h1>
              <hr />
              <br />
              <br />
              <div className="grid grid-cols-3 gap-4 text-left w-full h-full">
                <div className="w-full h-full CONTENT" />
                <div className="col-span-2 grid grid-cols-2 w-full gap-x-20 gap-y-10">
                  <h2>
                    <strong>Username </strong>
                    <br /> {usrData["Username"]}
                  </h2>
                  <p>
                    <strong>ID</strong> <br />
                    {usrData["Id"]}
                  </p>
                  <p className="">
                    <strong>Email</strong>
                    <br />
                    {usrData["User"]}
                  </p>
                  <p className="">
                    <strong>Role</strong>
                    <br />
                    {usrData["Groups"][0]}
                  </p>
                </div>
              </div>
              <br />
              <br />
              <button onClick={closePopup}>Close Popup</button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;
