import React, { Fragment, useState } from 'react';
import { Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { Btn } from '../AbstractElements';
import Logo from '../assets/images/logo/svist-logo.png';
import { Key } from 'react-feather';
import Swal from 'sweetalert2';
import { baseApiURL } from '../baseUrl';
import axios from 'axios';

const ChangePwd = ({ user , onClose }) => {
  const [togglePassword, setTogglePassword] = useState(false);
  const [togglePassword1, setTogglePassword1] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(true);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      if (newPassword !== retypePassword) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Password Do Not Match',
            confirmButtonText: 'OK'
          });
        return;
      }
      
      Swal.showLoading();
      await axios.post(
        `${baseApiURL()}/changepassword/${user}`,
        { newPassword },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setNewPassword('');
      setRetypePassword('');

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Password Changed successfully.',
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
          text: 'Failed to Change Password',
          confirmButtonText: 'OK'
        });
    }
  };

  return (
    <Fragment>
      {isFormOpen && (
        <section>
          <Container fluid={true} className='p-0 login-page'>
            <Row className='m-0'>
              <Col xl='12 p-0'>
                <div>
                  <div className='d-flex justify-content-center'>
                    <img src={Logo} alt="" />
                  </div>
                  <div className='login-main'>
                    <Form className='theme-form login-form' onSubmit={handleChangePassword}>
                      <FormGroup className='position-relative'>
                        <Label className='m-0 col-form-label'>New Password</Label>
                        <Input
                          className='form-control'
                          type={togglePassword ? 'text' : 'password'}
                          name='login[password]'
                          required
                          placeholder='*********'
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <div className='show-hide' onClick={() => setTogglePassword(!togglePassword)}>
                          <span className={togglePassword ? '' : 'show'}></span>
                        </div>
                      </FormGroup>
                      <FormGroup className='position-relative'>
                        <Label className='m-0 col-form-label'>Retype Password</Label>
                        <Input
                          className='form-control'
                          type={togglePassword1 ? 'text' : 'password'}
                          name='checklogin[password]'
                          required
                          placeholder='*********'
                          value={retypePassword}
                          onChange={(e) => setRetypePassword(e.target.value)}
                        />
                        <div className='show-hide' onClick={() => setTogglePassword1(!togglePassword1)}>
                          <span className={togglePassword1 ? '' : 'show'}></span>
                        </div>
                      </FormGroup>
                      <FormGroup className='d-flex justify-content-center'>
                        <Btn
                          attrBtn={{ className: 'd-block w-40 btn btn-air-primary', color: 'primary' }}
                          type="submit"
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Key size={16} />&nbsp; Change Password
                          </div>
                        </Btn>
                      </FormGroup>
                    </Form>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      )}
    </Fragment>
  );
};

export default ChangePwd;
