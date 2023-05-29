import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedPage({ children, guestOnly, needLogin }) {
  const token = JSON.parse(localStorage.getItem("token"));
  const nav = useNavigate();
  useEffect(() => {
    if (guestOnly && token) {
      return nav("/");
    } else if (needLogin && !token) {
      return nav("/login");
    }
  });

  return children;
}
