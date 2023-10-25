import { useState,useEffect } from "react";
import { useSelector } from "react-redux";
import { FaPlus, FaTrash, FaRegEdit } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
//function
import {createCourse,readAllCourse,updateCourse,deleteCourse}from "../../functions/course"
//Ant เเจ้ง Alert
import { message } from 'antd';


const ManagementCourse = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [course_id, setCourse_id] = useState("");
  const [subj_code, setSubj_code] = useState("");
  const [subj_name, setSubj_name] = useState(""); 
  const [Years, setYears] = useState("");
  const [Term, setTerm] = useState("");
  const [day, setDay] = useState("");
  const [time_begin, setTime_begin] = useState(""); 
  const [time_end, setTime_end] = useState("");     
  const [lect_id, setLect_id] = useState("");       
  const [lect_name, setLect_name] = useState("");    
  const [room_id, setRoom_id] = useState("");
  const [std_code, setStdCode] = useState([]);      //ยังไม่ได้set ไปเพิ่มในหน้า StdinCourse
  const [std_name, setStdName] = useState([]);      //ยังไม่ได้set ไปเพิ่มในหน้า StdinCourse
  const [major_id,setMajor_id] = useState("2519");
  const [major_name, setMajor_name] = useState("วิศวะกรรมคอมพิวเตอร์");


//------------------------------------------cerate Course--------------------------------------------
//createModal
const [showModal, setShowModal] = useState(false);
const handleModalClose = () => setShowModal(false);
const handleModalShow = () => setShowModal(true);

 //set courseID = (Year + Term + subj_code)
 useEffect(() => {
  setCourse_id(Years + Term + subj_code);
}, [Years, Term, subj_code]);

const handleSubmit = async (e) => {
  e.preventDefault();
  const value ={
    subj_code,
    subj_name,
    course_id,
    room_id,
    Years,
    Term,
    day,
    time_begin,
    time_end,
    lect_id,
    lect_name,
    std_code,
    std_name,
    major_id,
    major_name
  };

  createCourse(user.token, value)
    .then((res) => {
      loadData(user.token);
      handleModalClose();
      //alert("create Course Success"); 
      message.success("create Course Success");
    })
    .catch((err) => {
      //console.log(err.response.data);
      message.error(err.response.data);
    });
};
//------------------------------------------readAllCourse and loadData---------------------------------
 const [data, setData] = useState([]);         
 const loadData = (authtoken) => { 
  readAllCourse(authtoken)
     .then((res) => {
       setData(res.data);   
     })
     .catch((err) => {
       console.log(err.response.data); 
     });
 };
 useEffect(() => {       
   loadData(user.token);  
 }, []);
//------------------------------------------updateCourse-------------------------------------------
  //editModal 
  const [editModal, setEditModal] = useState(false);
  const [values, setValues] = useState({
    course_id: "",
    subj_code: "",
    room_id: "",
    Years: "",
    Term: "",
    day: "",
    time: ""
  });
  const showEditModal = (Course) => {
    setValues({
      course_id: Course.course_id,
      subj_code: Course.subj_code,
      room_id: Course.room_id,
      Years: Course.Years,
      Term: Course.Term,
      day: Course.day,
      time: Course.time
    });
    setEditModal(true);
  };
  const handleEdit = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateCourse(user.token, values.course_id, values)
      .then((res) => {
        //alert("Update Course Success");
        message.success("Update Course Success");
        loadData(user.token);
        setEditModal(false);
      })
      .catch((err) => message.error(err.response.data));
      
  };
