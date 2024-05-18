import React, {useState, useEffect} from 'react';
import { Card, CardBody } from 'reactstrap';
import axios from 'axios';
import { H4, Image, P } from '../../../AbstractElements';
import { baseApiURL } from '../../../baseUrl';
import welcome from '../../../assets/images/dashboard-3/widget.svg';

const GreetingCard = () => {
  const [name, setName] = useState();
  const [department, setDepartment] = useState();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/checkauthentication`, {
          withCredentials: true,
        });

        const data = response.data.user;
        setName(data.name);
        setDepartment(data.department);

      } catch (error) {
          console.log();
      }
    };

    fetchUserDetails();
  }, [name , department]);

  return (
    <Card className='o-hidden welcome-card'>
      <CardBody>
        <H4 attrH4={{ className: 'mb-5 mt-1 f-w-500 mb-0 f-22' }}>
          Hello, {name}
        </H4>
        <P>Welcome to SVIST {department} Department</P>
      </CardBody>
      <Image attrImage={{ className: 'welcome-img', src: welcome, alt: 'search image' }} />
    </Card>
  );
};

export default GreetingCard;
