import { IExistingReview } from "@/Types/RestaurantTypes";
import { Card, CardContent } from "../ui/card";
import { Trash2, Verified } from "lucide-react";
import Ratings from "../ui/ratings";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

export function ReviewCard({ review, onDelete }: { review: IExistingReview, onDelete?: () => void }) {
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
        <div className="flex relative">
        <div className="grid grid-cols-6 gap-2 place-items-center">
          {review.pictures?.map((url) => (
            <Dialog key={url}>
              <DialogTrigger asChild>
                <div className="rounded-lg bg-gray-100 overflow-hidden aspect-square w-full border flex items-center justify-center relative">
                  <img
                    src={url}
                    alt=""
                    className="w-full h-auto object-contain"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="p-10">
                <img
                  src={url}
                  alt=""
                  className="w-full h-auto object-contain"
                />
              </DialogContent>
            </Dialog>
          ))}
        </div>
        {onDelete && <div className="absolute bottom-0 right-0"><button onClick={() => onDelete()}><Trash2/></button></div>}
        </div>
        
        
      </CardContent>
    </Card>
  );
}
