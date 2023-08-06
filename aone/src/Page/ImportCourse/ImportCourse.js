import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import "./ImportCourse.css";
import { Modal, Button } from "react-bootstrap";
//redux
import { useSelector } from "react-redux";
//function
import{importCourse} from "../../functions/importExcel"


const ImportCourse = () => {
  const { user } = useSelector((state) => ({ ...state }));
  //module
  const [showModal, setShowModal] = useState(false);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  //สาขายังไม่มี data ที่ยังไม่มี
  const [major_id,setMajor_id] = useState("2519");
  const [faculty, setFaculty] = useState("เทคโนโลยีอุตสาหกรรม");
  const [major_name, setMajor_name] = useState("วิศวะกรรมคอมพิวเตอร์");
  const [roomtype_id, setRoomtype_id] = useState("1"); //1 ห้องเรียนค่าเริ่มต้น
  const [capacity, setCapacity] = useState("60");      

  const [subj_code, setSubj_code] = useState("");
  const [subj_name, setSubj_name] = useState("");
  const [course_id, setCourse_id] = useState(""); //(Year + Term + subj_code) 
  const [room_id, setRoom_id] = useState("");
  const [Years, setYears] = useState("");
  const [Term, setTerm] = useState("");
  const [day, setDay] = useState("");
  const [time_begin, setTime_begin] = useState("");
  const [time_end, setTime_end] = useState("");
  const [lect_id, setLect_id] = useState("");
  const [lect_name, setLect_name] = useState("");
  const [std_code, setStdCode] = useState([]);
  const [std_name, setStdName] = useState([]); 


  
  const [building, setBuilding] = useState("");

   //set courseID = (Year + Term + subj_code)
   useEffect(() => {
    setCourse_id(Years + Term + subj_code);
  }, [Years, Term, subj_code]);

  const handleSubmit =(e)=>{
    e.preventDefault();
   const value ={
    subj_code,
    subj_name,
    course_id,
    room_id,
    roomtype_id,
    building,
    capacity,
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
    major_name,
  };
  importCourse(user.token, value) 
  .then((res)=>{
    console.log(res);
    alert("Import Course Success"); 
    handleModalClose();
  })
  .catch((error) => {
    console.log(error);
  });
  };

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        const binaryStr = reader.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // Parse Year and Term from the 3rd row
        const yearTermCell = worksheet["A3"];
        if (yearTermCell) {
          const yearTerm = yearTermCell.v;
          const match = yearTerm.match(
            /ภาคการศึกษาที่ : (\d+)\s+ปีการศึกษา : (\d+)/
          );
          if (match) {
            setTerm(match[1]);
            setYears(match[2]);
          }
        }

        // Parse lecturer ID and name from the 4th row
        const lectCell = worksheet["A4"];
        if (lectCell) {
          const lect = lectCell.v;
          const match = lect.match(/ชื่อ-สกุลอาจารย์ : (\d+) - (.+)/);
          if (match) {
            setLect_id(match[1]);
            setLect_name(match[2].trim());
          }
        }

        // Parse subject code and name from the 6th row
        const subjCell = worksheet["A6"];
        if (subjCell) {
          const subj = subjCell.v;
          const match = subj.match(/ชื่อวิชา : (\w+)\s+(.+) :/);
          if (match) {
            setSubj_code(match[1]);
            setSubj_name(match[2].trim());
          }
        }

        // Parse Day, time_begin, time_end, building, and room_id from the 8th row
        const scheduleCell = worksheet["A8"];
        if (scheduleCell) {
          const schedule = scheduleCell.v;
          const match = schedule.match(
            /วันเวลาเรียน : (\S+) (\S+)-(\S+)\s+ห้องเรียน : (\d+)\/(\d+)/
          );
          if (match) {
            setDay(match[1]);
            setTime_begin(match[2]);
            setTime_end(match[3]);
            setBuilding(match[4]);
            setRoom_id(match[5]);
          }
        }

        // Start reading from row 11
        const startRow = 11;
        let dataB = [];
        let dataC = [];
        let done = false;
        for (let i = startRow; !done; i++) {
          const cellB = worksheet["B" + i];
          const cellC = worksheet["C" + i];

          if (cellB === undefined && cellC === undefined) {
            done = true; // Stop if both B and C are undefined
          } else {
            dataB.push(cellB ? cellB.v : ""); // get cell Bi value or empty string if undefined
            dataC.push(cellC ? cellC.v : ""); // get cell Ci value or empty string if undefined
          }
        }
        // filter ช่องว่างใน array ออก
        const filteredDataB = dataB.filter((item) => item !== ""); 
        const filteredDataC = dataC.filter((item) => item !== "");

        setStdCode(filteredDataB);
        setStdName(filteredDataC);
      };
      reader.readAsBinaryString(file);
    });
    handleModalShow();  
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="h-container">
      <h1 className="big-title">Import ข้อมูลการลงทะเบียนเรียน</h1>
      <p>โปรดเลือก Excel File ที่ท่านต้องการ Import</p>
      <div className="importfile" {...getRootProps()}>
        <input {...getInputProps()} className="hidden-input" />
        <button className="btn1">เรียกดูไฟล์</button>
        <h2 className="decs">หรือลากมาใส่ในกล่องนี้</h2>
      </div>

      <Modal
        show={showModal}
        onHide={handleModalClose}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">
            <h3 className="titleModal">Import ข้อมูลการลงทะเบียนเรียน</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3 className="titleModal2">
            ปีการศึกษา : {Years} ภาคการศึกษาที่ : {Term}
          </h3>
          <div class="container text-center">
            <div class="row">
              <div class="col text-start">
                <h3 className="title">รหัสวิชา</h3>
                <h3 className="dec">{subj_code}</h3>
                <h3 className="title">รหัสอาจารย์</h3>
                <h3 className="dec">{lect_id}</h3>
                <h3 className="title">วันเวลาเรียน</h3>
                <h3 className="dec">
                  {day} {time_begin}-{time_end}
                </h3>
              </div>
              <div class="col text-start">
                <h3 className="title">ชื่อวิชา</h3>
                <h3 className="dec">{subj_name}</h3>
                <h3 className="title">ชื่อ-นามสกุลอาจารย์</h3>
                <h3 className="dec">{lect_name}</h3>
                <h3 className="title">ห้องเรียน</h3>
                <h3 className="dec">
                  {building}/{room_id}
                </h3>
              </div>
            </div>

            <table className="table table-bordered shadow custom-table">
              <thead>
                <tr>
                  <th scope="col">
                    <h3 className="titleTh">ที่</h3>
                  </th>
                  <th scope="col">
                    <h3 className="titleTh">รหัสนักศึกษา</h3>
                  </th>
                  <th scope="col">
                    <h3 className="titleTh">ชื่อ-สกุลนักศึกษา</h3>
                  </th>
                </tr>
              </thead>
              <tbody>
                {std_code.map((code, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{code}</td>
                    <td>{std_name[index]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center w-100">
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ImportCourse;
