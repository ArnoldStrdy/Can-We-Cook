import { Routes, Route } from "react-router-dom";

import BusinessDash from "./pages/BusinessDash";
import CustomerDash from "./pages/CustomerDash";
import RestaurantDetails from "./pages/RestaurantDetails";
import AboutUs from "./pages/AboutUs";
import Error from "./pages/Error";
import CustomerNavbar from "@/components/CustomerNav";

function App() {
  return (
    <div>
      <CustomerNavbar />
      <Routes>
        <Route path="/" element={<CustomerDash />} />
        <Route path="/business" element={<BusinessDash />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/:section" element={<CustomerDash />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
