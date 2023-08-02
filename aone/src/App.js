import { Routes, Route } from "react-router-dom";
// Layout
import Navbar from "./Component/Navbar/Navbar";

// functions
import { currentUser } from "./functions/auth";
//Page
import Home from "./Page/Home/Home"
import HomeUser from "./Page/HomeUser/HomeUser";
import Login from "./Page/Login/Login";
import Calendar from "./Page/Calendar/Calendar";
import Booking from "./Page/Booking/Booking";
import SinglePageBooking from "./Page/SinglePageBooking/SinglePageBooking";
import BookingHistory from "./Page/BookingHistory/BookingHistory";
import EditProfile from "./Page/EditProfile/EditProfile";
import HomeAdmin from "./Page/HomeAdmin/HomeAdmin";
import ImportCourse from "./Page/ImportCourse/ImportCourse";
import ImportStudent from "./Page/ImportStudent/ImportStudent";
import DataManagement from "./Page/DataManagement/DataManagement";
import BookingApproval from "./Page/BookingApproval/BookingApproval";
import SinglePageBookingApproval from "./Page/SinglePageBookingApproval/SinglePageBookingApproval";
//Protect Routes
import UserRoute from "./Protect_Rout/UserRoute"; 
import AdminRoute from "./Protect_Rout/AdminRoute";
// redux
import { useDispatch } from "react-redux";


function App() {
  const dispatch = useDispatch();
  const idtoken = localStorage.token;     //get Token from LocalStorage 
  if (idtoken) {                          //if have Token
    currentUser(idtoken)                  //Is function send Token to decoded  before check Token
      .then((res) => {   
        //console.log(res.data);          // get res.data (Is Data of User  passed decoded or verify) 
        dispatch({  
          type: "LOGIN",
          payload: {
            token: idtoken,              //set idtoken in REDUX
            username: res.data.username, //set res.data in REDUX
            role: res.data.role,        
          },
        });
      })
      .catch((err) => {   
        console.log(err);
      });
  }

  return (
    <>
      <Navbar />
      <Routes>
        {/* user */}
        <Route path="/"                 element={<Home/>} />
        <Route path="/login"            element={<Login />} />
        <Route path="/user/index"       element={<UserRoute>  <HomeUser />   </UserRoute>}/>
        <Route path="/calendar"         element={<Calendar />} />
        <Route path="/booking"          element={<Booking />} />
        <Route path="/booking/:id"      element={<SinglePageBooking />} />
        <Route path="/booking-history"  element={<BookingHistory />} />
        <Route path="/edit-profile"     element={<EditProfile />} />
        {/* admin */}
        <Route path="/admin/index"      element={<AdminRoute>  <HomeAdmin/>       </AdminRoute>}/>
        <Route path="/importcourse"     element={<AdminRoute>   <ImportCourse/>    </AdminRoute>}/>
        <Route path="/importstudent"    element={<AdminRoute>   <ImportStudent/>   </AdminRoute>}/>
        <Route path="/data-management"  element={<AdminRoute>   <DataManagement/>  </AdminRoute>}/>
        <Route path="/booking-approval" element={<AdminRoute>   <BookingApproval/> </AdminRoute>}/>
        <Route path="/booking-approval/:id" element={<AdminRoute><SinglePageBookingApproval /></AdminRoute>}/>
    </Routes>
    </>
  );
}

export default App;
