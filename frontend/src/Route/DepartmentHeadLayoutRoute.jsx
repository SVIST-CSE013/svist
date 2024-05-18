import React, { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import { departmentheadroutes } from './DepartmentHeadRoutes';
import DepartmentHeadLayout from '../Layout/Department-Head/Layout';

const DepartmentHeadLayoutRoute = () => {

  return (
    <>
      <Routes>
        {departmentheadroutes.map(({ path, Component }, i) => (
          <Fragment key={i}>
            <Route element={<DepartmentHeadLayout />} key={i}>
              <Route path={path} element={Component} />
            </Route>
          </Fragment>
        ))}
      </Routes>
    </>
  );
};

export default DepartmentHeadLayoutRoute;