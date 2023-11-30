export default function isDateStringValid(dateString: string) {
    const isoRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)((-(\d{2}):(\d{2})|Z)?)$/;
    return isoRegex.test(dateString) && !isNaN(new Date(dateString) as never);
}
