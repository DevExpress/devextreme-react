export function getNestedValue(obj: object, keyParts: string[]): any {
    let current = obj;
    keyParts.some((part) => {
        current = current[part];

        return current === undefined || current === null;
    });

    return current;
}
