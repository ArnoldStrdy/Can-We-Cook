import { useNavigate } from "react-router-dom";
import Logo from "../assets/logoNameIcon.png";
import { useEffect, useState } from "react";
import { getAuth, EmailAuthProvider } from "firebase/auth";
import * as firebaseui from "firebaseui";
import React from "react";
import { Link } from "react-router-dom";
import firebase from "firebase/compat/app";
import { getCustomerFromUID } from "@/pages/FirebaseAPI";
import { toast } from "sonner";

interface CustomerNavbarProps {
  uid: string | null;
  setUID: React.Dispatch<React.SetStateAction<string | null>>;
}

const CustomerNavbar: React.FC<CustomerNavbarProps> = ({ uid, setUID }) => {
  const navigate = useNavigate();
  const url = window.location.href;

  // useEffect(() => {
  //   console.log(section);
  //   console.log(url);

  const [customerName, setCustomerName] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // const [uid, setUID] = useState<string | null>(null);
  // const uid = firebase.auth().currentUser?.uid;

  // check if user is logged in
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUID(user.uid);
      }
    });
  }, []);

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!uid) return;
      const customerData = await getCustomerFromUID(uid);

      if (customerData) {
        setCustomerName(customerData.name);
        setProfilePic(customerData.profilePic);
      } else {
        setCustomerName("Guest"); // fallback
        setProfilePic(""); // fallback: empty or default avatar URL
      }
    };

    fetchCustomerData();
  }, [uid]);

  const handleToggle = () => {
    const nav = document.getElementById("nav");
    if (!nav) return;
    if (nav.classList.contains("opacity-0")) {
      nav.classList.remove("opacity-0");
      nav.classList.add("opacity-100");
      setTimeout(() => {
        nav.classList.remove("invisible");
      });
    } else {
      nav.classList.add("opacity-0");
      nav.classList.remove("opacity-100");
      setTimeout(() => {
        nav.classList.add("invisible");
      }, 300);
    }
  };

  const handleLogout = () => {
    firebase.auth().signOut();
    setDropdownOpen(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <>
      <nav className="fixed top-0 right-0 left-0 z-40 w-full h-16 bg-neutral-50 bg-opacity-70 backdrop-blur text-gray-800 flex items-center justify-evenly px-4 max-w-sc">
        <div className="max-w-[1527px] w-full flex flex-row items-center align-middle justify-between">
          {/* <div className="flex items-center gap-4"> */}
          <img
            src={Logo}
            className="w-24 cursor-pointer"
            onClick={() => {
              navigate("/top");
              setDropdownOpen(false);
              // var top = document.getElementById("top");
              // top.scrollIntoView({ behavior: "smooth" });
            }}
          />
          {/* <p
              onClick={() => {
                navigate("/top");
                // var top = document.getElementById("top");
                // top.scrollIntoView({ behavior: "smooth" });
              }}
              className="font-semibold cursor-pointer hover:text-[#FF6F00] transition-colors"
            >
              Can We Cook?
            </p>
          </div> */}
          <div className="hidden sm:flex items-center justify-between gap-8">
            <p
              onClick={() => {
                navigate("/home");
                setDropdownOpen(false);
                // var top = document.getElementById("top");
                // top.scrollIntoView({ behavior: "smooth" });
              }}
              className="font-normal cursor-pointer hover:text-[#FF6F00] transition-colors navbar-item"
            >
              Home
            </p>
            <p
              onClick={() => {
                navigate("/restaurants");
                setDropdownOpen(false);
                // var about = document.getElementById("about");
                // about.scrollIntoView({
                //   behavior: "smooth",
                // });
              }}
              className="font-normal cursor-pointer hover:text-[#FF6F00] transition-colors"
            >
              Restaurants
            </p>
            <p
              onClick={() => {
                navigate("/map");
                setDropdownOpen(false);

                // var contact = document.getElementById("contact");
                // contact.scrollIntoView({ behavior: "smooth" });
              }}
              className="font-normal cursor-pointer hover:text-[#FF6F00] transition-colors"
            >
              Map
            </p>
            <p
              onClick={() => {
                navigate("/about");
                setDropdownOpen(false);
                // var contact = document.getElementById("contact");
                // contact.scrollIntoView({ behavior: "smooth" });
              }}
              className="font-normal cursor-pointer hover:text-[#FF6F00] transition-colors"
            >
              About Us
            </p>
            {/* {firebase.auth().currentUser ? (
              <div className="flex flex-row items-center gap-4">
                {profilePic && (
                  <img src={profilePic} className="w-8 h-8 rounded-full" />
                )}
                <p
                  onClick={() => {
                    firebase.auth().signOut();
                    navigate("/");
                  }}
                  className="font-normal cursor-pointer hover:text-[#FF6F00] transition-colors"
                >
                  Hi, {customerName}
                </p>
              </div>
            ) : (
              <p
                onClick={() => {
                  navigate("/login");
                }}
                className="font-normal cursor-pointer hover:text-[#FF6F00] transition-colors"
              >
                Login/Signup
              </p>
            )} */}
            {firebase.auth().currentUser ? (
              <div className="relative">
                <div
                  className="flex flex-row items-center gap-4 cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {profilePic && (
                    <img
                      src={profilePic}
                      className="w-8 h-8 rounded-full"
                      alt="Profile"
                    />
                  )}
                  <p className="font-normal hover:text-[#FF6F00] transition-colors">
                    Hi, {customerName}
                  </p>
                </div>

                {dropdownOpen && (
                  <div
                    onMouseLeave={() => setDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-48 bg-white border border-[#FF6F00] rounded-sm shadow-sm"
                  >
                    <p
                      className="px-4 py-2 hover:cursor-pointer hover:text-[#FF6F00]"
                      onClick={() => {
                        navigate("/settings");
                        setDropdownOpen(false);
                      }}
                      // hide when the use clicks on anything else
                    >
                      Settings
                    </p>
                    <p
                      className="px-4 py-2 hover:cursor-pointer hover:text-[#FF6F00]"
                      onClick={handleLogout}
                    >
                      Logout
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p
                onClick={() => navigate("/login")}
                className="font-normal cursor-pointer hover:text-[#FF6F00] transition-colors"
              >
                Login/Signup
              </p>
            )}
            {/* <p
              onClick={() => {
                navigate("/business");
                setDropdownOpen(false);
                // var contact = document.getElementById("contact");
                // contact.scrollIntoView({ behavior: "smooth" });
              }}
              className="font-normal cursor-pointer hover:text-[#FF6F00] transition-colors"
            >
              Temp go to business
            </p> */}
          </div>
          <div className="sm:hidden">
            <button
              className="text-black"
              onClick={() => {
                handleToggle();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <nav
        id="nav"
        className="opacity-0 invisible fixed inset-0 bg-[#181d25] text-white flex flex-col items-center justify-center z-40 transition-opacity duration-300"
      >
        <p
          onClick={() => {
            if (url.includes("currency-converter-privacy-policy")) {
              navigate("/");
            }
            var top = document.getElementById("top");
            // top.scrollIntoView({ behavior: "smooth" });
            handleToggle();
          }}
          className="text-2xl mb-4 cursor-pointer"
        >
          Home
        </p>
        {/* <a
          target="_self"
          href="https://blog.shlok.tech"
          className="text-2xl mb-4 cursor-pointer"
        >
          BLOG
        </a> */}
        <p
          onClick={() => {
            navigate("/restaurants");
            // about.scrollIntoView({ behavior: "smooth" });
            handleToggle();
          }}
          className="text-2xl mb-4 cursor-pointer"
        >
          Restaurants
        </p>
        <p
          onClick={() => {
            navigate("/map");
            var contact = document.getElementById("contact");
            // contact.scrollIntoView({ behavior: "smooth" });
            handleToggle();
          }}
          className="text-2xl mb-4 cursor-pointer"
        >
          Map
        </p>
        <p
          onClick={() => {
            navigate("/about");
            // var contact = document.getElementById("contact");
            // contact.scrollIntoView({ behavior: "smooth" });
            handleToggle();
          }}
          className="text-2xl mb-4 cursor-pointer"
        >
          About Us
        </p>
        <p
          onClick={() => {
            if (firebase.auth().currentUser) {
              navigate("/home");
            } else {
              navigate("/login");
            }
          }}
          className="font-normal cursor-pointer bg-white px-4 py-2 rounded-full transition-colors border border-black hover:border-[#FF6F00] hover:text-[#FF6F00]"
        >
          Login/Signup
        </p>
        <p
          onClick={() => {
            navigate("/business");
            // var contact = document.getElementById("contact");
            // contact.scrollIntoView({ behavior: "smooth" });
          }}
          className="text-2xl mb-4 cursor-pointer"
        >
          Temp go to business
        </p>
        <button
          className="mt-8 text-xl text-gray-300"
          onClick={() => {
            handleToggle();
          }}
        >
          Close
        </button>
      </nav>
    </>
  );
};

export default CustomerNavbar;
