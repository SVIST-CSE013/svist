import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import Swal from 'sweetalert2';
import PDFImg from "../../images/pdf.png";
import New from "../../images/new.gif";
import { baseApiURL } from '../../baseUrl';
import { storage } from '../../Config/firebaseconfig';

function About() {
  const [about, setAbout] = useState({});
  const [noticeData, setNoticeData] = useState([]);
  const [lastFetchedTimestamp, setLastFetchedTimestamp] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/getaboutdetails`);
        const firstItem = response.data[0];

        const storageRef = ref(storage, firstItem.image);
        const imageUrl = await getDownloadURL(storageRef);

        setAbout({
          title: firstItem.title,
          description: firstItem.description,
          image: imageUrl,
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Error Fetching Data!',
          confirmButtonText: 'OK',
        });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/getnewnoticedetails`, {
          params: {
            lastFetchedTimestamp: lastFetchedTimestamp,
            type: 'Front-End Notice Panel',
          },
        });

        setNoticeData((prevNotices) => {
          const updatedNotices = [...prevNotices, ...response.data];

          updatedNotices.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

          const latestNotices = updatedNotices.slice(0, 20);

          if (latestNotices.length > 0) {
            const latestTimestamp = Math.max(...latestNotices.map((notice) => new Date(notice.timestamp)));
            setLastFetchedTimestamp(latestTimestamp);
          }

          return latestNotices;
        });
      } catch (error) {
        console.log(error);
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
    const removeBadgeAfterDays = 7;
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    const shouldRemoveBadge = daysDifference > removeBadgeAfterDays;

    return isNew && !shouldRemoveBadge;
  };

  const isPdfFile = (fileUrl) => {
    const fileExtension = fileUrl.split('?')[0].split('/').pop().split('.').pop().toLowerCase();
    return fileExtension === 'pdf';
  };

  return (
    <div>
      <section className="blog_details_page pt_120 xs_pt_80 pb_120 xs_pb_80" id="about" style={{ backgroundImage: `url(${require('../../images/about_section_bg.jpg')})` }}>
        <div className="container">
          <div className="row">
            <div className="col-xl-7 col-lg-7 wow fadeInUp" data-wow-duration="1s">
              <div className="blog_details_area">
                <div className="blog_details_img">
                  <img src={about.image} alt="blog details" className="img-fluid w-100" />
                </div>
                <div className="blog_details_text">
                  <h2>{about.title}</h2>
                  <p>{about.description}</p>
                </div>
              </div>
            </div>
            <div className="col-xl-5 col-lg-5">
              <div className="sidebar bg-light text-dark" id="sticky_sidebar" style={{ maxHeight: '700px', overflowY: 'auto' }}>
                <h3>Latest Announcements</h3>
                <div className="sidebar_post">
                  <ul>
                    {noticeData.map((notice, index) => (
                      <li key={index}>
                        <div className="img">
                          {isPdfFile(notice.file) ? (
                            < img src={PDFImg} width="100" height="100" alt="PDF Thumbnail" />
                          ) : (
                            <img src={notice.file} width="100" height="100" alt="File Thumbnail" />
                          )}
                        </div>
                        <div className="text">
                          <a href={notice.file} target="_blank" rel="noopener noreferrer">{notice.title}&nbsp;{isRecentlyUpdated(notice.timestamp) && <img className='newbadge-noticepanel' src={New}/>}</a>
                          <p><i className="fal fa-calendar-alt"></i> {notice.date}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
