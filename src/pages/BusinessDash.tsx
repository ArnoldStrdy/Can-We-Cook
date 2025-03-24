import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Ratings from "@/components/ui/ratings";
import {
  getCollection,
  getBusiness,
  Business,
  getDocument,
} from "./FirebaseAPI"; // Firebase Config
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { firebaseConfig } from "@/FirebaseConfig";

import imgUrl from "../assets/logoIcon.png";
const sampleR = [
  {
    name: "Savor & Sip",
    logo: imgUrl,
    rating: 4,
    id: 2311,
  },
];

const pictures = [imgUrl];
const reviews = [
  {
    reviewer: "Jeff Bezos",
    verified: false,
    date: "05/07/2024",
    rating: 5,
    review:
      "I had an amazing dinner at Savor & Sip last night! The ambiance was warm and inviting, and the staff were super friendly. I ordered the grilled salmon, and it was cooked to perfection—crispy on the outside and tender inside.",
  },
  {
    reviewer: "Jeff Bezos",
    verified: true,
    date: "05/07/2024",
    rating: 3,
    review:
      "I had an amazing dinner at Savor & Sip last night! The ambiance was warm and inviting, and the staff were super friendly. I ordered the grilled salmon, and it was cooked to perfection—crispy on the outside and tender inside.",
  },
  {
    reviewer: "Jeff Bezos",
    verified: true,
    date: "05/07/2024",
    rating: 2,
    review:
      "I had an amazing dinner at Savor & Sip last night! The ambiance was warm and inviting, and the staff were super friendly. I ordered the grilled salmon, and it was cooked to perfection—crispy on the outside and tender inside.",
  },
  {
    reviewer: "Jeff Bezos",
    verified: false,
    date: "05/07/2024",
    rating: 5,
    review:
      "I had an amazing dinner at Savor & Sip last night! The ambiance was warm and inviting, and the staff were super friendly. I ordered the grilled salmon, and it was cooked to perfection—crispy on the outside and tender inside.",
  },
];

const menu = [
  {
    picture: imgUrl,
    name: "Item 1",
    price: "5",
  },
  {
    picture: imgUrl,
    name: "Item 1",
    price: "5",
  },
  {
    picture: imgUrl,
    name: "Item 1",
    price: "5",
  },
  {
    picture: imgUrl,
    name: "Item 1",
    price: "5",
  },
  {
    picture: imgUrl,
    name: "Item 1",
    price: "5",
  },
];

type Review = {
  rating: number;
  review: string;
  pictures: File[];
  verified: boolean;
  anonymous: boolean;
};

