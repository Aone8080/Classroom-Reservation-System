// // XLSX ตัวอ่านไฟล์ Excel
// var XLSX = require('xlsx')
// var workbook = XLSX.readFile('std.xlsx');
// let worksheet =workbook.Sheets[workbook.SheetNames[0]];


// //create NewArr null
// const NameData =[];
// const student_idData =[];

// //loop data from excel to NewArr
// for(let index =11;index<40;index++){
//   const NameStd =worksheet[`C${index}`].v;
//   const student_id =worksheet[`B${index}`].v;
     
//      //Push data to arr
//      NameData.push(NameStd)
//      student_idData.push(student_id)
   
// }

// for(let index =0;index<student_idData.length;index++){
//     console.log(student_idData[index]);

// }

// //Loop data to databass
// for (let index = 0; index <NameData.length; index++) {

//     con.execute(
//         "INSERT INTO students(name, student_id) VALUES (? , ?)", //ใช้คำสั่งเพิ่มข้อมูลใน sql
//         [NameData[index], student_idData[index]], //คือvalue ที่ได้จาก body เทียบกันกับข้าง???บนเอาไปเพิ่มลง sql
//         function (err, results, fields) {
//           //ผลลัพที่ได้อยู่ในresults
    
//           //เช็ค error
//           if (err) {
//            console.log({ status: "error", message: err });
//             return;
//           }
//           console.log({ status: "Add data success" });
//         }
//       );
//     }




//  Route POST adduser
app.post("/adduser", function (req, res) {
    // sql คำสั่ง INSERT
    con.execute(
      "INSERT INTO students(name, student_id) VALUES (? , ?)", //ใช้คำสั่งเพิ่มข้อมูลใน sql
      [req.body.name, req.body.student_id], //คือvalue ที่ได้จาก body เทียบกันกับข้าง???บนเอาไปเพิ่มลง sql
      function (err, results, fields) {
        //ผลลัพที่ได้อยู่ในresults
  
        //เช็ค error
        if (err) {
          res.json({ status: "error", message: err });
          return;
        }
        res.json({ status: "Add data success" });
      }
    );
  });
  
  // Route GET lisuser
  app.get("/lisuser", function (req, res) {
      
      // sql คำสั่ง SELECT
      con.execute(
        "SELECT * FROM `students` ", 
        function (err, results, fields) {
          
          if (err) {
              res.json({ status: "error", message: err });
              return;
            }
            res.json(results) //ส่งผลลัพไปหน้าบ้าน
          }
      );
    });
  
  
  //  Route POST excel data
  app.post("/exceldata",function(req,res){
    
  var XLSX = require('xlsx')
  var workbook = XLSX.readFile('std.xlsx');
  let worksheet =workbook.Sheets[workbook.SheetNames[0]];
  
  //New arr
  const NameData =[];
  const student_idData =[];
  
  for(let index =11;index<40;index++){
    const NameStd =worksheet[`C${index}`].v;
    const student_id =worksheet[`B${index}`].v;
       
       //Push data to arr
       NameData.push(NameStd)
       student_idData.push(student_id)
   
  }
  
  //Loop data to databass
  for (let index = 1; index < student_idData.length; index++) {
  
      con.execute(
          "INSERT INTO students(name, student_id) VALUES (? , ?)", //ใช้คำสั่งเพิ่มข้อมูลใน sql
          [NameData[index], student_idData[index]], //คือvalue ที่ได้จาก body เทียบกันกับข้าง???บนเอาไปเพิ่มลง sql
          function (err, results, fields) {
            //ผลลัพที่ได้อยู่ในresults
      
            //เช็ค error
            if (err) {
              res.json({ status: "error", message: err });
              return;
            }
            res.json({ status: "Add data success" });
          }
        );
      }
  });