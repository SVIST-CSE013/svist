import React, { Suspense } from 'react';
import { Spinner } from 'reactstrap';

//Lazy Loading for Faculty Dashboard
const FacultyDashboard = React.lazy(() => import("../Layout/Faculty/Dashboard"));

//Lazy Loading for Other Routes
const FacultySearchStudent = React.lazy(() => import("../Layout/Faculty/Students/SearchStudent"));
const FacultyStudentAttendance = React.lazy(() => import("../Layout/Faculty/Students/StudentAttendance"));
const FacultyAddNotice = React.lazy(() => import("../Layout/Faculty/Notices"));
const FacultyAddMaterial = React.lazy(() => import("../Layout/Faculty/Materials"));
const FacultyAddTimetable = React.lazy(() => import("../Layout/Faculty/Timetables"));
const FacultyViewProfile = React.lazy(() => import("../Layout/Faculty/Profile/ViewProfile"));
const FacultyEventCalendar = React.lazy(() => import("../Layout/Faculty/Calendar"));

export const facultyroutes = [
  { path: `${process.env.PUBLIC_URL}/dashboard`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><FacultyDashboard/></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/enrolled-students`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><FacultySearchStudent/></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/studentattendance`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><FacultyStudentAttendance/></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/notice`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><FacultyAddNotice/></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/material`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><FacultyAddMaterial/></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/timetable`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><FacultyAddTimetable/></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/profile`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><FacultyViewProfile/></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/eventcalendar`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><FacultyEventCalendar/></Suspense>)},
];
