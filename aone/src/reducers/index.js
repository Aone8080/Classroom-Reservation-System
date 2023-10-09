
import { combineReducers } from "redux";
import { userReducer2 } from "./userReducer2"; // ใช้ชื่อ userReducer2 แทน

const rootReducer = combineReducers({
  user: userReducer2, 
});

export default rootReducer;