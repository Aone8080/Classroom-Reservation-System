import axios from "axios";


//----importCourse 
export const importCourse = async (value) => { 
  return await axios.post(`${process.env.REACT_APP_API}/course`, value);
};

//----readAllCourse
export const readAllCourse = async () => {
  return await axios.get(`${process.env.REACT_APP_API}/course`);
}

//----readCourse
export const readCourse = async (id) => {
  return await axios.get(`${process.env.REACT_APP_API}/course/${id}`);
}


//----updateCourse
export const updateCourse = async (id,value) => {
  return await axios.put(`${process.env.REACT_APP_API}/course/${id}`, value);
}

//----deleteCourse
export const deleteCourse = async (id) => {
  return await axios.delete(`${process.env.REACT_APP_API}/course/${id}`);
}

