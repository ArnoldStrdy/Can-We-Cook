import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import BusinessDash from "./pages/BusinessDash";
import CustomerDash from "./pages/CustomerDash";
import RestaurantDetails from "./pages/RestaurantDetails";
import AboutUs from "./pages/AboutUs";
import Error from "./pages/Error";
import CustomerNavbar from "@/components/CustomerNav";
import LoginPage from "./pages/LoginPage";
import firebase from "firebase/compat/app";
const auth = firebase.auth();
console.log(auth.currentUser);
function App() {
  const [uid, setUID] = useState<string | null>(null);
  useEffect(() => {
    if (document.cookie.includes(";uid")) {
      const uid = document.cookie.split(";uid=")[1];
      setUID(uid);
    } else {
      firebase.auth().onAuthStateChanged((user: firebase.User | null) => {
        if (user) {
          setUID(user.uid);
        }
      });
    }
  }, []);
  return (
    <div>
      <CustomerNavbar uid={uid} setUID={setUID} />
      <Routes>
        <Route path="/" element={<CustomerDash />} />
        <Route path="/business" element={<BusinessDash />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/:section" element={<CustomerDash />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
