// components/AdminRoute.jsx
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user || !["admin", "master"].includes(user.role)) {
    console.log(user)
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
