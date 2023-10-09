import axios from "axios";


//---- findDayTime (หาวันเวลาที่ว่างตรงกัน)
export const findDayTime = async (authtoken, value) => { 
    return await axios.post(process.env.REACT_APP_API + "/reservation/findDayTime", value, {
      headers: {
        authtoken,
      },
    });
  };



  //---- reservation (จองห้อง)
export const reservation = async (authtoken, value) => { 
  return await axios.post(process.env.REACT_APP_API + "/reservation", value, {
    headers: {
      authtoken,
    },
  });
};


  //---- readAllreservation (อ่านประวัติการจองห้องทั้งหมด)
  export const readAllreservation = async (authtoken) => { 
    return await axios.get(`${process.env.REACT_APP_API}/reservation`, {
      headers: {
        authtoken,
      },
    });
  };



  //---- readreservationByid (อ่านประวัติการจองจาก user_id)
  export const readreservationByid = async (authtoken, ID) => { 
    return await axios.get(`${process.env.REACT_APP_API}/reservation/byuserid/${ID}`, {
      headers: {
        authtoken,
      },
    });
  };

    //---- readreservationByid (อ่านประวัติการจองจาก room_id)
    export const readreservationByRoomid = async (authtoken, ID) => { 
      return await axios.get(`${process.env.REACT_APP_API}/reservation/byroomid/${ID}`, {
        headers: {
          authtoken,
        },
      });
    };
  
  
  //----deleteReservation   
export const deleteReservation = async (authtoken, id) => { 
  return await axios.delete(`${process.env.REACT_APP_API}/reservation/${id}`, {
    headers: {
      authtoken,
    },
  });
};