import axios from "axios";
import { auth_types } from "../types";

export function userLogin(account) {
  return async function (dispatch) {
    try {
      const token = await axios
        .get("http://localhost:2000/Users/v2", {
          params: {
            emna: account.emna,
            password: account.password,
          },
        })
        .then((res) => res.data.token);
      const userData = await axios
        .get("http://localhost:2000/Users/token2", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.data);
      if (userData) {
        await dispatch({
          type: auth_types.login,
          payload: userData,
        });
      }
      localStorage.setItem("token", JSON.stringify(token));
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };
}
