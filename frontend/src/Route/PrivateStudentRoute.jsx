import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import { baseApiURL } from '../baseUrl';
import { setAuthenticated } from "../redux/authRedux";

const PrivateStudentRoute = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.authenticated);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/checkauthentication`, {
          withCredentials: true,
        });

        const data = response.data;

        if (data.authenticated && data.user.role === 'Student') {
          dispatch(setAuthenticated(true));
        }
      } catch (error) {
          console.log();
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [dispatch]);

  useEffect(() => {
    if (isMobile && (location.pathname.startsWith("/student/dashboard") || location.pathname.startsWith("/student"))) {
      navigate('/403');
    }
  }, [isMobile, location, navigate]);

  if (loading) {
    return null;
  }

  if (isAuthenticated && location.pathname === `${process.env.PUBLIC_URL}/student`) {
    return <Navigate to={`${process.env.PUBLIC_URL}/student/dashboard`} replace />;
  }

  if (!isAuthenticated && location.pathname.startsWith(`${process.env.PUBLIC_URL}/student`)) {
    return <Navigate to={`${process.env.PUBLIC_URL}/studentlogin`} replace />;
  }

  return <Outlet />;
};

export default PrivateStudentRoute;


