import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './MyCalendar.css';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // needed for dayClick
import { readreservationByRoomid } from '../../functions/reservation';
import { readAllRoomsType, readAllroomByRoomtype } from '../../functions/room'; // เรียกใช้งานฟังก์ชัน fetchRoomsByRoomType

const MyCalendar = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [events, setEvents] = useState([]);

  const [roomtype_id, setRoomtype_id] = useState([]);// 1 fetch dataมาลง roomtype_id
  const [rooms, setRooms] = useState([]);            // 2 fetch dataมาลง room
  const [room_id, setRoom_id] = useState("");        // 3 เลือกห้องนำมาเเสดงใน calendar
  

  // 1 fetch dataมาลง roomtype_id
  useEffect(() => {
    readAllRoomsType()
      .then((res) => {
        setRoomtype_id(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, []);
  


  // 2 fetch dataมาลง room
  const handleRoomTypeChange = (e) => {
    const id = e.target.value;  
    readAllroomByRoomtype(id) 
      .then((res) => {
        setRooms(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };
  
  

  

  useEffect(() => {
    if (user && user.token && room_id) {
      readreservationByRoomid(user.token, room_id)
        .then((res) => {
          const convertedEvents = res.data.map((reservation) => {
            return {
              title: reservation.user_name + ' ' + reservation.reservation_time,
              start: reservation.reservation_date,
              allDay: true,
              color: reservation.reservation_time === 'AM' ? '#3F9BF0' : '#FF6F00',
            };
          });
          setEvents(convertedEvents);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [user,room_id]);
  

  return (
    <>
      <h1 className="big-title-custome text-center">ปฏิทินการใช้ห้อง</h1>
      <div className='container-main-noborder'>
      <h3 className="title ms-3">ค้นหาห้อง</h3>
      
      <div className="container-main mb-5">
            <div className="d-flex justify-content-around">
              <div className="m-3">
                <label htmlFor="roomtype_id" className="dec">
                  ชนิดห้อง:
                </label>
                <select
                  className="ms-2"
                  name="roomtype_id"
                  onChange={handleRoomTypeChange} // เรียกใช้งาน handleRoomTypeChange เมื่อมีการเลือกชนิดห้องใหม่
                >
                  <option value="">เลือก...</option>
                  {roomtype_id.map((item, index) => (
                    <option key={index} value={item.roomtype_id}>
                      {item.roomtype_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="m-3">
                <label htmlFor="room_id" className="dec ">
                  ห้อง:
                </label>
                <select
                  className="ms-2"
                  name="room_id"
                  onChange={(e) => setRoom_id(e.target.value)}
                >
                  <option value="">เลือก...</option>
                  {rooms.map((room, index) => (
                    <option key={index} value={room.room_id}>
                      {room.room_id}
                    </option>
                  ))}
                </select>
              </div>
            </div>
      </div>
      <h3 className="title ms-3 mb-2">ห้อง <span className="editspan"> {room_id}</span></h3>
      <div className="container-main mb-5">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              events={events}
            />
          </div>
      </div>
    </>
  );
};

export default MyCalendar;