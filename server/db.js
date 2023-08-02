const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'classroom-reservation-system'
});

db.connect((err) => {
  if (err) {
    console.error('An error occurred while connecting to the DB');
    throw err;
  }
  console.log('Connected to SQL Successfully');
});

module.exports = db;


