import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const AdminRoute = () => {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
  }

  if (!authUser || authUser.role !== "ADMIN") {
    return <Navigate to="/" />;
  }
  return <div></div>;
};

export default AdminRoute;
