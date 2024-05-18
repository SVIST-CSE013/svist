import React, { Fragment, useState } from 'react';
import { H5, Btn } from '../../../../../AbstractElements';
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { baseApiURL } from '../../../../../baseUrl';

const AddFaq = ({onClose}) => {
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(true);

  const handleAddFaq = async (e) => {
    e.preventDefault();
    try {

      Swal.showLoading();
      setLoading(true);

      const formData = new FormData();
      formData.append('question', faqQuestion);
      formData.append('answer', faqAnswer);

      const response = await axios.post(`${baseApiURL()}/addfaqEEE`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setFaqQuestion('');
      setFaqAnswer('');

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'FAQ added successfully.',
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
          text: 'Error Adding FAQ!',
          confirmButtonText: 'OK'
        });
    } finally {
      setLoading(false);
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
                <H5>Add FAQ</H5>
                <CardBody>
                  <Form className='theme-form' onSubmit={handleAddFaq}>
                    <Row>
                      <Col sm="12">
                        <FormGroup>
                          <Label>Question</Label>
                          <Input
                            className="form-control"
                            type="text"
                            placeholder="Enter Question"
                            onChange={(e) => setFaqQuestion(e.target.value)}
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
                            onChange={(e) => setFaqAnswer(e.target.value)}
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

export default AddFaq;


