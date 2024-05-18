import React, { Fragment, useState, useEffect } from 'react';
import { Col, Container } from 'reactstrap';
import { Breadcrumbs } from '../../../AbstractElements';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Swal from 'sweetalert2';
import { baseApiURL } from '../../../baseUrl';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthenticated } from "../../../redux/authRedux";

const localizer = momentLocalizer(moment);

const DragCalendar = () => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkLibraryAdminAuthorization = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/librarianRoutes`, {
          withCredentials: true,
        });

        const data = response.data;

        if (data.authenticated) {
          dispatch(setAuthenticated(true));
          window.history.pushState(null, null, window.location.pathname);
        } else {
          navigate(`${process.env.PUBLIC_URL}/librarianlogin`, { replace: true });
        }

      } catch (error) {
        navigate(`${process.env.PUBLIC_URL}/librarianlogin`, { replace: true });
      }
    };

    checkLibraryAdminAuthorization();

    const handleBackButton = () => {
      window.history.forward();
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };

  }, [dispatch, navigate]);

  useEffect(() => {
    fetchEventsFromDatabase();
  }, []);

  const fetchEventsFromDatabase = () => {
    axios.get(`${baseApiURL()}/getevents`)
      .then(response => {
        setCalendarEvents(response.data);
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error Fetching Events!',
          confirmButtonText: 'OK'
        });
      });
  };

  return (
    <Fragment>
      <Breadcrumbs mainTitle='Event Calendar' parent='Librarian' title='Event Calendar' />
      <Container fluid={true}>
        <Col sm="12">
          <div>
            <Col sm="12" lg="12" xl="12">
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                views={['month', 'agenda']}
              />
            </Col>
          </div>
        </Col>
      </Container>
    </Fragment>
  );
};

export default DragCalendar;
