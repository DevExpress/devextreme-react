import * as React from "react";
import * as ReactDOM from "react-dom";

import * as events from "devextreme/events";

const DX_REMOVE_EVENT = "dxremove";

export default class TemplateWrapper extends React.PureComponent<{
    render: any
    data: any,
    container: Element,
    onRemoved: () => void
}, any> {
    public render() {
        return ReactDOM.createPortal(this.props.render(this.props.data), this.props.container);
    }

    public componentDidMount() {
        const element = ReactDOM.findDOMNode(this);
        events.one(element, DX_REMOVE_EVENT, this.props.onRemoved);
    }
}
