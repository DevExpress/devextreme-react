import { ITemplateMeta } from "./template";

function separateProps(
    props: Record<string, any>,
    defaultsProps: Record<string, string>,
    templateProps: ITemplateMeta[]
): {
    options: Record<string, any>;
    defaults: Record<string, any>;
    templates: Record<string, any>;
} {
    const defaults: Record<string, any> = {};
    const options: Record<string, any> = {};
    const templates: Record<string, any> = {};

    const knownTemplates: Record<string, any> = {};

    templateProps.forEach((value) => {
        knownTemplates[value.component] = true;
        knownTemplates[value.render] = true;
    });

    Object.keys(props).forEach((key) => {
        const defaultOptionName = defaultsProps ? defaultsProps[key] : null;

        if (key === "children") {
            return;
        }

        if (defaultOptionName) {
            defaults[defaultOptionName] = props[key];
        } else if (knownTemplates[key]) {
            templates[key] = props[key];
        } else {
            options[key] = props[key];
        }
    });

    return { options, defaults, templates };
}

export {
    separateProps
};
