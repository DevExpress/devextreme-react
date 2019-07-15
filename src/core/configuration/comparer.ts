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
        const config = buildNode(current, changesAccum.templates, true);
        changesAccum.options[current.fullName] = config.options;
        return;
    }

    appendRemovedValues(current.options, prev.options, changesAccum);
    appendRemovedValues(current.configCollections, prev.configCollections, changesAccum);
    appendRemovedValues(current.configs, prev.configs, changesAccum);

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

    buildTemplates(current, {}, changesAccum.templates);
}

function appendRemovedValues(
    current: Record<string, any>,
    prev: Record<string, any>,
    changesAccum: IConfigChanges
) {
    const removedKeys = Object.keys(prev).filter((key) => Object.keys(current).indexOf(key) < 0);

    for (const key of removedKeys) {
        changesAccum.options[mergeNameParts(current.fullName, key)] = undefined;
    }
}

function compareCollections(
    current: Record<string, any>,
    prev: Record<string, any>,
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
            changesAccum.options[mergeNameParts(current.fullname, key)] = updatedCollection;
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
