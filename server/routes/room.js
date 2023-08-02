const express = require("express");
const router = express.Router();

//controller
const {
  createRoom,
  readAllRoom,
  readRoom,
  updateRoom,
  deleteRoom,
  createRoomType,
  readAllRoomType,
  readRoomType,
  updateRoomType,
  deleteRoomType,
  } = require("../controllers/room");
  
  
 //room
  router.post("/room", createRoom)
  router.get("/room", readAllRoom)
  router.get("/room/:id", readRoom)
  router.put("/room/:id", updateRoom)
  router.delete("/room/:id", deleteRoom)
  
  //room type
  router.post("/roomtype", createRoomType)
  router.get("/roomtype", readAllRoomType)
  router.get("/roomtype/:id", readRoomType)
  router.put("/roomtype/:id", updateRoomType)
  router.delete("/roomtype/:id", deleteRoomType)

  module.exports = router;