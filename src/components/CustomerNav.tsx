import { useNavigate } from "react-router-dom";
import Logo from "../assets/logoNameIcon.png";
import { useEffect } from "react";
import { getAuth, EmailAuthProvider } from "firebase/auth";
import * as firebaseui from 'firebaseui';
import React from 'react';
import { Link } from 'react-router-dom';
import firebase from "firebase/compat/app";
function CustomerNavbar() {
  const navigate = useNavigate();
  const url = window.location.href;

  // useEffect(() => {
  //   console.log(section);
  //   console.log(url);


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

  return (
    <>
      <nav className="fixed top-0 right-0 left-0 z-40 w-full h-16 bg-neutral-50 bg-opacity-70 backdrop-blur text-gray-800 flex items-center justify-evenly px-4 max-w-sc">
        <div className="max-w-6xl w-full flex flex-row items-center align-middle justify-between">
          {/* <div className="flex items-center gap-4"> */}
          <img
            src={Logo}
            className="w-24 cursor-pointer"
            onClick={() => {
              navigate("/top");
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
                // var contact = document.getElementById("contact");
                // contact.scrollIntoView({ behavior: "smooth" });
              }}
              className="font-normal cursor-pointer hover:text-[#FF6F00] transition-colors"
            >
              About Us
            </p>
            <p
              onClick={() => {
                // contact.scrollIntoView({ behavior: "smooth" });\
                if (firebase.auth().currentUser) {
                  navigate("/home");
                }
                else {
                  navigate('/login');
                }
              }}
              className="font-normal cursor-pointer bg-white px-4 py-2 rounded-full transition-colors border border-black hover:border-[#FF6F00] hover:text-[#FF6F00]"
            >Login/Signup</p>
            <p
              onClick={() => {
                navigate("/business");
                // var contact = document.getElementById("contact");
                // contact.scrollIntoView({ behavior: "smooth" });
              }}
              className="font-normal cursor-pointer hover:text-[#FF6F00] transition-colors"
            >
              Temp go to business
            </p>
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
            }
            else {
              navigate('/login');
            }
          }}
          className="font-normal cursor-pointer bg-white px-4 py-2 rounded-full transition-colors border border-black hover:border-[#FF6F00] hover:text-[#FF6F00]"
        >Login/Signup</p>
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
}

export default CustomerNavbar;

