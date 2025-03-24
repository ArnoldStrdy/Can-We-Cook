import React, { useEffect } from "react";
import { getCollection, getBusiness, Business, getDocument } from "./FirebaseAPI"; // Firebase Config
import { firebaseConfig } from "@/FirebaseConfig";

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
          reviewDiv.innerHTML += review.data().businessID.id + "<br>";
          getDocument("businesses", review.data().businessID.id).then((business) => {
            reviewDiv.innerHTML += business?.businessName + "<br>";
          });
          reviewsDiv.appendChild(reviewDiv);
        });
      }
    });
  }, []);

  console.log("Business Dashboard");

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-black">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-900 p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Dashboard</h2>
        <ul className="space-y-4">
        <li>
          <button className="w-full text-left text-gray-700 dark:text-gray-200 hover:underline">Home</button>
        </li>
        <li>
          <button className="w-full text-left text-gray-700 dark:text-gray-200 hover:underline">Review</button>
        </li>
        <li>
          <button className="w-full text-left text-gray-700 dark:text-gray-200 hover:underline">Update Restaurant</button>
        </li>
        <li>
          <button className="w-full text-left text-gray-700 dark:text-gray-200 hover:underline">Update Menu</button>
        </li>
        <li>
          <button className="w-full text-left text-gray-700 dark:text-gray-200 hover:underline">Update Image</button>
        </li>
        <li>
          <button className="w-full text-left text-gray-700 dark:text-gray-200 hover:underline">LogOut</button>
        </li>
      </ul>
    </div>

      {/* Main Content */ }
  <div className="flex-1 p-10 overflow-y-auto">
    <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mt-10">Owner Dashboard</h1>
    <div id="reviews" className="mt-6 space-y-4 text-gray-800 dark:text-gray-200"></div>
  </div>
    </div >
  );
}


export default BusinessDash;
