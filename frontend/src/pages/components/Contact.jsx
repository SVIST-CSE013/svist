import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseApiURL } from '../../baseUrl';
import Swal from 'sweetalert2';

function Contact() {
  const [contactData, setContactData] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/getfooterdetails`);
        const firstItem = response.data[0];

        setContactData({
          address: firstItem.address,
          phonenumber: firstItem.phonenumber,
          email: firstItem.email,
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error Fetching Contact Details!',
          confirmButtonText: 'OK',
        });
      }
    };

    fetchData();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please fill out all fields in the form!',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      const response = await axios.post(`${baseApiURL()}/submitContactForm`, formData);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Enquiry Submitted successfully.',
        confirmButtonText: 'OK',
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Error Submitting Enquiry!',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div>
      <section className="contact_page pt_110 xs_pt_70 pb_120 xs_pb_80" id='contact'>
        <div className="container">
          <div className="row">
            <h2>Get In Touch With Us</h2>
            <div className="col-xl-6">
              <div className="row">
                <div className="col-xl-6 col-md-6 wow fadeInUp" data-wow-duration="1s">
                  <div className="contact_info">
                    <i className="fas fa-envelope"></i>
                    <h3>Email</h3>
                    <span>Our friendly team is here to help.</span>
                    <p>{contactData.email}</p>
                  </div>
                </div>
                <div className="col-xl-6 col-md-6 wow fadeInUp" data-wow-duration="1s">
                  <div className="contact_info">
                    <i className="fas fa-map-marker-alt"></i>
                    <h3>Office</h3>
                    <span>Come say hello at our office.</span>
                    <p>{contactData.address}</p>
                  </div>
                </div>
                <div className="col-xl-6 col-md-6 wow fadeInUp" data-wow-duration="1s">
                  <div className="contact_info">
                    <i className="fas fa-phone-alt"></i>
                    <h3>Phone</h3>
                    <span>Mon-Fri from 8am to 5pm.</span>
                    <p>{contactData.phonenumber}</p>
                  </div>
                </div>
                <div className="col-xl-6 col-md-6 wow fadeInUp" data-wow-duration="1s">
                  <div className="contact_info">
                    <i className="fas fa-clock"></i>
                    <h3>Working Hours</h3>
                    <span>Satday to Friday:</span>
                    <p>09:00am - 10:00pm</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-6 wow fadeInRight" data-wow-duration="1s">
              <form className="contact_form" onSubmit={handleFormSubmit}>
                <div className="row">
                  <div className="col-xl-12">
                    <div className="form_single_input">
                      <label>name</label>
                      <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                  </div>
                  <div className="col-xl-12 col-md-6">
                    <div className="form_single_input">
                      <label>email</label>
                      <input type="email" placeholder="example@gmail.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="col-xl-12 col-md-6">
                    <div className="form_single_input">
                      <label>phone</label>
                      <input type="text" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} maxLength={10} size={10}/>
                    </div>
                  </div>
                  <div className="col-xl-12">
                    <div className="form_single_input">
                      <label>Message</label>
                      <textarea rows="4" placeholder="Type here.." style={{resize: 'none'}} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}></textarea>
                    </div>
                    <button type="submit" className="common_btn">Send message</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
