import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Ratings from "@/components/ui/ratings";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import imgUrl from "../assets/logoIcon.png";

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
];

const dummyMenu = [
  { name: "Classic Cheeseburger", price: "12.99" },
  { name: "Spaghetti Carbonara", price: "15.50" },
  { name: "Grilled Chicken Salad", price: "13.00" },
  { name: "Margherita Pizza", price: "14.00" },
  { name: "Chocolate Lava Cake", price: "7.50" },
];

const dummyPictures = [imgUrl, imgUrl];

function BusinessDash() {
  const [currentPage, setCurrentPage] = useState("home");
  const [menu, setMenu] = useState(dummyMenu);
  const [pictures, setPictures] = useState(dummyPictures);
  const [reviews] = useState(dummyReviews);

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
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-black">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-900 p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
          Dashboard
        </h2>
        <ul className="space-y-4">
          {["home", "reviews", "restaurant", "menu", "pictures", "settings", "logout"].map((page) => (
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
            <Tabs defaultValue="reviews" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="menu">Menu</TabsTrigger>
                <TabsTrigger value="pictures">Pictures</TabsTrigger>
              </TabsList>
              <TabsContent value="reviews">
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <strong>AI Summary:</strong> Great ambiance, loved dishes.
                    Overall sentiment: Positive.
                  </CardContent>
                </Card>
                <ReviewsTabContent reviews={reviews} />
              </TabsContent>
              <TabsContent value="menu">
                <MenuTabContent menu={menu} />
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
            <ReviewsTabContent reviews={reviews} />
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
                <p className="text-gray-700 dark:text-gray-300">{restaurantDesc}</p>
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
                  const name = (form.elements.namedItem("name") as HTMLInputElement).value;
                  const desc = (form.elements.namedItem("description") as HTMLTextAreaElement).value;
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
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
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
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Menu</h1>

            <MenuTabContent menu={menu} onDelete={handleDeleteMenu} />

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
                  const name = (form.elements.namedItem("itemname") as HTMLInputElement).value;
                  const price = (form.elements.namedItem("price") as HTMLInputElement).value;
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
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
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
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Update Pictures</h1>

            <PicturesTabContent pictures={pictures} onDelete={handleDeletePicture} />

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
    <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Settings</h1>
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
    <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Logout</h1>
    <p className="text-gray-700 dark:text-gray-300">Are you sure you want to log out?</p>
    <div className="flex justify-center space-x-4">
      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={() => {
          alert("Logged out!");
          setCurrentPage("home"); // or redirect to login page
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
      </div>
    </div>
  );

}

const ReviewsTabContent = ({ reviews }: { reviews: Review[] }) => (
  <div className="mt-4 space-y-6">
    <Card>
      <CardContent className="p-4 text-gray-800 dark:text-gray-200">
        <strong>🧠 AI Summary:</strong><br />
        Customers generally praise the warm ambiance and attentive staff. The grilled salmon is a standout favorite. However, some mention inconsistent wait times. Overall sentiment is <span className="text-green-600 font-bold">positive</span>.
      </CardContent>
    </Card>

    {reviews.map((review, index) => (
      <Card key={index}>
        <CardContent className="text-lg space-y-2">
          <div className="flex justify-between">
            <div className="font-bold">{review.reviewer}</div>
            <div className="text-right">
              <div className="text-gray-600">{review.date}</div>
              <Ratings stars={review.rating} />
            </div>
          </div>
          <div>{review.review}</div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const MenuTabContent = ({
  menu,
  onDelete,
}: {
  menu: { name: string; price: string }[];
  onDelete?: (index: number) => void;
}) => (
  <Table className="mt-4">
    <TableHeader>
      <TableRow className="text-lg">
        <TableHead className="text-center font-bold text-black">Name</TableHead>
        <TableHead className="text-center font-bold text-black">Price</TableHead>
        {onDelete && (
          <TableHead className="text-center font-bold text-black">Actions</TableHead>
        )}
      </TableRow>
    </TableHeader>
    <TableBody>
      {menu.map((item, index) => (
        <TableRow key={index}>
          <TableCell className="text-center">{item.name}</TableCell>
          <TableCell className="text-center">${item.price}</TableCell>
          {onDelete && (
            <TableCell className="text-center">
              <button
                onClick={() => onDelete(index)}
                className="text-red-600 hover:text-red-800"
              >
                🗑️
              </button>
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
