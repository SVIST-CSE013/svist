import React, { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import { librarymemberroutes } from './LibraryMemberRoutes';
import LibraryMemberLayout from '../Layout/LibraryMember/Layout';

const LibraryMemberLayoutRoute = () => {

  return (
    <>
      <Routes>
        {librarymemberroutes.map(({ path, Component }, i) => (
          <Fragment key={i}>
            <Route element={<LibraryMemberLayout />} key={i}>
              <Route path={path} element={Component} />
            </Route>
          </Fragment>
        ))}
      </Routes>
    </>
  );
};

export default LibraryMemberLayoutRoute;