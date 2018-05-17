import * as dasherize from "dasherize";
import { extname as getPathExtension } from "path";

export function removeExtension(path: string) {
    return path.slice(0, - getPathExtension(path).length);
}

export function removePrefix(value: string, prefix: string): string {
    return new RegExp(`^${prefix}`, "i").test(value) ? value.substring(prefix.length) : value;
}

export function toKebabCase(value: string): string {
    return dasherize(value);
}

export function uppercaseFirst(value: string): string {
    return value[0].toUpperCase() + value.substr(1);
}

export function lowercaseFirst(value: string): string {
    return value[0].toLowerCase() + value.substr(1);
}

export function compareStrings(a: string, b: string) {
    return a.localeCompare(b, undefined, { caseFirst: "upper" });
}

export function createKeyComparator<T>(keyGetter: (x: T) => string) {
    return (a: T, b: T) => compareStrings(keyGetter(a), keyGetter(b));
}

export function removeElement<T>(array: T[], element: T) {
    const index = array.indexOf(element);
    if (index > -1) {
        array.splice(index, 1);
    }
}

export function isNotEmptyArray(array: any[]): boolean {
    return !isEmptyArray(array);
}

export function isEmptyArray(array: any[]): boolean {
    return array === undefined || array === null || array.length === 0;
}
