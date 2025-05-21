import { useState, useEffect } from "react";
import BGLogo from "../assets/logoIconFork.png";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllBusinesses, getAllPromotions } from "@/API/RestaurantAPI";
import { BusinessCard } from "@/components/custom/businessCard";
import { LuInfo } from "react-icons/lu";
import Footer from "@/components/Footer";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TPromotion } from "@/Types/RestaurantTypes";
import { weeklyJob } from "./WrapperObjects";
import { cleanExpiredBanners } from "./WrapperObjects";


function CustomerDash() {
  const navigate = useNavigate();
  const [selectedCuisine, setCuisine] = useState<string>("All");
  const [query, setQuery] = useState<string>("");
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
  });

  const getTopBusinessesQuery = useQuery({
    queryFn: () => getAllBusinesses(),
    queryKey: ["getAllBusinesses"],
  });

  const topBusiness = getTopBusinessesQuery.data
    ?.filter((restaurant) => restaurant.aggregatedReviews > 0)
    .sort((a, b) => {
      const aRatio = a.aggregatedScore / a.aggregatedReviews;
      const bRatio = b.aggregatedScore / b.aggregatedReviews;
      return aRatio == bRatio
        ? b.aggregatedReviews - a.aggregatedReviews
        : bRatio - aRatio;
    })
    .slice(0, 5)
    .map((restaurant, index) => (
      <BusinessCard
        index={index}
        key={restaurant.businessId || index}
        restaurant={restaurant}
      />
    ));

  const getCategories = getAllBusinessesQuery.data
    ?.map((restaurant) => restaurant.cuisineType)
    .filter((value, index, self) => self.indexOf(value) === index);
  const categories = getCategories?.sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );

  const getAllPromotionsQuery = useQuery({
    queryFn: () => getAllPromotions(),
    queryKey: ["getAllPromotions"],
  });

  const PromotionCarousel = ({ promotions }: { promotions: TPromotion[] }) => {
    const [api, setApi] = useState<CarouselApi>();

    const intervalTime = 3000;
    useEffect(() => {
      setInterval(() => {
        api?.scrollNext();
      }, intervalTime);
    }, [api]);

    return (
      <Carousel
        setApi={setApi}
        className="max-w-7xl"
        opts={{ align: "center", loop: true }}
      >
        <CarouselContent>
          {promotions?.map((promotion) => (
            <CarouselItem
              className={`basis-1/${
                promotions.length < 3 ? promotions.length : 3
              }`}
              onClick={() => navigate(`/restaurant/${promotion.businessID}`)}
              key={promotion.promotionID}
            >
              <div className="flex items-center justify-center h-36 sm:h-72 bg-gray-200/40 rounded-lg p-1">
                <img
                  src={promotion.imageURL}
                  className="object-cover max-h-full cursor-pointer"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {promotions.length > 3 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    );
  };

  return (
    <>
      <img
        src={BGLogo}
        className="w-[50%] blur-2xl opacity-30 object-contain fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none -z-50"
      />
      <div className="bg-[#A7ACD9]/20 flex flex-col items-center pt-20 text-black gap-10 relative px-4 sm:px-0">
      <div className="flex flex-row items-center justify-center gap-2">
        <button
          onClick={() => {
            weeklyJob();
          }}
          className="bg-red-600 text-white px-4 py-2 rounded hidden"
        >
          DEMO ONLY Weekly update top pics
        </button>
        <button
          onClick={() => {
            cleanExpiredBanners();
          }}
          className="bg-red-600 text-white px-4 py-2 rounded hidden"
        >
          DEMO ONLY Daily delete expired promotions
        </button>
        </div>
        <div
          id="top"
          className="max-w-6xl w-full flex flex-col items-start justify-center gap-6"
        >
          <div className="flex flex-row items-center justify-start gap-3 pt-6">
            <h1 className="text-3xl font-bold">Top Pics</h1>

            <div className="relative group flex flex-row items-center justify-center gap-2 h-full">
              <LuInfo className="text-xl cursor-pointer" />

              {/* Tooltip */}
              <div className="absolute bottom-[-2.5rem] left-1/2 -translate-x-1/2 bg-white text-sm text-black px-3 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                Highest Average Ratings Updated Weekly
              </div>
            </div>
          </div>
          {topBusiness?.length! > 0 && (
            <>
              <div className="flex flex-col justify-center gap-4 w-full">
                {topBusiness}
              </div>
            </>
          )}
        </div>
        <h1 className="text-3xl font-bold text-start w-full max-w-6xl">
          Promotions
        </h1>
        <div className="max-w-6xl w-full flex flex-col items-start justify-start gap-3 pt-6">
          {getAllPromotionsQuery.data?.length! > 0 && (
            <PromotionCarousel promotions={getAllPromotionsQuery.data!} />
          )}
        </div>

        <div className="max-w-6xl w-full flex flex-col items-start justify-center gap-6 mb-6">
          <div className="flex flex-col items-start justify-start gap-1">
            <h1 className="text-3xl font-bold">All Restaurants</h1>
          </div>

          <div className="flex flex-row items-center justify-start gap-4 w-full py-2 px-1">
            <input
              type="text"
              className="border rounded-md px-4 py-2 w-fit min-w-fit border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#FF6F00] focus:border-transparent"
              placeholder="Search for a restaurant"
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
            <div className="flex flex-row items-center justify-start gap-2 w-full overflow-x-auto scrollbar-hidden">
              <div
                  className={`border rounded-md px-4 py-2 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${"All" == selectedCuisine && "bg-gray-100"}`}
                  onClick={() => setCuisine("All")}
                >
                  All
                </div>
              {categories?.map((cuisine, index) => (
                <div
                  key={index}
                  className={`border rounded-md px-4 py-2 hover:cursor-pointer border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${cuisine == selectedCuisine && "bg-gray-100"}`}
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
                <BusinessCard
                  index={index}
                  key={index}
                  restaurant={restaurant}
                />
              ))}
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center items-center">
        <Footer />
      </div>
    </>
  );
}

export default CustomerDash;
