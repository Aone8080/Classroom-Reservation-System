import { useState,useEffect } from "react";
import { useSelector } from "react-redux";
import { FaPlus, FaTrash, FaRegEdit } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
//function
import {createStudent,readAllStudent,updateStudent,deleteStudent}from "../../functions/student"
import { readAllMajor}from "../../functions/major"

const ManagementStudent = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [std_code, setStd_code] = useState("");
  const [major_id, setMajor_id] = useState("");
  const [std_name, setStd_name] = useState("");


//fetch major มาเป็น value ใน input 
const [SelectMajor_id, setSelectMajor_id] = useState([]);
useEffect(() => {
  readAllMajor()
    .then((res) => {
      setSelectMajor_id(res.data);
    })
    .catch((err) => {
      console.log(err.response.data);
    });
}, []);




//------------------------------------------cerate Student--------------------------------------------
//createModal
const [showModal, setShowModal] = useState(false);
const handleModalClose = () => setShowModal(false);
const handleModalShow = () => setShowModal(true);

const handleSubmit = async (e) => {
  e.preventDefault();
  const newPost = {
    std_code,
    major_id,
    std_name,
  };
  createStudent(user.token, newPost)
    .then((res) => {
      console.log(res.data);
      loadData(user.token);
      handleModalClose();
      alert("create Student Success"); 
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};
//------------------------------------------readAllStudent and loadData---------------------------------

const [data, setData] = useState([]);         
 const loadData = (authtoken) => { 
  readAllStudent(authtoken)
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

 
//------------------------------------------updateStudent-------------------------------------------
  
//editModal 
  const [editModal, setEditModal] = useState(false);
  const [values, setValues] = useState({
    std_code: "",
    major_id: "",
    std_name: "",
  });
  const showEditModal = (student) => {
    setValues({
      std_code: student.std_code,
      major_id: student.major_id,
      std_name: student.std_name,
    });
    setEditModal(true);
  };
  const handleEdit = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateStudent(user.token, values.std_code, values)
      .then((res) => {
        alert("Update Student Success");
        loadData(user.token);
        setEditModal(false);
      })
      .catch((err) => console.log(err.response.data));
  };
//------------------------------------------deleteStudent---------------------------------------------
  const handleRemove = (id) => {
    if (window.confirm("Are You Sure Delete!!")) { 
      deleteStudent(user.token, id)                   
        .then((res) => {                           
          console.log(res);
          loadData(user.token);               
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  };

  return (
    <div className="con">
      <div className="d-flex justify-content-start align-items-center">
          <h3 className="title">ข้อมูลนักศึกษา</h3>
          <button className="btn-manage ms-2" onClick={() => handleModalShow()}>
            <FaPlus /> เพิ่มข้อมูล
          </button>
      </div>
      
      <div className="py-2">
        <table className="table table-bordered shadow custom-table">
          <thead>
            <tr>
              <th className="text-center" scope="col">
                <h3 className="titleTh">รหัสประจำตัว</h3>
              </th>
              <th className="text-center" scope="col">
                <h3 className="titleTh">ชื่อ-นามสกุล</h3>
              </th>
              <th className="text-center" scope="col">
                <h3 className="titleTh">สาขา</h3>
              </th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item,index)=>(
            <tr key={index}>
              <td className="text-center">{item.std_code}</td>
              <td className="text-center">{item.std_name}</td>
              <td className="text-center">{item.major_name}</td>
              <td className="text-center">
                <button className="btn-edit me-3" onClick={() => showEditModal(item)}>
                  <FaRegEdit /> เเก้ไข
                </button>
                <button className="btn-trash" onClick={() => handleRemove(item.std_code)} >
                  <FaTrash /> ลบ
                </button>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* MODAL เพิ่มข้อมูล */}
      <Modal show={showModal} onHide={handleModalClose} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">
            <h3 className="titleModal">เพิ่มข้อมูลวิชา</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="container ">
            <form className="m-5">
              <div className="form-group mt-3">
                <h3>รหัสประจำตัว</h3>
                <input
                  className="form-control"
                  type="text"
                  name="std_code"
                  onChange={(e) => setStd_code(e.target.value)}
                />
              </div>

              <div className="form-group mt-3">
                <h3>ชื่อ-นามสกุล</h3>
                <input
                  className="form-control"
                  type="text"
                  name="std_name"
                  onChange={(e) => setStd_name(e.target.value)}
                />
              </div>

              <div className="form-group mt-3">
                <h3>สาขา</h3>
                 <select
                  className="form-control"
                  name="major_id"
                  onChange={(e) => setMajor_id(e.target.value)} 
                >
                  <option value="">เลือก...</option>
                  {SelectMajor_id.map((item, index) => (
                    <option key={index} value={item.major_id}>
                      {item.major_name}
                    </option>
                  ))}
                </select>
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
      <h3 className="titleModal">แก้ไขข้อมูลวิชา {values.std_code}</h3>
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="container">
      <form className="m-5" onSubmit={handleEditSubmit}>
        <div className="form-group">
          <h3>รหัสประจำตัว</h3>
          <input
            className="form-control"
            type="text"
            name="std_code"
            value={values.std_code}
            onChange={handleEdit}
          />
        </div>
        <div className="form-group mt-3">
          <h3>ชื่อ-นามสกุล</h3>
          <input
            className="form-control"
            type="text"
            name="std_name"
            value={values.std_name}
            onChange={handleEdit}
          />
        </div>
        <div className="form-group mt-3">
          <h3>สาขา</h3>
          <select
            className="form-control"
            name="major_id"
            onChange={handleEdit} 
            >
            <option value="">เลือก...</option>
            {SelectMajor_id.map((item, index) => (
              <option key={index} value={item.major_id}>
                {item.major_name}
              </option>
            ))}
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

export default ManagementStudent;
