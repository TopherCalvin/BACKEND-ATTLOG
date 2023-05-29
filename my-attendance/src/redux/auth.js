import axios from "axios";
import { auth_types } from "./types";
const init = {
  id: "",
  name: "",
  email: "",
  address: "",
  company_id: "",
};

function userReducer(state = init, action) {
  if (action.type == auth_types.login) {
    return {
      ...state,
      ...action?.payload,
    };
  } else {
    return init;
  }
  return state;
}

export default userReducer;
