import React, { useState } from 'react';
import SvgIcon from '../../../../CommonElements/SvgIcon';

const Notificationbar = () => {
  const [notificationDropDown, setNotificationDropDown] = useState(false);

  return (
    <li className='onhover-dropdown'>
      <div className='notification-box' onClick={() => setNotificationDropDown(!notificationDropDown)}>
        <SvgIcon iconId='notification' />
        <span className='badge rounded-pill badge-secondary'>4</span>
      </div>
      <div className={`notification-dropdown onhover-show-div ${notificationDropDown ? 'active' : ''}`}>
        <h6 className='f-18 mb-0 dropdown-title'>{Notification}</h6>
        <ul>
          <li className='b-l-primary border-4'>
            <p>
              Notice Uploaded <span className='font-danger'>{'New'}</span>
            </p>
          </li>
          <li className='b-l-success border-4'>
            <p>
              Faculty Added
              <span className='font-success'>{''}</span>
            </p>
          </li>
          <li className='b-l-info border-4'>
            <p>
              Staff Added
              <span className='font-info'>{''}</span>
            </p>
          </li>
          <li className='b-l-warning border-4'>
            <p>
              Report Generated
              <span className='font-warning'>{''}</span>
            </p>
          </li>
          {/* <li>
            <a className='f-w-700' href='#javascript'>
              CHECKALL
            </a>
          </li> */}
        </ul>
      </div>
    </li>
  );
};

export default Notificationbar;
