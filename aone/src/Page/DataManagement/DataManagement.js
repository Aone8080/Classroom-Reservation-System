import React from 'react'
import ManagementRoomType from '../../Component/Management/ManagementRoomType'
import ManagementRoom from '../../Component/Management/ManagementRoom'
import ManagementSubject from '../../Component/Management/ManagementSubject'
import ManagementLecturer from '../../Component/Management/ManagementLecturer'
import ManagementStudent from '../../Component/Management/ManagementStudent'
import ManagementCourse from '../../Component/Management/ManagementCourse'
import ManagementStdInCourse from '../../Component/Management/ManagementStdInCourse'
import ManagementYearsTerm from '../../Component/Management/ManagementYearsTerm'

import ManagementUser from '../../Component/Management/ManagementUser'

const DataManagement = () => {
  return (
    <div  className='container-main-noborder'>
      <h3 className='big-title py-3'>จัดการข้อมูล</h3>
      
      {/* <ManagementRoomType/> */}
      {/* <ManagementRoom/> */}
      {/* <ManagementSubject/> */}
      {/* <ManagementStudent/> */}
      {/* <ManagementLecturer/>  */}
      {/* <ManagementStdInCourse/>     อันนี้มีข้อมูลเกิน 50 ใส่สกอก่อน */}
      {/* <ManagementYearsTerm/> */}
      {/* <ManagementUser/> */}

      <ManagementCourse/>      
    </div>
  )
}

export default DataManagement