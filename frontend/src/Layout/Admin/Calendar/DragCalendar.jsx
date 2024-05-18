import React, { Fragment, useState, useEffect } from 'react';
import { Col, Container, Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Breadcrumbs } from '../../../AbstractElements';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from 'moment';
import { baseApiURL } from '../../../baseUrl';
import { setAuthenticated } from "../../../redux/authRedux";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import Swal from 'sweetalert2';

const localizer = momentLocalizer(moment);

const DragCalendar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const checkAdminAuthorization = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/adminRoutes`, {
          withCredentials: true,
        });

        const data = response.data;

        if (data.authenticated) {
          dispatch(setAuthenticated(true));
          window.history.pushState(null, null, window.location.pathname);
        } else {
          navigate(`${process.env.PUBLIC_URL}/adminlogin`, { replace: true });
        }

      } catch (error) {
        navigate(`${process.env.PUBLIC_URL}/adminlogin`, { replace: true });
      }
    };

    checkAdminAuthorization();

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
          text: 'Error Fetching Event Details!',
          confirmButtonText: 'OK'
        });
      });
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsConfirmationModalOpen(true);
  };

  const handleDateClick = (arg) => {
    setHoveredDate(arg.start);
    setIsModalOpen(true);
  };

  const handleAddEvent = () => {
    if (!eventTitle.trim()) {
      alert('Please enter the event title');
      return;
    }

    const newEvent = {
      title: eventTitle,
      description: eventDescription,
      start: hoveredDate,
      end: moment(hoveredDate).add(1, 'hour').toDate(),
    };

    setCalendarEvents([...calendarEvents, newEvent]);

    setEventTitle('');
    setEventDescription('');
    setIsModalOpen(false);

    sendEventToDatabase(newEvent);
  };

  const sendEventToDatabase = (eventData) => {
    axios.post(`${baseApiURL()}/addevent`, eventData)
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Event has been successfully added.',
          confirmButtonText: 'OK'
        });
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error Adding Event!',
          confirmButtonText: 'OK'
        });
      });
  };

  const handleDeleteConfirmation = () => {
    setCalendarEvents((prevEvents) => prevEvents.filter(event => event !== selectedEvent));
    deleteEventFromDatabase(selectedEvent);
    setIsConfirmationModalOpen(false);
  };

  const deleteEventFromDatabase = (eventData) => {
    axios.delete(`${baseApiURL()}/deleteevent`, { data: eventData })
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Event has been successfully deleted.',
          confirmButtonText: 'OK'
        });

        fetchEventsFromDatabase();
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error Deleting Event Details!',
          confirmButtonText: 'OK'
        });
      });
  };

  return (
    <Fragment>
      <Breadcrumbs mainTitle='Event Calendar' parent='Admin' title='Event Calendar' />
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
                onSelectEvent={handleEventClick}
                selectable
                onSelectSlot={handleDateClick}
              />
            </Col>
          </div>
        </Col>
      </Container>

      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)}>
        <ModalHeader toggle={() => setIsModalOpen(!isModalOpen)}>Add Event</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="eventTitle">Event Title</Label>
              <Input
                type="text"
                name="eventTitle"
                id="eventTitle"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="eventDescription">Event Description</Label>
              <Input
                type="textarea"
                name="eventDescription"
                id="eventDescription"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                style={{ resize: "none" }}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAddEvent}>
            Submit
          </Button>{' '}
          <Button color="secondary" onClick={() => setIsModalOpen(!isModalOpen)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={isConfirmationModalOpen} toggle={() => setIsConfirmationModalOpen(!isConfirmationModalOpen)}>
        <ModalHeader toggle={() => setIsConfirmationModalOpen(!isConfirmationModalOpen)}>Delete Event</ModalHeader>
        <ModalBody>
          Are you sure you want to delete the event?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDeleteConfirmation}>
            Delete
          </Button>{' '}
          <Button color="secondary" onClick={() => setIsConfirmationModalOpen(!isConfirmationModalOpen)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default DragCalendar;