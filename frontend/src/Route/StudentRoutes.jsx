import React, { Suspense } from 'react';
import { Spinner } from 'reactstrap';

//Lazy Loading
const StudentDashboard = React.lazy(() => import("../Layout/Student/Dashboard"));
const StudentAttendance = React.lazy(() => import("../Layout/Student/CheckAttendance"));
const StudentAttendanceAnalytics = React.lazy(() => import("../Layout/Student/Analytics"));
const StudentSubjects = React.lazy(() => import("../Layout/Student/Subjects"));
const StudentViewNotice = React.lazy(() => import("../Layout/Student/Notices"));
const StudentViewMaterial = React.lazy(() => import("../Layout/Student/Materials/ViewMaterial"));
const StudentViewTimetable = React.lazy(() => import("../Layout/Student/Timetables"));
const StudentEventCalendar = React.lazy(() => import("../Layout/Student/Calendar"));
const StudentViewProfile = React.lazy(() => import("../Layout/Student/Profile/ViewProfile"));


export const studentroutes = [
  { path: `${process.env.PUBLIC_URL}/dashboard`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><StudentDashboard/></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/attendance`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><StudentAttendance/></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/analytics`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><StudentAttendanceAnalytics/></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/subjects`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><StudentSubjects/></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/viewnotice`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><StudentViewNotice/></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/viewmaterial`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><StudentViewMaterial/></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/viewtimetable`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><StudentViewTimetable/></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/profile`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><StudentViewProfile/></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/eventcalendar`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><StudentEventCalendar/></Suspense>)},
];
