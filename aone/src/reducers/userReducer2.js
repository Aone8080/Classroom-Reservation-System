
// userReducer.js 
export function userReducer2(state = null, action) {
  switch (action.type) {
    case "LOGIN":
      return action.payload;
    case "LOGOUT":
      localStorage.clear();
      return action.payload;
    default:
      return state;
  }
}


     
//----------------code เวลา set dispatch หรือเปลียนค่า-----------------//

// dispatch({                                                
//   type: "LOGIN",                                  
//   payload: {                                       
//     token: res.data.token,                         
//     username: res.data.payload.user.username,
//     role: res.data.payload.user.role,
//   },
// });
