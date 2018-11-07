import * as React from "react";
import Example from "./example-block";

import Map, { Location, Marker, Route, Tooltip } from "../src/map";

export default class extends React.Component<any, { text: string; uncontrolledText: string; }> {

    public render() {
        return (
            <Example title="dxMap">
                <Map
                    provider={"bing"}
                    zoom={11}
                    height={440}
                    controls={true}
                >
                    <Marker iconSrc="https://js.devexpress.com/Demos/RealtorApp/images/map-marker.png">
                        <Tooltip text={"Times Square"} />
                        <Location lat={40.755833} lng={-73.986389} />
                    </Marker>

                    <Marker iconSrc="https://js.devexpress.com/Demos/RealtorApp/images/map-marker.png">
                        <Tooltip text={"Central Park"} />
                        <Location lat={40.7825} lng={-73.966111} />
                    </Marker>

                    <Route color="green">
                        <Location lat={40.755833} lng={-73.986389} />
                        <Location lat={40.7825} lng={-73.966111} />
                    </Route>
                </Map>
            </Example>
        );
    }
}
