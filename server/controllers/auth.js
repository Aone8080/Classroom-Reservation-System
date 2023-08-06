const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

//----register
exports.register = async (req, res) => {
    const { username, lect_id, password, role = 'user' } = req.body;
  
    db.query('SELECT * FROM users WHERE user_id = ?', [username], async (error, results) => {
      if (error) {
        return res.status(500).json({ error });
      }
  

      if (results.length > 0) {
        return res.status(400).send('User Already exists');
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
  
        db.query('INSERT INTO Users SET ?', {user_id: username, lect_id, password: hashedPassword, role: role}, (error, results) => {
          if (error) {
            return res.status(500).json({ error });
          }
          res.send('Register Success');
        });
      }
    });
  };


exports.login = async (req, res) => {
  const { username, password } = req.body;

  // คิวรีแรกสำหรับการรับข้อมูลจากตาราง users
  db.query('SELECT * FROM users WHERE user_id = ?', [username], async (error, results) => {
    if (error) {
      return res.status(500).json({ error });
    }

    if (results.length === 0) {
      return res.status(400).send('User Not found!!!');
    } else {
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).send('Password Invalid!!');
      } else {

        // คิวรีที่สองสำหรับการรับ lect_name จากตาราง lecturer โดยใช้ lect_id จากผลลัพธ์ของคิวรีแรก
        db.query('SELECT lect_name FROM lecturer WHERE lect_id = ?', [user.lect_id], (errorLecturer, resultsLecturer) => {
          if (errorLecturer) {
            return res.status(500).json({ errorLecturer });
          }

          const lectName = resultsLecturer.length > 0 ? resultsLecturer[0].lect_name : null;

          const payload = {
            user: {
              username: user.user_id,
              lectID: user.lect_id,
              lectName: lectName, 
              role: user.role,
            },
          };

          jwt.sign(payload, 'jwtSecret', { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token, payload });
          });
        });
      }
    }
  });
};


//---- currentUser
exports.currentUser = async (req, res) => {
  try {

    const username = req.user.username; //req.user เป็นuserที่ผ่านการ decoded หรือ verify เเล้ว เอามาจาก middlewere เป็นตัวเเปลที่สร้างไว้

    // We prepare the SQL statement
    const sql = "SELECT * FROM users WHERE user_id = ?";

    // We execute the SQL statement
    db.query(sql, [username], (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error });
      }

      // We select the first (and should be only) user from the results
      const user = results[0];

      // We remove the password from the user object before sending it
      delete user.password;

      // We send the user object
      res.json(user);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error!");
  }
};
