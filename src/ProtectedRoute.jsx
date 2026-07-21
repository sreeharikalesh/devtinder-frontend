import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router";
import api from "./utils/axios";
import { addUser, removeUser } from "./utils/userSlice";

const ProtectedRoute = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [checking, setChecking] = useState(!user);

  useEffect(() => {
    if (user) return;

    const verifyAuth = async () => {
      try {
        const res = await api.get("/profile/view");
        dispatch(addUser(res.data));
      } catch (err) {
        dispatch(removeUser());
      } finally {
        setChecking(false);
      }
    };

    verifyAuth();
  }, []);

  if (checking) {
    return <div className="flex justify-center mt-10">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
