import React, { Suspense } from 'react';
import { Spinner } from 'reactstrap';

// Lazy loading for AdminDashboard
const AdminDashboard = React.lazy(() => import("../Layout/Admin/Dashboard"));

// Lazy loading for other components
const AdminAddStudent = React.lazy(() => import("../Layout/Admin/Students"));
const AdminAddFaculty = React.lazy(() => import("../Layout/Admin/Faculties"));
const AdminAddStaff = React.lazy(() => import("../Layout/Admin/Staffs"));
const AdminAddDepartment = React.lazy(() => import("../Layout/Admin/Departments"));
const AdminAddSubject = React.lazy(() => import("../Layout/Admin/Subjects"));
const AdminAddMaterial = React.lazy(() => import("../Layout/Admin/Materials"));
const AdminAddNotice = React.lazy(() => import("../Layout/Admin/Notices"));
const AdminAddTimetable = React.lazy(() => import("../Layout/Admin/Timetables"));
const AdminEnquiry = React.lazy(() => import("../Layout/Admin/Enquiries"));
const StudentAttendanceReport = React.lazy(() => import("../Layout/Admin/Students/StudentAttendanceReport"))
const AdminEventCalendar = React.lazy(() => import("../Layout/Admin/Calendar"));
const AdminCredentialGenerator = React.lazy(() => import("../Layout/Admin/Credential-Generator"));
const AdminActivatedUsers = React.lazy(() => import("../Layout/Admin/AcivatedUsers"));
const AdminViewProfile = React.lazy(() => import("../Layout/Admin/Profile/ViewProfile"));
const AddBanner = React.lazy(() => import("../Layout/Admin/Front-End/Home/banner"));
const About = React.lazy(() => import("../Layout/Admin/Front-End/Home/about/AddAbout"));
const Achievements = React.lazy(() => import("../Layout/Admin/Front-End/Home/achievements"));
const Course = React.lazy(() => import("../Layout/Admin/Front-End/Home/courses"));
const Testimonial = React.lazy(() => import("../Layout/Admin/Front-End/Home/testimonials"));
const Events = React.lazy(() => import("../Layout/Admin/Front-End/Home/events"));
const Footer = React.lazy(() => import("../Layout/Admin/Front-End/Home/footer/AddFooterDetails"));
const AddBannerCSE = React.lazy(() => import("../Layout/Admin/Front-End/HomeCSE/banner"));
const AboutDepartmentCSE = React.lazy(() => import("../Layout/Admin/Front-End/HomeCSE/about/AddAbout"));
const AddFaqCSE = React.lazy(() => import("../Layout/Admin/Front-End/HomeCSE/faq"));
const AddGalleryCSE = React.lazy(() => import("../Layout/Admin/Front-End/HomeCSE/gallery"));
const AddBannerECE = React.lazy(() => import("../Layout/Admin/Front-End/HomeECE/banner"));
const AboutDepartmentECE = React.lazy(() => import("../Layout/Admin/Front-End/HomeECE/about/AddAbout"));
const AddFaqECE = React.lazy(() => import("../Layout/Admin/Front-End/HomeECE/faq"));
const AddGalleryECE = React.lazy(() => import("../Layout/Admin/Front-End/HomeECE/gallery"));
const AddBannerEEE = React.lazy(() => import("../Layout/Admin/Front-End/HomeEEE/banner"));
const AboutDepartmentEEE = React.lazy(() => import("../Layout/Admin/Front-End/HomeEEE/about/AddAbout"));
const AddFaqEEE = React.lazy(() => import("../Layout/Admin/Front-End/HomeEEE/faq"));
const AddGalleryEEE = React.lazy(() => import("../Layout/Admin/Front-End/HomeEEE/gallery"));
const AddBannerCE = React.lazy(() => import("../Layout/Admin/Front-End/HomeCE/banner"));
const AboutDepartmentCE = React.lazy(() => import("../Layout/Admin/Front-End/HomeCE/about/AddAbout"));
const AddFaqCE = React.lazy(() => import("../Layout/Admin/Front-End/HomeCE/faq"));
const AddGalleryCE = React.lazy(() => import("../Layout/Admin/Front-End/HomeCE/gallery"));
const AddBannerME = React.lazy(() => import("../Layout/Admin/Front-End/HomeME/banner"));
const AboutDepartmentME = React.lazy(() => import("../Layout/Admin/Front-End/HomeME/about/AddAbout"));
const AddFaqME = React.lazy(() => import("../Layout/Admin/Front-End/HomeME/faq"));
const AddGalleryME = React.lazy(() => import("../Layout/Admin/Front-End/HomeME/gallery"));
const AddBannerMBA = React.lazy(() => import("../Layout/Admin/Front-End/HomeMBA/banner"));
const AboutDepartmentMBA = React.lazy(() => import("../Layout/Admin/Front-End/HomeMBA/about/AddAbout"));
const AddFaqMBA = React.lazy(() => import("../Layout/Admin/Front-End/HomeMBA/faq"));
const AddGalleryMBA = React.lazy(() => import("../Layout/Admin/Front-End/HomeMBA/gallery"));


