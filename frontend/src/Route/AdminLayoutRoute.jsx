import React, { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import { adminroutes } from './AdminRoutes';
import AdminLayout from '../Layout/Admin/Layout';

const AdminLayoutRoute = () => {

  return (
    <>
      <Routes>
        {adminroutes.map(({ path, Component }, i) => (
          <Fragment key={i}>
            <Route element={<AdminLayout />} key={i}>
              <Route path={path} element={Component} />
            </Route>
          </Fragment>
        ))}
      </Routes>
    </>
  );
};

export default AdminLayoutRoute;