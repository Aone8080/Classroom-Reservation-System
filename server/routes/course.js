const express = require("express");
const router = express.Router();

//controller
const {
  readAllCourse,
  readCourse,
  readCoursesByLecturer,
  updateCourse,
  deleteCourse,
  } = require("../controllers/course");
  
  
  
  // create course ทำงานใน importExcel.js
  router.get("/course", readAllCourse)
  router.get("/course/:id", readCourse) 
  router.post("/course/readCoursesByLecturer", readCoursesByLecturer)//ดึงข้อมูลคอร์สที่ lecturer สอนในปีและภาคเรียนที่ระบุ 
  router.put("/course/:id", updateCourse)
  router.delete("/course/:id", deleteCourse);
  module.exports = router;
  