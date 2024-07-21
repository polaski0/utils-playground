/**
    * Suffix definitions
    *
    * y = year
    * M = month
    * d = day
    * h = hour
    * m = minute
    * s = second
    *
    * Example value:
    *   - 1y = 1 year
    *   - 10s = 10 seconds
    */
export const parse = (value: string) => {
    const array: string[] = []
    let type = ""
    let acc = ""

    for (let i = 0; i < value.length; i++) {
        const t = isNaN(parseInt(value[i])) ? "string" : "number";
        if (t !== type) {
            if (i !== 0) {
                array.push(acc);
            }

            type = t;
            acc = "";
        }

        acc += value[i];

        if (i == value.length - 1) {
            array.push(acc);
        }
    }

    return array;
}
