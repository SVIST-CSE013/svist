import React, { Fragment, useState } from 'react';
import { Key } from 'react-feather';
import axios from 'axios';
import Swal from "sweetalert2";
import { Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { Btn, H4 } from '../AbstractElements';
import { baseApiURL } from '../baseUrl';
import Logo from '../assets/images/logo/svist-logo.png';

const ForgotPwd = () => {
  const [togglePassword, setTogglePassword] = useState(false);
  const [togglePassword1, setTogglePassword1] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [error, setError] = useState(null);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      if (newPassword !== retypePassword) {
        setError('Passwords do not match');
        return;
      }
      
      await axios.post(
        `${baseApiURL()}/forgotpassword`,
        { email , newPassword },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Password Changed successfully.',
        confirmButtonText: 'OK'
      })

      setEmail('');
      setNewPassword('');
      setRetypePassword('');
      setPasswordChanged(true);
      setError(null);

    } catch (error) {
        setError(error.message || 'Failed to change password');
    }
  };


  return (
    <Fragment>
      <section>
        <Container fluid={true} className='p-0 login-page'>
          <Row className='m-0'>
            <Col xl='12 p-0'>
              <div className='login-card'>
                <div>
                  <div className="text-center mb-4">
                    <img src={Logo} alt="Logo" style={{ maxWidth: "100px" }} />
                  </div>
                  <div className='login-main'>
                    <Form className='theme-form login-form' onSubmit={handleChangePassword}>
                      <H4>Forgot Password ?</H4>
                      <FormGroup>
                        <Label className="col-form-label">Email Address</Label>
                        <Input className="form-control" type="email" placeholder='abc@mail.com' onChange={(e) => setEmail(e.target.value)} value={email} required autoFocus/>
                      </FormGroup>
                      <FormGroup className='position-relative'>
                        <Label className='m-0 col-form-label'>New Password</Label>
                        <div className='position-relative'>
                          <Input
                            className='form-control'
                            type={togglePassword ? 'text' : 'password'}
                            required
                            placeholder='*********'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                          <div className='show-hide' onClick={() => setTogglePassword(!togglePassword)}>
                            <span className={togglePassword ? '' : 'show'}></span>
                          </div>
                        </div>
                      </FormGroup>
                      <FormGroup className='position-relative'>
                        <Label className='m-0 col-form-label'>Retype Password</Label>
                        <div className='position-relative'>
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
                        </div>
                      </FormGroup>
                      <FormGroup className='d-flex justify-content-center'>
                        <Btn
                          attrBtn={{ className: 'd-block w-40 ', color: 'primary' }}
                          type="submit"
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Key size={16} />&nbsp; Change Password
                          </div>
                        </Btn>
                      </FormGroup>
                      {error && <p style={{ color: 'red' }}>{error}</p>}
                      {passwordChanged && <p style={{ color: 'green' }}>Password changed successfully!</p>}
                    </Form>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Fragment>
  );
};

export default ForgotPwd;
