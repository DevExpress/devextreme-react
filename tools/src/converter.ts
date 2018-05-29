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

function findCustomTypeRef(types: ITypeDescr[]): ICustomTypeRef {
    let result: ICustomTypeRef = null;
    types.some((t) => {
        if (t.isCustomType) {
            result = {
                type: t.type,
                isCollectionItem: false
            };
            return true;
        }

        if (t.type === inputTypes.array) {
            const itemCustomType = findCustomTypeRef((t as IArrayDescr).itemTypes);
            if (itemCustomType) {
                result = {
                    type: itemCustomType.type,
                    isCollectionItem: true
                };
                return true;
            }
        }
    });

    return result;
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
    toPropTypingType,
    findCustomTypeRef
};
