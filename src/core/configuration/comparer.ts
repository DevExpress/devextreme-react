import { IConfigNode, ITemplate } from "./config-node";
import { buildNode, buildTemplates } from "./tree";
import { mergeNameParts } from "./utils";

interface IConfigChanges {
    options: Record<string, any>;
    templates: Record<string, ITemplate>;
}

function getChanges(current: IConfigNode, prev: IConfigNode) {
    const changesAccum: IConfigChanges = {
        options: {},
        templates: {}
    };

    compare(current, prev, changesAccum);

    return changesAccum;
}

function compare(current: IConfigNode, prev: IConfigNode, changesAccum: IConfigChanges) {
    if (!prev) {
        changesAccum.options[current.fullName] = buildNode(
            current,
            changesAccum.templates,
            true
        );
        return;
    }

    appendRemovedValues(current.options, prev.options, current.fullName, changesAccum.options);
    appendRemovedValues(current.configCollections, prev.configCollections, current.fullName, changesAccum.options);
    appendRemovedValues(current.configs, prev.configs, current.fullName, changesAccum.options);

    compareCollections(current, prev, changesAccum);

    for (const key of Object.keys(current.configs)) {
        compare(current.configs[key], prev.configs[key], changesAccum);
    }

    for (const key of Object.keys(current.options)) {
        if (current.options[key] === prev.options[key]) {
            continue;
        }

        changesAccum.options[mergeNameParts(current.fullName, key)] = current.options[key];
    }

    compareTemplates(current, prev, changesAccum);
}

function compareTemplates(current: IConfigNode, prev: IConfigNode, changesAccum: IConfigChanges) {
    const currentTemplatesOptions: Record<string, any> = {};
    const currentTemplates: Record<string, ITemplate> = {};
    const prevTemplatesOptions: Record<string, any> = {};
    const prevTemplates: Record<string, ITemplate> = {};

    buildTemplates(current, currentTemplatesOptions, currentTemplates);
    buildTemplates(prev, prevTemplatesOptions, prevTemplates);

    appendRemovedValues(currentTemplatesOptions, prevTemplatesOptions, current.fullName, changesAccum.options);
    // TODO: support switching to default templates
    // appendRemovedValues(currentTemplates, prevTemplates, "", changesAccum.templates);

    for (const key of Object.keys(currentTemplatesOptions)) {
        if (currentTemplatesOptions[key] === prevTemplatesOptions[key]) {
            continue;
        }

        changesAccum.options[mergeNameParts(current.fullName, key)] = currentTemplatesOptions[key];
    }

    for (const key of Object.keys(currentTemplates)) {
        const currentTemplate = currentTemplates[key];
        const prevTemplate = prevTemplates[key];
        if (prevTemplate && currentTemplate.content === prevTemplate.content) {
            continue;
        }

        changesAccum.templates[key] = currentTemplate;
    }
}

function appendRemovedValues(
    current: Record<string, any>,
    prev: Record<string, any>,
    path: string,
    changesAccum: Record<string, any>
) {
    const removedKeys = Object.keys(prev).filter((key) => Object.keys(current).indexOf(key) < 0);

    for (const key of removedKeys) {
        changesAccum[mergeNameParts(path, key)] = undefined;
    }
}

function compareCollections(
    current: IConfigNode,
    prev: IConfigNode,
    changesAccum: IConfigChanges
) {
    for (const key of Object.keys(current.configCollections)) {
        const currentCollection = current.configCollections[key];
        const prevCollection = prev.configCollections[key] || [];
        if (!currentCollection || currentCollection.length !== prevCollection.length) {
            const updatedCollection: Array<Record<string, any>> = [];
            currentCollection.map(
                (item) => {
                    const config = buildNode(item, changesAccum.templates, true);
                    updatedCollection.push(config);
                }
            );
            changesAccum.options[mergeNameParts(current.fullName, key)] = updatedCollection;
            continue;
        }

        for (let i = 0; i < currentCollection.length; i++) {
            compare(currentCollection[i], prevCollection[i], changesAccum);
        }
    }
}

export {
    getChanges
};
