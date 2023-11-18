import upperCaseFirstLetter from '@/lib/util/upperCaseFirstLetter';


export default function camelCaseToSpaces(str: string, firstLaterToUppercase = true) {
    const regex = /([a-z])([A-Z])/g;
    str = str.replace(regex, '$1 $2').toLowerCase();

    return firstLaterToUppercase ? upperCaseFirstLetter(str) : str;
}
