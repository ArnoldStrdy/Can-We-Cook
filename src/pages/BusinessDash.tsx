import React, { useEffect } from "react";
import { getCollection } from "./FirebaseBusinessAPI";  // Firebase Config
import firebaseConfig from "@/FirebaseConfig";



function BusinessDash() {
  useEffect(() => {
    const reviews = getCollection("reviews");
    reviews.then((data) => {
      console.log(data);
      const reviewsDiv = document.getElementById("reviews");
      if (reviewsDiv) {
        reviewsDiv.innerHTML = ""; // Clear the reviews div before appending new reviews
        data?.forEach((review) => {
          const reviewDiv = document.createElement("div");
          reviewDiv.innerHTML = review.data().reviewText;
          reviewsDiv.appendChild(reviewDiv);
        });
      }
    });
  }, []);

  console.log("Business Dashboard");
  console.log(firebaseConfig);
  return (
    <div>
      <h1>Business Dashboard</h1>
      <div id="reviews"></div>
    </div>
  );
}

export default BusinessDash;
