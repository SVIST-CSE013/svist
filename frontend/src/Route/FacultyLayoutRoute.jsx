import React, { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import { facultyroutes } from './FacultyRoutes';
import FacultyLayout from '../Layout/Faculty/Layout';

const FacultyLayoutRoute = () => {

  return (
    <>
      <Routes>
        {facultyroutes.map(({ path, Component }, i) => (
          <Fragment key={i}>
            <Route element={<FacultyLayout />} key={i}>
              <Route path={path} element={Component} />
            </Route>
          </Fragment>
        ))}
      </Routes>
    </>
  );
};

export default FacultyLayoutRoute;