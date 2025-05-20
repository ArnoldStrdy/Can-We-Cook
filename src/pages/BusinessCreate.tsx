import { useState } from "react";
import firebase from "firebase/compat/app";
import { redirect, useNavigate } from "react-router-dom";
import {
  Business,
  businessData,
} from "./WrapperObjects";
import { getOwnerFromUID } from "./FirebaseAPI";
import Logo from "../assets/logoNameIcon.png";

function BusinessCreate() {
  const auth = firebase.auth();
  const [businessName, setbusinessName] = useState("");
  const [ownerID, setOwnerID] =
    useState<firebase.firestore.DocumentReference | null>(null);
  const navigate = useNavigate();
  auth.onAuthStateChanged(async (user) => {
    if (ownerID) {
      // console.log("Owner ID already set, skipping fetch.");
      return;
    }
    if (user) {
      // console.log(user.uid);
      const owner = await getOwnerFromUID(user.uid);
      // console.log(owner);
      if (!owner) {
        console.error("No owner found for this user");
        redirect("/login");
      }
      setOwnerID(
        owner ? firebase.firestore().doc("owners/" + owner.toString()) : null
      );
    } else {
      console.error("No user is currently logged in");
      alert("Please log in to create a business");
      redirect("/login");
    }
  });
  const [businessAddress, setBusinessAddress] = useState("");
  // const [menu, setMenu] = useState<menuItem[]>([]);
  const [businessDescription, setBusinessDescription] = useState("");
  // const [businessLogo, setBusinessLogo] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [useAddress, setUseAddress] = useState(true);
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  // const [menuItemName, setItemName] = useState("");
  // const [menuItemPrice, setItemPrice] = useState(0);
  // const [menuItemImage, setItemImage] = useState("");
  let lat = 0;
  let lon = 0;
  let addr = "";
  const generateBusiness = () => {
    // console.log("Generating business...");
    // console.log("Lon Lan", latitude, longitude, lat, lon);
    const data: businessData = {
      businessName: businessName,
      businessAddress: addr,
      ownerID: ownerID ? ownerID.id : "",
      menu: [],
      businessDescription: businessDescription,
      businessLogo: "",
      cuisineType: cuisineType,
      businessID: undefined,
      businessCertifications: [],
      businessLocation: [lat ?? 0, lon ?? 0],
      businessPictures: [],
      weeklyAggregatedScore: 0,
      weeklyAggregatedReviews: 0,
      aggregatedReviews: 0,
      aggregatedScore: 0
    };
    const newBusiness = new Business(data);
    newBusiness.createBusiness();
    navigate("/business");
  };

  return (
    <div className="bg-gray-1 py-20 dark:bg-dark lg:py-[120px] bg-[#A7ACD9]/20 min-h-screen">
      <div className="flex flex-col items-center justify-center mt-20 max-w-sm mx-auto gap-4">
        <div className="flex flex-col items-center justify-center gap-2 max-w-[160px]">
          <img src={Logo} alt="logo" />
          <span className="">Configure Business</span>
        </div>
        <input
          className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white"
          type="text"
          placeholder="Business Name"
          value={businessName}
          onChange={(e) => setbusinessName(e.target.value)}
        />
        <input
          className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white"
          type="paragraph"
          placeholder="Business Description"
          value={businessDescription}
          onChange={(e) => setBusinessDescription(e.target.value)}
        />
        <div className="flex gap-2">
          <label htmlFor="address">Use Address</label>
          <input
            type="checkbox"
            id="address"
            checked={useAddress}
            onChange={(e) => setUseAddress(e.target.checked)}
          />
        </div>
        {useAddress ? (
          <input
            className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white"
            type="text"
            placeholder="Business Address"
            value={businessAddress}
            onChange={(e) => setBusinessAddress(e.target.value)}
          />
        ) : (
          <div className="flex flex-col gap-2">
            <input
              className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white"
              type="number"
              placeholder="Latitude"
              value={latitude || ""}
              onChange={(e) => {
                setLatitude(Number(e.target.value));
                lat = Number(e.target.value);
              }}
            />
            <input
              className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white"
              type="number"
              placeholder="Longitude"
              value={longitude || ""}
              onChange={(e) => {
                setLongitude(Number(e.target.value));
                lon = Number(e.target.value);
              }}
            />
          </div>
        )}
        <input
          className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-body-color outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white"
          type="text"
          placeholder="Cuisine Type"
          value={cuisineType}
          onChange={(e) => setCuisineType(e.target.value)}
        />
        <button
          onClick={() => {
            generateBusiness();
          }}
          type="button"
          className="w-full cursor-pointer rounded-md border border-primary bg-[#554971] px-5 py-3 text-base font-medium text-white transition hover:bg-opacity-90"
        >
          Submit Details
        </button>
      </div>
    </div>
  );
}
export default BusinessCreate;
