import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Ratings from "@/components/ui/ratings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Business, uploadImage } from "@/pages/WrapperObjects";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FiBarChart,
  FiChevronDown,
  FiChevronsRight,
  FiDollarSign,
  FiHome,
  FiMonitor,
  FiShoppingCart,
  FiTag,
  FiUsers,
} from "react-icons/fi";
import { MdOutlineReviews } from "react-icons/md";
import { IoRestaurantOutline } from "react-icons/io5";
import { BiFoodMenu } from "react-icons/bi";
import { AiOutlinePicture } from "react-icons/ai";
import { PiCertificate } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";
import { motion } from "framer-motion";

import imgUrl from "../assets/logoIcon.png";
import { useCookies } from "react-cookie";
import firebase from "firebase/compat/app";
import model from "@/API/gemini";

import { useNavigate } from "react-router-dom";
import { Check, Trash2, Upload, Verified, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteMenuItem,
  getMenuByBusinessId,
  getReviewByBusinessId,
  postNewMenuItem,
} from "@/API/RestaurantAPI";
import {
  IExistingMenu,
  IExistingReview,
  INewMenu,
} from "@/Types/RestaurantTypes";
import { Button } from "@/components/ui/button";
import {
  getOwnerFromUID,
  getRestuarantfromOwnerID,
  getOwnerNameFromUID,
} from "./FirebaseAPI";
import { Sidebar } from "./ReactSidebar";
import { Input } from "@/components/ui/input";

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
  {
    reviewer: "Bill Gates",
    verified: false,
    date: "10/07/2024",
    rating: 2,
    review: "The food was average, and the service was slow.",
  },
  {
    reviewer: "Emma Watson",
    verified: true,
    date: "11/07/2024",
    rating: 4,
    review: "Lovely place! The pasta was delicious.",
  },
  {
    reviewer: "Leonardo DiCaprio",
    verified: true,
    date: "12/07/2024",
    rating: 5,
    review: "Best restaurant in town! Highly recommend the seafood.",
  },
  {
    reviewer: "Scarlett Johansson",
    verified: false,
    date: "13/07/2024",
    rating: 3,
    review: "Good food, but the wait time was too long.",
  },
  {
    reviewer: "Dwayne Johnson",
    verified: true,
    date: "14/07/2024",
    rating: 4,
    review: "Great atmosphere! Perfect for a night out.",
  },
  {
    reviewer: "Natalie Portman",
    verified: true,
    date: "15/07/2024",
    rating: 5,
    review: "Incredible experience! The wine selection is top-notch.",
  },
];

const dummyMenu = [
  { name: "Classic Cheeseburger", price: "12.99" },
  { name: "Spaghetti Carbonara", price: "15.50" },
  { name: "Grilled Chicken Salad", price: "13.00" },
  { name: "Margherita Pizza", price: "14.00" },
  { name: "Chocolate Lava Cake", price: "7.50" },
];

type SummarizedReviews = {
  summary: string;
  overallSentiment: "positive" | "negative" | "neutral";
};

const dummyBusiness = new Business();
const dummyPictures = [imgUrl, imgUrl];

interface OptionProps {
  Icon: React.ComponentType;
  title: string;
  selected: string;
  setSelected: (value: string) => void;
  open: boolean;
  notifs?: number;
}

const Option: React.FC<OptionProps> = ({
  Icon,
  title,
  selected,
  setSelected,
  open,
  notifs,
}) => {
  return (
    <motion.button
      layout
      onClick={() => setSelected(title)}
      className={`relative flex h-10 w-full items-center rounded-md transition-colors ${
        selected === title
          ? "bg-indigo-100 text-indigo-800"
          : "text-slate-500 hover:bg-slate-100"
      }`}
    >
      <motion.div
        layout
        className="grid h-full w-10 place-content-center text-lg"
      >
        <Icon />
      </motion.div>
      {open && (
        <motion.span
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.125 }}
          className="text-xs font-medium"
        >
          {title}
        </motion.span>
      )}
      {notifs && open && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ y: "-50%" }}
          transition={{ delay: 0.5 }}
          className="absolute right-2 top-1/2 size-4 rounded bg-indigo-500 text-xs text-white"
        >
          {notifs}
        </motion.span>
      )}
    </motion.button>
  );
};

interface TitleSectionProps {
  open: boolean;
}

interface ToggleCloseProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToggleClose: React.FC<ToggleCloseProps> = ({ open, setOpen }) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((prev) => !prev)}
      className="absolute bottom-0 left-0 right-0 border-t border-slate-300 transition-colors hover:bg-slate-100"
    >
      <div className="flex items-center p-2">
        <motion.div
          layout
          className="grid size-10 place-content-center text-lg"
        >
          <FiChevronsRight
            className={`transition-transform ${open && "rotate-180"}`}
          />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-xs font-medium"
          >
            Hide
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};

