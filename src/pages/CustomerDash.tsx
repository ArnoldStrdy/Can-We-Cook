import { useState, useEffect } from "react";
import imgUrl from "../assets/logoIcon.png";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Ratings from "@/components/ui/ratings";

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
    id: 2312,
  },
  {
    name: "The Blue Plate",
    logo: imgUrl,
    rating: 3.5,
    id: 2313,
  },
  {
    name: "The Red Spoon",
    logo: imgUrl,
    rating: 4.5,
    id: 2314,
  },
  {
    name: "The Yellow Bowl",
    logo: imgUrl,
    rating: 4,
    id: 2315,
  },
];

const sampleRestaurants = [
  {
    name: "Savor & Sip",
    logo: imgUrl,
    rating: 4,
    id: 2311,
    cuisine: "American",
  },
  {
    name: "The Green House",
    logo: imgUrl,
    rating: 4.5,
    id: 2312,
    cuisine: "Italian",
  },
  {
    name: "The Blue Plate",
    logo: imgUrl,
    rating: 3.5,
    id: 2313,
    cuisine: "Chinese",
  },
  {
    name: "The Red Spoon",
    logo: imgUrl,
    rating: 4.5,
    id: 2314,
    cuisine: "Mexican",
  },
  {
    name: "The Yellow Bowl",
    logo: imgUrl,
    rating: 4,
    id: 2315,
    cuisine: "Indian",
  },
  { name: "Urban Bites", logo: imgUrl, rating: 3.8, id: 2316, cuisine: "Thai" },
  {
    name: "Fork & Flame",
    logo: imgUrl,
    rating: 4.2,
    id: 2317,
    cuisine: "Korean",
  },
  {
    name: "Spice Symphony",
    logo: imgUrl,
    rating: 4.6,
    id: 2318,
    cuisine: "Indian",
  },
  {
    name: "Fusion Feast",
    logo: imgUrl,
    rating: 3.9,
    id: 2319,
    cuisine: "Fusion",
  },
  {
    name: "Taste of Tokyo",
    logo: imgUrl,
    rating: 4.3,
    id: 2320,
    cuisine: "Japanese",
  },
  {
    name: "Curry & Co.",
    logo: imgUrl,
    rating: 4.1,
    id: 2321,
    cuisine: "Indian",
  },
  {
    name: "Bistro Bella",
    logo: imgUrl,
    rating: 4.4,
    id: 2322,
    cuisine: "French",
  },
  {
    name: "La Fiesta",
    logo: imgUrl,
    rating: 3.7,
    id: 2323,
    cuisine: "Mexican",
  },
  {
    name: "Dragon Wok",
    logo: imgUrl,
    rating: 4.5,
    id: 2324,
    cuisine: "Chinese",
  },
  {
    name: "Seoul Bites",
    logo: imgUrl,
    rating: 4.2,
    id: 2325,
    cuisine: "Korean",
  },
  {
    name: "Pasta Point",
    logo: imgUrl,
    rating: 4.3,
    id: 2326,
    cuisine: "Italian",
  },
  {
    name: "The Rustic Grill",
    logo: imgUrl,
    rating: 3.8,
    id: 2327,
    cuisine: "American",
  },
  {
    name: "Sushi Zen",
    logo: imgUrl,
    rating: 4.7,
    id: 2328,
    cuisine: "Japanese",
  },
  {
    name: "Herbivore Haven",
    logo: imgUrl,
    rating: 4.0,
    id: 2329,
    cuisine: "Vegetarian",
  },
  {
    name: "Pizza Palace",
    logo: imgUrl,
    rating: 4.1,
    id: 2330,
    cuisine: "Italian",
  },
  {
    name: "Flame & Skillet",
    logo: imgUrl,
    rating: 3.9,
    id: 2331,
    cuisine: "American",
  },
  {
    name: "The Vegan Table",
    logo: imgUrl,
    rating: 4.5,
    id: 2332,
    cuisine: "Vegan",
  },
  {
    name: "Noodle Nirvana",
    logo: imgUrl,
    rating: 4.4,
    id: 2333,
    cuisine: "Thai",
  },
  {
    name: "The Kebab Stop",
    logo: imgUrl,
    rating: 4.2,
    id: 2334,
    cuisine: "Middle Eastern",
  },
  {
    name: "Banh Mi Bistro",
    logo: imgUrl,
    rating: 3.8,
    id: 2335,
    cuisine: "Vietnamese",
  },
  {
    name: "Ramen Republic",
    logo: imgUrl,
    rating: 4.6,
    id: 2336,
    cuisine: "Japanese",
  },
  {
    name: "Steakhouse Supreme",
    logo: imgUrl,
    rating: 4.3,
    id: 2337,
    cuisine: "American",
  },
  {
    name: "Casa de Tapas",
    logo: imgUrl,
    rating: 4.0,
    id: 2338,
    cuisine: "Spanish",
  },
  {
    name: "Tandoori Times",
    logo: imgUrl,
    rating: 4.4,
    id: 2339,
    cuisine: "Indian",
  },
  {
    name: "Pho Paradise",
    logo: imgUrl,
    rating: 4.1,
    id: 2340,
    cuisine: "Vietnamese",
  },
  {
    name: "Burgers & Brews",
    logo: imgUrl,
    rating: 3.9,
    id: 2341,
    cuisine: "American",
  },
  {
    name: "Dumpling Den",
    logo: imgUrl,
    rating: 4.2,
    id: 2342,
    cuisine: "Chinese",
  },
  {
    name: "Greek Garden",
    logo: imgUrl,
    rating: 4.0,
    id: 2343,
    cuisine: "Greek",
  },
  {
    name: "Falafel Factory",
    logo: imgUrl,
    rating: 3.7,
    id: 2344,
    cuisine: "Middle Eastern",
  },
  {
    name: "Pancake Point",
    logo: imgUrl,
    rating: 4.3,
    id: 2345,
    cuisine: "Breakfast",
  },
  {
    name: "Toast & Tonic",
    logo: imgUrl,
    rating: 4.6,
    id: 2346,
    cuisine: "Brunch",
  },
  {
    name: "Wok This Way",
    logo: imgUrl,
    rating: 4.2,
    id: 2347,
    cuisine: "Asian Fusion",
  },
  {
    name: "Zest Kitchen",
    logo: imgUrl,
    rating: 4.5,
    id: 2348,
    cuisine: "Fusion",
  },
  {
    name: "The Daily Grind",
    logo: imgUrl,
    rating: 4.1,
    id: 2349,
    cuisine: "Cafe",
  },
  {
    name: "Gnocchi & Co.",
    logo: imgUrl,
    rating: 4.4,
    id: 2350,
    cuisine: "Italian",
  },
  {
    name: "Peking Garden",
    logo: imgUrl,
    rating: 4.0,
    id: 2351,
    cuisine: "Chinese",
  },
  {
    name: "Taco Terrace",
    logo: imgUrl,
    rating: 4.2,
    id: 2352,
    cuisine: "Mexican",
  },
  {
    name: "Biryani Bazaar",
    logo: imgUrl,
    rating: 4.3,
    id: 2353,
    cuisine: "Indian",
  },
  {
    name: "Burger Barn",
    logo: imgUrl,
    rating: 3.9,
    id: 2354,
    cuisine: "American",
  },
  {
    name: "Samosa Street",
    logo: imgUrl,
    rating: 4.1,
    id: 2355,
    cuisine: "Indian",
  },
  {
    name: "Miso Hungry",
    logo: imgUrl,
    rating: 4.5,
    id: 2356,
    cuisine: "Japanese",
  },
  {
    name: "The Grill Spot",
    logo: imgUrl,
    rating: 4.2,
    id: 2357,
    cuisine: "BBQ",
  },
  {
    name: "Chili & Lime",
    logo: imgUrl,
    rating: 4.0,
    id: 2358,
    cuisine: "Thai",
  },
  { name: "Café Mocha", logo: imgUrl, rating: 4.3, id: 2359, cuisine: "Cafe" },
  {
    name: "Wrap & Roll",
    logo: imgUrl,
    rating: 4.1,
    id: 2360,
    cuisine: "Mediterranean",
  },
  {
    name: "Tortilla Town",
    logo: imgUrl,
    rating: 4.4,
    id: 2361,
    cuisine: "Mexican",
  },
  {
    name: "The Spice Route",
    logo: imgUrl,
    rating: 4.5,
    id: 2362,
    cuisine: "Indian",
  },
  {
    name: "Rice & Beans",
    logo: imgUrl,
    rating: 3.8,
    id: 2363,
    cuisine: "Latin American",
  },
  {
    name: "Udon Universe",
    logo: imgUrl,
    rating: 4.6,
    id: 2364,
    cuisine: "Japanese",
  },
  {
    name: "Grill & Chill",
    logo: imgUrl,
    rating: 4.0,
    id: 2365,
    cuisine: "American",
  },
  {
    name: "Saffron Lounge",
    logo: imgUrl,
    rating: 4.4,
    id: 2366,
    cuisine: "Indian",
  },
  {
    name: "Teriyaki Time",
    logo: imgUrl,
    rating: 4.3,
    id: 2367,
    cuisine: "Japanese",
  },
  {
    name: "Chopsticks & Co.",
    logo: imgUrl,
    rating: 4.1,
    id: 2368,
    cuisine: "Chinese",
  },
  {
    name: "Soul Food Café",
    logo: imgUrl,
    rating: 3.9,
    id: 2369,
    cuisine: "Southern",
  },
  {
    name: "Gastro Pub",
    logo: imgUrl,
    rating: 4.0,
    id: 2370,
    cuisine: "British",
  },
  {
    name: "Tandoor Tales",
    logo: imgUrl,
    rating: 4.5,
    id: 2371,
    cuisine: "Indian",
  },
  {
    name: "Bowl & Fork",
    logo: imgUrl,
    rating: 4.2,
    id: 2372,
    cuisine: "Healthy",
  },
  {
    name: "Mezze Magic",
    logo: imgUrl,
    rating: 4.3,
    id: 2373,
    cuisine: "Mediterranean",
  },
  {
    name: "Pasta House",
    logo: imgUrl,
    rating: 4.1,
    id: 2374,
    cuisine: "Italian",
  },
  {
    name: "Churro Charm",
    logo: imgUrl,
    rating: 4.4,
    id: 2375,
    cuisine: "Dessert",
  },
  {
    name: "Tempura Town",
    logo: imgUrl,
    rating: 4.5,
    id: 2376,
    cuisine: "Japanese",
  },
  {
    name: "Baguette Bistro",
    logo: imgUrl,
    rating: 4.0,
    id: 2377,
    cuisine: "French",
  },
  {
    name: "Crepe Corner",
    logo: imgUrl,
    rating: 4.3,
    id: 2378,
    cuisine: "French",
  },
  {
    name: "The Salad Spot",
    logo: imgUrl,
    rating: 4.2,
    id: 2379,
    cuisine: "Healthy",
  },
  { name: "BBQ Bay", logo: imgUrl, rating: 4.1, id: 2380, cuisine: "BBQ" },
];

