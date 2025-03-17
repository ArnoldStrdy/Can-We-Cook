import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Ratings from "@/components/ui/ratings";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import imgUrl from "../assets/logoIcon.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronRight, Upload, Verified } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import RatingSelect from "@/components/ui/ratingSelect";
import { Textarea } from "@/components/ui/textarea";

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
    rating: 3,
    review:
      "I had an amazing dinner at Savor & Sip last night! The ambiance was warm and inviting, and the staff were super friendly. I ordered the grilled salmon, and it was cooked to perfection—crispy on the outside and tender inside.",
  },
  {
    reviewer: "Jeff Bezos",
    date: "05/07/2024",
    rating: 2,
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

const menu = [
  {
    picture: imgUrl,
    name: "Item 1",
    price: "5",
  },
  {
    picture: imgUrl,
    name: "Item 1",
    price: "5",
  },
  {
    picture: imgUrl,
    name: "Item 1",
    price: "5",
  },
  {
    picture: imgUrl,
    name: "Item 1",
    price: "5",
  },
  {
    picture: imgUrl,
    name: "Item 1",
    price: "5",
  },
];

const pictures = [
  imgUrl,
  imgUrl,
  imgUrl,
  imgUrl,
  imgUrl,
  imgUrl,
  imgUrl,
  imgUrl,
];

function RestaurantDetails() {
  const [loggedIn, setLoggedIn] = useState(true);

  const ReviewDialog = () => {
    const [page, setPage] = useState(1);

    const FirstPage = () => {
      return (
        <>
          {loggedIn ? (
            <>
              <span>
                You are logged in as <b>[Username]</b>
              </span>
              <span className="flex">
                Post anonymously? <Switch className="ml-2 my-auto" />{" "}
              </span>
            </>
          ) : (
            <span>
              You are not logged in,{" "}
              <Button variant="ghost" className="w-min px-2.5">
                Login?
              </Button>
            </span>
          )}

          <span className="text-center mx-[20%]">
            Upload a picture of your receipt to show a{" "}
            <Verified className="inline" color="#4ECB71" /> beside your name
          </span>
          <Button className="mx-auto w-min">
            <Upload />
          </Button>
          {loggedIn && (
            <Button
              className="mx-auto"
              variant="ghost"
              onClick={() => setPage(2)}
            >
              Skip <ChevronRight className="inline" />
            </Button>
          )}
        </>
      );
    };

    const SecondPage = () => {
      const [star, setStars] = useState(0);
      console.log(star);
      return (
        <>
          <span>Rate your experience</span>
          <div>
            <RatingSelect onChange={setStars} />
          </div>

          <span>What were the up's and down's?</span>
          <Textarea />
          <span>Got any pictures? (optional)</span>
          <Button variant="outline" className="w-min">
            <Upload />
          </Button>
          <Button variant="outline" className="w-min ml-auto">
            Post
          </Button>
        </>
      );
    };

    return (
      <Dialog onOpenChange={() => setPage(1)}>
        <DialogTrigger asChild>
          <Button className="rounded-full ml-auto text-lg p-6">
            Write a Review
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogTitle>
          {page === 1 && <FirstPage />}
          {page === 2 && <SecondPage />}
        </DialogContent>
      </Dialog>
    );
  };

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
          <img src="/src\assets\logoIcon.png" className="w-[60%] mx-auto" />
        </div>
      </div>
      <div className="w-min mx-auto">
        <ReviewDialog />
      </div>
      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="pictures">Pictures</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
        </TabsList>
        <TabsContent value="reviews" className="px-4 mb-4">
          <ReviewsTabContent />
        </TabsContent>
        <TabsContent value="menu" className="px-4">
          <MenuTabContent />
        </TabsContent>
        <TabsContent value="pictures" className="px-4">
          <PicturesTabContent />
        </TabsContent>
        <TabsContent value="map" className="px-4">
          <div className="aspect-2/1 w-full">
            <iframe
              className="size-full"
              src="https://use.mazemap.com/embed.html#v=1&zlevel=1&center=145.132766,-37.914154&zoom=18&campusid=159&sharepoitype=poi&sharepoi=1034799&utm_medium=iframe"
              style={{ border: "1px solid grey" }}
              allow="geolocation"
            ></iframe>
            <br />
            <small>
              <a href="https://www.mazemap.com/">Map by MazeMap</a>
            </small>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const ReviewsTabContent = () => (
  <div className="mt-4 space-y-6 ">
    {reviews.map((review, index) => (
      <Card key={index}>
        <CardContent className="text-lg space-y-2">
          <div className="flex">
            <div className="flex-3/5 font-bold">{review.reviewer}</div>
            <div className=" flex flex-2/5">
              <div className="flex ml-auto space-x-6">
                <div className="text-gray-600 text-right">{review.date}</div>
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
  </div>
);

const MenuTabContent = () => (
  <Table className="mt-4">
    <TableHeader>
      <TableRow className="text-lg">
        <TableHead className="text-center font-bold text-black">
          Picture
        </TableHead>
        <TableHead className="text-center font-bold text-black">Name</TableHead>
        <TableHead className="text-center font-bold text-black">
          Price
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {menu.map((item, index) => (
        <TableRow key={index}>
          <TableCell className="w-[7%] text-center">
            <img src={item.picture} />
          </TableCell>
          <TableCell className="text-center">{item.name}</TableCell>
          <TableCell className="text-center">${item.price}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const PicturesTabContent = () => (
  <div className="grid grid-cols-4 gap-8 mt-4">
    {pictures.map((picture, index) => (
      <img src={picture} className="aspect-square w-[60%] m-auto" key={index} />
    ))}
  </div>
);

export default RestaurantDetails;
