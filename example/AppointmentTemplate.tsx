import * as React from "react";
import Query from 'devextreme/data/query';

import { moviesData } from './data';

function getMovieById(id: any) {
  return Query(moviesData).filter(['id', id]).toArray()[0];
}

export default function AppointmentTemplate(model: { appointmentData: { movieId: any; price: void; startDate: any; endDate: any; }; }) {
  console.log("appointment template");
  const movieData = getMovieById(model.appointmentData.movieId) || {};
  return (
    <div className="showtime-preview">
      <div> {movieData.text}</div>
      <div>
        Ticket Price: <strong>${ model.appointmentData.price }</strong>
      </div>
      <div>
        {JSON.stringify(model.appointmentData.startDate)}
      </div>
    </div>
  );
}
