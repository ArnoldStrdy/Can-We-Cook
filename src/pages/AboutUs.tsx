import React, { useEffect } from "react";
import { getCollection, getBusiness, Business } from "./FirebaseAPI"; // Firebase Config
import firebaseConfig from "@/FirebaseConfig";

function AboutUs() {
  
  console.log("About us");
  //console.log(firebaseConfig);
  return (
    <div className="bg-white dark:bg-black flex flex-col items-center justify-center mt-20">
      <h1 className="text-3xl font-semibold">About Us</h1>
      <div id="reviews"></div>
    </div>
  );
}

export default AboutUs;
