import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { readAllreservation } from "../../functions/reservation";
import { Modal, Button } from "react-bootstrap";
import {PDFDownloadLink } from '@react-pdf/renderer';//print(PDFDownloadLink)
import ReservationformPDF from '../../Component/ReservationformPDF/ReservationformPDF'
import moment from 'moment/min/moment-with-locales';

const BookingApproval = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [faculty, setFaculty] = useState("เทคโนโลยีอุตสาหกรรม");
  const [major_name, setMajor_name] = useState("วิศวะกรรมคอมพิวเตอร์");
  //module
  const [showModal, setShowModal] = useState(false);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);
  //-------- 1: featch data
  const [data, setData] = useState([]);         
  const loadData = (authtoken) => { 
    readAllreservation(authtoken)
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

  //-------- 2: เอา item ไปsetใน modal
  const [selectedItem, setSelectedItem] = useState(null);
  const handleSubmit = (item) => {
    setSelectedItem(item);
     handleModalShow();
     console.log(item);  
  };
  //ปลิ้นเอกสาร
  const handleSubmitCreatePDF =()=>{
    
  }
  

  return (
    <>
    <div className="container-main-noborder">
      <div className="d-flex justify-content-start align-items-center">
        <h3 className="title">รายการจองห้อง</h3>
      </div>

      <div className="py-2">
        <table className="table table-bordered shadow custom-table">
          <thead>
            <tr>
            <th className="text-center" scope="col">
                <h3 className="titleTh">ห้อง</h3>
              </th>
              <th className="text-center" scope="col">
                <h3 className="titleTh">ชื่อวิชา</h3>
              </th>
              <th className="text-center" scope="col">
                <h3 className="titleTh">รหัสวิชา</h3>
              </th>
              
              <th className="text-center" scope="col">
                <h3 className="titleTh">ชื่อผู้จอง</h3>
              </th>
              <th className="text-center" scope="col">
                <h3 className="titleTh">จองห้องวันที่</h3>
              </th>
              <th className="text-center" scope="col">
                <h3 className="titleTh">ช่วงเวลา</h3>
              </th>
              <th className="text-center" scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="text-center">{item.room_id}</td>
                <td className="text-center">{item.subj_name}</td>
                <td className="text-center">{item.subj_code}</td>
                <td className="text-center">{item.user_name}</td>
                <td className="text-center">{moment(item.reservation_date).locale('th').format('LL')}</td>
                <td className="text-center">{item.reservation_time === "AM" ? "08:00 - 12:00" : "12:00 - 18:00"}</td>
                <td className="text-center">
                  <button
                    className="btn-manage2 me-3"
                    onClick={() => handleSubmit(item)}
                  >
                    ตรวจสอบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

       {/* Modal */}
      <Modal show={showModal} onHide={handleModalClose} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">
            <h3 className="titleModal">รายละเอียดของการจอง</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="container text-center">
            <div class="row">
              <div class="col text-start">
                <h3 className="title">ห้อง</h3>
                <h3 className="dec mb-5">{selectedItem ? selectedItem.room_id : ''}</h3>
                <h3 className="title">สาขาวิชา</h3>
                <h3 className="dec mb-5">{major_name}</h3>
                <h3 className="title">คณะ</h3>
                <h3 className="dec mb-5">{faculty}</h3>
                <h3 className="title">มีความประสงค์ใช้ห้องเพื่อ</h3>
                <h3 className="dec mb-5">ทำการเรียนการสอน</h3>
                <h3 className="title">จองห้องวันที่</h3>
                <h3 className="dec mb-5">{moment(selectedItem ? selectedItem.reservation_date : '').locale('th').format('LL')}</h3>
              </div>
              <div class="col text-start">
                <h3 className="title">ผู้จอง</h3>
                <h3 className="dec mb-5">อาจาร</h3>
                <h3 className="title">ชื่อผู้จอง</h3>
                <h3 className="dec mb-5">{selectedItem ? selectedItem.user_name : ''}</h3>
                <h3 className="title">เบอร์โทรศัพที่ติดต่อได้</h3>
                <h3 className="dec mb-5">....</h3>
                <h3 className="title">จำนวนผู้ใช้ห้อง</h3>
                <h3 className="dec mb-5">{selectedItem ? selectedItem.capacity : ''}</h3>
                <h3 className="title">ช่วงเวลา</h3>
                <h3 className="dec mb-5">{selectedItem ? (selectedItem.reservation_time === "AM" ? "08:00 - 12:00" : "12:00 - 18:00") : '' }</h3>
              </div>
            </div>        
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center w-100">
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
           {/*Print PDF */}
          <PDFDownloadLink 
                  document={<ReservationformPDF selectedItem={selectedItem} faculty={faculty} major_name={major_name} />} // ส่งข้อมูล selectedItem เข้าไปใน PDF
                  fileName="reservation-formtest2.pdf"
                  className="btn btn-primary m-1"  >
                  พิมพ์ใบจองห้อง
            </PDFDownloadLink>
        </Modal.Footer>
      </Modal>

        
         <div className="row">
          <div className="col">
            
          </div>
         </div>


    </div>
    </>
  )
}

export default BookingApproval