const db = require("../db");

exports.findAvailableTimeSlots = async (req, res) => {
  try {
    const { course_id, lect_id, start_date, end_date } = req.body;

    //----------------------------------------------lect----------------------------------------------------------
    // สร้าง Object เพื่อเก็บข้อมูลวันว่างของอาจารย์
    const lectScheduleObject = {
      จันทร์: { AM: 0, PM: 0 },
      อังคาร: { AM: 0, PM: 0 },
      พุธ: { AM: 0, PM: 0 },
      พฤหัสบดี: { AM: 0, PM: 0 },
      ศุกร์: { AM: 0, PM: 0 },
    };

    // ดึงข้อมูลตารางสอนของอาจารย์จากฐานข้อมูล
    const teachScheduleQuery =
      "SELECT c.day, c.time FROM Teach t JOIN Course c ON t.course_id = c.course_id WHERE t.lect_id = ?";
    const [teachRows, _teachFields] = await db
      .promise()
      .query(teachScheduleQuery, [lect_id]);

    // นำข้อมูลตารางสอนมาใส่ใน Object ของอาจารย์
    for (const row of teachRows) {
      const { day, time } = row;
      if (time === "AM") {
        lectScheduleObject[day].AM = 1;
      } else if (time === "PM") {
        lectScheduleObject[day].PM = 1;
      }
    }

    const reservationQueryLecturer =
      "SELECT reservation_date, reservation_time FROM Reservation WHERE user_id = ? AND reservation_date BETWEEN ? AND ?";
    const [reservationRows, _reservationFields] = await db
      .promise()
      .query(reservationQueryLecturer, [lect_id, start_date, end_date]);

    for (const row of reservationRows) {
      const { reservation_date, reservation_time } = row;
      const day = getDayFromDate(reservation_date);
      if (day && lectScheduleObject[day]) {
        if (reservation_time === "AM") {
          lectScheduleObject[day].AM = 1;
        } else if (reservation_time === "PM") {
          lectScheduleObject[day].PM = 1;
        }
      }
    }
    //----------------------------------------------student----------------------------------------------------------

    // สร้าง Object เพื่อเก็บข้อมูลวันว่างของนักเรียน
    const student_schedule = {
      จันทร์: { AM: 0, PM: 0 },
      อังคาร: { AM: 0, PM: 0 },
      พุธ: { AM: 0, PM: 0 },
      พฤหัสบดี: { AM: 0, PM: 0 },
      ศุกร์: { AM: 0, PM: 0 },
    };

    // ดึงข้อมูลนักเรียนที่ลงทะเบียนในคอร์สนี้
    const regQuery = `
      SELECT std_code
      FROM std_reg_course
      WHERE course_id = ?`;
    const [regRows, _regFields] = await db
      .promise()
      .execute(regQuery, [course_id]);

    // วนลูปเพื่อหาข้อมูลวันว่างของนักเรียน
    for (const regRow of regRows) {
      const stdQuery = `
        SELECT c.day, c.time
        FROM course c
        WHERE c.course_id IN (SELECT course_id FROM std_reg_course WHERE std_code = ?)`;
      const [stdRows, _stdFields] = await db
        .promise()
        .execute(stdQuery, [regRow.std_code]);

      // นำข้อมูลวันว่างของนักเรียนมาใส่ใน Object
      for (const stdRow of stdRows) {
        const { day, time } = stdRow;
        if (time === "AM") {
          student_schedule[day].AM = 1;
        } else if (time === "PM") {
          student_schedule[day].PM = 1;
        }
      }
    }
    
   //ค้นหาทุกคอร์สที่นักศึกษาในคอร์สตัวนี้ลงทะเบียนเรียนเพิ่มเติมในตาราง Reservation
    const reservationQueryStudent = `
  SELECT reservation_date, reservation_time
  FROM Reservation r
  JOIN std_reg_course sr ON r.course_id = sr.course_id
  WHERE sr.std_code IN (
    SELECT std_code
    FROM std_reg_course
    WHERE course_id = ?
  ) AND reservation_date BETWEEN ? AND ?`;
    const [reservationRowsStudent, _reservationFieldsStudent] = await db
      .promise()
      .execute(reservationQueryStudent, [course_id, start_date, end_date]);

    // นำข้อมูลการจองมาใส่ใน Object ของนักเรียน
    for (const row of reservationRowsStudent) {
      const { reservation_date, reservation_time } = row;
      const day = getDayFromDate(reservation_date);
      if (day && student_schedule[day]) {
        if (reservation_time === "AM") {
          student_schedule[day].AM = 1;
        } else if (reservation_time === "PM") {
          student_schedule[day].PM = 1;
        }
      }
    }

    // ส่ง JSON กับข้อมูลว่างเวลาของอาจารย์และนักเรียนในคอร์สนี้ทุกคนกลับไปที่เว็บไซต์
    res.json({
      lecturer_schedule: lectScheduleObject,
      student_schedule: student_schedule,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({
        error: "An error occurred while fetching the available time slots.",
      });
  }
};

function getDayFromDate(date) {
  const dayNames = [
    "อาทิตย์",
    "จันทร์",
    "อังคาร",
    "พุธ",
    "พฤหัสบดี",
    "ศุกร์",
    "เสาร์",
  ];
  const jsDate = new Date(date);
  const dayIndex = jsDate.getDay(); // 0 = อาทิตย์, 1 = จันทร์, ...
  return dayNames[dayIndex];
}
