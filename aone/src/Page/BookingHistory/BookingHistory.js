import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { readreservationByid,deleteReservation } from "../../functions/reservation";
import moment from 'moment/min/moment-with-locales';

const BookingHistory = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [data, setData] = useState([]);

  
  useEffect(() => {
    if (user && user.token) {             // เช็คว่า user ถูกโหลดเสร็จแล้ว
      const ID = user.username
      readreservationByid(user.token, ID)
        .then((res) => {
          setData(res.data); 
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user]);
  

      const handleDelete =(id)=>{
        deleteReservation(user.token, id)
          .then((res) => { 
            alert("delete Reservation Success");
            window.location.reload();
          })
          .catch((error) => {
            console.log(error);
          });
      }

  return (
    <>
    <h1 className="big-title">ประวัติการจองห้องเรียน</h1>
    <div className="container-main">
      <div className="d-flex justify-content-start align-items-center">
        <h3 className="title">รายการจองห้องของฉัน</h3>
      </div>
      <div className="py-2">
        <table className="table table-bordered shadow custom-table">
          <thead>
            <tr>
              <th className="text-center" scope="col">
                <h3 className="titleTh">ห้องเรียน</h3>
              </th>
              <th className="text-center" scope="col">
                <h3 className="titleTh">ชื่อวิชา</h3>
              </th>
              <th className="text-center" scope="col">
                <h3 className="titleTh">รหัสวิชา</h3>
              </th>
              <th className="text-center" scope="col">
                <h3 className="titleTh">ทำการจองห้องวันที่</h3>
              </th>
              <th className="text-center" scope="col">
                <h3 className="titleTh">เวลา</h3>
              </th>
              <th className="text-center" scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr>
                <td className="text-center">{item.room_id}</td>
                <td className="text-center">{item.subj_name}</td>
                <td className="text-center">{item.subj_code}</td>
                <td className="text-center">{moment(item.reservation_date).locale('th').format('LL')}</td>
                <td className="text-center">{item.reservation_time === "AM" ? "08:00 - 12:00" : "12:00 - 18:00"}</td>
                <td className="text-center">
                  <button
                    className="btn-trash me-3"
                    onClick={() => handleDelete(item.reservation_id)}
                  >
                    ยกเลิกการจอง
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  )
}

export default BookingHistory