import { Routes, Route } from "react-router-dom";

import BusinessDash from "./pages/BusinessDash";
import CustomerDash from "./pages/CustomerDash";
import RestaurantDetails from "./pages/RestaurantDetails";
import Error from "./pages/Error";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<CustomerDash />} />
        <Route path="/:section" element={<CustomerDash />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        <Route path="/business" element={<BusinessDash />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}

export default App;
