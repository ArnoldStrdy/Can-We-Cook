import { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Business, uploadImage, Banner } from "@/pages/WrapperObjects";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { FiChevronsRight, FiHome } from "react-icons/fi";
import { MdOutlineReviews } from "react-icons/md";
import { IoRestaurantOutline } from "react-icons/io5";
import { BiFoodMenu } from "react-icons/bi";
import { AiOutlinePicture } from "react-icons/ai";
import { PiCertificate } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";
import { GrAnnounce } from "react-icons/gr";
import { motion } from "framer-motion";

import imgUrl from "../assets/logoIcon.png";
import firebase from "firebase/compat/app";
import model from "@/API/gemini";

import { useNavigate } from "react-router-dom";
import { Check, Trash2, Upload, X } from "lucide-react";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deleteMenuItem,
  deleteReviewById,
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
import { Input } from "@/components/ui/input";
import { ReviewCard } from "@/components/custom/reviewCard";
import { Quantum } from "ldrs/react";
import "ldrs/react/Quantum.css";
import { PicturesTabContent } from "@/components/custom/PicturesTabContent";

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
const certificate = [
  "Halal",
  "Kosher",
  "Vegan",
  "Vegetarian",
  "Gluten Free",
  "Organic",
  "Non-GMO",
];
const BusinessDash: React.FC<CustomerNavbarProps> = ({ uid, setUID }) => {
  const [currentPage, setCurrentPage] = useState("Dashboard");
  // const [cookies, setCookie] = useCookies(["uid", "name"]);
  const auth = firebase.auth();
  // const [menu, setMenu] = useState([]);
  const [pictures, setPictures] = useState(dummyPictures);
  const [ownerName, setOwnerName] = useState("Owner Name");
  // const [reviews] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [changePasswordError, setChangePasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePasswordSuccess, setChangePasswordSuccess] = useState("");
  const [restaurantName, setRestaurantName] = useState("Restaurant Name");
  const [restaurantDesc, setRestaurantDesc] = useState("Description");
  const [businessLogo, setBusinessLogo] = useState<string>(
    dummyBusiness.businessLogo
  );

  const [bannerFile, setBannerFile] = useState<File>();
  const [expireDate, setExpireDate] = useState<string>(""); // e.g. "2025-05-31"
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  // Change this line
  const persistance = firebase.auth.Auth.Persistence.LOCAL; // Use LOCAL instead of SESSION
  // const handleUpdateCertifications = (
  //   event: React.ChangeEvent<HTMLSelectElement>
  // ) => {
  //   const selectedOptions = Array.from(event.target.selectedOptions).map(
  //     (option) => option.value
  //   );
  //   Buisness.data?.setBusinessCertifications(selectedOptions);
  //   toast.success("Certifications updated successfully!");
  // };

  const toggleCertificate = (cert: string) => {
    setSelectedCertificates((prev) =>
      prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert]
    );
  };

  const handleUpdateCertifications = () => {
    Buisness.data?.setBusinessCertifications(selectedCertificates);
    toast.success("Certifications updated successfully!");
  };

  useEffect(() => {
    auth
      .setPersistence(persistance)
      .then(() => {
        // Existing onAuthStateChanged listener setup
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            // console.log("Auth state changed: User found", user.uid);
            setUID(user.uid);
            // Optionally set cookie here too for redundancy, though LOCAL persistence should handle it
            // setCookie("uid", user.uid, { path: "/" });
          } else {
            // console.log("Auth state changed: No user found");
            setUID(null);
            // Optionally clear cookie if needed
            // removeCookie("uid", { path: "/" });
          }
        });
        return unsubscribe; // Cleanup listener on component unmount
      })
      .catch((error) => {
        console.error("Error setting persistence:", error);
      });

    // Note: Removed setUID(uid) from here as it was redundant with onAuthStateChanged
    // The initial uid prop might be useful if passed down correctly,
    // but onAuthStateChanged is the primary mechanism.
  }, [auth, setUID]); // Add dependencies

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!uid) return;
      const owner = await getOwnerFromUID(uid);
      setOwnerID(owner!);
      const ownerName = await getOwnerNameFromUID(uid);
      if (!ownerName) return;
      setOwnerName(ownerName!);
      // console.log("Owner Name:", ownerName);

      // console.log("Owner ID:", owner);
    };

    fetchCustomerData();
  }, [uid]);

  const [ownerID, setOwnerID] = useState<string | null>(null);
  const [selectedCertificates, setSelectedCertificates] = useState<string[]>(
    []
  );
  const [businessId, setbusinesID] = useState<string>();

  useEffect(() => {
    const fetchBusinessID = async () => {
      if (ownerID) {
        console.log("Owner ID:", ownerID);
        const business = await getRestuarantfromOwnerID(ownerID);
        setbusinesID(business!);
        console.log("Business ID:", business);
      }
    };
    fetchBusinessID();
  }, [ownerID]);
  const bus = useQuery({
    queryKey: ["getRestuarantfromOwnerID", ownerID],
    queryFn: async () => {
      if (ownerID) {
        console.log("Owner ID:", ownerID);
        const business = await getRestuarantfromOwnerID(ownerID);
        setbusinesID(business!);
        console.log("Business ID:", business);
      }
      return ownerID;
    }
  });
  const Buisness = useQuery({
    queryFn: () => {
      const business = new Business();
      business.initBusiness(businessId!).then(() => {
        setPictures(
          business.businessPictures.length > 0 ? business.businessPictures : []
        );
        setRestaurantName(business.businessName);
        setRestaurantDesc(business.businessDescription);
        setBusinessLogo(business.businessLogo);
        setSelectedCertificates(business.businessCertifications || []);
        // console.log("Business ID:", businessId, business.businessID);
        // console.log("Business Pictures:", pictures, business.businessPictures);
        // console.log("Business:", restaurantName, business.businessName);
        // console.log(
        //   "Business Desc:",
        //   restaurantDesc,
        //   business.businessDescription
        // );
      });
      return business;
    },
    queryKey: ["getBusinessById", businessId],
  });
  // console.log("Business ID:", businessId, Buisness.data?.businessID);
  // console.log("Business Pictures:", pictures, Buisness.data?.businessPictures);
  // console.log("Business:", restaurantName, Buisness.data?.businessName);
  // console.log(
  //   "Business Desc:",
  //   restaurantDesc,
  //   Buisness.data?.businessDescription
  // );
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

  const handleUploadBanner = async () => {
    if (!bannerFile || !expireDate || !businessId) {
      toast.error("Please upload an image and select an expiration date.");
      return;
    }

    try {
      const url = await uploadImage(bannerFile);
      const expiresAt = new Date(expireDate);
      const banner = new Banner(businessId, url, expiresAt);
      banner.createBanner();
      toast.success("Banner uploaded successfully!");
      setBannerFile(undefined);
      setExpireDate("");
    } catch (error) {
      console.error("Error uploading banner:", error);
      toast.error("Failed to upload banner.");
    }
  };
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

  const deleteReviewMutation = useMutation({
    mutationFn: deleteReviewById,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getReviewByBusinessId", businessId],
      });
      toast.success("Succesfuly deleted a review");
    },
    onError: (e) => {
      toast.error(`Error deleting review: ${e}`);
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

    // setMenu((prev) => [...prev, { name, price }]);
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
    // alert(`Updated: ${name}, ${description}`);
    toast.success("Restaurant info updated successfully!");
  };
  const handleDeletePicture = (indexToDelete: number) => {
    const updatedPictures = pictures.filter(
      (_, index) => index !== indexToDelete
    );
    setPictures(updatedPictures);
    Buisness.data!.setBusinessPictures(updatedPictures);
    toast.success("Successfully deleted a picture")
    // console.log("Updated Pictures:", updatedPictures);
    // console.log("Business Pictures:", Buisness.data!.businessPictures);
  };

  const [isEditing, setIsEditing] = useState(false);
  const handleChangeLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file)
        .then((url) => {
          if (url) {
            setBusinessLogo(url);
            Buisness.data?.setBusinessLogo(url);
            toast.success("Logo updated successfully!");
          }
        })
        .catch((error) => {
          console.error("Error uploading logo:", error);
          toast.error("Error uploading logo");
        });
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };
  const [isEditingPictures, setIsEditingPictures] = useState(false);

  const [isEditingMenu, setIsEditingMenu] = useState(false);
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

  const [open, setOpen] = useState<boolean>(false);

  // if mobile, set open to false
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call it once to set the initial state

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const TitleSection: React.FC<TitleSectionProps> = ({ open }) => {
    return (
      <div className="mb-3 border-b border-slate-300 pb-3">
        <div className="flex items-center justify-between rounded-md transition-colors">
          <div className="flex items-center gap-2">
            {/* <Logo /> */}
            <img
              src={businessLogo ? businessLogo : imgUrl}
              className="h-8 w-8 object-contain"
              alt="Logo"
            />
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

  const RestaurantPage = () => {
    return (
      <div className="mt-10 mx-4 sm:mx-[20%] space-y-4">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Update Restaurant Info
        </h1>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">
          Name and Description
        </h2>
        {!isEditing ? (
          <div className="bg-card flex flex-col gap-6 rounded-md py-6 px-4">
            <h2 className="text-xl font-bold">{restaurantName}</h2>
            <p className="text-gray-700 dark:text-gray-300">{restaurantDesc}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-2 px-4 py-2 w-fit bg-[#FF6F00] text-white rounded"
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
              const name = (form.elements.namedItem("name") as HTMLInputElement)
                .value;
              const desc = (
                form.elements.namedItem("description") as HTMLTextAreaElement
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
        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleChangeLogo(e)}
          ref={logoInputRef}
          className="hidden"
        />

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">
          Business Logo
        </h2>
        {businessLogo ? (
          <img
            src={businessLogo}
            alt="Business Logo"
            className="w-32 mt-4 rounded"
          />
        ) : (
          <div className="w-32 h-32 rounded outline">No logo</div>
        )}
        <Button
          type="button"
          variant="outline"
          className="w-min"
          onClick={() => logoInputRef.current!.click()}
        >
          <Upload /> Upload new logo
        </Button>
      </div>
    );
  };
  return (
    <div className="flex h-screen bg-[#A7ACD9]/20">
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
            Icon={GrAnnounce}
            title="Promotions"
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
      <div className="flex-1 sm:px-10 overflow-y-auto">
        {currentPage === "Dashboard" && (
          <div className="mx-4 sm:mx-[20%] mt-[5%] space-y-6">
            <div className="flex justify-between flex-col sm:flex-row">
              <div className="flex-3/4 text-left space-y-4 pr-[10%]">
                <h1 className="text-4xl font-extrabold">{restaurantName}</h1>
                <span className="text-lg font-semibold">{restaurantDesc}</span>
              </div>
              <div className="flex-1/4 flex-col justify-end flex">
                <img
                  src={businessLogo ? businessLogo : imgUrl}
                  className="w-full h-40 object-contain"
                />
                <div className="flex flex-wrap gap-2 pt-8 align-middle justify-center">
                  {selectedCertificates.map((cert) => (
                    <div
                      key={cert}
                      className="flex items-center text-sm font-semibold text-gray-700"
                    >
                      <img
                        src={mapCertToImg[cert]}
                        alt={cert}
                        className="w-12 h-12 mr-1"
                        title={cert}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <button
                onClick={handleSubmit}
                className="bg-[#7367e6] text-white px-4 py-2 rounded"
              >
                Summarize Reviews
              </button>
            </div>
            {isLoading && (
              <div className="card bg-[linear-gradient(#7367e6,#71affe)] p-2 rounded-xl relative">
                <div className="bg-white/75 rounded-lg shadow-md h-full p-3 flex justify-center items-center">
                  <div className="my-6">
                    <Quantum size="45" speed="1.75" color="black" />
                  </div>
                </div>
              </div>
            )}
            {!isLoading && summarizedReviews && (
              <div className="card bg-[linear-gradient(#7367e6,#71affe)] p-2 rounded-xl relative">
                <div className="bg-white/75 rounded-lg shadow-md h-full p-3">
                  <h2 className="font-black">AI Summary:</h2>
                  <h2 className="z-50">{summarizedReviews.summary}</h2>
                  <h2 className="font-black pt-2">Overall Sentiment:</h2>
                  <h2 className="card__title z-50">
                    {summarizedReviews.overallSentiment}
                  </h2>
                </div>
              </div>
            )}
            <Tabs defaultValue="reviews" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="menu">Menu</TabsTrigger>
                <TabsTrigger value="pictures">Pictures</TabsTrigger>
              </TabsList>
              <TabsContent value="reviews">
                <ReviewsTabContent
                  reviews={getReviewsQuery.data!}
                  deleteReviewMutation={deleteReviewMutation}
                />
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
          <div className="mt-10 mx-4 sm:mx-[20%]">
            <h1 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
              Reviews
            </h1>
            <ReviewsTabContent
              reviews={getReviewsQuery.data!}
              deleteReviewMutation={deleteReviewMutation}
            />
          </div>
        )}

        {currentPage === "Restaurant" && <RestaurantPage />}

        {currentPage === "Promotions" && (
          <div className="mt-10 mx-4 sm:mx-[20%] space-y-4">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
              Upload Promotion Banner
            </h1>

            <div className="bg-card flex flex-col gap-6 rounded-md py-6 px-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Banner Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBannerFile(e.target.files?.[0])}
                  className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#FF6F00] file:text-white hover:file:bg-[#e65c00] file:cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={expireDate}
                  onChange={(e) => setExpireDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] dark:bg-gray-800 dark:text-white"
                />
              </div>

              <button
                onClick={handleUploadBanner}
                className="mt-2 px-4 py-2 w-fit bg-[#FF6F00] text-white rounded cursor-pointer hover:file:bg-[#e65c00]"
              >
                Upload Banner
              </button>
            </div>
          </div>
        )}

        {currentPage === "Menu" && (
          <div className="mt-10 mx-4 sm:mx-[20%] space-y-4">
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
          <div className="mt-10 mx-4 sm:mx-[20%] space-y-4">
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
                <div className="space-y-4 space-x-2">
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
                                toast.success("Successfully added a picture")
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
          <div className="mt-10 mx-4 sm:mx-[20%] space-y-4">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
              Settings
            </h1>
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Change Password
              </h2>
              {/* Change Password Section */}
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
          </div>
        )}

        {currentPage === "Certifications" && (
          <div className="mt-10 mx-4 sm:mx-[20%] space-y-4">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Select Your Certifications
            </h1>

            <div className="bg-card rounded shadow-sm px-6 py-4 space-y-3">
              {certificate?.map((cert: string, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <Checkbox
                    id={`cert-${index}`}
                    checked={selectedCertificates.includes(cert)}
                    onCheckedChange={() => toggleCertificate(cert)}
                  />
                  <label
                    htmlFor={`cert-${index}`}
                    className="text-sm font-medium text-gray-800 dark:text-gray-200"
                  >
                    {cert}
                  </label>
                </div>
              ))}
            </div>

            <button
              onClick={handleUpdateCertifications}
              className="w-fit px-5 py-2 rounded bg-[#FF6F00] text-white font-medium hover:bg-[#e65c00] transition-colors"
            >
              Update Certifications
            </button>
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
                className="bg-green-600 text-white px-4 py-2 rounded flex gap-2"
                onClick={() => {
                  // alert("Logged out!");
                  firebase.auth().signOut();
                  toast.success("Logged out successfully");
                  navigate("/");
                }}
              >
                <Check /> Confirm
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded flex gap-2"
                onClick={() => setCurrentPage("Dashboard")}
              >
                <X /> Cancel
              </button>
            </div>
          </div>
        )}
        {/* {currentPage === "login" && (
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
                        // console.log("Sign Up functionality not implemented yet")
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
        )} */}
      </div>
      {/* </div> */}
    </div>
  );
};

const ReviewsTabContent = ({
  reviews,
  deleteReviewMutation,
}: {
  reviews: IExistingReview[];
  deleteReviewMutation: UseMutationResult<undefined, Error, string, unknown>;
}) => {
  const handleDeleteReview = (reviewId: string) => {
    deleteReviewMutation.mutate(reviewId);
  };

  return (
    <div className="my-4 space-y-6">
      {reviews?.map((review, index) => {
        return (
          <ReviewCard
            review={review}
            key={index}
            onDelete={() => handleDeleteReview(review.reviewId)}
          />
        );
      })}
    </div>
  );
};
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
        <TableHead className="text-center font-bold text-black w-1/3">
          Image
        </TableHead>
        <TableHead className="text-center font-bold text-black w-1/3">
          Name
        </TableHead>
        <TableHead className="text-center font-bold text-black w-1/3">
          Price
        </TableHead>
        {onDelete && (
          <TableHead className="text-center font-bold text-black w-1/3">
            Actions
          </TableHead>
        )}
      </TableRow>
    </TableHeader>
    <TableBody>
      {menu?.map((item, index) => (
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

export default BusinessDash;
