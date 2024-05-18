import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import cubaimg from "../../../assets/images/logo/logo-icon.png"

const SidebarIcon = () => {
  return (
    <div className="logo-icon-wrapper">
      <Link to={`${process.env.PUBLIC_URL}/admin/dashboard`}>
        <img
          className="img-fluid"
          src={cubaimg}
          alt=""
        />
      </Link>
    </div>
  );
};

export default SidebarIcon;