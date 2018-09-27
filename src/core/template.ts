import { PropTypes } from "prop-types";
import * as React from "react";

interface ITemplateMeta {
    tmplOption: string;
    component: string;
    render: string;
}

interface ITemplateProps {
    name: string;
    component?: any;
    render?: any;
}

class Template extends React.PureComponent<ITemplateProps, any> {
    public render() {
        return null;
    }
}

const requiredPropsCheck = (props: Record<string, any>) => {
    if (!props.component && !props.render) {
        return new Error("One of 'component' or 'render' is required by Template component.")
    }
    return null;
}

(Template as any).propTypes = {
    name: PropTypes.string.isRequired,
    component: requiredPropsCheck,
    render: requiredPropsCheck
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
