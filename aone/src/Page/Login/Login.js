import { useState } from "react";
import './Login.css'
// functions
import { login } from "../../functions/auth";
// ⁡⁣⁡⁣⁣⁢redux⁡⁡
import { useDispatch } from "react-redux";
//React router
import { useNavigate } from "react-router-dom";
import { FaLock,FaUser  } from "react-icons/fa";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [value, setValue] = useState({
    username: "",
    password: "",
  });

  //check Role User for navigat 
  const roleBaseRedirect = (role) => {
    console.log(role);
    if (role === "admin") {
      navigate("/admin/index");
    } else {
      navigate("/user/index");
    }
  };

  const handleChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(value)
      .then((res) => {
        alert(res.data.payload.user.username + " Login Success");
        dispatch({
          type: "LOGIN",
          payload: {
            token: res.data.token,
            username: res.data.payload.user.username,
            lectID: res.data.payload.user.lectID,
            lectName: res.data.payload.user.lectName, 
            role: res.data.payload.user.role,
          },
        });
        //set token in localStorage
        localStorage.setItem("token", res.data.token);
        //check Roule User
        roleBaseRedirect(res.data.payload.user.role);
      })
      .catch((err) => {
        console.log(err.response.data);
        alert(err.response.data);
      });
  };

  return (
    <div className="container-main2">
      <h3 className="big-title-custom">เข้าสู่ระบบ</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group d-flex">
          <FaUser className="icon"/>
          <input
            placeholder="ชื่อผู้ใช้"
            className="form-control"
            type="text"
            name="username"
            onChange={handleChange}
          />
        </div>

        <div className="form-group d-flex mt-4">
          <FaLock className="icon"/>
          <input
            placeholder="รหัสผ่าน"
            className="form-control"
            type="password"
            name="password"
            onChange={handleChange}
          />
        </div>
        <div className="btn-container d-flex justify-content-center">
        <button className="btn-custom ">ลงชื่อเข้าใช้</button>
        </div>
        
      </form>
    </div>
  );
};

export default Login;
