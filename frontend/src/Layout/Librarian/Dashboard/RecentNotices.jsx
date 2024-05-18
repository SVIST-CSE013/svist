import React, {useEffect, useState} from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { H5, Btn, UL, LI, H6 } from '../../../AbstractElements';
import axios from 'axios';
import New from "../../../images/new.gif";
import { Link } from 'react-router-dom';
import { baseApiURL } from '../../../baseUrl';
import { IconFileText } from '@tabler/icons-react';


const RecentNotices = () => {
  const [notices, setNotices] = useState([]);
  const [lastFetchedTimestamp, setLastFetchedTimestamp] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/getnewnoticedetails`, {
          params: {
            lastFetchedTimestamp: lastFetchedTimestamp,
            type: ['Library Notice Panel', 'Library-Member Notice Panel']
          },
        });

        setNotices((prevNotices) => {
          const updatedNotices = [...prevNotices, ...response.data];
          updatedNotices.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          const latestNotices = updatedNotices.slice(0, 1);

          if (latestNotices.length > 0) {
            const latestTimestamp = Math.max(...latestNotices.map((notice) => new Date(notice.timestamp)));
            setLastFetchedTimestamp(latestTimestamp);
          }

          return latestNotices;
        });
        
      } catch (error) {
          console.log();
      }
    };

    fetchData();
  }, [lastFetchedTimestamp]);

  const isRecentlyUpdated = (timestamp) => {
    const now = new Date();
    const noticeDate = new Date(timestamp);
    const timeDifference = now - noticeDate;
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    
    const isNew = hoursDifference <= 24;

    const removeBadgeAfterHours = 48;
    const shouldRemoveBadge = hoursDifference > removeBadgeAfterHours;

    return isNew && !shouldRemoveBadge;
  };


  return (
    <Card className='schedule-card'>
      <CardHeader className='card-no-border'>
        <div className='header-top'>
          <H5 attrH5={{ className: 'm-0' }}>Recent Notices Uploaded</H5>
          <div className='card-header-right-icon'>
            <Btn attrBtn={{ color: 'light-primary', className: 'btn badge-light-primary' }}><Link to="/library/notices">View All Notices</Link></Btn>
          </div>
        </div> 
      </CardHeader>
      <CardBody className='pt-0'>
        <UL attrUL={{ className: 'schedule-list d-flex' }}>
          {notices.map((item, i) => (
            <LI key={i} attrLI={{ className: 'primary' }}>
              <IconFileText color="#ff4500" style={{width: "55", height: "50"}} />
              &nbsp;
              <div>
                <Link to={item.file} target='_blank'><H6 className='mb-1'>{item.title}&nbsp;{isRecentlyUpdated(item.timestamp) && <img className="newbadge-topbar" src={New} />}</H6></Link>
                <UL>
                  <LI attrLI={{ className: 'f-light' }}>
                    <span>{item.date}</span>
                  </LI>
                </UL>
              </div>
            </LI>
          ))}
        </UL>
      </CardBody>
    </Card>
  );
};

export default RecentNotices;
