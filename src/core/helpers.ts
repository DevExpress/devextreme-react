export function getNestedValue(obj: object, keyParts: string[]): any {
    let current = obj;
    keyParts.some((part) => {
        current = current[part];

        return current === undefined || current === null;
    });

    return current;
}

export function addPrefixToKeys(obj: Record<string, any>, prefix: string): Record<string, any> {
    const result = {};
    Object.keys(obj).forEach((key) => result[prefix + key] = obj[key]);

    return result;
}

export function generateID() {
    Math.random().toString(36).substr(2);
}
