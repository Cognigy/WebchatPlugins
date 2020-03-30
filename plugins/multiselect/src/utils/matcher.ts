/*
 * Partially, case-insensitivly match the string in another string, case-insensetive
 */

const matcher = (haystack: string, needle: string): boolean => {
    if (String.prototype.includes) {
        return haystack.toLocaleLowerCase().includes(needle.toLocaleLowerCase());
    }

    return haystack.toLocaleLowerCase().indexOf(needle.toLocaleLowerCase()) !== -1;
};

export default matcher;
