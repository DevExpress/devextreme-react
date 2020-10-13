import * as React from 'react';
import Example from './example-block';

import Map, {
  Location, Marker, Route, Tooltip,
} from '../src/map';

interface IPosition {
  lat: number;
  lng: number;
}

const startPos = {
  lat: 40.71000,
  lng: -73.91000,
};

export default class extends React.Component<any, { text: string; pos: IPosition }> {
  constructor(props: any) {
    super(props);
    const pos = { ...startPos };
    this.state = {
      text: JSON.stringify(pos),
      pos,
    };

    this.updatePos = this.updatePos.bind(this);
  }

  public updatePos() {
    const pos = {
      lat: this.state.pos.lat + 0.01,
      lng: this.state.pos.lng + 0.05,
    };

    this.setState({
      text: JSON.stringify(pos),
      pos,
    });
  }

  public render() {
    return (
      <Example title="dxMap" state={this.state}>
        <button onClick={this.updatePos}>Move!</button>
        <Map
          provider="bing"
          defaultZoom={11}
          height={440}
          controls={true}
        >
          <Marker iconSrc="https://js.devexpress.com/Demos/RealtorApp/images/map-marker.png">
            <Tooltip text="Times Square" />
            <Location lat={40.755833} lng={-73.986389} />
          </Marker>

          <Marker iconSrc="https://js.devexpress.com/Demos/RealtorApp/images/map-marker.png">
            <Tooltip text="Central Park" />
            <Location lat={40.7825} lng={-73.966111} />
          </Marker>

          <Marker iconSrc="https://js.devexpress.com/Demos/RealtorApp/images/map-marker.png">
            <Tooltip text="Start" />
            <Location {...startPos} />
          </Marker>

          <Marker>
            <Tooltip text={JSON.stringify(this.state.pos)} />
            <Location {...this.state.pos} />
          </Marker>

          <Route color="green">
            <Location lat={40.755833} lng={-73.986389} />
            <Location lat={40.7825} lng={-73.966111} />
            <Location {...startPos} />
            <Location {...this.state.pos} />
          </Route>
        </Map>
      </Example>
    );
  }
}
