import { Routes, Route } from "react-router-dom";
// Layout
import Navbar from "./Component/Navbar/Navbar";
//Page 
import Home from "./Page/Home/Home";
import HomeUser from "./Page/HomeUser/HomeUser"
import Login from "./Page/Login/Login"
import Calendar from "./Page/Calendar/Calendar"
import Booking from "./Page/Booking/Booking"
import SinglePageBooking from "./Page/SinglePageBooking/SinglePageBooking"
import BookingHistory from "./Page/BookingHistory/BookingHistory"
import EditProfile from "./Page/EditProfile/EditProfile"
import HomeAdmin from "./Page/HomeAdmin/HomeAdmin"
import ImportData from "./Page/ImportData/ImportData"
import DataManagement from "./Page/DataManagement/DataManagement"
import BookingApproval from "./Page/BookingApproval/BookingApproval"
import SinglePageBookingApproval from "./Page/SinglePageBookingApproval/SinglePageBookingApproval"

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* user */}
        <Route path="/" element={<Home />} />
        <Route path="/user/index" element={<HomeUser />} />
        <Route path="/login" element={<Login />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/booking/:id" element={<SinglePageBooking />} />
        <Route path="/booking-history" element={<BookingHistory />} />
        <Route path="/edit-profile" element={<EditProfile />} />

        {/* admin */}
        <Route path="/admin/index" element={<HomeAdmin />} />
        <Route path="/import-data" element={<ImportData />} />
        <Route path="/data-management" element={<DataManagement />} />
        <Route path="/booking-approval" element={<BookingApproval />} />
        <Route path="/booking-approval/:id" element={<SinglePageBookingApproval />} />

  
      </Routes>
    </>
  );
}

export default App;
