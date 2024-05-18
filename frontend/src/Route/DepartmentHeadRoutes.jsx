import React, { Suspense } from 'react';
import { Spinner } from 'reactstrap';

//Lazy Loading for Department-Head Dashboard
const DepartmentHeadDashboard = React.lazy(() => import("../Layout/Department-Head/Dashboard"));

//Lazy Loading for Other Routes
const DepartmentHeadSearchStudent = React.lazy(() => import("../Layout/Department-Head/Students/SearchStudent"));
const DepartmentFaculties = React.lazy(() => import("../Layout/Department-Head/Faculties"));
const DepartmentSubjects = React.lazy(() => import("../Layout/Department-Head/Subjects"));
const DepartmentHeadStudentAttendance = React.lazy(() => import("../Layout/Department-Head/Students/StudentAttendance"));
const DepartmentHeadStudentAttendanceReport = React.lazy(() => import("../Layout/Department-Head/Students/StudentAttendanceReport"));
const DepartmentHeadAddNotice = React.lazy(() => import("../Layout/Department-Head/Notices"));
const DepartmentHeadAddMaterial = React.lazy(() => import("../Layout/Department-Head/Materials"));
const DepartmentHeadAddTimetable = React.lazy(() => import("../Layout/Department-Head/Timetables"));
const DepartmentHeadViewProfile = React.lazy(() => import("../Layout/Department-Head/Profile/ViewProfile"));
const DepartmentHeadEventCalendar = React.lazy(() => import("../Layout/Department-Head/Calendar"));
const DepartmentHeadCredentialGenerator = React.lazy(() => import("../Layout/Department-Head/Credential-Generator"));
const DepartmentHeadActivatedUsers = React.lazy(() => import("../Layout/Department-Head/AcivatedUsers"));

export const departmentheadroutes = [
  { path: `${process.env.PUBLIC_URL}/dashboard`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><DepartmentHeadDashboard/></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/studentdetails`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><DepartmentHeadSearchStudent/></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/faculties`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><DepartmentFaculties/></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/subjects`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><DepartmentSubjects/></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/studentattendance`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><DepartmentHeadStudentAttendance/></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/studentreport`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><DepartmentHeadStudentAttendanceReport/></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/notice`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><DepartmentHeadAddNotice/></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/material`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><DepartmentHeadAddMaterial/></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/timetable`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><DepartmentHeadAddTimetable/></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/profile`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><DepartmentHeadViewProfile/></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/eventcalendar`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><DepartmentHeadEventCalendar/></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/credentials-manager`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><DepartmentHeadCredentialGenerator /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/activated-users`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><DepartmentHeadActivatedUsers /></Suspense>)},
];