export const adminroutes = [
  { path: `${process.env.PUBLIC_URL}/dashboard`, Component:(<Suspense fallback={<Spinner type="grow" color="primary" />}><AdminDashboard/></Suspense>) },
  { path: `${process.env.PUBLIC_URL}/students`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AdminAddStudent /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/faculties`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AdminAddFaculty /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/staffs`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AdminAddStaff /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/departments`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AdminAddDepartment /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/subjects`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AdminAddSubject /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/material`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AdminAddMaterial /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/notices`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AdminAddNotice /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/timetable`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AdminAddTimetable /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/enquiries`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AdminEnquiry /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/report`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><StudentAttendanceReport /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/calendar`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AdminEventCalendar /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/credentials-manager`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AdminCredentialGenerator /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/activated-users`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AdminActivatedUsers /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/profile`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AdminViewProfile /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/frontend/home/bannershome`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AddBanner /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/frontend/home/abouthome`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><About /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/frontend/home/achievementshome`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><Achievements /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/frontend/home/courseshome`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><Course /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/frontend/home/testimonialshome`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><Testimonial /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/frontend/home/eventshome`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><Events /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/frontend/home/footerhome`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><Footer /></Suspense>)},

  { path: `${process.env.PUBLIC_URL}/frontend/homeCSE/bannerscse`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AddBannerCSE /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/frontend/homeCSE/aboutcse`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AboutDepartmentCSE /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/frontend/homeCSE/faqscse`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AddFaqCSE /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/frontend/homeCSE/gallerycse`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AddGalleryCSE /></Suspense>)},

  { path: `${process.env.PUBLIC_URL}/frontend/homeECE/bannersece`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AddBannerECE /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/frontend/homeECE/aboutece`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AboutDepartmentECE /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/frontend/homeECE/faqsece`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AddFaqECE /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/frontend/homeECE/galleryece`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AddGalleryECE /></Suspense>)},

  { path: `${process.env.PUBLIC_URL}/frontend/homeEEE/bannerseee`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AddBannerEEE /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/frontend/homeEEE/abouteee`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AboutDepartmentEEE /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/frontend/homeEEE/faqseee`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AddFaqEEE /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/frontend/homeEEE/galleryeee`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AddGalleryEEE /></Suspense>)},

  { path: `${process.env.PUBLIC_URL}/frontend/homeCE/bannersce`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AddBannerCE /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/frontend/homeCE/aboutce`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AboutDepartmentCE /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/frontend/homeCE/faqsce`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AddFaqCE /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/frontend/homeCE/galleryce`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AddGalleryCE /></Suspense>)},

  { path: `${process.env.PUBLIC_URL}/frontend/homeME/bannersme`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AddBannerME /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/frontend/homeME/aboutme`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AboutDepartmentME /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/frontend/homeME/faqsme`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AddFaqME /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/frontend/homeME/galleryme`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AddGalleryME /></Suspense>)},

  { path: `${process.env.PUBLIC_URL}/frontend/homeMBA/bannersmba`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AddBannerMBA /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/frontend/homeMBA/aboutmba`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AboutDepartmentMBA /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/frontend/homeMBA/faqsmba`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AddFaqMBA /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/frontend/homeMBA/gallerymba`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><AddGalleryMBA /></Suspense>)},

];

