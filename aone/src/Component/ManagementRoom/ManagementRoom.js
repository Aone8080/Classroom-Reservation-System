import { useState } from "react";
import { FaPlus, FaTrash, FaRegEdit } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";

const ManagementRoom = () => {
  //module
  const [showModal, setShowModal] = useState(false);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  const [building, setBuilding] = useState("");
  const [room_id, setRoom_id] = useState("");
  const [roomtype_id, setRoomtype_id] = useState("");
  const [capacity, setCapacity] = useState("");

  const handleSubmit = async (e) => {
    // e.preventDefault();
  };

  return (
    <div className="con">
      <div className="d-flex justify-content-start align-items-center">
        <h3 className="title">ข้อมูลห้องเรียน</h3>
        <button className="btn-manage ms-2" onClick={() => handleModalShow()}>
          <FaPlus /> เพิ่มข้อมูล
        </button>
      </div>

      <div className="py-2">
        <table className="table table-bordered shadow custom-table">
          <thead>
            <tr>
              <th className="text-center" scope="col">
                <h3 className="titleTh">อาคาร</h3>
              </th>
              <th className="text-center" scope="col">
                <h3 className="titleTh">ห้อง</h3>
              </th>
              <th className="text-center" scope="col">
                <h3 className="titleTh">ความจุ</h3>
              </th>
              <th className="text-center" scope="col">
                <h3 className="titleTh">ชนิดห้อง</h3>
              </th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="text-center" scope="row">
                47
              </th>
              <td className="text-center">4733</td>
              <td className="text-center">60</td>
              <td className="text-center">ห้องเรียน</td>
              <td className="text-center">
                <button className="btn-edit me-3">
                  <FaRegEdit /> เเก้ไข
                </button>
                <button className="btn-trash">
                  <FaTrash /> ลบ
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={handleModalClose} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title className="text-center w-100">
            <h3 className="titleModal">เพิ่มข้อมูลห้องเรียน</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="container ">
            <form className="m-5" onSubmit={handleSubmit}>
              <div className="form-group ">
                <h3>อาคาร</h3>
                <input
                  className="form-control"
                  type="text"
                  name="building"
                  onChange={(e) => setBuilding(e.target.value)}
                />
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

              <div className="form-group mt-3">
                <h3>ความจุ</h3>
                <input
                  className="form-control"
                  type="text"
                  name="capacity"
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </div>

              <div className="form-group mt-3">
                <h3>ชนิดห้อง</h3>
                <select className="form-control" onChange={(e) => setRoomtype_id(e.target.value)}>
                  <option value="">เลือก...</option>
                  <option value="1">ห้องเรียน</option>
                  <option value="2">ห้องประชุม</option>
                  <option value="3">ห้องหุ่นยน</option>
                </select>
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center w-100">
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary">Submit</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManagementRoom;
