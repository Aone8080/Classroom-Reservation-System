exports.findAvailableTimeSlots = async (req, res) => {
    const { lect_id, course_id } = req.body;
  
    // สร้าง array 2 มิติ สำหรับวันจันทร์ - ศุกร์ (0-4), AM (0) และ PM (1)
    let availability = Array(5).fill(null).map(() => [0, 0]);
  
    try {
      // ดึงข้อมูลตารางสอนของอาจารย์และนักศึกษา
      const query = `
        SELECT c.day, c.time_begin, c.time_end
        FROM teach t
        JOIN course c ON t.course_id = c.course_id
        JOIN std_reg_course s ON s.course_id = c.course_id
        WHERE t.lect_id = ? AND s.course_id = ?
      `;
  
      const [results] = await db.query(query, [lect_id, course_id]);
  
      // ตั้งค่า availability array
      results.forEach(result => {
        const dayIndex = getDayIndex(result.day);
        const timeIndex = getTimeIndex(result.time_begin, result.time_end);
  
        // กำหนดค่า 1 สำหรับไม่ว่าง
        availability[dayIndex][timeIndex] = 1;
      });
  
      res.status(200).json({ availability });
    } catch (error) {
      res.status(500).json({ error });
    }
  };
  
  // ฟังก์ชันเพิ่มเติมสำหรับแปลงวันและเวลาเป็น index ของ array
  function getDayIndex(day) {
    // แปลงชื่อวันเป็น index
  }
  
  function getTimeIndex(time_begin, time_end) {
    // แปลงช่วงเวลาเป็น index (0 = AM, 1 = PM)
  }
  