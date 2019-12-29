/**
 * Aligned columns in text arrays output
 * @param strArr - string[] to extend
 * @param data - arbitrary data source array
 * @param extendFn - string extender
 * @param joiner - char to fill the gap, defaults to ' '
 */
export function alignAndExtendStrArray<T>(
    strArr: string[],
    data: T[],
    extendFn: (el: T, i: number) => string,
    joiner: string = ' ',
) {
    const maxLength = Math.max(...strArr.map(s => s.length));
    return data.map((el, i) => {
        let newStr = strArr[i] + ' '.repeat(maxLength + 1 - strArr[i].length);
        newStr += extendFn(el, i);
        return newStr;
    });
}
