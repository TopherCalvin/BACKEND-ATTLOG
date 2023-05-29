import { useDispatch } from "react-redux";
import { auth_types } from "../redux/types";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();
  async function refreshReader() {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      const userData = await axios
        .get("http://localhost:2000/Users/token2", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.data);

      await dispatch({
        type: auth_types.login,
        payload: userData,
      });
    }
  }
  refreshReader();

  return children;
}
