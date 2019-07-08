export function buildOptionFullname(parentFullname: string, name: string) {
    return parentFullname ? parentFullname + "." + name : name;
}
