import React, { Suspense } from 'react';
import { Spinner } from 'reactstrap';

//Lazy Loading
const LibraryMemberDashboard = React.lazy(() => import("../Layout/LibraryMember/Dashboard"));
const LibraryMemberAddBooks = React.lazy(() => import("../Layout/LibraryMember/Books"));
const LibraryMemberAddIssue = React.lazy(() => import("../Layout/LibraryMember/Issue"));
const LibraryMemberDepartments = React.lazy(() => import("../Layout/LibraryMember/Departments"));
const LibraryMemberNotices = React.lazy(() => import("../Layout/LibraryMember/Notices"));
const LibraryMemberEventCalendar = React.lazy(() => import("../Layout/LibraryMember/Calendar"));
const LibraryMemberViewProfile = React.lazy(() => import("../Layout/LibraryMember/Profile/ViewProfile"));


export const librarymemberroutes = [
  { path: `${process.env.PUBLIC_URL}/dashboard`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><LibraryMemberDashboard/></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/books`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><LibraryMemberAddBooks /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/issues-returns`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><LibraryMemberAddIssue /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/departments`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><LibraryMemberDepartments /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/notices`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><LibraryMemberNotices /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/calendar`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><LibraryMemberEventCalendar /></Suspense>)},
  { path: `${process.env.PUBLIC_URL}/profile`, Component: (<Suspense fallback={<Spinner type="grow" color="primary" />}><LibraryMemberViewProfile /></Suspense>)},
];
