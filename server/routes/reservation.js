const express = require('express');
const router = express.Router();

const {findAvailableTimeSlots} = require('../controllers/reservation');

// middleware 
const { authCheck,adminCheck } = require("../middleware/auth");


//router.post('/reservation',authCheck, adminCheck, findAvailableTimeSlots);
router.post('/reservation', findAvailableTimeSlots);  


module.exports = router;