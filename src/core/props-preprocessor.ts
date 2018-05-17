import { Children, ReactElement } from "react";
import { ITemplateMeta, Template } from "./template";

function splitProps(
    props: Record<string, any>,
    defaultsProps: Record<string, string>,
    templateProps: ITemplateMeta[]
): {
    defaults: Record<string, any>,
    options: Record<string, any>,
    templates: Record<string, any>,
    nestedTemplates: Record<string, any>
} {
    const defaults: Record<string, any> = {};
    const options: Record<string, any> = {};
    const templates: Record<string, any> = {};
    const nestedTemplates: Record<string, any> = {};

    const knownTemplates: Record<string, any> = {};

    templateProps.forEach((value) => {
        knownTemplates[value.component] = true;
        knownTemplates[value.render] = true;
    });

    Object.keys(props).forEach((key) => {
        const defaultOptionName = defaultsProps ? defaultsProps[key] : null;

        if (defaultOptionName) {
            defaults[defaultOptionName] = props[key];
        } else if (knownTemplates[key]) {
            templates[key] = props[key];
        } else if (key === "children") {
            Children.forEach(props[key], (child: ReactElement<any>) => {
                if (child.type === Template) {
                    nestedTemplates[child.props.name] = {
                        render: child.props.render,
                        component: child.props.component
                    };
                }
            });
        } else {
            options[key] = props[key];
        }
    });

    return { defaults, options, templates, nestedTemplates };
}

export { splitProps };