//------------------------------------------deleteCourse---------------------------------------------
  const handleRemove = (id) => {
    if (window.confirm("Are You Sure Delete!!")) { 
      deleteCourse(user.token, id)                   
        .then((res) => {                           
          loadData(user.token);
          message.success('Delete Course Success');               
        })
        .catch((err) => {
          //console.log(err.response);
          message.error(err.response.data);
        });
    }
  };

  return (
    <div className="container-main-noborder">
    <h3 className='big-title py-3'>จัดการข้อมูล</h3>
      <div className="d-flex justify-content-start align-items-center">
        <h3 className="title">ข้อมูลการลงทะเบียน</h3>
        <button className="btn-manage ms-2 mb-3" onClick={() => handleModalShow()}>
          <FaPlus /> เพิ่มข้อมูล
        </button>
      </div>

      <div className="py-2 " style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table className="table table-bordered shadow custom-table ">
          <thead>
            <tr>
              <th className="titleTh text-center" scope="col">รหัสวิชา</th>
              <th className="titleTh text-center" scope="col">ชื่อวิชา</th>
              <th className="titleTh text-center" scope="col">อาจารย์ประจำคอร์ส</th>
              <th className="titleTh text-center" scope="col">ห้อง</th>
              <th className="titleTh text-center" scope="col">ปีการศึกษา</th>
              <th className="titleTh text-center" scope="col">เทอม</th>
              <th className="titleTh text-center" scope="col">วัน</th>
              <th className="titleTh text-center" scope="col">เวลา</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item,index)=>(
            <tr key={index} >
              <td className="titleTd text-center">{item.subj_code}</td>
              <td className="titleTd text-center">{item.subj_name}</td>
              <td className="titleTd text-center">{item.lect_name}</td>
              <td className="titleTd text-center">{item.room_id}</td>
              <td className="titleTd text-center">{item.Years}</td>
              <td className="titleTd text-center">{item.Term}</td>
              <td className="titleTd text-center">{item.day}</td>
              <td className="titleTd text-center">{item.time}</td>
              <td className="titleTd text-center">
                <button className="btn-edit me-3" onClick={() => showEditModal(item)}>
                  <FaRegEdit /> เเก้ไข
                </button>
                <button className="btn-trash me-3" onClick={() => handleRemove(item.course_id)} >
                  <FaTrash /> ลบ
                </button>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* MODAL เพิ่มข้อมูล */}
      <Modal show={showModal} onHide={handleModalClose} className="custom-modal" >
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">
            <h3 className="titleModal">เพิ่มข้อมูลการลงทะเบียน</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="container-modal ">
            <form className="m-5">
              <div className="form-group mt-3">
                <h3>รหัสวิชา</h3>
                <input
                  className="form-control"
                  type="text"
                  name="subj_code"
                  onChange={(e) => setSubj_code(e.target.value)}
                />
              </div>

              <div className="form-group mt-3">
                <h3>ชื่อวิชา</h3>
                <input
                  className="form-control"
                  type="text"
                  name="subj_name"
                  onChange={(e) => setSubj_name(e.target.value)}
                />
              </div>

              <div className="form-group mt-3">
                <h3>ปีการศึกษา</h3>
                <input
                  className="form-control"
                  type="text"
                  name="Years"
                  onChange={(e) => setYears(e.target.value)}
                />
              </div>

              <div className="form-group mt-3">
                <h3>เทอมการศึกษา</h3>
                <select
                className="form-control "
                name="term"
                onChange={(e) => setTerm(e.target.value)} 
                >
                <option value="">เลือก...</option>
                <option value="1">เทอม 1</option>
                <option value="2">เทอม 2</option>
              </select>
              </div>

              <div className="form-group mt-3">
                <h3>วัน</h3> 
                <select
                className="form-control "
                name="day"
                onChange={(e) => setDay(e.target.value)} 
                >
                <option value="จันทร์">วันจันทร์</option>
                <option value="อังคาร">วันอังคาร</option>
                <option value="พุธ">วันพุธ</option>
                <option value="พฤหัสบดี">วันพฤหัสบดี</option>
                <option value="ศุกร์">วันศุกร์</option>
               </select>
              </div>
              <div className="form-group mt-3">
                <h3>เวลาเริ่มต้น:</h3>
                <input
                  className="form-control"
                  type="time"
                  name="time_begin"
                  onChange={(e) => setTime_begin(e.target.value)}
                />
              </div>
              <div className="form-group mt-3">
                <h3>เวลาสิ้นสุด:</h3>
                <input
                  className="form-control"
                  type="time"
                  name="time_end"
                  onChange={(e) => setTime_end(e.target.value)}
                />
              </div>
              <div className="form-group mt-3">
                <h3>รหัสอาจารย์ประจำคอร์ส</h3>
                <input
                  className="form-control"
                  type="text"
                  name="lect_id"
                  onChange={(e) => setLect_id(e.target.value)}
                />
              </div>
              <div className="form-group mt-3">
                <h3>ชื่ออาจารย์ประจำคอร์ส</h3>
                <input
                  className="form-control"
                  type="text"
                  name="lect_name"
                  onChange={(e) => setLect_name(e.target.value)}
                />
              </div>
              <div className="form-group mt-3">
                <h3>คณะ</h3>
                  <select
                  className="form-control "
                  name="major_name"
                  value={major_name}
                  >
                  <option value="major_name">วิศวะกรรมคอมพิวเตอร์</option>
                </select>
              </div> 
              <div className="form-group mt-3">
                <h3>ห้อง</h3>
                <input
                  className="form-control"
                  type="text"
                  name="room_id"
                  onChange={(e) => setRoom_id(e.target.value)}
                />
              </div> 
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center w-100">
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>Submit</Button>
        </Modal.Footer>
      </Modal>

    
      {/* MODAL เเก้ไขข้อมูล */}
  <Modal show={editModal} onHide={() => setEditModal(false)} className="custom-modal">
  <Modal.Header closeButton>
    <Modal.Title className="text-center w-100">
      <h3 className="titleModal">แก้ไขข้อมูลวิชา {values.course_id}</h3>
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="container-modal ">
      <form className="m-5" onSubmit={handleEditSubmit}>
        <div className="form-group mt-3">
          <h3>รหัสวิชา</h3>
          <input
            className="form-control"
            type="text"
            name="subj_code"
            value={values.subj_code}
            onChange={handleEdit}
          />
        </div>
        <div className="form-group mt-3">
          <h3>ห้อง</h3>
          <input
            className="form-control"
            type="text"
            name="room_id"
            value={values.room_id}
            onChange={handleEdit}
          />
        </div>
        <div className="form-group mt-3">
          <h3>ปีการศึกษา</h3>
          <input
            className="form-control"
            type="text"
            name="Years"
            value={values.Years}
            onChange={handleEdit}
          />
        </div>
        <div className="form-group mt-3">
          <h3>เทอม</h3>
          <select
            className="form-control "
            name="Term"
            value={values.Term}
            onChange={handleEdit} 
          >
            <option value="1">เทอม 1</option>
            <option value="2">เทอม 2</option>
          </select>

        </div>
        <div className="form-group mt-3">
          <h3>วัน</h3>
          <select
            className="form-control "
            name="day"
            value={values.day}
            onChange={handleEdit} 
          >
            <option value="จันทร์">วันจันทร์</option>
            <option value="อังคาร">วันอังคาร</option>
            <option value="พุธ">วันพุธ</option>
            <option value="พฤหัสบดี">วันพฤหัสบดี</option>
            <option value="ศุกร์">วันศุกร์</option>
          </select>

        </div>
        <div className="form-group mt-3">
          <h3>ช่วงเวลา</h3>
          <select
            className="form-control "
            name="time"
            value={values.time}
            onChange={handleEdit} 
          >
            <option value="AM">ช่วงเช้า</option>
            <option value="PM">ช่วงบ่าย</option>
          </select>
        </div>
      </form>
    </div>
  </Modal.Body>
  <Modal.Footer className="d-flex justify-content-center w-100">
    <Button variant="secondary" onClick={() => setEditModal(false)}>
      Close
    </Button>
    <Button variant="primary" type="submit" onClick={handleEditSubmit}>
      Submit
    </Button>
  </Modal.Footer>
</Modal>


    </div>
  );
};

export default ManagementCourse;
