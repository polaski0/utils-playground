export const deepAssign = (data: Record<string, any>) => {
    const result: Record<string, any> = {};

    for (const key in data) {
        const parts = key.split('.');
        let currentObj = result;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];

            if (i === parts.length - 1) {
                if (Array.isArray(currentObj[part])) {
                    currentObj[part].push(data[key]);
                } else if (typeof currentObj[part] === 'object' && currentObj[part] !== null) {
                    currentObj[part] = [currentObj[part], data[key]];
                } else {
                    currentObj[part] = data[key];
                }
            } else {
                if (!currentObj[part]) {
                    currentObj[part] = {};
                }
                currentObj = currentObj[part];
            }
        }
    }

    return result;
}
