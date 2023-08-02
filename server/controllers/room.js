const db = require('../db');

  
//----createRoom
exports.createRoom = async (req, res) => {
  const { room_id, roomtype_id, capacity, building } = req.body;
  const sql = "INSERT INTO room (room_id, roomtype_id, capacity, building) VALUES (?, ?, ?, ?)";
  db.query(sql, [room_id, roomtype_id, capacity, building], (error, results) => {
      if (error) {
          return res.status(500).json({ error });
      }
      res.status(200).json({ message: "Room has been created successfully." });
  });
};


//----readAllRoom
exports.readAllRoom = async (req, res) => {
  const sql = "SELECT * FROM room";
  db.query(sql, (error, results) => {
      if (error) {
          return res.status(500).json({ error });
      }
      res.status(200).json(results);
  });
};


//----readRoom
exports.readRoom = async (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM room WHERE room_id = ?";
  db.query(sql, id, (error, results) => {
      if (error) {
          return res.status(500).json({ error });
      }
      if (results.length === 0) {
          return res.status(404).json({ message: "No room found with this ID." });
      }
      res.status(200).json(results[0]);
  });
};


//----deleteRoom
exports.deleteRoom = async (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM room WHERE room_id = ?";
  db.query(sql, id, (error, results) => {
      if (error) {
          return res.status(500).json({ error });
      }
      res.status(200).json({ message: "Room has been deleted successfully." });
  });
};


//----updateRoom
exports.updateRoom = async (req, res) => {
  const { id } = req.params;
  const { roomtype_id, capacity, building } = req.body;
  const sql = "UPDATE room SET roomtype_id = ?, capacity = ?, building = ? WHERE room_id = ?";
  db.query(sql, [roomtype_id, capacity, building, id], (error, results) => {
      if (error) {
          return res.status(500).json({ error });
      }
      res.status(200).json({ message: "Room has been updated successfully." });
  });
};

//---------------------room type--------------------


//----createRoomType
exports.createRoomType = async (req, res) => {
  const { roomtype_id, roomtype_name } = req.body;
  const sql = "INSERT INTO roomtype (roomtype_id, roomtype_name) VALUES (?, ?)";
  db.query(sql, [roomtype_id, roomtype_name], (error, results) => {
      if (error) {
          return res.status(500).json({ error });
      }
      res.status(200).json({ message: "Room type has been created successfully." });
  });
};

//----readAllRoomType
exports.readAllRoomType = async (req, res) => {
  const sql = "SELECT * FROM roomtype";
  db.query(sql, (error, results) => {
      if (error) {
          return res.status(500).json({ error });
      }
      res.status(200).json(results);
  });
};

//----readRoomType
exports.readRoomType = async (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM roomtype WHERE roomtype_id = ?";
  db.query(sql, id, (error, results) => {
      if (error) {
          return res.status(500).json({ error });
      }
      if (results.length === 0) {
          return res.status(404).json({ message: "No room type found with this ID." });
      }
      res.status(200).json(results[0]);
  });
};

//----updateRoomType
exports.updateRoomType = async (req, res) => {
  const { id } = req.params;
  const { roomtype_name } = req.body;
  const sql = "UPDATE roomtype SET roomtype_name = ? WHERE roomtype_id = ?";
  db.query(sql, [roomtype_name, id], (error, results) => {
      if (error) {
          return res.status(500).json({ error });
      }
      res.status(200).json({ message: "Room type has been updated successfully." });
  });
};

//----deleteRoomType
exports.deleteRoomType = async (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM roomtype WHERE roomtype_id = ?";
  db.query(sql, id, (error, results) => {
      if (error) {
          return res.status(500).json({ error });
      }
      res.status(200).json({ message: "Room type has been deleted successfully." });
  });
};





 