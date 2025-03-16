import React, { useEffect } from "react";
import { getCollection, getBusiness, Business } from "./FirebaseBusinessAPI";  // Firebase Config
import firebaseConfig from "@/FirebaseConfig";



function BusinessDash() {
  useEffect(() => {
    const reviews = getCollection("reviews");
    reviews.then((data) => {
      console.log(data);
      const reviewsDiv = document.getElementById("reviews");
      if (reviewsDiv) {
        reviewsDiv.innerHTML = ""; // Clear the reviews div before appending new reviews
        data?.forEach((review: any) => {
          const reviewDiv = document.createElement("div");
          console.log(review.data());
          reviewDiv.innerHTML = review.data().reviewText + "<br>";
          reviewDiv.innerHTML += review.data().rating + "<br>";
          reviewDiv.innerHTML += review.data().dateTime + "<br>";
          console.log(review.data().businessID.id);
          getBusiness(review.data().businessID.id).then((business) => {
            reviewDiv.innerHTML += business?.businessName + "<br>";
            return undefined;
          });
          reviewsDiv.appendChild(reviewDiv);
        });
      }
    });
  }, []);

  console.log("Business Dashboard");
  //console.log(firebaseConfig);
  return (
    <div className="bg-white dark:bg-black flex flex-col items-center justify-center">
      <h1>Business Dashboard</h1>
      <div id="reviews"></div>
    </div>
  );
}

export default BusinessDash;
