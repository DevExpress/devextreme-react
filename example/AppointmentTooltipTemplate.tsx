import * as React from "react";

import Query from 'devextreme/data/query';


import { moviesData } from './data';

function getMovieById(id: any) {
  return Query(moviesData).filter(['id', id]).toArray()[0];
}

export default class AppointmentTooltipTemplate extends React.Component<{model: any, scheduler?: any}, {movieData: any}> {
  constructor(props: {model: any, scheduler?: any}) {
    super(props);
    this.state = {
      movieData: getMovieById(props.model.appointmentData.movieId)
    };
  }

  render() {
    console.log("appointment tooltip template");
    const { movieData } = this.state;
    return (
      <div className="movie-tooltip">
        <img src={movieData.image} />
        <div className="movie-info">
          <div className="movie-title">
            {movieData.text} ({movieData.year})
          </div>
          <div>
            Director: {movieData.director}
          </div>
          <div>
            Duration: {movieData.duration} minutes
          </div>
        </div>
      </div>
    );
  }
}
