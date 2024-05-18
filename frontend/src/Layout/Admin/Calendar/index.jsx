import DragCalendar from "./DragCalendar";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import React, { Fragment } from "react";

const Calendar = () => {
  return (
    <Fragment>
      <span>&nbsp;</span>
      <Container fluid={true} className="calendar-basic">
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                <div className="basic-calendar">
                  <Row>
                    <DragCalendar />
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};
export default Calendar;
