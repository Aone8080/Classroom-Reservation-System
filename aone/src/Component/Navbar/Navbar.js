import React from "react";
import "./Navbar.css";
import { Link, useNavigate ,useLocation} from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { FaChevronDown,FaLock  } from "react-icons/fa";
import { BiLogIn } from "react-icons/bi";
const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => ({ ...state }));
  
  const logout = () => {
    dispatch({
        type: "LOGOUT",
        payload: null,
    });
    // Use setTimeout to delay the redirection.
    setTimeout(() => {
        navigate("/");
    }, 0);
};

  return (
    <div className="navbar w-100 d-flex justify-content-between shadow">

    <div className="navbar-left ms-5">
      {user ? (
        <Link to={user.role === "admin" ? "/admin/index" : "/user/index"} className={location.pathname === "/admin/index" || location.pathname === "/user/index" ? "active" : ""}>
          <AiFillHome className="icons"/>หน้าหลัก
        </Link>
      ) : (
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          <AiFillHome className="icons"/>หน้าหลัก
        </Link>
      )}
    </div>
    
    <div className="navbar-right">
      {user && user.role === "admin" ? (
        <>
          <Link to="/importcourse" className={location.pathname === "/importcourse" ? "active" : ""}>Import คอร์สเรียน</Link>
          <Link to="/importstudent" className={location.pathname === "/importstudent" ? "active" : ""}>Import นักเรียน</Link>
          <Link to="/data-management" className={location.pathname === "/data-management" ? "active" : ""}>จัดการข้อมูล</Link>
          <Link to="/booking-approval" className={location.pathname === "/booking-approval" ? "active" : ""}>ตรวจสอบคำร้องขอจองห้องเรียน</Link>
          <div className="dropdown">
            <Link>  Admin <FaChevronDown/></Link>
            <div className="dropdown-content">
              <div className="itemDD">
                <Link to="/edit-profile" >
                  แก้ไขข้อมูลส่วนตัว
                </Link>
              </div>
              <div className="itemDD">
                <Link onClick={logout}>
                  <BiLogIn/> ออกจากระบบ
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : user && user.role === "user" ? (
        <>
          <Link to="/calendar" className={location.pathname === "/calendar" ? "active" : ""}>ปฎิทินการใช้ห้อง</Link>
          <Link to="/booking" className={location.pathname === "/booking" ? "active" : ""}>จองห้องเรียน</Link>
          <Link to="/booking-history" className={location.pathname === "/booking-history" ? "active" : ""}>ประวัติการจองห้องเรียน</Link>
          <div className="dropdown">
            <Link>อาจารย์ {user.lectName} <FaChevronDown/></Link>
            <div className="dropdown-content">
              <div className="itemDD">
                <Link to="/edit-profile" >
                  แก้ไขข้อมูลส่วนตัว
                </Link>
              </div>
              <div className="itemDD">
                <Link onClick={logout}>
                  <BiLogIn/> ออกจากระบบ
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>
            <FaLock/> ลงชื่อเข้าใช้
          </Link>
        </> 
      )}
    </div>
  </div> 
  );
};

export default Navbar;
