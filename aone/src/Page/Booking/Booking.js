import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
// Function
import { readCoursesByLecturer } from "../../functions/course";

const Booking = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const navigate = useNavigate();
  const [years, setYears] = useState("");
  const [term, setTerm] = useState("1");
  const [data, setData] = useState([]);
  
  // สร้างฟังก์ชันเพื่อแปลงปีคริสต์ศักราชเป็นปีพุทธศักราช
  useEffect(() => {
    const getBuddhistYear = () => {
      const christianYear = new Date().getFullYear();
      const buddhistYear = christianYear + 543;
      return buddhistYear.toString();      // แปลงเป็นข้อความ (string) สำหรับแสดงผล
    };
    const buddhistYear = getBuddhistYear(); // เรียกใช้งานและเซ็ตปีพุทธศักราชใน state
    setYears(buddhistYear);
  }, []);

//---featch ข้อมูล วิชาที่อาจารย์มีสอน
  useEffect(() => {
    if (user && user.token) {             
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
  }, [user, years, term]);

  const handleSubmit = (id) => {
     //console.log(id);
     navigate(`/booking/${id}`);
  };

  return (
    <>
    <h1 className="big-title text-center">จองห้องเรียน</h1>
    <div className="container-main">
      <div className="d-flex justify-content-start align-items-center">
        <h3 className="title">
          วิชาที่มีสอนปีการศึกษา : <span className="editspan"> {years}</span>ภาคการศึกษาที่ : <span className="editspan">{term}</span>
        </h3>
      </div>

      <div className="py-2">
        <table className="table table-bordered shadow custom-table">
          <thead>
            <tr>
              <th className="text-center" scope="col">
                <h3 className="titleTh">รหัสวิชา</h3>
              </th>
              <th className="text-center" scope="col">
                <h3 className="titleTh">ชื่อวิชา</h3>
              </th>
              <th className="text-center" scope="col">
                <h3 className="titleTh">ห้องเรียน</h3>
              </th>
              <th className="text-center" scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr>
                <td className="text-center">{item.subj_code}</td>
                <td className="text-center">{item.subj_name}</td>
                <td className="text-center">{item.room_id}</td>
                <td className="text-center">
                  <button
                    className="btn-manage2 me-3"
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
