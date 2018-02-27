export function removePrefix(value: string, prefix: string): string {
    return new RegExp(`^${prefix}`, "i").test(value) ? value.substring(prefix.length) : value;
}
