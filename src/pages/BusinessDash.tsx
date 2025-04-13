import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Ratings from "@/components/ui/ratings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Business } from "@/pages/WrapperObjects";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import imgUrl from "../assets/logoIcon.png";
import { useCookies } from "react-cookie";
import firebase from "firebase/compat/app";
import model from "@/API/gemini";

import { useNavigate } from "react-router-dom";
import { Trash2, Verified } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMenuByBusinessId, getReviewByBusinessId } from "@/API/RestaurantAPI";
import { TMenu, TReview } from "@/Types/RestaurantTypes";
import { Button } from "@/components/ui/button";


type Review = {
  reviewer: string;
  verified: boolean;
  date: string;
  rating: number;
  review: string;
};

const dummyReviews: Review[] = [
  {
    reviewer: "Jeff Bezos",
    verified: true,
    date: "05/07/2024",
    rating: 4,
    review: "Amazing food and cozy vibes. The salmon was perfect!",
  },
  {
    reviewer: "Elon Musk",
    verified: false,
    date: "06/07/2024",
    rating: 5,
    review: "Delicious! The steak was out of this world.",
  },
  {
    reviewer: "Taylor Swift",
    verified: true,
    date: "07/07/2024",
    rating: 3,
    review: "Nice ambiance, but the dessert was a bit too sweet for me.",
  },
  {
    reviewer: "Oprah Winfrey",
    verified: true,
    date: "08/07/2024",
    rating: 5,
    review: "Absolutely loved it! The service was exceptional.",
  },
  {
    reviewer: "Barack Obama",
    verified: true,
    date: "09/07/2024",
    rating: 4,
    review: "A solid dining experience. Great for family dinners.",
  },
  // {
  //   reviewer: "Bill Gates",
  //   verified: false,
  //   date: "10/07/2024",
  //   rating: 1,
  //   review: "The food dog shit, will never come back.",
  // },
];

const dummyMenu = [
  { name: "Classic Cheeseburger", price: "12.99" },
  { name: "Spaghetti Carbonara", price: "15.50" },
  { name: "Grilled Chicken Salad", price: "13.00" },
  { name: "Margherita Pizza", price: "14.00" },
  { name: "Chocolate Lava Cake", price: "7.50" },
];

const dummyBusiness = new Business();
const dummyPictures = [imgUrl, imgUrl];

