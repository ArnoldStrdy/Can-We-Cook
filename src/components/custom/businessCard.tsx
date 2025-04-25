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
      className="flex flex-row items-center justify-between gap-4 py-8 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <CardContent className="flex flex-row items-center justify-between w-full">
        <div className="flex flex-row items-center gap-4">
          <img
            src={restaurant.businessLogo}
            className="w-12 h-12 object-contain"
          />
          <div className="text-lg font-bold">
            {index + 1 + ". "}
            {restaurant.businessName}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div>{restaurant.weeklyAggregateScore}</div>
          <Ratings stars={restaurant.weeklyAggregateScore} />
        </div>
      </CardContent>
    </Card>
  );
}
