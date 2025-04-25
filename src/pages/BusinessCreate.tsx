import React, { use, useState } from "react";
import firebase from "firebase/compat/app";
import { redirect, useNavigate } from "react-router-dom";
import {
  Business,
  businessData,
  menuItem,
  uploadImage,
} from "./WrapperObjects";
import { getOwnerFromUID } from "./FirebaseAPI";
import { get } from "http";

function BusinessCreate() {
  const auth = firebase.auth();
  const [businessName, setbusinessName] = useState("");
  const [ownerID, setOwnerID] =
    useState<firebase.firestore.DocumentReference | null>(null);
  const navigate = useNavigate();
  auth.onAuthStateChanged(async (user) => {
    if (ownerID) {
      console.log("Owner ID already set, skipping fetch.");
      return;
    }
    if (user) {
      console.log(user.uid);
      const owner = await getOwnerFromUID(user.uid);
      console.log(owner);
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
  const [menu, setMenu] = useState<menuItem[]>([]);
  const [businessDescription, setBusinessDescription] = useState("");
  const [businessLogo, setBusinessLogo] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [pictures, setPictures] = useState<string[]>([]);
  const [useAddress, setUseAddress] = useState(true);
  const [latitude, setLatitude] = useState<number | null>(0);
  const [longitude, setLongitude] = useState<number | null>(0);
  const [menuItemName, setItemName] = useState("");
  const [menuItemPrice, setItemPrice] = useState(0);
  const [menuItemImage, setItemImage] = useState("");

  const addMenuItem = () => {
    const newMenuItem = new menuItem(
      menuItemName,
      (menu.length + 1).toString(),
      menuItemPrice,
      menuItemImage
    );
    setMenu([...menu, newMenuItem]);
    setItemName("");
    setItemImage("");
    setItemPrice(0);
  };
  const addLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = uploadImage(file).then((url) => {
        setBusinessLogo(url);
      });
    }
  };
  const createBusiness = () => {
    console.log("Creating business...");
    if (useAddress) {
      if (businessAddress === "") {
        alert("Please enter a business address");
        return;
      }
      const url = `https://api.geoapify.com/v1/geocode/search?text=${businessAddress}&apiKey=8cc2744ffcf14d2e976e236495bc4565`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const lat = data.features[0].properties.lat;
          const lon = data.features[0].properties.lon;
          setLatitude(lat);
          setLongitude(lon);
        })
        .catch((error) => {
          console.error("Error fetching coordinates:", error);
        });
    } else {
      if (latitude === null || longitude === null) {
        alert("Please enter latitude and longitude");
        return;
      }
      const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=8cc2744ffcf14d2e976e236495bc4565`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const address = data.features[0].properties.formatted;
          setBusinessAddress(address);
        })
        .catch((error) => {
          console.error("Error fetching address:", error);
        });
    }
    const data: businessData = {
      businessName: businessName,
      businessAddress: businessAddress,
      ownerID: ownerID,
      menu: menu,
      businessDescription: businessDescription,
      businessLogo: businessLogo,
      cuisineType: cuisineType,
      businessID: undefined,
      businessCertifications: [],
      businessLocation: [latitude ?? 0, longitude ?? 0],
      businessPictures: pictures,
      weeklyAggregatedScore: 0,
      weeklyAggregatedReviews: 0,
    };
    const newBusiness = new Business(data);
    newBusiness.createBusiness();
    navigate("/business");
  };
  return (
    <div className="flex flex-col items-center justify-center mt-20 max-w-sm mx-auto gap-4">
      <h1>Create Business</h1>
      <input
        className="border-1 border-gray-300 w-full px-4 py-1 rounded-2xl"
        type="text"
        placeholder="Business Name"
        value={businessName}
        onChange={(e) => setbusinessName(e.target.value)}
      />
      <input
        className="border-1 border-gray-300 w-full px-4 py-1 rounded-2xl"
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
          className="border-1 border-gray-300 w-full px-4 py-1 rounded-2xl"
          type="text"
          placeholder="Business Address"
          value={businessAddress}
          onChange={(e) => setBusinessAddress(e.target.value)}
        />
      ) : (
        <div className="flex flex-col gap-2">
          <input
            className="border-1 border-gray-300 w-full px-4 py-1 rounded-2xl"
            type="number"
            placeholder="Latitude"
            value={latitude || ""}
            onChange={(e) => setLatitude(Number(e.target.value))}
          />
          <input
            className="border-1 border-gray-300 w-full px-4 py-1 rounded-2xl"
            type="number"
            placeholder="Longitude"
            value={longitude || ""}
            onChange={(e) => setLongitude(Number(e.target.value))}
          />
        </div>
      )}
      <input
        className="border-1 border-gray-300 w-full px-4 py-1 rounded-2xl"
        type="text"
        placeholder="Cusiine Type"
        value={cuisineType}
        onChange={(e) => setCuisineType(e.target.value)}
      />
      <div>
        <h2>Add Menu Item</h2>
        <input
          className="border-1 border-gray-300 w-full px-4 py-1 rounded-2xl"
          type="text"
          placeholder="Menu Item Name"
          value={menuItemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <input
          className="border-1 border-gray-300 w-full px-4 py-1 rounded-2xl"
          type="number"
          placeholder="Menu Item Price"
          min="0"
          step="0.01"
          value={menuItemPrice}
          onChange={(e) => setItemPrice(Number(e.target.value))}
        />
        <button
          onClick={addMenuItem}
          className="border-1 border-gray-300 w-full px-4 py-1 rounded-2xl hover:bg-gray-100 cursor-pointer"
        >
          Add Menu Item
        </button>
        <ul>
          {menu.map((item, index) => (
            <li key={index}>
              {item.itemName} - ${item.itemPrice}
            </li>
          ))}
        </ul>
      </div>
      <input
        className="border-1 border-gray-300 w-full px-4 py-1 rounded-2xl"
        type="file"
        accept="image/*"
        onChange={addLogo}
      ></input>
      <div>
        <h2>Add Business Pictures</h2>
        <input
          className="border-1 border-gray-300 w-full px-4 py-1 rounded-2xl"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const files = e.target.files;
            if (files) {
              const urls: string[] = [];
              for (let i = 0; i < files.length; i++) {
                const file = files[i];
                uploadImage(file).then((url) => {
                  urls.push(url);
                  setPictures(urls);
                });
              }
            }
          }}
        />
      </div>
      <button
        onClick={createBusiness}
        className="border-1 border-gray-300 w-full px-4 py-1 rounded-2xl hover:bg-gray-100 cursor-pointer"
      >
        Create
      </button>
    </div>
  );
}
export default BusinessCreate;
