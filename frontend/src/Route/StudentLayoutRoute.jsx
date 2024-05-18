import React, { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import { studentroutes } from './StudentRoutes';
import StudentLayout from '../Layout/Student/Layout';

const StudentLayoutRoute = () => {

  return (
    <>
      <Routes>
        {studentroutes.map(({ path, Component }, i) => (
          <Fragment key={i}>
            <Route element={<StudentLayout />} key={i}>
              <Route path={path} element={Component} />
            </Route>
          </Fragment>
        ))}
      </Routes>
    </>
  );
};

export default StudentLayoutRoute;