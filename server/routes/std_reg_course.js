const express = require('express');
const router = express.Router();

// controller
const {
    createStdRegCourse,
    readAllStdRegCourse,
    readStdRegCourse,
    deleteStdRegCourse
} = require('../controllers/std_reg_course');

router.post("/std_reg_course", createStdRegCourse);
router.get("/std_reg_course", readAllStdRegCourse);
router.get("/std_reg_course/:std_code/:course_id", readStdRegCourse);
router.delete("/std_reg_course/:std_code/:course_id", deleteStdRegCourse);

module.exports = router;
