import { IArrayDescr, ITypeDescr } from "../integration-data-model";
import { lowercaseFirst } from "./helpers";

function toPropTypingType(types: string[]): string[] {
    if (types === undefined || types === null || types.length === 0) {
        return;
    }

    const convertedTypes = new Set(types.map(convertType));
    if (convertedTypes.has("Any")) {
        return;
    }

    return Array.from(convertedTypes);
}

function convertType(type: string): string {
    switch (type) {
        case inputTypes.string:
        case inputTypes.number:
        case inputTypes.array:
        case inputTypes.object:
            return lowercaseFirst(type);

        case inputTypes.bool:
            return "bool";

        case inputTypes.func:
            return "func";
    }

    return "Any";
}

interface ICustomTypeRef {
    type: string;
    isCollectionItem: boolean;
}

const inputTypes = {
    array: "Array",
    string: "String",
    number: "Number",
    object: "Object",
    bool: "Boolean",
    func: "Function"
};

export {
    toPropTypingType
};
