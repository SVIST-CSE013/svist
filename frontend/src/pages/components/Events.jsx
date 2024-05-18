import React, { useState, useEffect } from 'react'
import { ref, getDownloadURL } from 'firebase/storage';
import axios from "axios"
import Swal from 'sweetalert2';
import { Modal, ModalBody } from 'reactstrap';
import { storage } from '../../Config/firebaseconfig'
import EventDetails from './EventDetails';
import { baseApiURL } from '../../baseUrl';


function Events() {
    const [eventData, setEventData] = useState([]);
    const [eventModal, setEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseApiURL()}/getshowevents`);
                const eventDetails = response.data.map(async (item) => {
                    const storageRef = ref(storage, item.file);
                    const imageUrl = await getDownloadURL(storageRef);
                    return {
                        title: item.title,
                        description: item.description,
                        date: item.date,
                        image: imageUrl,
                    };
                });

                Promise.all(eventDetails).then((events) => {
                    setEventData(events);
                });

            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error Fetching Events!',
                    confirmButtonText: 'OK',
                });
            }
        };

        fetchData();
    }, []);

    const openEventModal = (event) => {
        setSelectedEvent(event);
        setEventModal(true);
    };

    const closeEventModal = () => {
        setSelectedEvent(null);
        setEventModal(false);
    };

    return (
        <div>
            <section className="event_page pt_95 xs_pt_55 pb_120 xs_pb_80" id='events'>
                <div className="container">
                    <div className="row">
                        <div className="col-xl-6 col-md-9 col-lg-7 m-auto">
                            <div className="section_heading heading_center mb_30">
                                <h2>Our Events</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {eventData.map((event, index) => (
                            <div key={index} className="col-xl-6 col-lg-6 wow fadeInUp" data-wow-duration="1s">
                                <div className="single_event">
                                    <div className="single_event_date">
                                        <img src={event.image} alt="event" className="img-fluid w-100" />
                                        <h2><span>{event.date}</span></h2>
                                    </div>
                                    <div className="single_event_text">
                                        <h3>{event.title}</h3>
                                        <ul>
                                            <li><i className="far fa-map-marker-alt"></i>SVIST Campus, Kolkata</li>
                                        </ul>
                                        <p>{event.description}</p>
                                        <a href="javascript:void(0)" onClick={() => openEventModal(event)} style={{ cursor: 'pointer' }}>View Details <i class="far fa-long-arrow-right"></i></a>
                                        <Modal isOpen={eventModal} toggle={closeEventModal} size="xl" centered>
                                            <ModalBody>
                                                <EventDetails event={selectedEvent} onClose={closeEventModal} />
                                            </ModalBody>
                                        </Modal>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Events
