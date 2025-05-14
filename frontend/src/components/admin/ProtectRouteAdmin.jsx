import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectRouteAdmin = ({ children }) => {
  const { admin } = useSelector((state) => state.admin);
  console.log(admin,"admin details check")
  if (!admin) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default ProtectRouteAdmin;