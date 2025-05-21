import { Button } from "@/components/ui/button";
import BGLogo from "../assets/logoIconFork.png";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  getCertficationByBusinessId,
} from "@/API/RestaurantAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Timestamp } from "firebase/firestore";
import { ReviewCard } from "@/components/custom/reviewCard";
import { receiptModel } from "@/API/gemini";
import { Quantum } from "ldrs/react";
import "ldrs/react/Quantum.css";
import { PicturesTabContent } from "@/components/custom/PicturesTabContent";
import Footer from "@/components/Footer";

import Gluten from "@/assets/gluten.png";
import Halal from "@/assets/halal.png";
import Kosher from "@/assets/kosher.png";
import NonGMO from "@/assets/nongmo.png";
import Organic from "@/assets/organic.png";
import Vegan from "@/assets/vegan.png";
import Vegetarian from "@/assets/vegetarian.png";

const mapCertToImg: { [key: string]: string } = {
  "Halal": Halal,
  "Kosher": Kosher,
  "Vegan": Vegan,
  "Vegetarian": Vegetarian,
  "Gluten Free": Gluten,
  "Organic": Organic,
  "Non-GMO": NonGMO,
};

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
    queryKey: ["getBusinessById", businessId],
  });
  const getReviewsQuery = useQuery({
    queryFn: () => getReviewByBusinessId(businessId!),
    queryKey: ["getReviewByBusinessId", businessId],
  });

  const getMenuQuery = useQuery({
    queryFn: () => getMenuByBusinessId(businessId!),
    queryKey: ["getMenuByBusinessId", businessId],
  });

  const getCertificatesQuery = useQuery({
    queryFn: () => getCertficationByBusinessId(businessId!),
    queryKey: ["getCertficationByBusinessId", businessId],
  });

  return (
    <>
      <div className="px-4 sm:px-[20%] pt-20 sm:pt-[5%] min-h-screen space-y-6 bg-[#A7ACD9]/20">
        <img
          src={BGLogo}
          className="w-[50%] blur-3xl opacity-30 object-contain fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none -z-50"
        />
        <div className="flex flex-col sm:flex-row">
          <div className="flex-3/4 space-y-4 sm:pr-[10%] text-center sm:text-left">
            <h1 className="text-5xl font-extrabold">
              {getBusinessQuery.data?.businessName}
            </h1>
            <span className="text-lg font-semibold text-gray-700">
              {getBusinessQuery.data?.businessDescription}
            </span>
          </div>
          <div className="flex-1/4 flex-col justify-end flex pb-10 sm:pb-0">
            {getBusinessQuery.data?.businessLogo.length! > 0 && (
              <img
                src={getBusinessQuery.data?.businessLogo}
                className="h-50 object-contain"
              />
            )}
            <div className="flex flex-wrap gap-2 pt-4 align-middle justify-center">
              {getCertificatesQuery.data?.length! > 0 && (
                <div className="flex items-center text-sm font-semibold text-gray-700">
                  {getCertificatesQuery.data?.map((cert) => {
                    const imgSrc = mapCertToImg[cert];
                    return (
                      <img
                        key={cert}
                        src={imgSrc}
                        alt={cert}
                        title={cert}
                        className="w-12 h-12 mr-1"
                      />
                    );
                  })}
                </div>
              )}
            </div>
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
          <TabsContent value="reviews" className="mb-4">
            <ReviewsTabContent reviews={getReviewsQuery.data!} />
          </TabsContent>
          <TabsContent value="menu">
            <MenuTabContent menu={getMenuQuery.data!} />
          </TabsContent>
          <TabsContent value="pictures">
            <PicturesTabContent
              pictures={getBusinessQuery.data?.businessPictures!}
            />
          </TabsContent>
          <TabsContent value="map">
            <div className="aspect-2/1 w-full">
              <iframe
                className="size-full"
                src={`https://use.mazemap.com/embed.html#v=1&zlevel=1&center=${getBusinessQuery
                  .data?.businessLocation[1]!},${getBusinessQuery.data
                  ?.businessLocation[0]!}&zoom=18.5&campusid=159${
                  getBusinessQuery.data?.businessLocation[2] &&
                  "&sharepoitype=poi&sharepoi=" +
                    getBusinessQuery.data?.businessLocation[2]! +
                    "&utm_medium=iframe"
                }`}
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
      <div className="flex w-full justify-center items-center">
        <Footer />
      </div>
    </>
  );
}

