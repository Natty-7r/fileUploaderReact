import React from "react";
import { useNavigate } from "react-router-dom";
function Protected({ auth, children }) {
  const navigate = useNavigate();
  if (!auth) {
    return navigate("/");
  }
  return children;
}
export default Protected;
