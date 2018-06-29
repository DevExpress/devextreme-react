import { PropTypes } from "prop-types";
import * as React from "react";

interface ITemplateMeta {
    tmplOption: string;
    component: string;
    render: string;
}

class Template extends React.PureComponent<{
    name: string;
    component?: any;
    render?: any;
}, any> {
    public render() {
        return null;
    }
}

(Template as any).propTypes = {
    name: PropTypes.string.isRequired,
    component: PropTypes.func,
    render: PropTypes.func
};

function findProps(child: React.ReactElement<any>): Record<string, { render: any, component: any }> {
    if (child.type !== Template) {
        return {};
    }
    const result: Record<string, { render: any, component: any }> = {};

    result[child.props.name] = {
        render: child.props.render,
        component: child.props.component
    };

    return result;
}

export {
    ITemplateMeta,
    Template,
    findProps
};
