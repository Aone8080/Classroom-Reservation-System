const express = require('express');
const router = express.Router();

const {
    importAllStudent,
    importCourse
} = require('../controllers/importExcel');



//import Excel All new students
router.post('/importstudent', importAllStudent); 
//import Excel Course
router.post('/importcourse', importCourse);


module.exports = router;