const ReviewsTabContent = ({ reviews }: { reviews: IExistingReview[] }) => {
  return (
    <div className="mt-4 space-y-6">
      {reviews?.map((review, index) => {
        // console.log("[XX]Review: ", review);
        return <ReviewCard key={index} review={review} />;
      })}
    </div>
  );
};

const MenuTabContent = ({ menu }: { menu: IExistingMenu[] }) => {
  // console.log(menu);
  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow className="text-lg">
          <TableHead className="text-center font-bold text-black w-1/3">
            Picture
          </TableHead>
          <TableHead className="text-center font-bold text-black w-1/3">
            Name
          </TableHead>
          <TableHead className="text-center font-bold text-black w-1/3">
            Price
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {menu.map((item, index) => (
          <TableRow key={index}>
            <TableCell className="w-[7%] p-0 text-center">
              <div className="flex justify-center items-center w-full h-full">
                {item.itemImage.length > 0 && (
                  <img
                    src={item.itemImage}
                    className="w-12 h-12 object-contain"
                  />
                )}
              </div>
            </TableCell>
            <TableCell className="text-center">
              <p className="text-base font-semibold">{item.itemName}</p>
            </TableCell>
            <TableCell className="text-center">
              <p className="text-base font-semibold">${item.itemPrice}</p>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

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
      setAnon(false);
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
    if (newReview.rating === 0) {
      toast.error("Rating is required");
    } else if (newReview.reviewText.length === 0) {
      toast.error("Review text is required");
    } else {
      postReviewMutation.mutate({
        newReview: { ...newReview, dateTime: Timestamp.fromDate(new Date()) },
        businessID: businessId!,
        customerUid: newReview.anonymous ? undefined : auth.currentUser?.uid!,
      });
    }
  };

  const [receiptVerified, setReceiptVerified] = useState(false);

  const FirstPage = () => {
    const [uploadingReceipt, setUploadingReceipt] = useState(false);

    const handleUploadReceipt = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploadingReceipt(true);

      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64String = reader.result as string;
          const prompt = "Is this a receipt?";

          const response = await receiptModel.generateContent({
            contents: [
              {
                role: "user",
                parts: [
                  { text: prompt },
                  {
                    inlineData: {
                      mimeType: "image/jpeg",
                      data: base64String.split(",")[1],
                    },
                  },
                ],
              },
            ],
          });

          const resultJson = JSON.parse(response.response.text());

          if (resultJson.isReceipt) {
            toast.success("Receipt verified successfully!");
            setReceiptVerified(true);
            setPage(2);
            setReview((prev) => ({ ...prev, verified: true }));
          } else {
            toast.error("This doesn't look like a valid receipt. Try again.");
          }
        } catch (error) {
          console.error("Error verifying receipt:", error);
          toast.error("Failed to verify receipt. Try again later.");
        } finally {
          setUploadingReceipt(false); // ✅ move this here INSIDE onloadend
        }
      };

      reader.readAsDataURL(file);
    };

    return (
      <>
        {auth.currentUser ? (
          <div className="flex flex-col justify-center items-center">
            <span>
              You are logged in as <b>{customerName}</b>
            </span>
            <span className="flex mb-6">
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
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center">
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
          </div>
        )}

        <span className="text-center mx-[20%]">
          Upload a picture of your receipt to show a{" "}
          <Verified className="inline" color="#4ECB71" /> beside your name
        </span>
        <Input
          type="file"
          accept="image/*"
          onChange={handleUploadReceipt}
          className="hidden"
          ref={imageInput}
        />
        {uploadingReceipt ? (
          <div className="flex justify-center">
            <Quantum size="45" speed="1.75" color="black" />
          </div>
        ) : (
          <Button
            className="mx-auto w-min"
            onClick={() => imageInput.current?.click()}
            disabled={uploadingReceipt}
          >
            <Upload />
          </Button>
        )}

        {auth.currentUser && (
          <Button
            className="mx-auto"
            variant="ghost"
            onClick={() => setPage(2)}
          >
            {receiptVerified ? "Next" : "Skip"}{" "}
            <ChevronRight className="inline" />
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
          className="bg-[#554971] text-white px-4 py-2 rounded text-base font-semibold hover:bg-[#FF6F00] hover:text-black transition-colors hover:cursor-pointer"
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
