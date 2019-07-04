import * as React from "react";
import { TemplatesStore } from "./templates-store";

class TemplatesRenderer extends React.PureComponent<{templatesStore: TemplatesStore}> {
    public render() {
        return React.createElement(
            React.Fragment,
            {},
            this.props.templatesStore.renderWrappers()
        );
    }
}

export {
    TemplatesRenderer
};
