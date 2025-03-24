import React, { useState } from "react";
import firebase from "firebase/compat/app";
import { redirect, useNavigate } from "react-router-dom";
import { Business, businessData, menuItem } from "./WrapperObjects";
import { getOwnerFromUID } from "./FirebaseAPI";
import { get } from "http";

function BusinessCreate(){
    const auth = firebase.auth();
    const [businessName, setbusinessName] = useState("");
    const [ownerID, setOwnerID] = useState<firebase.firestore.DocumentReference | null>(null);
    const navigate = useNavigate();
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            console.log(user.uid);
            const owner = await getOwnerFromUID(user.uid);
            console.log(owner);
            setOwnerID("owners/" + owner?.toString());
        } else {
            console.error("No user is currently logged in");
            redirect("/login");
        }
    });
    const [businessAddress, setBusinessAddress] = useState("");
    const [menu, setMenu] = useState<menuItem[]>([]);
    const [businessDescription, setBusinessDescription] = useState("");
    const [businessLogo, setBusinessLogo] = useState("");
    const [cuisineType, setCuisineType] = useState("");
    
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
    }


    const createBusiness = () => {
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
            businessLocation: [0, 0],
            businessPictures: [],
            weeklyAggregatedScore: 0,
            weeklyAggregatedReviews: 0
        }
        const newBusiness = new Business(
            data
        )
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
            <input
            className="border-1 border-gray-300 w-full px-4 py-1 rounded-2xl"
            type="paragraph"
            placeholder="Business Address"
            value={businessAddress}
            onChange={(e) => setBusinessAddress(e.target.value)}
            />
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
                    min = "0"
                    step = "0.01"
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
                        <li key={index}>{item.itemName} - ${item.itemPrice}</li>
                    ))}
                </ul>
            </div>
            <button
            onClick={createBusiness}
            className="border-1 border-gray-300 w-full px-4 py-1 rounded-2xl hover:bg-gray-100 cursor-pointer"
            >Create</button>
        </div>
    )
}
export default BusinessCreate;