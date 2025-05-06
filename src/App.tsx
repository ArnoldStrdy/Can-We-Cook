import { Routes, Route, Navigate } from "react-router-dom";
import { use, useEffect, useState } from "react";
import BusinessDash from "./pages/BusinessDash";
import CustomerDash from "./pages/CustomerDash";
import RestaurantDetails from "./pages/RestaurantDetails";
import AboutUs from "./pages/AboutUs";
import Error from "./pages/Error";
import CustomerNavbar from "@/components/CustomerNav";
import BusinessCreate from "./pages/BusinessCreate";
import LoginPage from "./pages/LoginPage";
import LoginPageBusiness from "./pages/LoginPageBusiness";
import UserSettings from "./pages/UserSettings";
import firebase from "firebase/compat/app";
import { useLocation } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { CookiesProvider, useCookies } from "react-cookie";
import { getCustomerFromUID, getOwnerFromUID } from "./pages/FirebaseAPI";

const auth = firebase.auth();
console.log(auth.currentUser);

function App() {
  const [uid, setUID] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [cookies, setCookie] = useCookies(["uid", "name"]); // Use react-cookie to access cookies
  const location = useLocation(); // Current route location
  const [isOwner, setIsOwner] = useState(false);

  // Check if the user is an owner
  useEffect(() => {
    const checkIfOwner = async () => {
      firebase.auth().onAuthStateChanged((user: firebase.User | null) => {
        if (user) {
          getOwnerFromUID(user.uid).then((customer) => {
            if (customer) {
              setIsOwner(true);
              console.log("User is an owner.");
            } else {
              setIsOwner(false);
              console.log("User is not an owner.");
            }
          });
        }
      });
    };
    checkIfOwner();
  }, [uid]);

  useEffect(() => {
    if (cookies.uid) {
      setUID(cookies.uid);
      setName(cookies.name);
    } else {
      firebase.auth().onAuthStateChanged((user: firebase.User | null) => {
        if (user) {
          setUID(user.uid);
          getCustomerFromUID(user.uid).then((customer) => {
            if (customer) {
              setName(customer.name);
              setCookie("uid", user.uid, { path: "/" }); // Set uid cookie
              setCookie("name", customer.name, { path: "/" }); // Set name cookie
            } else {
              console.log("No customer data found for this UID.");
            }
          });
        }
      });
    }
  }, [cookies.uid]);

  // Hide navbar only on /business route
  const hideNavbar =
    location.pathname.startsWith("/business") ||
    location.pathname.startsWith("/createBusiness");

  return (
    <div>
      {!hideNavbar && <CustomerNavbar uid={uid} setUID={setUID} />}
      <Toaster richColors position="bottom-right" />
      <Routes>
        <Route path="/" element={<CustomerDash />} />
        <Route path="/settings" element={<UserSettings />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/createBusiness" element={<BusinessCreate />} />
        <Route path="/about" element={<AboutUs />} />
        <Route
          path="/business"
          element={<BusinessDash uid={uid} setUID={setUID} />}
        />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        <Route path="/loginBusiness" element={<LoginPageBusiness />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
