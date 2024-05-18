import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, User, Camera } from "react-feather";
import { Modal, ModalBody } from "reactstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { LI, UL, P } from "../../../../AbstractElements";
import ChangeProfilePicture from "../../Profile/ChangeProfilePicture";
import { baseApiURL } from '../../../../baseUrl';

const UserHeader = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [facultyData, setFacultyData] = useState([]);
  const [userRole, setUserRole] = useState();
  const [profilemodal, setProfileModal] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/checkauthentication`, {
          withCredentials: true,
        });

        const data = response.data.user;
        setName(data.name);
        setEmail(data.email);
        setUserRole(data.role);

      } catch (error) {
          console.log();
      }
    };

    fetchUserDetails();
  }, [name]);

  useEffect(() => {
    const FetchData = async () => {
      try {
          const response = await axios.post(`${baseApiURL()}/getFilteredFacultyDetails`, {fullName: name , email: email });
          const firstItem = response.data.faculty[0];

          setFacultyData({
            profile: firstItem.profile,
          });

        } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Error Fetching Faculty Details!',
              confirmButtonText: 'OK'
            });
      }
    };

    if (name && email) {
      FetchData();
    }

  }, [name, email])

  const handleLogout = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(`${baseApiURL()}/logout`, null, {
            withCredentials: true,
          });

          navigate(`${process.env.PUBLIC_URL}/departmentlogin`);
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error Logging Out!',
            confirmButtonText: 'OK'
          });
        }
      }
    });
  };

  const userMenuRedirect = (redirect) => {
    navigate(redirect);
  };

  const openProfileModal = () => {
    setProfileModal(true);
  };

  const closeProfileModal = () => {
    setProfileModal(false);
  };

  return (
    <li className="profile-nav onhover-dropdown pe-0 py-0">
      <div className="media profile-media">
        <img src={facultyData.profile} loading="lazy" style={{maxWidth: "45px", maxHeight: "40px", borderRadius: "10px"}}/>
        <div className="media-body">
          <span>{name}</span>
          <P attrPara={{ className: "mb-0 font-roboto" }}>
            {userRole}<i className="middle fa fa-angle-down"></i>
          </P>
        </div>
      </div>
      <UL attrUL={{ className: "simple-list profile-dropdown onhover-show-div" }}>
        <LI
          attrLI={{
            onClick: () => userMenuRedirect(`${process.env.PUBLIC_URL}/department/profile`),
          }}>
          <User />
          <span>Account</span>
        </LI>
        <LI
          attrLI={{ onClick: openProfileModal }}>
          <Camera />
          <span>Change Profile Picture</span>
          <Modal isOpen={profilemodal} toggle={closeProfileModal} size="md" centered>
            <ModalBody>
              {email && <ChangeProfilePicture user={email} onClose={closeProfileModal} />}
            </ModalBody>
          </Modal>
        </LI>
        <LI
          attrLI={{ onClick: handleLogout }}>
          <LogIn />
          <span>Logout</span>
        </LI>
      </UL>
    </li>
  );
};

export default UserHeader;
