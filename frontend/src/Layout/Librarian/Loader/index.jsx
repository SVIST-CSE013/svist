import React, { Fragment, useState, useEffect } from 'react';
import { Spinner } from 'reactstrap';

const Loader = (props) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(false);
    }, 200);

    return () => {
      clearTimeout(timeout);
    };
  }, [show]);

  return (
    <Fragment>
      {show && (
        <div className="loader-wrapper">
          <div className="loader">
            <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Loader;
