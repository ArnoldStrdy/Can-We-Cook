import { IExistingReview } from "@/Types/RestaurantTypes";
import { Card, CardContent } from "../ui/card";
import { Verified } from "lucide-react";
import Ratings from "../ui/ratings";

export function ReviewCard({ review }: { review: IExistingReview }) {
  return (
    <Card>
      <CardContent className="text-lg space-y-2">
        <div className="flex">
          <div className="flex-3/5 font-bold flex">
            {review.customerName}
            {review.verified && <Verified color="#4ECB71" className="ml-2" />}
          </div>
          <div className=" flex flex-2/5">
            <div className="flex ml-auto space-x-6">
              <div className="text-gray-600 text-right">
                {review.dateTime.toDate().toLocaleDateString()}
              </div>
              <div className="">
                <Ratings stars={review.rating} />
              </div>
            </div>
          </div>
        </div>
        <div>{review.reviewText}</div>
        <div className="grid grid-cols-6 gap-2 place-items-center">
          {review.pictures?.map((url) => (
            <div
              key={url}
              className="rounded-lg bg-gray-100 overflow-hidden aspect-square w-full border flex items-center justify-center relative"
            >
              <img src={url} alt="" className="w-full h-auto object-contain" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
