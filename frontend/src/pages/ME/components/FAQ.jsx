import React, { useState, useEffect } from 'react'
import { baseApiURL } from '../../../baseUrl';
import axios from "axios"
import Swal from "sweetalert2"

function FAQ() {
    const [faqData, setFaqData] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseApiURL()}/getfaqsME`);
                const faqsDetails = response.data.map(async (item, index) => {
                    return {
                        question: item.question,
                        answer: item.answer,
                        isOpen: index === 0,
                    };
                });
                Promise.all(faqsDetails).then((faqs) => {
                    setFaqData(faqs);
                });

            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Error Fetching FAQ Details!',
                    confirmButtonText: 'OK',
                });
            }
        };

        fetchData();
    }, []);

    const toggleAccordion = (index) => {
        setFaqData((prevFaqData) =>
            prevFaqData.map((faq, i) => ({
                ...faq,
                isOpen: i === index ? !faq.isOpen : false,
            }))
        );
    };

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
            <section className="faq_page pt_95 xs_pt_55 pb_120 xs_pb_80" id='faq'>
                <div className="container">
                    <div className="row">
                        <div className="col-xl-6 col-md-9 col-lg-7 m-auto">
                            <div className="section_heading heading_center mb_35 xs_mb_30">
                                <h2>Frequently Asked Questions</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xxl-8 col-lg-7">
                            <div className="faq_text">
                                <div className="accordion" id="accordionExample">
                                    {faqData.map((faq, index) => (
                                        <div key={index} className="accordion-item wow fadeInUp" data-wow-duration="1s">
                                            <h2 className="accordion-header">
                                                <button
                                                    className="accordion-button"
                                                    type="button"
                                                    onClick={() => toggleAccordion(index)}
                                                    aria-expanded={faq.isOpen ? 'true' : 'false'}
                                                >
                                                    {faq.question}
                                                </button>
                                            </h2>
                                            <div
                                                className={`accordion-collapse collapse ${faq.isOpen ? 'show' : ''}`}
                                                data-bs-parent="#accordionExample"
                                            >
                                                <div className="accordion-body">
                                                    <p>{faq.answer}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-4 col-lg-5 wow fadeInRight" data-wow-duration="1s">
                            <form className="faq_form become_instructor_form" onSubmit={handleFormSubmit}>
                                <h2>Have Any Question?</h2>
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div className="form_single_input">
                                            <label>name</label>
                                            <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="col-xl-12">
                                        <div className="form_single_input">
                                            <label>email</label>
                                            <input type="email" placeholder="example@gmail.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="col-xl-12">
                                        <div className="form_single_input">
                                            <label>phone</label>
                                            <input type="text" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} maxLength={10} size={10} />
                                        </div>
                                    </div>
                                    <div className="col-xl-12">
                                        <div className="form_single_input">
                                            <label>Message</label>
                                            <textarea rows="4" placeholder="Type here.." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} style={{ resize: 'none' }}></textarea>
                                        </div>
                                    </div>
                                    <div className="col-xl-12">
                                        <button type="submit" className="common_btn">Submit</button>
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

export default FAQ
