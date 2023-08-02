const db = require('../db');



exports.importAllStudent = async (req, res) => {
    const { major_id, major_name, std_code, std_name } = req.body;

    const uniqueStdCodes = [...new Set(std_code)]; //กันข้อมูลซ้ำในbody

    const createMajorSql = "INSERT INTO major (major_id, major_name) VALUES (?, ?) ON DUPLICATE KEY UPDATE major_name = ?";
    db.query(createMajorSql, [major_id, major_name, major_name], (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
    });
    
    const createStudentSql = "INSERT INTO student (std_code, major_id, std_name) VALUES (?, ?, ?)";
    const queries = [];

    // 2. Create Student
    // Loop through each unique student code and name, and insert into the database.
    for (let i = 0; i < uniqueStdCodes.length; i++) {
        const query = new Promise((resolve, reject) => {
            // First, check if the student code already exists in the database.
            db.query('SELECT * FROM student WHERE std_code = ?', [uniqueStdCodes[i]], (error, results) => {
                if (error) {
                    reject(error);
                } else if (results.length > 0) {
                    // If the student code already exists, skip this insertion.
                    resolve();
                } else {
                    // If the student code does not exist, proceed with the insertion.
                    db.query(createStudentSql, [uniqueStdCodes[i], major_id, std_name[i]], (error, results) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(results);
                        }
                    });
                }
            });
        });
        queries.push(query);
    }
    //Promise.all จะรอให้ทุกคำสั่ง SQL ทำงานเสร็จสิ้นก่อนที่จะส่ง response กลับไปยัง client.
    Promise.all(queries)
        .then(() => res.status(200).json({ message: "Major and Students have been created successfully." }))
        .catch(error => res.status(500).json({ error }));
};









exports.importCourse = async (req, res) => {
    const { subj_code, subj_name, course_id, room_id, Years, Term, day, time_begin, time_end, lect_id, lect_name, std_code } = req.body;
    const queries = [];

    // 1. Insert subject
    const insertSubjectQuery = new Promise((resolve, reject) => {
        db.query('SELECT * FROM subject WHERE subj_code = ?', [subj_code], (error, results) => {
            if (error) {
                reject(error);
            } else if (results.length > 0) {
                // If the subject code already exists, skip this insertion.
                resolve();
            } else {
                // If the subject code does not exist, proceed with the insertion.
                db.query('INSERT INTO subject (subj_code, subj_name) VALUES (?, ?)', [subj_code, subj_name], (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            }
        });
    });
    queries.push(insertSubjectQuery);

    // 2. Insert course
    const insertCourseQuery = new Promise((resolve, reject) => {
        db.query('SELECT * FROM course WHERE course_id = ?', [course_id], (error, results) => {
            if (error) {
                reject(error);
            } else if (results.length > 0) {
                // If the course_id already exists, skip this insertion.
                resolve();
            } else {
                // If the course_id does not exist, proceed with the insertion.
                db.query('INSERT INTO course (course_id, subj_code, room_id, Years, Term, day, time_begin, time_end) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [course_id, subj_code, room_id, Years, Term, day, time_begin, time_end], (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            }
        });
    });
    queries.push(insertCourseQuery);

    // 3. Insert lecturer
    const insertLecturerQuery = new Promise((resolve, reject) => {
        db.query('SELECT * FROM lecturer WHERE lect_id = ?', [lect_id], (error, results) => {
            if (error) {
                reject(error);
            } else if (results.length > 0) {
                // If the lect_id already exists, skip this insertion.
                resolve();
            } else {
                // If the lect_id does not exist, proceed with the insertion.
                db.query('INSERT INTO lecturer (lect_id, lect_name) VALUES (?, ?)', [lect_id, lect_name], (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            }
        });
    });
    queries.push(insertLecturerQuery);

    // 4. Insert into teach
    const insertTeachQuery = new Promise((resolve, reject) => {
        db.query('SELECT * FROM teach WHERE lect_id = ? AND course_id = ?', [lect_id, course_id], (error, results) => {
            if (error) {
                reject(error);
            } else if (results.length > 0) {
                // If the lect_id and course_id already exists, skip this insertion.
                resolve();
            } else {
                // If the lect_id and course_id does not exist, proceed with the insertion.
                db.query('INSERT INTO teach (lect_id, course_id) VALUES (?, ?)', [lect_id, course_id], (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            }
        });
    });
    queries.push(insertTeachQuery);

    // 5. Insert into std_reg_course
    for (let i = 0; i < std_code.length; i++) {
        const query = new Promise((resolve, reject) => {
            db.query('SELECT * FROM std_reg_course WHERE std_code = ? AND course_id = ?', [std_code[i], course_id], (error, results) => {
                if (error) {
                    reject(error);
                } else if (results.length > 0) {
                    resolve();
                } else {
                    const createStdRegCourseSql = "INSERT INTO std_reg_course (std_code, course_id) VALUES (?, ?)";
                    db.query(createStdRegCourseSql, [std_code[i], course_id], (error, results) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(results);
                        }
                    });
                }
            });
        });
        queries.push(query);
    }

    // Wait for all queries to finish before sending a response.
    Promise.all(queries)
        .then(() => res.status(200).json({ message: "Courses, Subjects, Lecturers, and Registrations have been imported successfully." }))
        .catch(error => res.status(500).json({ error }));
};






