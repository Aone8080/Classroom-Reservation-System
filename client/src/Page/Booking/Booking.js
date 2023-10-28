import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
// Function
import {  readYearsTermFromday } from "../../functions/years_term";
import { readCoursesByLecturer } from "../../functions/course";
import "./Booking.css"

const Booking = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const navigate = useNavigate();
  //เอา yyyy-MM-dd ปัจจุบัน
  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0]; // แปลงให้อยู่ในรูปแบบ "yyyy-MM-dd"
  const [Today, setToday] = useState(todayFormatted);
  
  const [years, setYears] = useState("");
  const [term, setTerm] = useState("");
  const [date_BeginYearsTerm, setDate_BeginYearsTerm] = useState("");
  const [date_EndYearsTerm, setDate_EndYearsTerm] = useState("");

  const [data, setData] = useState([]);
  
    
// 1---featch ข้อมูลหาว่าเวลาตอนนี้ตรงกับเทอมไหน
useEffect(() => {
  if (user && user.token) {
    readYearsTermFromday(user.token,Today)
      .then((res) => {
        if (res.data.length > 0) {
          const { Years, Term, date_begin, date_end } = res.data[0]; // นำข้อมูลจาก res.data
          setYears(Years.toString()); // แปลงเป็นข้อความ (string) และกำหนดให้ years
          setTerm(Term.toString());
          setDate_BeginYearsTerm(date_begin.toString());
          setDate_EndYearsTerm(date_end.toString()); 
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}, [user,Today]);

//2 ---featch ข้อมูล วิชาที่อาจารย์มีสอนในเทอมนี้
  useEffect(() => {
    if (user && user.token && years && term) {             
      const value = {
        lect_id: user.username,
        years,
        term,
      };
      readCoursesByLecturer(user.token, value)
        .then((res) => {
          setData(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user,years,term]);


  const handleSubmit = (id) => {
    navigate(`/booking/${id}`, { state: { years, term, date_BeginYearsTerm, date_EndYearsTerm } }); 
    //ส่ง state years, term ไปหน้า SinglePageBooking  
  };

  return (
    <>
    <h1 className="big-title text-center">จองห้องเรียน</h1>
    <div className="container-main">
      <div className="d-flex justify-content-start align-items-center">
        <h3 className="title-custom mt-5 mb-3">
          วิชาที่มีสอนปีการศึกษา : <span className="editspan"> {years} </span>ภาคการศึกษาที่ : <span className="editspan">{term}</span>
        </h3>
      </div>

      <div className="py-2">
        <table className="table table-bordered shadow custom-table">
          <thead>
            <tr>
              <th className="titleTh text-center" scope="col">รหัสวิชา</th>
              <th className="titleTh text-center" scope="col">ชื่อวิชา</th>
              <th className="titleTh text-center" scope="col">ห้องเรียน</th>
              <th className="titleTh text-center" scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="titleTd text-center">{item.subj_code}</td>
                <td className="titleTd text-center">{item.subj_name}</td>
                <td className="titleTd text-center">{item.room_id}</td>
                <td className="titleTd text-center">
                  <button
                    className="btn-manage2  "
                    onClick={() => handleSubmit(item.course_id)}
                  >
                    จองห้องเรียนเพิ่มเติม
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
    
  );
  
};

export default Booking;