function CustomerDash() {
  const navigate = useNavigate();
  const [filteredRestaurants, setFilteredRestaurants] =
    useState(sampleRestaurants);

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
          {sampleTopRestaurants.map((restaurant, index) => (
            <div
              key={index}
              className="flex flex-row items-center justify-between border rounded-lg py-8 gap-16 px-10 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => navigate(`/restaurant/${restaurant.id}`)}
            >
              <div className="flex flex-row items-center justify-between gap-4">
                <img src={restaurant.logo} className="w-12 h-12" />
                <div className="text-lg font-bold">
                  {index + 1 + ". "}
                  {restaurant.name}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <div>{restaurant.rating}</div>
                <Ratings stars={restaurant.rating} />
                {/* <div className="flex flex-row items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      className={`${
                        restaurant.rating >= value ? "fill-[#FFD233]" : ""
                      }`}
                    />
                  ))}
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div id="restaurants" className="h-28"></div>
      <div className="max-w-6xl w-full min-h-[800px] flex flex-col items-start justify-center gap-6">
        <div className="flex flex-col items-start justify-start gap-1">
          <h1 className="text-3xl font-semibold">Restaurants</h1>
        </div>

        <div className="flex flex-row items-center justify-start gap-4">
          {[
            "All",
            "American",
            "Italian",
            "Chinese",
            "Mexican",
            "Indian",
            "Thai",
            "Korean",
            "Japanese",
          ].map((cuisine, index) => (
            <div
              key={index}
              className="border rounded-full px-4 py-2 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() =>
                setFilteredRestaurants(
                  sampleRestaurants.filter(
                    (restaurant) =>
                      restaurant.cuisine === cuisine || cuisine === "All"
                  )
                )
              }
            >
              {cuisine}
            </div>
          ))}
          <input
            type="text"
            className="border rounded-full px-4 py-2 w-full"
            placeholder="Search for a restaurant"
            onChange={(e) => {
              setFilteredRestaurants(
                sampleRestaurants.filter(
                  (restaurant) =>
                    restaurant.name
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase()) ||
                    restaurant.cuisine
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase())
                )
              );
            }}
          />
        </div>

        <div className="flex flex-col justify-center gap-4 w-full">
          {filteredRestaurants.map((restaurant, index) => (
            <div
              key={index}
              className="flex flex-row items-center justify-between border rounded-lg py-8 gap-16 px-10 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => navigate(`/restaurant/${restaurant.id}`)}
            >
              <div className="flex flex-row items-center justify-between gap-4">
                <img src={restaurant.logo} className="w-12 h-12" />
                <div className="text-lg font-bold">
                  {index + 1 + ". "}
                  {restaurant.name}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                <div>{restaurant.rating}</div>
                <div className="flex flex-row items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      className={`${
                        restaurant.rating >= value ? "fill-[#FFD233]" : ""
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
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
