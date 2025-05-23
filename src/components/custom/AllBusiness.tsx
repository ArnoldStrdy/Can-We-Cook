import { TRestaurant } from "@/Types/RestaurantTypes";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useState } from "react";
import { BusinessCard } from "./businessCard";
import { getAllBusinesses } from "@/API/RestaurantAPI";

export const AllBusiness = () => {
  const getAllBusinessesQuery = useQuery({
    queryFn: () => getAllBusinesses(),
    queryKey: ["getAllBusinesses"],
  });
  const [selectedCuisine, setCuisine] = useState("All");
  const [query, setQuery] = useState("");
  const getCategories = getAllBusinessesQuery.data
    ?.map((restaurant) => restaurant.cuisineType)
    .filter((value, index, self) => self.indexOf(value) === index);
  const categories = getCategories?.sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );

  return (
    <div className="max-w-6xl w-full flex flex-col items-start justify-center gap-6 mb-6">
      <div className="flex flex-col items-start justify-start gap-1">
        <h1 className="text-3xl font-bold">All Restaurants</h1>
      </div>

      <div className="flex flex-row items-center justify-start gap-4 w-full py-2 px-1">
        <input
          type="text"
          className="border rounded-md px-4 py-2 w-fit min-w-fit border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#FF6F00] focus:border-transparent"
          placeholder="Search for a restaurant"
          onClick={() => setCuisine("All")}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
        <div className="flex flex-row items-center justify-start gap-2 w-full overflow-x-auto scrollbar-hidden">
          <div
            className={`border rounded-md px-4 py-2 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
              "All" == selectedCuisine && "bg-gray-100"
            }`}
            onClick={() => setCuisine("All")}
          >
            All
          </div>
          {categories?.map((cuisine, index) => (
            <div
              key={index}
              className={`border rounded-md px-4 py-2 hover:cursor-pointer border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                cuisine == selectedCuisine && "bg-gray-100"
              }`}
              onClick={() => setCuisine(cuisine)}
            >
              {cuisine}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-center gap-4 w-full">
        {getAllBusinessesQuery.data
          ?.filter(
            (restaurant) =>
              (selectedCuisine !== "All"
                ? restaurant.cuisineType == selectedCuisine
                : true) &&
              (restaurant.businessName
                .toLowerCase()
                .includes(query.toLowerCase()) ||
                restaurant.cuisineType
                  .toLowerCase()
                  .includes(selectedCuisine.toLowerCase()))
          )
          .map((restaurant, index) => (
            <BusinessCard index={index} key={index} restaurant={restaurant} />
          ))}
      </div>
    </div>
  );
};
