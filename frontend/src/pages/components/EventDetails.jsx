import React from 'react'

function EventDetails({event}) {
    if (!event) {
        return null;
    }

    const {
        title,
        description,
        date,
        image,
    } = event;

  return (
      <div>
          <section class="event_details_page">
              <div class="container">
                  <div class="row">
                      <div class="col-lg-12">
                          <div class="event_details_area">
                              <div class="event_details_img">
                                  <img src={image} alt="event" class="img-fluid w-100"/>
                              </div>
                              <h2>{title} ({date})</h2>
                              <div class="event_details_text">
                                  <h3>Description</h3>
                                  <p>{description}</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>
      </div>
  )
}

export default EventDetails
