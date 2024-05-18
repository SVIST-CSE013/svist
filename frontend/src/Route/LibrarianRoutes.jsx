import React, { Suspense } from 'react';
import { Spinner } from 'reactstrap';

//Lazy Loading
const LibrarianDashboard = React.lazy(() => import("../Layout/Librarian/Dashboard"));
const LibrarianAddBooks = React.lazy(() => import("../Layout/Librarian/Books"));
const LibrarianAddIssue = React.lazy(() => import("../Layout/Librarian/Issue"));
const LibrarianBookReturn = React.lazy(() => import("../Layout/Librarian/Return"));
const LibraryDepartments = React.lazy(() => import("../Layout/Librarian/Departments"));
const LibraryNotices = React.lazy(() => import("../Layout/Librarian/Notices"));
const LibrarianAddStudent = React.lazy(() => import("../Layout/Librarian/Members/Students"));
const LibrarianEventCalendar = React.lazy(() => import("../Layout/Librarian/Calendar"));
const LibrarianViewProfile = React.lazy(() => import("../Layout/Librarian/Profile/ViewProfile"));


export const librarianroutes = [
  { path: `${process.env.PUBLIC_URL}/dashboard`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><LibrarianDashboard/></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/books`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><LibrarianAddBooks /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/issues`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><LibrarianAddIssue /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/returns`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><LibrarianBookReturn /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/departments`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><LibraryDepartments /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/notices`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><LibraryNotices /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/calendar`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><LibrarianEventCalendar /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/members/students`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><LibrarianAddStudent /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/profile`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><LibrarianViewProfile /></Suspense>)},
];