function BusinessDash() {
  const [currentPage, setCurrentPage] = useState("home");
  console.log("Business Dashboard");

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-black">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-900 p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
          Dashboard
        </h2>
        <ul className="space-y-4">
          <li>
            <button
              className="w-full text-left text-gray-700 dark:text-gray-200 hover:underline"
              onClick={() => setCurrentPage("home")}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className="w-full text-left text-gray-700 dark:text-gray-200 hover:underline"
              onClick={() => setCurrentPage("reviews")}
            >
              Review
            </button>
          </li>
          <li>
            <button
              className="w-full text-left text-gray-700 dark:text-gray-200 hover:underline"
              onClick={() => setCurrentPage("restaurant")}
            >
              Update Restaurant
            </button>
          </li>
          <li>
            <button
              className="w-full text-left text-gray-700 dark:text-gray-200 hover:underline"
              onClick={() => setCurrentPage("menu")}
            >
              Update Menu
            </button>
          </li>
          <li>
            <button
              className="w-full text-left text-gray-700 dark:text-gray-200 hover:underline"
              onClick={() => setCurrentPage("pictures")}
            >
              Update Pictures
            </button>
          </li>
          <li>
            <button className="w-full text-left text-gray-700 dark:text-gray-200 hover:underline">
              LogOut
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}

      <div className="flex-1 px-10 overflow-y-auto">
        {currentPage === "home" && (
          <>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mt-10">
              Owner Dashboard
            </h1>
            <div
              id="reviews"
              className="mt-6 space-y-4 text-gray-800 dark:text-gray-200"
            ></div>
            <div className="mx-[20%] mt-[5%] space-y-6">
              <div className="flex">
                <div className="flex-3/4 text-left space-y-4 pr-[10%]">
                  <h1 className="text-4xl font-bold">Restaurant 1</h1>
                  <span className="text-lg">
                    Welcome to Savor & Sip, a cozy neighborhood restaurant where
                    delicious comfort food meets a relaxed, welcoming
                    atmosphere. Our menu features a delightful blend of classic
                    dishes with a modern twist, crafted using fresh, locally
                    sourced ingredients. Whether you're here for a quick bite, a
                    hearty meal, or just to enjoy our signature cocktails and
                    desserts, we promise an unforgettable dining experience.
                  </span>
                </div>
                <div className="flex-1/4 m-auto">
                  <img
                    src="/src\assets\logoIcon.png"
                    className="w-[60%] mx-auto"
                  />
                </div>
              </div>
              <div className="w-min mx-auto"></div>
              <Tabs defaultValue="reviews" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="menu">Menu</TabsTrigger>
                  <TabsTrigger value="pictures">Pictures</TabsTrigger>
                  <TabsTrigger value="map">Map</TabsTrigger>
                </TabsList>
                <TabsContent value="reviews" className="px-4 mb-4">
                  <ReviewsTabContent />
                </TabsContent>
                <TabsContent value="menu" className="px-4">
                  <MenuTabContent />
                </TabsContent>
                <TabsContent value="pictures" className="px-4">
                  <PicturesTabContent />
                </TabsContent>
                <TabsContent value="map" className="px-4">
                  <div className="aspect-2/1 w-full">
                    <iframe
                      className="size-full"
                      src="https://use.mazemap.com/embed.html#v=1&zlevel=1&center=145.132766,-37.914154&zoom=18&campusid=159&sharepoitype=poi&sharepoi=1034799&utm_medium=iframe"
                      style={{ border: "1px solid grey" }}
                      allow="geolocation"
                    ></iframe>
                    <br />
                    <small>
                      <a href="https://www.mazemap.com/">Map by MazeMap</a>
                    </small>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
        {currentPage === "reviews" && (
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mt-10">
            Reviews
          </h1>
        )}
        {currentPage === "restaurant" && (
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mt-10">
            Update Restaurant
          </h1>
        )}
        {currentPage === "menu" && (
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mt-10">
            Update Menu
          </h1>
        )}
        {currentPage === "pictures" && (
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mt-10">
            Update Pictures
          </h1>
        )}
      </div>
    </div>
  );
}
const ReviewsTabContent = () => (
  <div className="mt-4 space-y-6 ">
    {reviews.map((review, index) => (
      <Card key={index}>
        <CardContent className="text-lg space-y-2">
          <div className="flex">
            <div className="flex-3/5 font-bold">{review.reviewer}</div>
            <div className=" flex flex-2/5">
              <div className="flex ml-auto space-x-6">
                <div className="text-gray-600 text-right">{review.date}</div>
                <div className="">
                  <Ratings stars={review.rating} />
                </div>
              </div>
            </div>
          </div>
          <div>{review.review}</div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const MenuTabContent = () => (
  <Table className="mt-4">
    <TableHeader>
      <TableRow className="text-lg">
        <TableHead className="text-center font-bold text-black">
          Picture
        </TableHead>
        <TableHead className="text-center font-bold text-black">Name</TableHead>
        <TableHead className="text-center font-bold text-black">
          Price
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {menu.map((item, index) => (
        <TableRow key={index}>
          <TableCell className="w-[7%] text-center">
            <img src={item.picture} />
          </TableCell>
          <TableCell className="text-center">{item.name}</TableCell>
          <TableCell className="text-center">${item.price}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const PicturesTabContent = () => (
  <div className="grid grid-cols-4 gap-8 mt-4">
    {pictures.map((picture, index) => (
      <img src={picture} className="aspect-square w-[60%] m-auto" key={index} />
    ))}
  </div>
);

export default BusinessDash;
