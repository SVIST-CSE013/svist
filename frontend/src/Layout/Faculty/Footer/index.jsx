import React from 'react';
import { Fragment } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { H6, P } from '../../../AbstractElements';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <Col md="12" className="footer-copyright text-center">
              <P attrPara={{ className: "mb-1" }}>Copyright {currentYear} © by Arnab Modak & Rounak Saha.</P>
              <H6 attrPara={{ className: "mb-0" }}>(Always Use Google Chrome For Best View)</H6>
            </Col>
          </Row>
        </Container>
      </footer>
    </Fragment>
  );
};

export default Footer;