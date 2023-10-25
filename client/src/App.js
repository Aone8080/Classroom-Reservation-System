import { Routes, Route } from "react-router-dom";
// Layout
import MyNavbar from "./Component/Navbar/MyNavbar";

// functions
import { currentUser } from "./functions/auth";
//Page
import Home from "./Page/Home/Home"
import HomeUser from "./Page/HomeUser/HomeUser";
import Login from "./Page/Login/Login";
import MyCalendar from "./Page/MyCalendar/MyCalendar";
import Booking from "./Page/Booking/Booking";
import SinglePageBooking from "./Page/SinglePageBooking/SinglePageBooking";
import BookingHistory from "./Page/BookingHistory/BookingHistory";
import EditProfile from "./Page/EditProfile/EditProfile";
import HomeAdmin from "./Page/HomeAdmin/HomeAdmin";
import ImportCourse from "./Page/ImportCourse/ImportCourse";
import ImportStudent from "./Page/ImportStudent/ImportStudent";
import BookingApproval from "./Page/BookingApproval/BookingApproval";
import ManagementRoomType from './Component/Management/ManagementRoomType'
import ManagementRoom from './Component/Management/ManagementRoom'
import ManagementSubject from './Component/Management/ManagementSubject'
import ManagementLecturer from './Component/Management/ManagementLecturer'
import ManagementStudent from './Component/Management/ManagementStudent'
import ManagementCourse from './Component/Management/ManagementCourse'
import ManagementStdInCourse from './Component/Management/ManagementStdInCourse'
import ManagementYearsTerm from './Component/Management/ManagementYearsTerm'
import ManagementUser from './Component/Management/ManagementUser'

//Protect Routes
import UserRoute from "./Protect_Rout/UserRoute"; 
import AdminRoute from "./Protect_Rout/AdminRoute";
// redux
import { useDispatch} from "react-redux";


function App() {
  const dispatch = useDispatch();
  const idtoken = localStorage.token;     //get Token from LocalStorage 
  if (idtoken) {                          //if have Token
    currentUser(idtoken)                  //Is function send Token to decoded  before check Token
      .then((res) => {                    // get res.data (Is Data of User  passed decoded or verify) 
        dispatch({  
          type: "LOGIN",
          payload: {
            token: idtoken,              //set idtoken in REDUX
            username: res.data.user_id, //set res.data in REDUX
            userName: res.data.user_name,
            role: res.data.role,        
          },
        })
      })
      .catch((err) => {   
        console.log(err);
      });

  }

  return (
    <>
      <MyNavbar />
      <Routes>
        {/* user */}
        <Route path="/"                           element={<Home/>} />
        <Route path="/login"                      element={<Login />} />
        <Route path="/calendar"                   element={<MyCalendar />} />
        <Route path="/edit-profile"               element={<EditProfile />} />
        <Route path="/user/index"                 element={<UserRoute>  <HomeUser />              </UserRoute>}/>
        <Route path="/booking"                    element={<UserRoute>  <Booking />               </UserRoute>}/>
        <Route path="/booking/:id"                element={<UserRoute>  <SinglePageBooking />     </UserRoute>}/>
        <Route path="/booking-history"            element={<UserRoute>  <BookingHistory />        </UserRoute>}/>

        {/* admin */}
        <Route path="/admin/index"                element={<AdminRoute>  <HomeAdmin/>             </AdminRoute>}/>
        <Route path="/importcourse"               element={<AdminRoute>  <ImportCourse/>          </AdminRoute>}/>
        <Route path="/importstudent"              element={<AdminRoute>  <ImportStudent/>         </AdminRoute>}/>
        <Route path="/booking-approval"           element={<AdminRoute>  <BookingApproval/>       </AdminRoute>}/>
        <Route path="/data-managementroom"        element={<AdminRoute>  <ManagementRoom/>        </AdminRoute>}/>
        <Route path="/data-managementroomtype"    element={<AdminRoute>  <ManagementRoomType/>    </AdminRoute>}/>
        <Route path="/data-managementcourse"      element={<AdminRoute>  <ManagementCourse/>      </AdminRoute>}/>
        <Route path="/data-managementlecturer"    element={<AdminRoute>  <ManagementLecturer/>    </AdminRoute>}/>
        <Route path="/data-managementstdincourse" element={<AdminRoute>  <ManagementStdInCourse/> </AdminRoute>}/>
        <Route path="/data-managementstudent"     element={<AdminRoute>  <ManagementStudent/>     </AdminRoute>}/>
        <Route path="/data-managementsubject"     element={<AdminRoute>  <ManagementSubject/>     </AdminRoute>}/>
        <Route path="/data-managementyearsterm"   element={<AdminRoute>  <ManagementYearsTerm/>   </AdminRoute>}/>
        <Route path="/data-managementuser"        element={<AdminRoute>  <ManagementUser/>        </AdminRoute>}/>

    </Routes>
    </>
  );
}

export default App;
