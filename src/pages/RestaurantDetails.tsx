import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Ratings from "@/components/ui/ratings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const reviews = [
  {
    reviewer: "Jeff Bezos",
    date: "05/07/2024",
    rating: 5,
    review:
      "I had an amazing dinner at Savor & Sip last night! The ambiance was warm and inviting, and the staff were super friendly. I ordered the grilled salmon, and it was cooked to perfection—crispy on the outside and tender inside.",
  },
  {
    reviewer: "Jeff Bezos",
    date: "05/07/2024",
    rating: 5,
    review:
      "I had an amazing dinner at Savor & Sip last night! The ambiance was warm and inviting, and the staff were super friendly. I ordered the grilled salmon, and it was cooked to perfection—crispy on the outside and tender inside.",
  },
  {
    reviewer: "Jeff Bezos",
    date: "05/07/2024",
    rating: 5,
    review:
      "I had an amazing dinner at Savor & Sip last night! The ambiance was warm and inviting, and the staff were super friendly. I ordered the grilled salmon, and it was cooked to perfection—crispy on the outside and tender inside.",
  },
  {
    reviewer: "Jeff Bezos",
    date: "05/07/2024",
    rating: 5,
    review:
      "I had an amazing dinner at Savor & Sip last night! The ambiance was warm and inviting, and the staff were super friendly. I ordered the grilled salmon, and it was cooked to perfection—crispy on the outside and tender inside.",
  },

];

function RestaurantDetails() {
  return (
    <div className="mx-[20%] mt-[5%] space-y-6">
      <div className="flex">
        <div className="flex-3/4 text-left space-y-4 pr-[10%]">
          <h1 className="text-4xl font-bold">Restaurant 1</h1>
          <span className="text-lg">
            Welcome to Savor & Sip, a cozy neighborhood restaurant where
            delicious comfort food meets a relaxed, welcoming atmosphere. Our
            menu features a delightful blend of classic dishes with a modern
            twist, crafted using fresh, locally sourced ingredients. Whether
            you're here for a quick bite, a hearty meal, or just to enjoy our
            signature cocktails and desserts, we promise an unforgettable dining
            experience.
          </span>
        </div>
        <div className="flex-1/4 m-auto">
          <img src="/src\assets\logoIcon.png" className="w-[60%] mx-auto"/>
        </div>
      </div>
      <div className="w-min mx-auto">
        <Button className="rounded-full ml-auto text-lg p-6">
          Write a Review
        </Button>
      </div>
      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="pictures">Pictures</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
        </TabsList>
        <TabsContent value="reviews" className="px-4 space-y-6 mb-4">
          {reviews.map((review, index) => (
            <Card key={index}>
              <CardContent className="text-lg space-y-2">
                <div className="flex">
                  <div className="flex-3/5 font-bold">{review.reviewer}</div>
                  <div className=" flex flex-2/5">
                    <div className="flex ml-auto space-x-6">
                      <div className="text-gray-600 text-right">
                        {review.date}
                      </div>
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
        </TabsContent>
        <TabsContent value="menu" className="px-4">
          men
        </TabsContent>
        <TabsContent value="pictures" className="px-4">
          pic
        </TabsContent>
        <TabsContent value="map" className="px-4">
          map
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default RestaurantDetails;
