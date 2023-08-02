import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import "./ImportCourse.css";
// functions
import { importCourse } from "../../functions/importCourse";
//react-bootstrap
import { Modal, Button } from "react-bootstrap";

const ImportCourse = () => {
  const [showModal, setShowModal] = useState(false);

  const [courseID, setCourseID] = useState(""); //(Year + Term + subj_code)
  const [subj_code, setSubj_code] = useState("");
  const [subj_Name, setSubj_Name] = useState("");
  const [building, setBuilding] = useState("");
  const [roomID, setRoomID] = useState("");
  const [Year, setYear] = useState("");
  const [Term, setTerm] = useState("");
  const [Day, setDay] = useState("");
  const [time_begin, setTime_begin] = useState("");
  const [time_end, setTime_end] = useState("");
  const [lectID, setLectID] = useState("");
  const [lectName, setLectName] = useState("");
  const [std_code, setStdCode] = useState([]);
  const [std_name, setStdName] = useState([]);

  //สาขายังไม่มี
  const [major_id, setMajor_id] = useState("2519"); //
  const [major_name, setMajor_name] = useState("วิศวะกรรมคอมพิวเตอร์");

  //set courseID = (Year + Term + subj_code)
  useEffect(() => {
    setCourseID(Year + Term + subj_code);
  }, [Year, Term, subj_code]);

  const handleSubmit = () => {
    const value = {
      courseID,
      subj_code,
      subj_Name,
      building,
      roomID,
      Year,
      Term,
      Day,
      time_begin,
      time_end,
      lectID,
      lectName,
      std_code,
      std_name,
      major_id,
      major_name,
    };

    importCourse(value)
      .then((res) => {
        console.log(res.data);
        alert("Import Success");
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

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
            setYear(match[2]);
          }
        }

        // Parse lecturer ID and name from the 4th row
        const lectCell = worksheet["A4"];
        if (lectCell) {
          const lect = lectCell.v;
          const match = lect.match(/ชื่อ-สกุลอาจารย์ : (\d+) - (.+)/);
          if (match) {
            setLectID(match[1]);
            setLectName(match[2].trim());
          }
        }

        // Parse subject code and name from the 6th row
        const subjCell = worksheet["A6"];
        if (subjCell) {
          const subj = subjCell.v;
          const match = subj.match(/ชื่อวิชา : (\w+)\s+(.+) :/);
          if (match) {
            setSubj_code(match[1]);
            setSubj_Name(match[2].trim());
          }
        }

        // Parse Day, time_begin, time_end, building, and roomID from the 8th row
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
            setRoomID(match[5]);
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
            ปีการศึกษา : {Year} ภาคการศึกษาที่ : {Term}
          </h3>
          <div class="container text-center">
            <div class="row">
              <div class="col text-start">
                <h3 className="title">รหัสวิชา</h3>
                <h3 className="dec">{subj_code}</h3>
                <h3 className="title">รหัสอาจารย์</h3>
                <h3 className="dec">{lectID}</h3>
                <h3 className="title">วันเวลาเรียน</h3>
                <h3 className="dec">
                  {Day} {time_begin}-{time_end}
                </h3>
              </div>
              <div class="col text-start">
                <h3 className="title">ชื่อวิชา</h3>
                <h3 className="dec">{subj_Name}</h3>
                <h3 className="title">ชื่อ-นามสกุลอาจารย์</h3>
                <h3 className="dec">{lectName}</h3>
                <h3 className="title">ห้องเรียน</h3>
                <h3 className="dec">
                  {building}/{roomID}
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
