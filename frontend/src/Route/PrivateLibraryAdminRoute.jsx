import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import { baseApiURL } from '../baseUrl';
import { setAuthenticated } from "../redux/authRedux";

const PrivateLibraryAdminRoute = () => {
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

        if (data.authenticated && data.user.role === 'Librarian') {
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
    if (isMobile && (location.pathname.startsWith("/library/dashboard") || location.pathname.startsWith("/library"))) {
      navigate('/403');
    }
  }, [isMobile, location, navigate]);

  if (loading) {
    return null;
  }

  if (isAuthenticated && location.pathname === `${process.env.PUBLIC_URL}/library`) {
    return <Navigate to={`${process.env.PUBLIC_URL}/library/dashboard`} replace />;
  }

  if (!isAuthenticated && location.pathname.startsWith(`${process.env.PUBLIC_URL}/library`)) {
    return <Navigate to={`${process.env.PUBLIC_URL}/librarianlogin`} replace />;
  }

  return <Outlet />;
};

export default PrivateLibraryAdminRoute;


