import React from 'react';
import { Card, CardBody, Button, Row, Col } from 'reactstrap';
import Student from "../images/StudentImg.jpg";
import Faculty from "../images/Faculty_1.jpg";
import Library from "../images/LibrarianImg.jpg";
import LibraryMember from "../images/Library-Member.jpg";
import Department from "../images/Department.jpg";
import { Link as Link2 } from 'react-router-dom';

const Authlogin = () => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    position: 'relative',
  };

  const backgroundOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'url("https://images.collegedunia.com/public/college_data/images/appImage/1593506009pic51.jpg") center/cover no-repeat',
    filter: 'blur(3px)',
    zIndex: -1,
  };

  const rowStyle = {
    display: 'flex',
    flexDirection: 'row',
  };

  const cardStyle = {
    width: '18rem',
    margin: '2rem',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f5f5f5',
    borderRadius: '15px',
  };

  const imgStyle = {
    borderRadius: '15px 15px 0 0',
    width: '100%',
  };

  const bodyStyle = {
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      <div style={backgroundOverlayStyle}></div>
      <Row style={rowStyle}>
        <Col>
          <Card style={cardStyle}>
            <img alt="Student" src={Department} style={imgStyle} />
            <CardBody style={bodyStyle}>
              <Button color='primary'><Link2 to="/department" target='_blank' style={{ color: 'white' }}>Department Login</Link2></Button>
            </CardBody>
          </Card>
        </Col>
        <Col>
          <Card style={cardStyle}>
            <img alt="Faculty" src={Faculty} style={imgStyle} />
            <CardBody style={bodyStyle}>
              <Button color='primary'><Link2 to="/faculty" target='_blank' style={{ color: 'white' }}>Faculty Login</Link2></Button>
            </CardBody>
          </Card>
        </Col>
        <Col>
          <Card style={cardStyle}>
            <img alt="Faculty" src={Student} style={imgStyle} />
            <CardBody style={bodyStyle}>
              <Button color='primary'><Link2 to="/student" target='_blank' style={{ color: 'white' }}>Student Login</Link2></Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row style={rowStyle}>
        <Col>
          <Card style={cardStyle}>
            <img alt="Student" src={Library} style={imgStyle} />
            <CardBody style={bodyStyle}>
              <Button color='primary'><Link2 to="/library" target='_blank' style={{ color: 'white' }}>Librarian Login</Link2></Button>
            </CardBody>
          </Card>
        </Col>
        <Col>
          <Card style={cardStyle}>
            <img alt="Faculty" src={LibraryMember} style={imgStyle} />
            <CardBody style={bodyStyle}>
              <Button color='primary'><Link2 to="/library/member" target='_blank' style={{ color: 'white' }}>Library Member Login</Link2></Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Authlogin;
