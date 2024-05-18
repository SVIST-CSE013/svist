import React, {useState , useEffect} from 'react';
import axios from 'axios';
import { baseApiURL } from '../../../baseUrl';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Media } from 'reactstrap';
import { H4, P, Btn} from '../../../AbstractElements';

const GreetingCard = () => {
  const [name, setName] = useState();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/checkauthentication`, {
          withCredentials: true,
        });

        const data = response.data.user;
        setName(data.name);

      } catch (error) {
          console.log();
      }
    };

    fetchUserDetails();
  }, [name]);

  return (
    <Col className='col-xxl-4 col-sm-6 box-col-6'>
      <Card className=' profile-box'>
        <CardBody>
          <Media>
            <Media body>
              <div className='greeting-user'> 
                <H4 attrH4={{ className: 'f-w-600' }}>Welcome {name} !!</H4>
                <P>This is SVIST College Management System.</P>
                <div className='whatsnew-btn'>
                  <Link to="/admin/profile"><Btn attrBtn={{ color: 'transparent', outline: true, className: 'btn btn-outline-white' }}>View Profile</Btn></Link>
                </div>
              </div>
            </Media>
          </Media>
        </CardBody>
      </Card>
    </Col>
  );
};

export default GreetingCard;
