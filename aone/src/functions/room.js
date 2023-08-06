import axios from "axios";


//----CREATE Room  //todo testgood
export const createRoom = async (authtoken, value) => { 
    return await axios.post(process.env.REACT_APP_API + "/room", value, {
      headers: {
        authtoken,
      },
    });
  };

//----readAllRooms       //todo testgood
export const readAllRooms = async (authtoken) => {
    return await axios.get(process.env.REACT_APP_API + "/room", {
      headers: {
        authtoken, 
      },
    });
  };

//----readRoom 
export const readRoom = async (authtoken,id) => {
  return await axios.get(`${process.env.REACT_APP_API}/room/${id}`,{
    headers: {
        authtoken, 
      },
  });
};


//----updateRoom   //todo testgood
export const updateRoom= async (authtoken, id, values) => {
    return await axios.put(`${process.env.REACT_APP_API}/room/${id}`,values, {
      headers: {
        authtoken
      }
    });
  };


//----deleteRoom    //todo testgood
export const deleteRoom = async (authtoken, id) => { //get Token and id
    return await axios.delete(`${process.env.REACT_APP_API}/room/${id}`, {
      headers: {
        authtoken,
      },
    });
  };
