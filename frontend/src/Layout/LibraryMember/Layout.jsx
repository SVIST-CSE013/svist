import React, { Fragment, useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useContext } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import Taptop from "./TapTop";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import ThemeCustomize from "../ThemeCustomizer";
import CustomizerContext from "../../_helper/Customizer";
import Loader from "./Loader";

const LibrarianLayout = () => {
  const { layout } = useContext(CustomizerContext);
  const { sidebarIconType } = useContext(CustomizerContext);
  const [showThemeCustomize, setShowThemeCustomize] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const layout1 = layout;
  const sideBarIcon = sidebarIconType;

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const shouldHardRefresh = localStorage.getItem("shouldHardRefresh");

    if (!shouldHardRefresh) {
      localStorage.setItem("shouldHardRefresh", "true");
      window.location.reload(true);
    } else {
      if (refreshCount < 2) {
        setRefreshCount(refreshCount + 1);
      } else {
        localStorage.removeItem("shouldHardRefresh");
      }
    }
  }, [refreshCount]); 

  useEffect(() => {
    if (isMobile && (location.pathname.startsWith("/library/member/dashboard") || location.pathname.startsWith("/library/member"))) {
      navigate('/403');
    }
  }, [isMobile, location, navigate]);

  return (
    <Fragment>
      <Loader />
      <Taptop />
      <div className={`page-wrapper ${layout1}`} sidebar-layout={sideBarIcon} id="pageWrapper">
        <Header />
        <div className="page-body-wrapper">
          <Sidebar />
          <div className="page-body">
            <div>
              <div>
                <Outlet />
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
      <div style={{ display: showThemeCustomize ? 'block' : 'none' }}>
        <ThemeCustomize />
      </div>
      <ToastContainer />
    </Fragment>
  );
};

export default LibrarianLayout;

