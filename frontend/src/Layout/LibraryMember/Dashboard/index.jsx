import React, { Fragment, useEffect } from "react";
import { Col, Container, Row } from "reactstrap";
import { useDispatch } from "react-redux";
import GreetingGrid from './GreetingGrid';
import GreetingCard from "./GreetingCard";
import RecentNotices from './RecentNotices';
import Calender from '../Dashboard/Calender';
import { baseApiURL } from '../../../baseUrl';
import axios from "axios";
import { setAuthenticated } from "../../../redux/authRedux";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkLibraryMemberAuthorization = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/libraryMemberRoutes`, {
          withCredentials: true,
        });

        const data = response.data;

        if (data.authenticated) {
          dispatch(setAuthenticated(true));
          window.history.pushState(null, null, window.location.pathname);
        } else {
          navigate(`${process.env.PUBLIC_URL}/libraryMemberlogin`, { replace: true });
        }

      } catch (error) {
        navigate(`${process.env.PUBLIC_URL}/libraryMemberlogin`, { replace: true });
      }
    };

    checkLibraryMemberAuthorization();

    const handleBackButton = () => {
      window.history.forward();
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };

  }, [dispatch, navigate]);

  return (
    <Fragment>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <Container fluid={true}>
        <Row className="widget-grid">
          <Col sm='12' xl='6'>
            <GreetingCard />
          </Col>
          <GreetingGrid />
          <Col xxl='3' xl='5' sm='6' className='col-ed-5 box-col-5'>
            <Calender />
          </Col>
          <Col xxl='5' xl='7' md='6' className='col-ed-7 box-col-7'>
            <RecentNotices />
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Dashboard;