function BusinessDash() {
  const [currentPage, setCurrentPage] = useState("home");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [cookies, setCookie] = useCookies(["uid", "name"]); // Initialize react-cookie
  const auth = firebase.auth();
  const persistance = firebase.auth.Auth.Persistence.SESSION;
  const [menu, setMenu] = useState(dummyMenu);
  const [pictures, setPictures] = useState(dummyPictures);
  const [reviews] = useState(dummyReviews);

  const businessId = "odCe5cYwH8M3oHTcYmav"

  const getReviewsQuery = useQuery({
    queryFn: () => getReviewByBusinessId(businessId!),
    queryKey: ["getReviewByBusinessId", businessId]
  }) 

  const getMenuQuery = useQuery({
      queryFn: () => getMenuByBusinessId(businessId!),
      queryKey: ["getMenuByBusinessId", businessId]
    })

  const navigate = useNavigate();
  const handleUpload = async (file: File) => {
    alert(`Pretend uploading: ${file.name}`);
    const newUrl = URL.createObjectURL(file);
    setPictures((prev) => [...prev, newUrl]);
  };

  const handleAddMenu = (name: string, price: string) => {
    setMenu((prev) => [...prev, { name, price }]);
  };

  const handleDeleteMenu = (indexToDelete: number) => {
    setMenu((prev) => prev.filter((_, index) => index !== indexToDelete));
  };
  const handleUpdateRestaurant = (name: string, description: string) => {
    setRestaurantName(name);
    setRestaurantDesc(description);
    setIsEditing(false);
    alert(`Updated: ${name}, ${description}`);
  };
  const handleDeletePicture = (indexToDelete: number) => {
    setPictures((prev) => prev.filter((_, index) => index !== indexToDelete));
  };

  const [restaurantName, setRestaurantName] = useState("Restaurant 1");
  const [restaurantDesc, setRestaurantDesc] = useState(
    "Welcome to Savor & Sip, where comfort food meets cozy vibes."
  );
  const [isEditing, setIsEditing] = useState(false);

  const cancelEdit = () => {
    setIsEditing(false);
  };
  const [isEditingPictures, setIsEditingPictures] = useState(false);

  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const handleLogin = async () => {
    try {
      await auth.setPersistence(persistance);
      await auth.signInWithEmailAndPassword(email, password);
      console.log("User logged in successfully");
      if (auth.currentUser) {
        setCookie("uid", auth.currentUser.uid, { path: "/" }); // Set uid cookie
        console.log(auth.currentUser.uid);
      } else {
        console.log("No user is currently logged in");
      }
    } catch (error) {
      setError((error as any).message);
      console.error("Error logging in: ", error);
    }
  };

  const [summarizedReviews, setSummarizedReviews] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      let prompt = "Summarize the reviews of a restaurant. The reviews are: ";
      getReviewsQuery.data!.forEach((review) => {
        prompt += `${review.customerName} (${review.dateTime}): ${review.reviewText}. `;
      });
      prompt +=
        "Please provide a summary of the reviews, including the overall sentiment (positive, negative, neutral).";

      const response = await model.generateContent(prompt);
      const responsejson = JSON.parse(response.response.text());

      setSummarizedReviews(responsejson);
    } catch (error) {
      console.error("Error generating summary: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-black">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-900 p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
          Dashboard
        </h2>
        <ul className="space-y-4">
          {[
            "home",
            "reviews",
            "restaurant",
            "menu",
            "pictures",
            "settings",
            "logout",
          ].map((page) => (
            <li key={page}>
              <button
                className="font-normal cursor-pointer hover:text-[#FF6F00] transition-colors"
                onClick={() => setCurrentPage(page)}
              >
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-10 overflow-y-auto">
        {currentPage === "home" && (
          <div className="mx-[20%] mt-[5%] space-y-6">
            <div className="flex">
              <div className="flex-3/4 text-left space-y-4 pr-[10%]">
                <h1 className="text-4xl font-bold">Restaurant 1</h1>
                <span className="text-lg">
                  Welcome to Savor & Sip, where comfort food meets cozy vibes.
                </span>
              </div>
              <div className="flex-1/4 m-auto">
                <img src={imgUrl} className="w-[60%] mx-auto" />
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="bg-[#FF6F00] text-white px-4 py-2 rounded"
            >
              Summarize Reviews
            </button>
            <Tabs defaultValue="reviews" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="menu">Menu</TabsTrigger>
                <TabsTrigger value="pictures">Pictures</TabsTrigger>
              </TabsList>
              <TabsContent value="reviews">
                {isLoading && (
                  <Card className="mb-4">
                    <CardContent className="p-4">
                      <strong>Loading...</strong>
                    </CardContent>
                  </Card>
                )}
                {summarizedReviews && (
                  <Card className="mb-4">
                    <CardContent className="p-4">
                      <strong>AI Summary:</strong> {summarizedReviews.summary}
                      <br />
                      <strong>Overall Sentiment:</strong>{" "}
                      {summarizedReviews.overallSentiment}
                    </CardContent>
                  </Card>
                )}
                {/* <Card className="mb-4">
                  <CardContent className="p-4">
                    <strong>AI Summary:</strong> Great ambiance, loved dishes.
                    Overall sentiment: Positive.
                  </CardContent>
                </Card> */}
                <ReviewsTabContent reviews={getReviewsQuery.data!} />
              </TabsContent>
              <TabsContent value="menu">
                <MenuTabContent menu={getMenuQuery.data!} />
              </TabsContent>
              <TabsContent value="pictures">
                <PicturesTabContent pictures={pictures} />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {currentPage === "reviews" && (
          <div className="mt-10">
            <h1 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
              Reviews
            </h1>
            <ReviewsTabContent reviews={getReviewsQuery.data!} />
          </div>
        )}

        {currentPage === "restaurant" && (
          <div className="mt-10 max-w-2xl space-y-4">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
              Update Restaurant Info
            </h1>

            {!isEditing ? (
              <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-2">
                <h2 className="text-xl font-bold">{restaurantName}</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {restaurantDesc}
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-2 px-4 py-2 bg-[#FF6F00] text-white rounded"
                >
                  + Edit
                </button>
              </div>
            ) : (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const name = (
                    form.elements.namedItem("name") as HTMLInputElement
                  ).value;
                  const desc = (
                    form.elements.namedItem(
                      "description"
                    ) as HTMLTextAreaElement
                  ).value;
                  handleUpdateRestaurant(name, desc);
                }}
              >
                <input
                  name="name"
                  defaultValue={restaurantName}
                  placeholder="Restaurant Name"
                  className="w-full p-2 border rounded"
                />
                <textarea
                  name="description"
                  defaultValue={restaurantDesc}
                  placeholder="Description"
                  className="w-full p-2 border rounded"
                />
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    ✔ Save
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {currentPage === "menu" && (
          <div className="mt-10 max-w-3xl space-y-6">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
              Menu
            </h1>

            <MenuTabContent menu={getMenuQuery.data!} onDelete={handleDeleteMenu} />

            {!isEditingMenu ? (
              <button
                onClick={() => setIsEditingMenu(true)}
                className="bg-[#FF6F00] text-white px-4 py-2 rounded"
              >
                + Add New Item
              </button>
            ) : (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const name = (
                    form.elements.namedItem("itemname") as HTMLInputElement
                  ).value;
                  const price = (
                    form.elements.namedItem("price") as HTMLInputElement
                  ).value;
                  handleAddMenu(name, price);
                  setIsEditingMenu(false);
                }}
              >
                <input
                  name="itemname"
                  placeholder="Item Name"
                  className="w-full p-2 border rounded"
                />
                <input
                  name="price"
                  placeholder="Price"
                  className="w-full p-2 border rounded"
                />
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    ✔ Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingMenu(false)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {currentPage === "pictures" && (
          <div className="mt-10 max-w-xl space-y-4">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
              Update Pictures
            </h1>

            <PicturesTabContent
              pictures={pictures}
              onDelete={handleDeletePicture}
            />

            {!isEditingPictures ? (
              <button
                onClick={() => setIsEditingPictures(true)}
                className="bg-[#FF6F00] text-white px-4 py-2 rounded"
              >
                + Add Picture
              </button>
            ) : (
              <div className="space-y-4">
                <div className="space-y-4">
                  <label className="inline-block px-4 py-2 bg-[#FF6F00] text-white rounded cursor-pointer">
                    📷 Upload Picture
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleUpload(file);
                          setIsEditingPictures(false);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsEditingPictures(false)}
                    className="bg-[#FF6F00] text-white px-4 py-2 rounded"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {currentPage === "settings" && (
          <div className="mt-10 max-w-xl space-y-6">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
              Settings
            </h1>
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-4">
              <div className="flex justify-between">
                <span>Dark Mode</span>
                <input type="checkbox" className="toggle toggle-sm" />
              </div>
              <div className="flex justify-between">
                <span>Email Notifications</span>
                <input type="checkbox" className="toggle toggle-sm" />
              </div>
              <button className="mt-4 px-4 py-2 bg-[#FF6F00] text-white rounded">
                Change Password
              </button>
            </div>
          </div>
        )}

        {currentPage === "logout" && (
          <div className="mt-10 max-w-md mx-auto text-center space-y-6">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
              Logout
            </h1>
            <p className="text-gray-700 dark:text-gray-300">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  // alert("Logged out!");
                  firebase.auth().signOut();
                  toast.success("Logged out successfully");
                  navigate("/");
                }}
              >
                ✔ Confirm
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setCurrentPage("home")}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        )}
        {currentPage === "login" && (
          <>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mt-10">
              Login
            </h1>
            <div className="bg-white dark:bg-black flex flex-col items-center justify-center mt-20">
              <h2>{isLogin ? "Login" : "Sign Up"}</h2>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                onClick={
                  isLogin
                    ? handleLogin
                    : () =>
                        console.log("Sign Up functionality not implemented yet")
                }
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
              {error && <p>{error}</p>}
              <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Switch to Sign Up" : "Switch to Login"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const ReviewsTabContent = ({ reviews }: { reviews: TReview[] }) => (
  <div className="mt-4 space-y-6">
    {/* <Card>
      <CardContent className="p-4 text-gray-800 dark:text-gray-200">
        <strong>🧠 AI Summary:</strong>
        <br />
        Customers generally praise the warm ambiance and attentive staff. The
        grilled salmon is a standout favorite. However, some mention
        inconsistent wait times. Overall sentiment is{" "}
        <span className="text-green-600 font-bold">positive</span>.
      </CardContent>
    </Card> */}

    {reviews?.map((review, index) => {
        return (
          <Card key={index}>
            <CardContent className="text-lg space-y-2">
              <div className="flex">
                <div className="flex-3/5 font-bold flex">
                  {review.customerName}
                  {review.verified && (
                    <Verified color="#4ECB71" className="ml-2" />
                  )}
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
            </CardContent>
          </Card>
        );
      })}
  </div>
);

const MenuTabContent = ({
  menu,
  onDelete,
}: {
  menu: TMenu[];
  onDelete?: (index: number) => void;
}) => (
  <Table className="mt-4">
    <TableHeader>
      <TableRow className="text-lg">
        <TableHead className="text-center font-bold text-black">Name</TableHead>
        <TableHead className="text-center font-bold text-black">
          Price
        </TableHead>
        {onDelete && (
          <TableHead className="text-center font-bold text-black">
            Actions
          </TableHead>
        )}
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
          {onDelete && (
            <TableCell className="text-center">
              <Button variant="ghost"><Trash2 color="red"/></Button>
            </TableCell>
          )}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const PicturesTabContent = ({
  pictures,
  onDelete,
}: {
  pictures: string[];
  onDelete?: (index: number) => void;
}) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
    {pictures.map((picture, index) => (
      <div key={index} className="relative group">
        <img src={picture} className="aspect-square w-full rounded shadow" />
        {onDelete && (
          <button
            onClick={() => onDelete(index)}
            className="absolute top-1 right-1 bg-white text-red-600 rounded-full p-1 shadow hover:text-red-800"
          >
            🗑️
          </button>
        )}
      </div>
    ))}
  </div>
);

export default BusinessDash;
