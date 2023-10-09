import axios from "axios";


//---- readCoursesByLecturer //todo testgood
export const readCoursesByLecturer = async (authtoken, value) => { 
    return await axios.post(process.env.REACT_APP_API + "/course/readCoursesByLecturer", value, {
      headers: {
        authtoken,
      },
    });
  };







