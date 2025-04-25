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
import { ChevronRight, Upload, Verified, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import RatingSelect from "@/components/ui/ratingSelect";
import { Textarea } from "@/components/ui/textarea";
import firebase from "firebase/compat/app";
import { useNavigate, useParams } from "react-router-dom";
import { getCustomerFromUID } from "./FirebaseAPI";
import { IExistingMenu, IExistingReview } from "@/Types/RestaurantTypes";
import {
  getBusinessById,
  getMenuByBusinessId,
  getReviewByBusinessId,
  postReview,
} from "@/API/RestaurantAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Timestamp } from "firebase/firestore";
import { ReviewCard } from "@/components/custom/reviewCard";

const reviews = [
  {
    reviewer: "Jeff Bezos",
    verified: false,
    date: "05/07/2024",
    rating: 5,
    review:
      "I had an amazing dinner at Savor & Sip last night! The ambiance was warm and inviting, and the staff were super friendly. I ordered the grilled salmon, and it was cooked to perfection—crispy on the outside and tender inside.",
  },
  {
    reviewer: "Jeff Bezos",
    verified: true,
    date: "05/07/2024",
    rating: 3,
    review:
      "I had an amazing dinner at Savor & Sip last night! The ambiance was warm and inviting, and the staff were super friendly. I ordered the grilled salmon, and it was cooked to perfection—crispy on the outside and tender inside.",
  },
  {
    reviewer: "Jeff Bezos",
    verified: true,
    date: "05/07/2024",
    rating: 2,
    review:
      "I had an amazing dinner at Savor & Sip last night! The ambiance was warm and inviting, and the staff were super friendly. I ordered the grilled salmon, and it was cooked to perfection—crispy on the outside and tender inside.",
  },
  {
    reviewer: "Jeff Bezos",
    verified: false,
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

const pics = [imgUrl, imgUrl, imgUrl, imgUrl, imgUrl, imgUrl, imgUrl, imgUrl];

type ReviewType = {
  rating: number;
  reviewText: string;
  pictures: File[];
  verified: boolean;
  anonymous: boolean;
};

function RestaurantDetails() {
  const businessId = useParams().id;

  const getBusinessQuery = useQuery({
    queryFn: () => getBusinessById(businessId!),
    queryKey: ["getBusinessById", businessId]
  })
  const getReviewsQuery = useQuery({
    queryFn: () => getReviewByBusinessId(businessId!),
    queryKey: ["getReviewByBusinessId", businessId],
  });

  const getMenuQuery = useQuery({
    queryFn: () => getMenuByBusinessId(businessId!),
    queryKey: ["getMenuByBusinessId", businessId],
  });
  
  // const pictures = business.businessPictures;
  const auth = firebase.auth();
  const navigate = useNavigate();

  return (
    <div className="mx-[20%] mt-[5%] space-y-6">
      <div className="flex">
        <div className="flex-3/4 text-left space-y-4 pr-[10%]">
          <h1 className="text-4xl font-bold">{getBusinessQuery.data?.businessName}</h1>
          <span className="text-lg">
            {getBusinessQuery.data?.businessDescription}  
          </span>
        </div>
        <div className="flex-1/4 m-auto">
          <img src={getBusinessQuery.data?.businessLogo} className="w-[60%] mx-auto" />
        </div>
      </div>
      <div className="w-min mx-auto">
        <ReviewDialog businessId={businessId!} />
      </div>
      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="pictures">Pictures</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
        </TabsList>
        <TabsContent value="reviews" className="px-4 mb-4">
          <ReviewsTabContent reviews={getReviewsQuery.data!} />
        </TabsContent>
        <TabsContent value="menu" className="px-4">
          <MenuTabContent menu={getMenuQuery.data!} />
        </TabsContent>
        <TabsContent value="pictures" className="px-4">
          <PicturesTabContent pics={getBusinessQuery.data?.businessPictures!}/>
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

const ReviewsTabContent = ({ reviews }: { reviews: IExistingReview[] }) => {
  return (
    <div className="mt-4 space-y-6">
      {reviews?.map((review, index) => {
        // console.log("[XX]Review: ", review);
        return (
          <ReviewCard key={index} review={review}/>
        );
      })}
    </div>
  );
};

const MenuTabContent = ({ menu }: { menu: IExistingMenu[] }) => {
  console.log(menu);
  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow className="text-lg">
          <TableHead className="text-center font-bold text-black">
            Picture
          </TableHead>
          <TableHead className="text-center font-bold text-black">
            Name
          </TableHead>
          <TableHead className="text-center font-bold text-black">
            Price
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {menu.map((item, index) => (
          <TableRow key={index}>
            <TableCell className="w-[7%] text-center">
              {item.itemImage.length > 0 && <img src={item.itemImage} />}
            </TableCell>
            <TableCell className="text-center">{item.itemName}</TableCell>
            <TableCell className="text-center">${item.itemPrice}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const PicturesTabContent = ({ pics }: { pics: string[] }) => (
  <div className="grid grid-cols-4 gap-8 mt-4">
    {pics?.map((url, index) => (
      <div
        key={index}
        className="rounded-lg bg-gray-100 overflow-hidden aspect-square w-full border flex items-center justify-center relative"
      >
        <img src={url} alt="" className="w-full h-auto object-contain" />
      </div>
    ))}
  </div>
);

const ReviewDialog = ({ businessId }: { businessId: string }) => {
  const auth = firebase.auth();
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [anonymous, setAnon] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [newReview, setReview] = useState<ReviewType>({
    rating: 0,
    reviewText: "",
    pictures: [],
    verified: false,
    anonymous: auth.currentUser ? false : true,
  });
  const queryClient = useQueryClient();
  const postReviewMutation = useMutation({
    mutationFn: postReview,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getReviewByBusinessId", businessId],
      });
      toast.success("Succesfuly posted a review");
      setReview({
        rating: 0,
        reviewText: "",
        pictures: [],
        verified: false,
        anonymous: auth.currentUser ? false : true,
      });
      setDialogOpen(false);
      setPage(1);
    },
    onError: (e) => {
      toast.error(`Error posting review: ${e}`);
    },
  });

  const imageInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const uid = auth.currentUser ? auth.currentUser.uid : undefined;
    const fetchName = async () => {
      if (!uid) return;
      const profile = await getCustomerFromUID(uid);
      setCustomerName(profile?.name ?? "Guest"); // fallback if undefined
    };

    fetchName();
  }, [auth.currentUser]);

  const handleSubmit = () => {
    console.log(newReview);
    console.log(auth.currentUser)
    if (newReview.rating === 0) {
      toast.error("Rating is required");
    } else if (newReview.reviewText.length === 0) {
      toast.error("Review text is required");
    } else {
      postReviewMutation.mutate({
        newReview: { ...newReview, dateTime: Timestamp.fromDate(new Date()) },
        businessID: businessId!,
        customerUid: auth.currentUser!.uid,
      });
    }
  };

  const FirstPage = () => {
    return (
      <>
        {auth.currentUser ? (
          <>
            <span>
              You are logged in as <b>[{customerName}]</b>
            </span>
            <span className="flex">
              Post anonymously?
              <Switch
                className="ml-2 my-auto"
                checked={anonymous}
                onCheckedChange={(checked) => {
                  setAnon(checked);
                  setReview({ ...newReview, anonymous: checked });
                }}
              />{" "}
            </span>
          </>
        ) : (
          <span>
            You are not logged in,{" "}
            <Button
              variant="ghost"
              className="w-min px-2.5"
              onClick={() => navigate("/login")}
            >
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
        {auth.currentUser && (
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

  const SecondPage = useMemo(() => {
    const handleAddPicture = (e: ChangeEvent<HTMLInputElement>) => {
      const MAX_IMAGE = 3;
      if (e.target.files) {
        const fileArray = Array.from(e.target.files);
        const remaining = MAX_IMAGE - newReview.pictures.length;
        if (fileArray.length > remaining) {
          toast.error("Max 3 images");
        }
        setReview({
          ...newReview,
          pictures: newReview.pictures.concat(
            fileArray.filter((_, index) => index < remaining)
          ),
        });
      }
    };

    const handleDeletePicture = (index: number) => {
      setReview({
        ...newReview,
        pictures: newReview.pictures.filter((_, i) => i != index),
      });
    };
    return (
      <>
        <span>Rate your experience</span>
        <div>
          <RatingSelect
            onChange={(rating) => {
              setReview({ ...newReview, rating });
            }}
            rating={newReview.rating}
          />
        </div>

        <span>What were the up's and down's?</span>
        <Textarea
          onChange={(e) =>
            setReview((prev) => ({ ...prev, reviewText: e.target.value }))
          }
          value={newReview.reviewText}
        />
        <span>Got any pictures? (optional)</span>
        <Input
          type="file"
          ref={imageInput}
          onChange={handleAddPicture}
          className="hidden"
          multiple
        />
        <Button
          variant="outline"
          className="w-min"
          onClick={() => imageInput.current!.click()}
        >
          <Upload />
        </Button>
        <div className="grid grid-cols-3 gap-2 place-items-center">
          {newReview.pictures.map((file, index) => {
            const url = URL.createObjectURL(file);
            return (
              <div
                key={url}
                className="rounded-lg bg-gray-100 overflow-hidden aspect-square w-full border flex items-center justify-center relative"
              >
                <img
                  src={url}
                  alt=""
                  className="w-full h-auto object-contain"
                />
                <button
                  onClick={() => handleDeletePicture(index)}
                  className="absolute top-1 right-1 bg-white text-red-600 rounded-full p-1 shadow hover:text-red-800"
                >
                  <X />
                </button>
              </div>
            );
          })}
        </div>

        <Button
          variant="outline"
          className="w-min ml-auto"
          onClick={() => handleSubmit()}
        >
          Post
        </Button>
      </>
    );
  }, [newReview]);

  return (
    <Dialog
      onOpenChange={(state) => {
        setDialogOpen(state);
        if (!state) setPage(1);
      }}
      open={dialogOpen}
    >
      <DialogTrigger asChild>
        <Button
          className="mx-auto rounded-full ml-auto text-lg p-6"
          onClick={() => setDialogOpen(true)}
        >
          Write a Review
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[40vw] max-h-[90vh] overflow-auto">
        <DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogTitle>
        {page === 1 && <FirstPage />}
        {page === 2 && SecondPage}
      </DialogContent>
    </Dialog>
  );
};

export default RestaurantDetails;

