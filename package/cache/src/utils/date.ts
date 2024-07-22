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
export const split = (value: string) => {
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

/** 
    * This function is used to parse a date in a specific format into millisecond 
    * where "1y" will return the value in milliseconds of that day.
    */
export const parse = (value: string): number => {
    const array = split(value)
    if (array.length % 2 !== 0) {
        throw new Error(`Invalid length: ${array.length}; Must be an even number.`);
    }

    const currDate = new Date();

    for (let i = 0; i < array.length; i += 2) {
        const num = parseInt(array[i])
        const suffix = array[i + 1]

        if (isNaN(num)) {
            throw new Error(`Invalid array: ${array[i]}`)
        }

        if (suffix == "y") {
            currDate.setFullYear(currDate.getFullYear() + num)
        } else if (suffix == "M") {
            currDate.setMonth(currDate.getMonth() + num)
        } else if (suffix == "d") {
            currDate.setDate(currDate.getDate() + num)
        } else if (suffix == "h") {
            currDate.setHours(currDate.getHours() + num)
        } else if (suffix == "m") {
            currDate.setMinutes(currDate.getMinutes() + num)
        } else if (suffix == "s") {
            currDate.setSeconds(currDate.getSeconds() + num)
        }
    }

    return currDate.getTime()
}
