import { buildConfig } from "./builder";
import { ConfigNode } from "./config-node";

export function buildOptionFullname(parentFullname: string, name: string) {
    return parentFullname ? parentFullname + "." + name : name;
}

export function getOptionValue(node: ConfigNode, fullNameParts: string[]): any {
    const name = fullNameParts.shift();

    if (!name) {
        return buildConfig(node, true);
    }

    const optionInfo = parseOptionName(name);

    if (optionInfo.isCollectionItem) {
        const collection = node.collections[optionInfo.name];
        if (!collection) {
            return;
        }

        const item = collection[optionInfo.index];
        if (!item) {
            return;
        }

        return getOptionValue(item, fullNameParts);
    }

    const child = node.children[optionInfo.name];
    if (child) {
        return getOptionValue(child, fullNameParts);
    }

    const value = node.values[optionInfo.name];
    if (value) {
        return value;
    }

    return;
}

function parseOptionName(name: string): IOptionInfo | ICollectionOptionInfo {
    const parts = name.split("[");

    if (parts.length === 1) {
        return {
            isCollectionItem: false,
            name
        };
    }

    return {
        isCollectionItem: true,
        name: parts[0],
        index: Number(parts[1].slice(0, -1))
    };
}

interface IOptionInfo {
    isCollectionItem: false;
    name: string;
}

interface ICollectionOptionInfo {
    isCollectionItem: true;
    name: string;
    index: number;
}
