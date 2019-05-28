export function getNestedValue(obj: object, keyParts: string[]): any {
    if (!obj) {
        return;
    }

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

export function generateID(): string {
    return Math.random().toString(36).substr(2);
}

export function isEmptyObject(obj: Record<any, any>): boolean {
    return Object.keys(obj).length === 0;
}

export class DoubleKeyMap<TKey1, TKey2, TValue> {
    readonly _map: Map<TKey1, Map<TKey2, TValue>> = new Map();

    public set({ key1, key2 }: { key1: TKey1, key2: TKey2 }, value: TValue) {
        let innerMap = this._map.get(key1);
        if (!innerMap) {
            innerMap = new Map<TKey2, TValue>();
            this._map.set(key1, innerMap);
        }

        innerMap.set(key2, value);
    }

    public get({ key1, key2 }: { key1: TKey1, key2: TKey2 }): TValue | undefined {
        const innerMap = this._map.get(key1);
        return innerMap ? innerMap.get(key2) : undefined;
    }

    public delete({ key1, key2 }: { key1: TKey1, key2: TKey2 }): void {
        const innerMap = this._map.get(key1);
        if (!innerMap) {
            return;
        }

        innerMap.delete(key2);
        if (innerMap.size === 0) {
            this._map.delete(key1);
        }
    }
}
