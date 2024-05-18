import React, { Fragment } from 'react';
import { Row } from 'reactstrap';
import Leftbar from './Leftbar/index';
import RightHeader from './RightHeader/index';

const Header = () => {
  return (
    <Fragment>
      <div className="page-header">
        <Row className='header-wrapper m-0'>
          <Leftbar />
          <RightHeader />
        </Row>
      </div>
    </Fragment>
  );
};

export default Header;
