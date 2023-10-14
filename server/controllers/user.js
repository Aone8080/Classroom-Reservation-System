const db = require('../db');
const bcrypt = require("bcryptjs");



//---Read All Users
exports.readAllUser = async (req, res) => {
    const sql = 'SELECT * FROM Users';
    db.query(sql, (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json(results);
    });
};

//---Read User
exports.readUser = async (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM Users WHERE user_id = ?';
    db.query(sql, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json(results);
    });
};

//----Update User
exports.updateUser = async (req, res) => {
  const { user_id, password, user_name, role } = req.body;

  try {
      const saltRounds = 10; // จำนวนรอบในการเข้ารหัส
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const sql = 'UPDATE Users SET password = ?, user_name = ?, role = ? WHERE user_id = ?';
      db.query(sql, [hashedPassword, user_name, role, user_id], (error, results) => {
          if (error) {
              return res.status(500).json({ error });
          }
          res.status(200).json({ message: "User has been updated successfully." });
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
  }
};


//----Delete User
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Users WHERE user_id = ?';
    db.query(sql, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.status(200).json({ message: "User has been deleted successfully." });
    });
};
