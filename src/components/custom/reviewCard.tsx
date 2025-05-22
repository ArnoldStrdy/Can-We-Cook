import { IExistingReview } from "@/Types/RestaurantTypes";
import { Card, CardContent } from "../ui/card";
import { Trash2, Verified } from "lucide-react";
import Ratings from "../ui/ratings";
import { ClickablePicture } from "./PicturesTabContent";

export function ReviewCard({
  review,
  onDelete,
}: {
  review: IExistingReview;
  onDelete?: () => void;
}) {
  return (
    <Card>
      <CardContent className="text-lg space-y-2">
        <div className="flex">
          <div>
            <div className="flex-3/5 font-bold flex">
              <p className="font-bold text-lg">{review.customerName}</p>
              {review.verified && <Verified color="#4ECB71" className="ml-2" />}
            </div>
            <div className="text-gray-400 text-left text-sm font-semibold">
              {review.dateTime.toDate().toLocaleDateString("en-AU")}
            </div>
          </div>
          <div className=" flex flex-2/5">
            <div className="flex ml-auto space-x-6">
              <div className="flex align-middle justify-center h-full">
                <Ratings stars={review.rating} />
              </div>
            </div>
          </div>
        </div>
        <div className="text-base font-semibold text-gray-800">
          {review.reviewText}
        </div>
        <div className="flex relative">
          <div className="grid grid-cols-6 gap-3 place-items-center">
            {review.pictures?.map((url) => (
              <ClickablePicture url={url} />
            ))}
          </div>
          {onDelete && (
            <div className="absolute bottom-0 right-0">
              <button onClick={() => onDelete()}>
                <Trash2 className="text-red-400" />
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
