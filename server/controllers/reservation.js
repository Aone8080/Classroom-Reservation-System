const db = require('../db');

exports.findAvailableTimeSlots = async (req, res) => {
    const { course_id,lect_id } = req.body;
  
    try {
      // 1. ดึงข้อมูล std_code ทั้งหมดที่ลงทะเบียนในคอร์ส course_id
      const regQuery = `
        SELECT std_code
        FROM std_reg_course
        WHERE course_id = ?`;
      const [regRows, regFields] = await db.promise().execute(regQuery, [course_id]);
  
      // 2. สร้าง object เพื่อเก็บข้อมูลวันว่างในรูปแบบ day/am/pm
      const scheduleObject = {
        "จันทร์": { am: 0, pm: 0 },
        "อังคาร": { am: 0, pm: 0 },
        "พุธ": { am: 0, pm: 0 },
        "พฤหัสบดี": { am: 0, pm: 0 },
        "ศุกร์": { am: 0, pm: 0 }
      };
  
      // 3. วน loop ใน std_code ทั้งหมดที่ลงทะเบียนในคอร์ส
      for (const regRow of regRows) {
        const stdQuery = `
          SELECT c.day, c.time_begin, c.time_end
          FROM course c
          WHERE c.course_id IN (SELECT course_id FROM std_reg_course WHERE std_code = ?)`;
        const [stdRows, stdFields] = await db.promise().execute(stdQuery, [regRow.std_code]);
  
        // 4. วน loop ในคอร์สที่นักศึกษาลงทะเบียนเพื่อตรวจสอบวันว่าง
        for (const stdRow of stdRows) {
          const day = stdRow.day;
          const amAvailable = stdRow.time_begin < '12:00' && stdRow.time_end <= '12:00';
          const pmAvailable = stdRow.time_begin >= '12:00' || stdRow.time_end > '12:00';
  
          if (amAvailable) {
            scheduleObject[day].am = 1;
          }
          if (pmAvailable) {
            scheduleObject[day].pm = 1;
          }
        }
      }
  
      // 5. แปลง object เป็น array และส่งข้อมูลกลับไปยังหน้าบ้าน
      const scheduleArray = Object.entries(scheduleObject).map(([day, schedule]) => ({
        day,
        am: schedule.am,
        pm: schedule.pm
      }));
  
      // 6. รับ const { lect_id } = req.body; (Code ด้านบน)
      const teachQuery = `
        SELECT course_id
        FROM teach
        WHERE lect_id = ?`;
      const [teachRows, teachFields] = await db.promise().execute(teachQuery, [lect_id]);
  
      // 7. สร้าง object เพื่อเก็บข้อมูลวันว่างของอาจารย์ในรูปแบบ day/am/pm
      const lectScheduleObject = {
        "จันทร์": { am: 0, pm: 0 },
        "อังคาร": { am: 0, pm: 0 },
        "พุธ": { am: 0, pm: 0 },
        "พฤหัสบดี": { am: 0, pm: 0 },
        "ศุกร์": { am: 0, pm: 0 }
      };
  
      // 8. วน loop ใน course_id ทั้งหมดที่อาจารย์สอน
      for (const teachRow of teachRows) {
        const courseQuery = `
          SELECT c.day, c.time_begin, c.time_end
          FROM course c
          WHERE c.course_id = ?`;
        const [courseRows, courseFields] = await db.promise().execute(courseQuery, [teachRow.course_id]);
  
        // 9. วน loop ใน course ที่อาจารย์สอนเพื่อตรวจสอบวันว่าง
        for (const courseRow of courseRows) {
          const day = courseRow.day;
          const amAvailable = courseRow.time_begin < '12:00' && courseRow.time_end <= '12:00';
          const pmAvailable = courseRow.time_begin >= '12:00' || courseRow.time_end > '12:00';
  
          if (amAvailable) {
            lectScheduleObject[day].am = 1;
          }
          if (pmAvailable) {
            lectScheduleObject[day].pm = 1;
          }
        }
      }
  
  
      // 10. แปลง object เป็น array และส่งข้อมูลกลับไปยังหน้าบ้าน
      const lectScheduleArray = Object.entries(lectScheduleObject).map(([day, schedule]) => ({
        day,
        am: schedule.am,
        pm: schedule.pm
      }));
  
      // 11. สร้าง object ใหม่เพื่อเก็บผลการเปรียบเทียบ studentSchedule กับ lecturerSchedule
      const comparisonResult = {};
      for (const day of Object.keys(scheduleObject)) {
        comparisonResult[day] = {
          am: scheduleObject[day].am === lectScheduleObject[day].am ? scheduleObject[day].am : 1,
          pm: scheduleObject[day].pm === lectScheduleObject[day].pm ? scheduleObject[day].pm : 1,
        };
      }
  
      // 12. แปลง object เป็น array และส่งข้อมูลกลับไปยังหน้าบ้าน
      const comparisonArray = Object.entries(comparisonResult).map(([day, schedule]) => ({
        day,
        am: schedule.am,
        pm: schedule.pm
      }));
  
      // 13. ส่งข้อมูลกลับไปยังหน้าบ้าน
      res.json({ studentSchedule: scheduleArray, lecturerSchedule: lectScheduleArray, comparisonSchedule: comparisonArray });
  
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching data' });
    }
  };
  
  
  
  
  
