import { useNavigate } from "react-router-dom";
import Logo from "../assets/logoNameIcon.png";
import { useEffect, useState } from "react";
import React from "react";
import firebase from "firebase/compat/app";
import { getCustomerFromUID } from "@/pages/FirebaseAPI";
import { toast } from "sonner";
import { useCookies } from "react-cookie";

interface CustomerNavbarProps {
  uid: string | null;
  setUID: React.Dispatch<React.SetStateAction<string | null>>;
}

const CustomerNavbar: React.FC<CustomerNavbarProps> = ({ uid, setUID }) => {
  const navigate = useNavigate();
  const url = window.location.href;
  const [cookies] = useCookies(["uid", "name"]);
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
    setUID(cookies.uid);
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
        // logout
        if (!url.includes("/loginBusiness")) {
          firebase.auth().signOut();
          setCustomerName("Guest"); // fallback
          setProfilePic(""); // fallback: empty or default avatar URL
        }
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
      <nav className="fixed top-0 right-0 left-0 z-40 w-full h-18 bg-white/80 backdrop-blur text-gray-800 flex items-center justify-evenly px-4 max-w-sc border-b border-[#554971] shadow-md">
        <div className="max-w-[1527px] w-full flex flex-row items-center align-middle justify-between">
          <img
            src={Logo}
            className="w-28 cursor-pointer"
            onClick={() => {
              navigate("/");
              setDropdownOpen(false);
            }}
          />
          <div className="hidden sm:flex items-center justify-between gap-8">
            <p
              onClick={() => {
                navigate("/");
                setDropdownOpen(false);
              }}
              className="font-semibold cursor-pointer hover:text-[#FF6F00] transition-colors navbar-item"
            >
              Home
            </p>
            <p
              onClick={() => {
                navigate("/about");
                setDropdownOpen(false);
              }}
              className="font-semibold cursor-pointer hover:text-[#FF6F00] transition-colors"
            >
              About Us
            </p>
            {firebase.auth().currentUser ? (
              <div className="relative">
                <div
                  className="flex flex-row items-center gap-4 cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <p className="font-semibold hover:text-[#FF6F00] transition-colors">
                    Hi, {customerName}
                  </p>
                  {profilePic && (
                    <img
                      src={profilePic}
                      className="w-8 h-8 rounded-full border border-[#554971]/20 object-cover"
                      alt="Profile"
                    />
                  )}
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
                className="bg-[#FF6F00] font-semibold cursor-pointer transition-colors border px-3 py-1 rounded-sm border-[#FF6F00] hover:bg-white hover:text-gray-800 text-white"
              >
                Login
              </p>
            )}
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
        className="opacity-0 invisible gap-4 fixed inset-0 bg-[#181d25] text-white flex flex-col items-center justify-center z-40 transition-opacity duration-300"
      >
        <p
          onClick={() => {
            navigate("/");
            setDropdownOpen(false);
            handleToggle();
          }}
          className="font-semibold cursor-pointer hover:text-[#FF6F00] transition-colors navbar-item"
        >
          Home
        </p>
        <p
          onClick={() => {
            navigate("/about");
            setDropdownOpen(false);
            handleToggle();
          }}
          className="font-semibold cursor-pointer hover:text-[#FF6F00] transition-colors"
        >
          About Us
        </p>
        {firebase.auth().currentUser ? (
          <div className="relative">
            <div
              className="flex flex-row items-center gap-4 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <p className="font-semibold hover:text-[#FF6F00] transition-colors">
                Hi, {customerName}
              </p>
              {profilePic && (
                <img
                  src={profilePic}
                  className="w-8 h-8 rounded-full border border-[#554971]/20 object-cover"
                  alt="Profile"
                />
              )}
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
            onClick={() => {
              navigate("/login");
              handleToggle();
            }}
            className="bg-[#FF6F00] font-semibold cursor-pointer transition-colors border px-3 py-1 rounded-sm border-[#FF6F00] hover:bg-white hover:text-gray-800 text-white"
          >
            Login
          </p>
        )}
        <button
          className="font-semibold cursor-pointer hover:text-[#FF6F00] transition-colors"
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
