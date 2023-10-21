import React, { useState,useEffect } from "react";
import "./SinglePageBooking.css";
import { useParams, useNavigate,useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from 'moment';
import 'moment/locale/th';
// Function
import { findDayTime, reservation} from "../../functions/reservation";

const SinglePageBooking = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const params = useParams();
  const navigate = useNavigate();
  const ID = params.id;
  //console.log(ID);

  // รับ State years,term มาจากหน้า Booking 
  const location = useLocation();  
  const { years, term, date_BeginYearsTerm, date_EndYearsTerm } = location.state;
   
   //todo test day
  const [data, setData] = useState([]);
  const [start_date, setStart_date] = useState("");
  const [end_date, setEnd_date] = useState("");
  const [roomtype_id, setRoomtype_id] = useState("");
  const [capacity, setCapacity] = useState("");
  const [Tran_dt, setTran_dt] = useState(new Date().toISOString().split("T")[0]); //เอาเวลาปัจจุบันที่ทำการจอง
  const [status_code, setStatus_code] = useState("A"); //ACTIVE
  

 //1--------------------------------------------------ค้นหาห้อง ---------------------------------------
  const handleSubmit = (e) => {
     e.preventDefault();
      // ให้ตรวจสอบเงื่อนไขที่ start_date และ end_date ไม่น้อยกว่า date_BeginYearsTerm และไม่มากกว่า date_EndYearsTerm
      if (moment(start_date).isBefore(date_BeginYearsTerm) || moment(start_date).isAfter(date_EndYearsTerm)) {
        alert("วันที่เริ่มต้นต้องอยู่ในช่วงปีการศึกษาที่ถูกต้อง");
        return;
      }
      // ตรวจสอบว่า end_date ไม่น้อยกว่า date_BeginYearsTerm และไม่มากกว่า date_EndYearsTerm
      if (moment(end_date).isBefore(date_BeginYearsTerm) || moment(end_date).isAfter(date_EndYearsTerm)) {
        alert("วันที่สิ้นสุดต้องอยู่ในช่วงปีการศึกษาที่ถูกต้อง");
        return;
      }
     const value = {
      ID,
      lect_id: user.username,
      start_date,
      end_date,
      roomtype_id,
      years,
      term
    };
     findDayTime(user.token, value)
      .then((res) => {
        setData(res.data);
        //console.log(res);
      })
      .catch((err) => console.log(err.response.data));
  };


 //2-----------------------------------------------------------จองห้อง -------------------------------------------------------------
 const handleSubmitReservation = (room_id, reservation_date, time) => {
  let reservation_time;
  const timestamp = new Date().getTime();
  const reservation_id = timestamp+ID;
  const course_id = ID;

  // ตรวจสอบค่า time เพื่อกำหนด reservation_time
  if (time === "ช่วงเช้า") {
    reservation_time = "AM";
  } else if (time === "ช่วงบ่าย") {
    reservation_time = "PM";
  } 
  const value = {
    reservation_id, 
    lect_id: user.username,
    course_id,
    room_id,
    status_code,
    Tran_dt,
    start_date,
    end_date,
    reservation_date,
    reservation_time, 
  };
  reservation(user.token, value)
    .then((res) => {
      alert("Reservation Success");
      window.location.reload();
    })
    .catch((err) => console.log(err.response.data));
};


  return (
    <>
      <h1 className="big-title">จองห้องเรียน</h1>
      <div className="container-main-custom">
            <form className="m-3" onSubmit={handleSubmit}>
                
                <h3 className="title text-center mb-5">1. เลือกช่วงสัปดาห์ที่จะทำการจองห้องเรียน</h3>
                    <div className="d-flex justify-content-center ">
                      <div className="date-input">
                        <label className="me-2 dec" htmlFor="start_date">
                          วันเริ่มต้น:
                        </label>
                        <input
                          type="date"
                          id="start_date"
                          name="start_date"
                          value={start_date}
                          onChange={(e) => setStart_date(e.target.value)}
                        />
                      </div>
                      <div className="date-input ms-5">
                        <label className="me-2 dec" htmlFor="end_date">
                          วันสิ้นสุด:
                        </label>
                        <input
                          type="date"
                          id="end_date"
                          name="end_date"
                          value={end_date}
                          onChange={(e) => setEnd_date(e.target.value)}
                        />
                      </div>
                    </div>
                    

                <h3 className="title text-center mt-5 mb-3">2. เลือกชนิดห้องเรียน</h3>
                      <div className=" d-flex justify-content-center">
                      <div className="form-group mt-3">
                        <label htmlFor="roomtype_id"  className="dec">ชนิดห้อง: </label>
                        <select
                          className="ms-2"
                          name="roomtype_id"
                          value={roomtype_id}
                          onChange={(e) => setRoomtype_id(e.target.value)}
                        >
                          <option value="">เลือก...</option>
                          <option value="1">ห้องเรียน</option>
                          <option value="2">ห้องประชุม</option>
                          <option value="3">ห้องหุ่นยน</option>
                        </select>
                      </div>
                      <div className="form-group mt-3">
                      <label htmlFor="capacity"  className="dec ms-5">ความจุ:</label>
                        <select
                         className="ms-2"
                          name="capacity"
                          value={capacity}
                          onChange={(e) => setCapacity(e.target.value)}
                        >
                          <option value="">เลือก...</option>
                          <option value="1">60 คน</option>
                          <option value="2">100 คน</option>
                          <option value="3">120 คน</option>
                        </select>
                      </div>
                      </div>
                <div className="btn-container d-flex justify-content-center mt-3 mb-5">
                  <button className="btn-custom ">ค้นหา</button>
                </div>
            </form>





           {data && data.allResult && (
              <div className="schedule-container mb-5">
                <h3 className="title text-center mt-5 mb-3">3. ตารางสอนที่สามารถจองได้</h3>
                <h3 className="dec text-center mt-5 mb-2">
                  ช่วงเวลาตั้งแต่วันที่ <span className="editspan">{moment(start_date).locale('th').format('LL')}</span> ถึง{" "}
                  <span className="editspan">{moment(end_date).locale('th').format('LL')} </span> มีห้องว่างดังนี้
                </h3>
                <table className="table table-bordered shadow custom-table">
                  <thead>
                    <tr>
                      <th className="text-center" scope="col">
                        <h3 className="titleTh">ห้อง</h3>
                      </th>
                      <th className="text-center" scope="col">
                        <h3 className="titleTh">วันที่</h3>
                      </th>
                      <th className="text-center" scope="col">
                        <h3 className="titleTh">ช่วงเวลา</h3>
                      </th>
                      <th className="text-center" scope="col">
                        <h3 className="titleTh">เลือก</h3>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
              {data.allResult.map((item, index) => (
                <tr key={index}>
                  <td className="text-center">{item.room_id}</td>
                  <td className="text-center">{moment(item.date).locale('th').format('LL')}</td>
                  <td className="text-center">{item.time}</td>
                  <td className="text-center">
                    <button
                      className="btn-manage2 me-3"
                      onClick={() => handleSubmitReservation(item.room_id, item.date, item.time)}
                    >
                      จองห้อง
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
                </table>
              </div>
            )}

      </div>
    </>
  );
};
export default SinglePageBooking;
