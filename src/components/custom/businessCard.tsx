import { TRestaurant } from "@/Types/RestaurantTypes";
import Ratings from "../ui/ratings";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../ui/card";

export function BusinessCard({
  restaurant,
  index,
}: {
  restaurant: TRestaurant;
  index: number;
}) {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => navigate(`/restaurant/${restaurant.businessId}`)}
      className="flex flex-row items-center justify-between gap-4 py-8 hover:cursor-pointer border hover:border-[#554971] transition-all duration-200 ease-in-out"
    >
      <CardContent className="flex flex-row items-center justify-between w-full">
        <div className="flex flex-row items-center gap-6">
          <img
            src={restaurant.businessLogo}
            className="w-12 h-12 object-contain"
          />
          <div className="text-lg font-bold">
            {/* {index + 1 + ". "} */}
            {restaurant.businessName}
          </div>
        </div>

        <div className="flex flex-col items-end align-middle justify-center h-fit">
          <div>{restaurant.weeklyAggregateScore}</div>
          <Ratings
            stars={restaurant.aggregatedScore / restaurant.aggregatedReviews}
          />
        </div>
      </CardContent>
    </Card>
  );
}
