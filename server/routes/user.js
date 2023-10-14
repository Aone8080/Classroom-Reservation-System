const express = require('express');
const router = express.Router();

const {
  readAllUser,
  readUser,
  updateUser,
  deleteUser,
} = require('../controllers/user');

router.get('/user', readAllUser);
router.get('/user/:id', readUser);
router.put('/user', updateUser);
router.delete('/user/:id', deleteUser);

module.exports = router;
