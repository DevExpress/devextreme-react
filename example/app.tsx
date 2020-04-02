import * as React from "react";
import * as ReactDOM from "react-dom";

import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.compact.css";

import Scheduler, { Resource } from '../src/scheduler';
import Query from 'devextreme/data/query';

import AppointmentTemplate from './AppointmentTemplate';
import AppointmentTooltipTemplate from './AppointmentTooltipTemplate';
import { data, moviesData, theatreData } from './data';

const currentDate = new Date(2015, 4, 25);
const views : any = ['day', 'week', 'timelineDay'];
const groups = ['theatreId'];




class App extends React.Component<{}, { scheduler: any }> {
  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      scheduler: null
    };
    this.getAppointmentTooltipTemplate = this.getAppointmentTooltipTemplate.bind(this);
    this.onAppointmentFormOpening = this.onAppointmentFormOpening.bind(this);
    this.onContentReady = this.onContentReady.bind(this);
  }
  render() {
    return (
      <Scheduler
        dataSource={data}
        views={views}
        defaultCurrentView="day"
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
        appointmentRender={AppointmentTemplate}
        appointmentTooltipRender={this.getAppointmentTooltipTemplate}
        onContentReady={this.onContentReady}
        onAppointmentFormOpening={this.onAppointmentFormOpening}
      >
        <Resource
          dataSource={moviesData}
          fieldExpr="movieId"
          useColorAsDefault={true}
        />
        <Resource
          dataSource={theatreData}
          fieldExpr="theatreId"
        />
      </Scheduler>
    );
  }

  getAppointmentTooltipTemplate(model: any) {
    return <AppointmentTooltipTemplate model={model} />;
  }

  onContentReady(e: { component: any; }) {
    this.state.scheduler === null && this.setState({ scheduler: e.component });
  }

  onAppointmentFormOpening(data: { form: any; appointmentData: { movieId: any; startDate: any; }; }) {
    let form = data.form,
      movieInfo = getMovieById(data.appointmentData.movieId) || {},
      startDate = data.appointmentData.startDate;

    form.option('items', [{
      label: {
        text: 'Movie'
      },
      editorType: 'dxSelectBox',
      dataField: 'movieId',
      editorOptions: {
        items: moviesData,
        displayExpr: 'text',
        valueExpr: 'id',
        onValueChanged: function(args: { value: any; }) {
          movieInfo = getMovieById(args.value);
          form.getEditor('director')
            .option('value', movieInfo.director);
          form.getEditor('endDate')
            .option('value', new Date(startDate.getTime() +
              60 * 1000 * movieInfo.duration));
        }
      },
    }, {
      label: {
        text: 'Director'
      },
      name: 'director',
      editorType: 'dxTextBox',
      editorOptions: {
        value: movieInfo.director,
        readOnly: true
      }
    }, {
      dataField: 'startDate',
      editorType: 'dxDateBox',
      editorOptions: {
        width: '100%',
        type: 'datetime',
        onValueChanged: function(args: { value: any; }) {
          startDate = args.value;
          form.getEditor('endDate')
            .option('value', new Date(startDate.getTime() +
              60 * 1000 * movieInfo.duration));
        }
      }
    }, {
      name: 'endDate',
      dataField: 'endDate',
      editorType: 'dxDateBox',
      editorOptions: {
        width: '100%',
        type: 'datetime',
        readOnly: true
      }
    }, {
      dataField: 'price',
      editorType: 'dxRadioGroup',
      editorOptions: {
        dataSource: [5, 10, 15, 20],
        itemTemplate: function(itemData: any) {
          return `$${itemData}`;
        }
      }
    }
    ]);
  }
}

function getMovieById(id:any) {
  return Query(moviesData).filter(['id', id]).toArray()[0];
}

ReactDOM.render(
    <App/>,
  document.getElementById("app")
);
