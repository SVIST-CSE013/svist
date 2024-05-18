import React from 'react';
import { Link } from 'react-router-dom';
// import cubaimg from "../../../assets/images/logo/logo-icon.png"
import LogoIcon from '../../../assets/images/logo/svist-logo-small.png';

const SidebarIcon = () => {
  return (
    <div className="logo-icon-wrapper">
      <Link to={`${process.env.PUBLIC_URL}/admin/dashboard`}>
        <img
          className="img-fluid"
          src={LogoIcon}
          alt=""
        />
      </Link>
    </div>
  );
};

export default SidebarIcon;