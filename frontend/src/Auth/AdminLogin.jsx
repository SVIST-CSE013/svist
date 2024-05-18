import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Col, Container, Form, FormGroup, Input, Label, Row } from "reactstrap";
import { Btn, H4, P } from "../AbstractElements";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { baseApiURL } from "../baseUrl";
import axios from "axios";
import Logo from "../assets/images/logo/svist-logo.png";

const AdminLogin = () => {
  const [userid, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/checkauthentication`, {
          withCredentials: true,
        });
        const data = response.data;

        if (data.authenticated && data.user.role === 'Admin') {
          navigate(`${process.env.PUBLIC_URL}/admin/dashboard`);
        } else {
          setLoading(false);
        }

      } catch (error) {
          console.log();
          setLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  const loginAuth = async (e) => {
    e.preventDefault();
    setLoadingMessage(true);
  
    try {
      const response = await axios.post(`${baseApiURL()}/login`, {
        userid,
        password,
        requestedRole: 'Admin',
      }, {
        withCredentials: true
      });

      const data = response.data;
  
      if (data.success && data.role === 'Admin') {
        document.cookie = `sessionID=${data.sessionID}; path=/`;
        navigate(`${process.env.PUBLIC_URL}/admin/dashboard`);
        
      } else {
          toast.error('Invalid credentials.');
      }
    } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error('Invalid Credentials.');
        } else if (error.response && error.response.status === 403) {
          toast.error('User Not Activated');
        } else if (error.response && error.response.status === 404) {
          toast.error('User Doesnot Exists');
        } else {
          toast.error('Something Went Wrong!!');
        }
    } finally {
      setLoadingMessage(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <Fragment>
      <Container fluid={true} className="p-0 login-page">
        <Row className="align-items-center">
          <Col xs="12">
            <div className="login-card">
              <div>
                <div className="text-center mb-4">
                  <img src={Logo} alt="Logo" style={{maxWidth: "100px"}} />
                </div>
                <div className="login-main login-tab">
                  <Form className="theme-form" onSubmit={loginAuth}>
                    <H4>Administrator Login Portal</H4>
                    <P>{"Enter your userid & password to login"}</P>
                    <FormGroup>
                      <Label className="col-form-label">User ID</Label>
                      <Input className="form-control" type="text" onChange={(e) => setUserId(e.target.value)} value={userid} required autoFocus onInvalid={(e) => e.target.setCustomValidity("Please enter User ID.")} onInput={(e) => e.target.setCustomValidity("")}/>
                    </FormGroup>
                    <FormGroup className='position-relative'>
                      <Label className='m-0 col-form-label'>Password</Label>
                      <Input
                        className='form-control'
                        type={togglePassword ? 'text' : 'password'}
                        required
                        placeholder='*********'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onInvalid={(e) => e.target.setCustomValidity("Enter Password")} onInput={(e) => e.target.setCustomValidity("")}
                      />
                      <div className='show-hide' onClick={() => setTogglePassword(!togglePassword)}>
                        <span className={togglePassword ? '' : 'show'}></span>
                      </div>
                    </FormGroup>
                    <div className="position-relative form-group mb-0">
                      <div className="checkbox">
                        <Input id="checkbox1" type="checkbox" />
                        <Label className="text-muted" for="checkbox1">
                          Remember Password
                        </Label>
                      </div>
                      <Link className="link" to="/forgotpassword">Forgot Password</Link>
                      <Btn attrBtn={{ color: "primary", className: "d-block w-100 mt-2 btn-pill btn-air-primary", type: "submit" }}>
                          {loadingMessage ? 'Logging In...' : 'Log In'}
                      </Btn>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </Fragment>
  );
};

export default AdminLogin;
