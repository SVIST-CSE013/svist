import React, { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import { librarianroutes } from './LibrarianRoutes';
import LibrarianLayout from '../Layout/Librarian/Layout';

const LibrarianLayoutRoute = () => {

  return (
    <>
      <Routes>
        {librarianroutes.map(({ path, Component }, i) => (
          <Fragment key={i}>
            <Route element={<LibrarianLayout />} key={i}>
              <Route path={path} element={Component} />
            </Route>
          </Fragment>
        ))}
      </Routes>
    </>
  );
};

export default LibrarianLayoutRoute;