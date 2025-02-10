export const bigintJSONStringify = (value) => {
    const toJSONBigIntCompatible = (key, value) => {
        if (typeof value === 'bigint') {
            // Represent bigints as strings to maintain precision.
            return value.toString();
        }
        return value;
    };

    return JSON.stringify(value, toJSONBigIntCompatible);
};
