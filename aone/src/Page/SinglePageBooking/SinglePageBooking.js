import React, { useState,useEffect } from "react";
import "./SinglePageBooking.css";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// Function
import { findDayTime, reservation} from "../../functions/reservation";

const SinglePageBooking = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const params = useParams();
  const navigate = useNavigate();
  const ID = params.id;
  //console.log(ID);

  //  const [start_date, setStart_date] = useState(new Date().toISOString().split("T")[0]);
  //  const [end_date, setEnd_date] = useState("");
  //todo test day
  const [data, setData] = useState([]);
  const [start_date, setStart_date] = useState("2023-09-25")
  const [end_date, setEnd_date] = useState("2023-09-29")
  const [roomtype_id, setRoomtype_id] = useState("1");
  const [capacity, setCapacity] = useState("");
  const [year, setYear] = useState("2566");
  const [term, setTerm] = useState("1");
  const [Tran_dt, setTran_dt] = useState(new Date().toISOString().split("T")[0]);
  const [status_code, setStatus_code] = useState("A"); //ACTIVE
  

 //-----------------ค้นหาห้อง --------------------
  const handleSubmit = (e) => {
     e.preventDefault();
     const value = {
      ID,
      lect_id: user.username,
      start_date,
      end_date,
      roomtype_id,
      year,
      term
    };
     findDayTime(user.token, value)
      .then((res) => {
        setData(res.data);
        //console.log(res);
      })
      .catch((err) => console.log(err.response.data));
  };


 //-----------------จองห้อง --------------------
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
      ช่วงเวลาตั้งแต่วันที่ <span className="editspan">{start_date}</span> ถึง{" "}
      <span className="editspan">{end_date}</span> มีห้องว่างดังนี้
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
      <td className="text-center">{item.date}</td>
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
