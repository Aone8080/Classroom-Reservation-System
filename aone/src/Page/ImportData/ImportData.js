import React, { useState, useCallback,useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import * as XLSX from 'xlsx'
import "./ImportData.css"

const ImportData = () => {

  const [courseID, setCourseID] = useState(""); //(Year + Term + subj_code)
  const [subj_code, setSubj_code] = useState("");
  const [subj_Name, setSubj_Name] = useState("");
  const [building, setBuilding] = useState("");
  const [roomID, setRoomID] = useState("");
  const [Year, setYear] = useState("");
  const [Term, setTerm] = useState("");
  const [Day, setDay] = useState("");
  const [time_begin, setTime_begin]= useState("");
  const [time_end, setTime_end]= useState("");
  const [lectID, setLectID]= useState("");
  const [lectName, setLectName]= useState("");
  const [std_code, setStdCode] = useState([]);
  const [std_name, setStdName] = useState([]);

  //set courseID = (Year + Term + subj_code)
  useEffect(() => {
    setCourseID(Year + Term + subj_code);
  }, [Year, Term, subj_code]);

  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        const binaryStr = reader.result;
        const workbook = XLSX.read(binaryStr, {type:'binary'});
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // Parse Year and Term from the 3rd row
        const yearTermCell = worksheet['A3'];
        if (yearTermCell) {
          const yearTerm = yearTermCell.v;
          const match = yearTerm.match(/ภาคการศึกษาที่ : (\d+)\s+ปีการศึกษา : (\d+)/);
          if (match) {
            setTerm(match[1]);
            setYear(match[2]);
          }
        }

        // Parse lecturer ID and name from the 4th row
        const lectCell = worksheet['A4'];
        if (lectCell) {
          const lect = lectCell.v;
          const match = lect.match(/ชื่อ-สกุลอาจารย์ : (\d+) - (.+)/);
          if (match) {
            setLectID(match[1]);
            setLectName(match[2].trim());
          }
        }

        // Parse subject code and name from the 6th row
        const subjCell = worksheet['A6'];
        if (subjCell) {
          const subj = subjCell.v;
          const match = subj.match(/ชื่อวิชา : (\w+)\s+(.+) :/);
          if (match) {
            setSubj_code(match[1]);
            setSubj_Name(match[2].trim());
          }
        }

        // Parse Day, time_begin, time_end, building, and roomID from the 8th row
        const scheduleCell = worksheet['A8'];
        if (scheduleCell) {
          const schedule = scheduleCell.v;
          const match = schedule.match(/วันเวลาเรียน : (\S+) (\S+)-(\S+)\s+ห้องเรียน : (\d+)\/(\d+)/);
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
        for(let i=startRow; !done; i++) {
          const cellB = worksheet['B' + i];
          const cellC = worksheet['C' + i];

          if(cellB === undefined && cellC === undefined) {
            done = true; // Stop if both B and C are undefined
          } else {
            dataB.push(cellB ? cellB.v : ""); // get cell Bi value or empty string if undefined
            dataC.push(cellC ? cellC.v : ""); // get cell Ci value or empty string if undefined
          }
        }

        setStdCode(dataB);
        setStdName(dataC);
      };
      reader.readAsBinaryString(file);
    });
  }, [])

  const { getRootProps, getInputProps } = useDropzone({onDrop})

  return (
    <div className='container'>
        <h1>Import ข้อมูลการลงทะเบียนเรียน</h1>
        <p>โปรดเลือก Excel File ที่ท่านต้องการ Import</p>
        <div className="importfile" {...getRootProps()}>
           <input {...getInputProps()} className="hidden-input" />
           <button className='btn1' >เรียกดูไฟล์</button>   
           <h2>หรือลากมาใส่ในกล่องนี้</h2>
        </div>
        <h2>รหัสวิชา</h2>
        <h3>{subj_code}</h3>
        <h2>ชื่อวิชา</h2>
        <h3>{subj_Name}</h3>
        <h2>รหัสนักศึกษา</h2>
        {std_code.map((item, index) => (
          <h3 key={index}>{item}</h3>
        ))}
        <h2>ชื่อนักศึกษา</h2>
        {std_name.map((item, index) => (
          <h3 key={index}>{item}</h3>
        ))}
        <h2>ภาคการศึกษาที่</h2>
        <h3>{Term}</h3>
        <h2>ปีการศึกษา</h2>
        <h3>{Year}</h3>
        <h2>วันเวลาเรียน</h2>
        <h3>{Day} {time_begin}-{time_end}</h3>
        <h2>ห้องเรียน</h2>
        <h3>{building}/{roomID}</h3>
        <h2>รหัสอาจารย์</h2>
        <h3>{lectID}</h3>
        <h2>ชื่ออาจารย์</h2>
        <h3>{lectName}</h3>
        <h2>คอร์สID</h2>
        <h3>{courseID}</h3>
        
        
    </div>
  )
}

export default ImportData
