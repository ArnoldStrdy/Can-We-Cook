import { useState, useEffect } from "react";
import imgUrl from "../assets/logoIcon.png";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Ratings from "@/components/ui/ratings";
import { useQuery } from "@tanstack/react-query";
import { getAllBusinesses } from "@/API/RestaurantAPI";
import { BusinessCard } from "@/components/custom/businessCard";

const sampleTopRestaurants = [
  {
    name: "Savor & Sip",
    logo: imgUrl,
    rating: 4,
    id: "odCe5cYwH8M3oHTcYmav",
  },
  {
    name: "The Green House",
    logo: imgUrl,
    rating: 4.5,
    id: "odCe5cYwH8M3oHTcYmav",
  },
  {
    name: "The Blue Plate",
    logo: imgUrl,
    rating: 3.5,
    id: "odCe5cYwH8M3oHTcYmav",
  },
  {
    name: "The Red Spoon",
    logo: imgUrl,
    rating: 4.5,
    id: "odCe5cYwH8M3oHTcYmav",
  },
  {
    name: "The Yellow Bowl",
    logo: imgUrl,
    rating: 4,
    id: "odCe5cYwH8M3oHTcYmav",
  },
];

const sampleRestaurants = [
  {
    name: "Savor & Sip",
    logo: imgUrl,
    rating: 4,
    id: "odCe5cYwH8M3oHTcYmav",
    cuisine: "American",
  },
  {
    name: "The Green House",
    logo: imgUrl,
    rating: 4.5,
    id: "odCe5cYwH8M3oHTcYmav",
    cuisine: "Italian",
  },
  {
    name: "The Blue Plate",
    logo: imgUrl,
    rating: 3.5,
    id: "odCe5cYwH8M3oHTcYmav",
    cuisine: "Chinese",
  },
  {
    name: "The Red Spoon",
    logo: imgUrl,
    rating: 4.5,
    id: "odCe5cYwH8M3oHTcYmav",
    cuisine: "Mexican",
  },
  {
    name: "The Yellow Bowl",
    logo: imgUrl,
    rating: 4,
    id: "odCe5cYwH8M3oHTcYmav",
    cuisine: "Indian",
  },
  {
    name: "Urban Bites",
    logo: imgUrl,
    rating: 3.8,
    id: "odCe5cYwH8M3oHTcYmav",
    cuisine: "Thai",
  },
  {
    name: "Fork & Flame",
    logo: imgUrl,
    rating: 4.2,
    id: "odCe5cYwH8M3oHTcYmav",
    cuisine: "Korean",
  },
  {
    name: "Spice Symphony",
    logo: imgUrl,
    rating: 4.6,
    id: "odCe5cYwH8M3oHTcYmav",
    cuisine: "Indian",
  },
  {
    name: "Fusion Feast",
    logo: imgUrl,
    rating: 3.9,
    id: "odCe5cYwH8M3oHTcYmav",
    cuisine: "Fusion",
  },
  {
    name: "Taste of Tokyo",
    logo: imgUrl,
    rating: 4.3,
    id: "odCe5cYwH8M3oHTcYmav",
    cuisine: "Japanese",
  },
];

type TCuisine = "All"|
            "American"|
            "Italian"|
            "Chinese"|
            "Mexican"|
            "Indian"|
            "Thai"|
            "Korean"|
            "Japanese"

const cuisines: TCuisine[] = ["All",
            "American",
            "Italian",
            "Chinese",
            "Mexican",
            "Indian",
            "Thai",
            "Korean",
            "Japanese"]

function CustomerDash() {
  const navigate = useNavigate();
  const [cuisine, setCuisine] = useState<TCuisine>("All")
  const [query, setQuery] = useState<string>("")
  const { section } = useParams();
  useEffect(() => {
    if (section) {
      const el = document.getElementById(section);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
    window.history.replaceState(null, "", "/");
  }, [section]);

  const getAllBusinessesQuery = useQuery({
    queryFn: () => getAllBusinesses(),
    queryKey: ["getAllBusinesses"],
  })

  return (
    <div className="bg-white dark:bg-black flex flex-col items-center justify-center text-black">
      <div
        id="top"
        className="max-w-6xl w-full h-screen min-h-[800px] flex flex-col items-start justify-center gap-6"
      >
        <div className="flex flex-col items-start justify-start gap-1">
          <h1 className="text-3xl font-semibold">Top Pics</h1>
          <p>Highest Average Ratings Every Week</p>
        </div>
        <div className="flex flex-col justify-center gap-4 w-full">
          {getAllBusinessesQuery.data?.map((restaurant, index) => (
            <BusinessCard index={index} key={index} restaurant={restaurant}/>
          ))}
        </div>
      </div>
      <div id="restaurants" className="h-28"></div>
      <div className="max-w-6xl w-full min-h-[800px] flex flex-col items-start justify-center gap-6">
        <div className="flex flex-col items-start justify-start gap-1">
          <h1 className="text-3xl font-semibold">Restaurants</h1>
        </div>

        <div className="flex flex-row items-center justify-start gap-4 overflow-x-auto w-full">
          {cuisines.map((cuisine, index) => (
            <div
              key={index}
              className="border rounded-full px-4 py-2 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() =>
                setCuisine(cuisine)
              }
            >
              {cuisine}
            </div>
          ))}
          <input
            type="text"
            className="border rounded-full px-4 py-2 w-full min-w-fit"
            placeholder="Search for a restaurant"
            onChange={(e) => {
              setQuery(e.target.value)
            }}
          />
        </div>

        <div className="flex flex-col justify-center gap-4 w-full">
          {getAllBusinessesQuery.data?.filter((restaurant) => (cuisine !== "All" ? restaurant.cuisineType == cuisine : true)  && (restaurant.businessName.toLowerCase().includes(query.toLowerCase()) || restaurant.cuisineType.toLowerCase().includes(cuisine.toLowerCase()))).map((restaurant, index) => (
            <BusinessCard index={index} key={index} restaurant={restaurant}/>
          ))}
        </div>
        <div id="map" className="h-28"></div>
        <div className="max-w-6xl w-full h-screen min-h-[800px] flex flex-col items-start justify-center gap-6">
          <div className="flex flex-col items-start justify-start gap-1">
            <h1 className="text-3xl font-semibold">Map</h1>
          </div>
          <div className="flex flex-col justify-center gap-4 w-full">
            <iframe
              className="w-full h-[720px]"
              src="https://use.mazemap.com/embed.html#v=1&campusid=159&zlevel=1&center=145.133167,-37.911460&zoom=16.4&utm_medium=iframe"
              allow="geolocation"
            ></iframe>
            <br />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDash;
