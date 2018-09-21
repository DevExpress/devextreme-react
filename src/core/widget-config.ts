import { ITemplateMeta } from "./template";

const elementPropNames = ["style", "id"];

function separateProps(
    props: Record<string, any>,
    defaultsProps: Record<string, string>,
    templateProps: ITemplateMeta[],
): {
    options: Record<string, any>;
    defaults: Record<string, any>;
    templates: Record<string, any>;
    classNames: string[] | null;
} {
    templateProps = templateProps || [];
    const defaults: Record<string, any> = {};
    const options: Record<string, any> = {};
    const templates: Record<string, any> = {};
    let classNames: string[] | null = null;

    const knownTemplates: Record<string, any> = {};

    templateProps.forEach((value) => {
        knownTemplates[value.component] = true;
        knownTemplates[value.render] = true;
    });

    Object.keys(props).forEach((key) => {
        const defaultOptionName = defaultsProps ? defaultsProps[key] : null;

        if (isIgnoredProp(key)) {
            if (key === "className") {
                classNames = props[key].split(" ");
            }

            return;
        }

        if (defaultOptionName) {
            defaults[defaultOptionName] = props[key];
            return;
        }

        if (knownTemplates[key]) {
            templates[key] = props[key];
            return;
        }

        options[key] = props[key];
    });

    return { options, defaults, templates, classNames };
}

function isIgnoredProp(name: string) {
    return name === "children" || name === "className" || elementPropNames.indexOf(name) > -1;
}

export {
    elementPropNames,
    separateProps
};
