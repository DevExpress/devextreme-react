import * as React from "react";
import { Scheduler } from "../src/scheduler";
import { movies } from "./data";
import Example from "./example-block";

const currentDate = new Date(2015, 4, 25);
const groups = ["theatreId"];

export default function() {
    return (
        <Example title="Scheduler Example">
            <Scheduler
                dataSource={movies}
                views={["week"]}
                defaultCurrentView="week"
                defaultCurrentDate={currentDate}
                groups={groups}
                height={600}
                firstDayOfWeek={0}
                startDayHour={9}
                endDayHour={23}
                showAllDayPanel={false}
                crossScrollingEnabled={true}
                cellDuration={20}
                editing={{ allowAdding: false }}
                appointmentRender={appointmentRender}
                appointmentTooltipRender={tooltipRender}
            />
        </Example>
    );
}

function tooltipRender(model: any) {
    return <div>Movie id: {model.appointmentData.movieId}</div>;
}

function appointmentRender(model: any) {
    return (
        <div>
            Movie id: {model.appointmentData.movieId}
        </div>
    );
}