interface CustomerNavbarProps {
  uid: string | null;
  setUID: React.Dispatch<React.SetStateAction<string | null>>;
}

const BusinessDash: React.FC<CustomerNavbarProps> = ({ uid, setUID }) => {
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [cookies, setCookie] = useCookies(["uid", "name"]);
  const auth = firebase.auth();
  const [menu, setMenu] = useState(dummyMenu);
  const [pictures, setPictures] = useState(dummyPictures);
  const [ownerName, setOwnerName] = useState("Owner Name");
  const [reviews] = useState(dummyReviews);
  const [newPassword, setNewPassword] = useState("");
  const [changePasswordError, setChangePasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePasswordSuccess, setChangePasswordSuccess] = useState("");
  const [restaurantName, setRestaurantName] = useState("Restaurant Name");
  const [restaurantDesc, setRestaurantDesc] = useState("Description");
  useEffect(() => {
    setUID(uid);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUID(user.uid);
      }
    });
  }, []);

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!uid) return;
      const owner = await getOwnerFromUID(uid);
      setOwnerID(owner!);
      const ownerName = await getOwnerNameFromUID(uid);
      setOwnerName(ownerName!);
      console.log("Owner Name:", ownerName);

      console.log("Owner ID:", owner);
    };

    fetchCustomerData();
  }, [uid]);

  const [ownerID, setOwnerID] = useState<string | null>(null);

  const [businessId, setbusinesID] = useState<string>();

  useEffect(() => {
    const fetchBusinessID = async () => {
      if (ownerID) {
        const business = await getRestuarantfromOwnerID(ownerID);
        setbusinesID(business!);
        console.log("Business ID:", business);
      }
    };
    fetchBusinessID();
  }, [ownerID]);

  // // get owner name from firebase
  // useEffect(() => {
  //   const fetchOwnerName = async () => {
  //     if (ownerID) {
  //       const owner = await getOwnerNameFromUID(ownerID);
  //       setOwnerName(owner!);
  //       console.log("Owner Name:", owner);
  //     }
  //   };
  //   fetchOwnerName();
  // }, [ownerID]);

  // const businessId = getRestuarantfromOwnerID(id!);
  // const businessId = "odCe5cYwH8M3oHTcYmav";

  const Buisness = useQuery({
    queryFn: () => {
      const business = new Business();
      business.initBusiness(businessId!).then(() => {
        setPictures(
          business.businessPictures.length > 0 ? business.businessPictures : []
        );
        setRestaurantName(business.businessName);
        setRestaurantDesc(business.businessDescription);
        console.log("Business ID:", businessId, business.businessID);
        console.log("Business Pictures:", pictures, business.businessPictures);
        console.log("Business:", restaurantName, business.businessName);
        console.log(
          "Business Desc:",
          restaurantDesc,
          business.businessDescription
        );
      });
      return business;
    },
    queryKey: ["getBusinessById", businessId],
  });
  console.log("Business ID:", businessId, Buisness.data?.businessID);
  console.log("Business Pictures:", pictures, Buisness.data?.businessPictures);
  console.log("Business:", restaurantName, Buisness.data?.businessName);
  console.log(
    "Business Desc:",
    restaurantDesc,
    Buisness.data?.businessDescription
  );
  const queryClient = useQueryClient();
  const getReviewsQuery = useQuery({
    queryFn: () => getReviewByBusinessId(businessId!),
    queryKey: ["getReviewByBusinessId", businessId],
  });

  const getMenuQuery = useQuery({
    queryFn: () => getMenuByBusinessId(businessId!),
    queryKey: ["getMenuByBusinessId", businessId],
  });

  const navigate = useNavigate();

  const postMenuItemMutation = useMutation({
    mutationFn: postNewMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getMenuByBusinessId", businessId],
      });
      toast.success("Succesfuly added a menu item");
      setMenuImage(undefined);
    },
    onError: (e) => {
      toast.error(`Error adding menu item: ${e}`);
    },
  });

  const deleteMenuItemMutation = useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getMenuByBusinessId", businessId],
      });
      toast.success("Succesfuly deleted a menu item");
    },
    onError: (e) => {
      toast.error(`Error deleting menu item: ${e}`);
    },
  });

  const handleAddMenu = (name: string, price: string, image: File) => {
    const menuItem: INewMenu = {
      itemName: name,
      itemPrice: +price,
      itemImage: image,
    };
    if (businessId) {
      postMenuItemMutation.mutate({ menuItem, businessId });
    }

    setMenu((prev) => [...prev, { name, price }]);
  };
  const handlePictureLoad = (business: Business) => {
    setPictures(business.businessPictures);
  };
  const handleDeleteMenu = (itemID: string) => {
    if (businessId) {
      deleteMenuItemMutation.mutate({ itemID, businessId });
    }
    // setMenu((prev) => prev.filter((_, index) => index !== indexToDelete));
  };
  const handleUpdateRestaurant = (name: string, description: string) => {
    setRestaurantName(name);
    setRestaurantDesc(description);
    Buisness.data?.setBusinessName(name);
    Buisness.data?.setBusinessDescription(description);
    setIsEditing(false);
    alert(`Updated: ${name}, ${description}`);
  };
  const handleDeletePicture = (indexToDelete: number) => {
    const updatedPictures = pictures.filter(
      (_, index) => index !== indexToDelete
    );
    setPictures(updatedPictures);
    Buisness.data!.setBusinessPictures(updatedPictures);
    console.log("Updated Pictures:", updatedPictures);
    console.log("Business Pictures:", Buisness.data!.businessPictures);
  };

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
  const handleChangePassword = async () => {
    const user = firebase.auth().currentUser;

    if (user && newPassword.length >= 6 && newPassword === confirmPassword) {
      try {
        await user.updatePassword(newPassword);
        setChangePasswordSuccess("Password updated successfully!");
        setChangePasswordError("");
        setNewPassword("");
      } catch (error) {
        setChangePasswordError((error as any).message);
        setChangePasswordSuccess("");
      }
    } else if (newPassword !== confirmPassword) {
      setChangePasswordError("Passwords do not match.");
      setChangePasswordSuccess("");
    } else if (newPassword.length < 6) {
      setChangePasswordError("Password must be at least 6 characters long.");
      setChangePasswordSuccess("");
    } else {
      setChangePasswordError("No user is currently signed in.");
      setChangePasswordSuccess("");
    }
  };
  //console.log("[XX]", Buisness.data!.businessPictures)
  const [summarizedReviews, setSummarizedReviews] =
    useState<SummarizedReviews | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      let prompt =
        "Summarize the reviews of a restaurant. Use only information provided in prompt. Suggest specific improvements as to owner if overall sentiment is negative, mixed or neutral from reviews provided if possible. The reviews are: ";
      getReviewsQuery.data!.forEach((review) => {
        prompt += `${review.customerName} (${review.dateTime}) [Rating: ${review.rating}]: ${review.reviewText}.\n`;
      });
      //prompt +=
      //"Please provide a summary of the reviews, including the overall sentiment (positive, negative, neutral). Make sure to use the information provided in the reviews only. Only add posible suggestions for improvement if the overall sentiment is negative or mixed. Do not add any other information.";

      const response = await model.generateContent(prompt);
      const responsejson = JSON.parse(response.response.text());

      setSummarizedReviews(responsejson);
    } catch (error) {
      console.error("Error generating summary: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [open, setOpen] = useState<boolean>(true);
  const [selected, setSelected] = useState<string>("Dashboard");

  const TitleSection: React.FC<TitleSectionProps> = ({ open }) => {
    return (
      <div className="mb-3 border-b border-slate-300 pb-3">
        <div className="flex items-center justify-between rounded-md transition-colors">
          <div className="flex items-center gap-2">
            {/* <Logo /> */}
            <img src={imgUrl} className="h-8 w-8" alt="Logo" />
            {open && (
              <div>
                <span className="block text-xs font-semibold">{ownerName}</span>
                <span className="block text-xs text-slate-500">
                  {restaurantName}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  const imageInput = useRef<HTMLInputElement | null>(null);
  const [menuImage, setMenuImage] = useState<File>();
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-black">
      <motion.nav
        layout
        className="sticky top-0 h-screen shrink-0 border-r border-slate-300 bg-white p-2"
        style={{
          width: open ? "225px" : "fit-content",
        }}
      >
        <TitleSection open={open} />

        <div className="space-y-1">
          <Option
            Icon={FiHome}
            title="Dashboard"
            selected={currentPage}
            setSelected={setCurrentPage}
            open={open}
          />
          <Option
            Icon={MdOutlineReviews}
            title="Reviews"
            selected={currentPage}
            setSelected={setCurrentPage}
            open={open}
            notifs={getReviewsQuery.data?.length!}
          />
          <Option
            Icon={IoRestaurantOutline}
            title="Restaurant"
            selected={currentPage}
            setSelected={setCurrentPage}
            open={open}
          />
          <Option
            Icon={BiFoodMenu}
            title="Menu"
            selected={currentPage}
            setSelected={setCurrentPage}
            open={open}
          />
          <Option
            Icon={PiCertificate}
            title="Certifications"
            selected={currentPage}
            setSelected={setCurrentPage}
            open={open}
          />
          <Option
            Icon={AiOutlinePicture}
            title="Update Pictures"
            selected={currentPage}
            setSelected={setCurrentPage}
            open={open}
          />
          <Option
            Icon={IoSettingsOutline}
            title="Settings"
            selected={currentPage}
            setSelected={setCurrentPage}
            open={open}
          />
          <Option
            Icon={RiLogoutBoxLine}
            title="Logout"
            selected={currentPage}
            setSelected={setCurrentPage}
            open={open}
          />
        </div>

        <ToggleClose open={open} setOpen={setOpen} />
      </motion.nav>
      {/* <div className="flex h-screen bg-gray-100 dark:bg-black"> */}
      {/* Sidebar */}
      {/* <div className="w-64 bg-white dark:bg-gray-900 p-6 shadow-lg">
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
      </div> */}

      {/* Main Content */}
      <div className="flex-1 px-10 overflow-y-auto">
        {currentPage === "Dashboard" && (
          <div className="mx-[20%] mt-[5%] space-y-6">
            <div className="flex">
              <div className="flex-3/4 text-left space-y-4 pr-[10%]">
                <h1 className="text-4xl font-bold">{restaurantName}</h1>
                <span className="text-lg">{restaurantDesc}</span>
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
                      <strong>AI Summary: </strong>
                      {summarizedReviews.summary}
                      <br />
                      <strong>Overall Sentiment: </strong>
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

        {currentPage === "Reviews" && (
          <div className="mt-10">
            <h1 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
              Reviews
            </h1>
            <ReviewsTabContent reviews={getReviewsQuery.data!} />
          </div>
        )}

        {currentPage === "Restaurant" && (
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
                    className="bg-green-600 text-white px-4 py-2 rounded flex"
                  >
                    <Check className="mr-2" /> Save
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="bg-red-500 text-white px-4 py-2 rounded flex"
                  >
                    <X className="mr-2" /> Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {currentPage === "Menu" && (
          <div className="mt-10 max-w-3xl space-y-6">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
              Menu
            </h1>

            <MenuTabContent
              menu={getMenuQuery.data!}
              onDelete={handleDeleteMenu}
            />

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
                  handleAddMenu(name, price, menuImage!);
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
                {!menuImage && (
                  <div>
                    <Input
                      name="image"
                      type="file"
                      ref={imageInput}
                      className="hidden"
                      onChange={(e) =>
                        setMenuImage(Array.from(e.target.files!)[0])
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-min"
                      onClick={() => imageInput.current!.click()}
                    >
                      <Upload />
                    </Button>
                  </div>
                )}

                {menuImage && (
                  <div className="rounded-lg bg-gray-100 overflow-hidden aspect-square w-56 p-6 border flex items-center justify-center relative">
                    <img
                      src={URL.createObjectURL(menuImage)}
                      alt=""
                      className="w-full h-auto object-contain"
                    />
                    <button
                      onClick={() => setMenuImage(undefined)}
                      className="absolute top-1 right-1 bg-white text-red-600 rounded-full p-1 shadow hover:text-red-800"
                    >
                      <X />
                    </button>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded flex"
                  >
                    <Check className="mr-2" /> Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingMenu(false)}
                    className="bg-red-500 text-white px-4 py-2 rounded flex"
                  >
                    <X className="mr-2" /> Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {currentPage === "Update Pictures" && (
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
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          uploadImage(file)
                            .then((url) => {
                              if (url) {
                                Buisness.data?.addBusinessPicture(url);
                              }
                            })
                            .catch((error) => {
                              console.error("Error uploading image:", error);
                              toast.error("Error uploading image");
                            });
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

        {currentPage === "Settings" && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Change Password
            </h2>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleChangePassword}
              className="bg-[#FF6F00] text-white px-4 py-2 rounded"
            >
              ✔ Update Password
            </button>
            {changePasswordError && (
              <p className="text-red-500">{changePasswordError}</p>
            )}
            {changePasswordSuccess && (
              <p className="text-green-500">{changePasswordSuccess}</p>
            )}
          </div>
        )}

        {currentPage === "Logout" && (
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
                onClick={() => setCurrentPage("Dashboard")}
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
      {/* </div> */}
    </div>
  );
};

const ReviewsTabContent = ({ reviews }: { reviews: IExistingReview[] }) => (
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
  menu: IExistingMenu[];
  onDelete?: (index: string) => void;
}) => (
  <Table className="mt-4">
    <TableHeader>
      <TableRow className="text-lg">
        <TableHead className="text-center font-bold text-black">
          Image
        </TableHead>
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
      {menu?.map((item, index) => (
        <TableRow key={index}>
          <TableCell className="w-[7%] text-center">
            {item.itemImage.length > 0 && <img src={item.itemImage} />}
          </TableCell>
          <TableCell className="text-center">{item.itemName}</TableCell>
          <TableCell className="text-center">${item.itemPrice}</TableCell>
          {onDelete && (
            <TableCell className="text-center">
              <Button variant="ghost" onClick={() => onDelete(item.itemID)}>
                <Trash2 color="red" />
              </Button>
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
