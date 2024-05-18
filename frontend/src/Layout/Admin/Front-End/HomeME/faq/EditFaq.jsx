import React, { Fragment, useState, useEffect } from 'react';
import { H5, Btn } from '../../../../../AbstractElements';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { baseApiURL } from '../../../../../baseUrl';

const EditFaq = ({faq , onClose}) => {
  const [faqData, setFaqData] = useState({
    question: '',
    answer: ''
  });
  
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFaqDetails = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/getSingleFaqME/${faq._id}`); 
        const FaqDetails = response.data;

        setFaqData(FaqDetails);
      } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Error Fetching FAQ Details!',
            confirmButtonText: 'OK'
          });
      }
    };

    fetchFaqDetails();
}, []);


  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      Swal.showLoading();

      const formData = new FormData();
      Object.entries(faqData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      axios.post(`${baseApiURL()}/editFaqME/${faq._id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          setFaqData({
            question: '',
            answer: ''
          });
        })
        .finally(() => {
          setLoading(false);
        });

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'FAQ updated successfully.',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            setIsFormOpen(false);
            onClose();
          }
        });

    } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error Updating FAQ Details!',
          confirmButtonText: 'OK'
        });
    }
  };

  return (
    <Fragment>
      <span>&nbsp;</span>
      {isFormOpen && (
        <Container fluid={true}>
          <Row>
            <Col sm='12'>
              <Card>
                <H5>Edit FAQ</H5>
                <CardBody>
                  <Form className='theme-form' onSubmit={handleEditSubmit}>
                    <Row>
                      <Col sm="12">
                        <FormGroup>
                          <Label>Question</Label>
                          <Input
                            className="form-control"
                            type="text"
                            placeholder="Enter Question"
                            value={faqData.question}
                            onChange={(e) => setFaqData({ ...faqData, question: e.target.value })}
                            required autoFocus
                          />
                        </FormGroup>
                      </Col>
                      <Col sm="12">
                        <FormGroup>
                          <Label>Answer</Label>
                          <textarea
                            className='form-control'
                            rows={5}
                            placeholder='Enter Answer'
                            style={{ resize: 'none' }}
                            value={faqData.answer}
                            onChange={(e) => setFaqData({ ...faqData, answer: e.target.value })}
                            required autoFocus
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className='text-end'>
                          <Btn attrBtn={{ color: 'primary', className: 'me-3' }} type="submit" disabled={loading}>
                            {loading ? 'Please Wait...' : 'Submit'}
                          </Btn>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </Fragment>
  );
};

export default EditFaq;


