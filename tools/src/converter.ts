import { lowercaseFirst } from "./helpers";

function convertTypes(types: string[]): string[] {
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
        case "String":
        case "Number":
        case "Array":
        case "Object":
            return lowercaseFirst(type);

        case "Boolean":
            return "bool";

        case "Function":
            return "func";
    }

    return "Any";
}

export { convertTypes };
