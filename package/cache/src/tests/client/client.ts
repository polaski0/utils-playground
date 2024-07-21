import config from "./config";

type TCacheProps = {
    stdTTL?: number;
    isCheckerActive?: boolean;
    checkPeriod?: number;
    sets?: {
        name: string;
        enabled: boolean;
        /** ttl must be in seconds if you're supplying a number */
        ttl?: string | number;
    }[];
}

/** All time related values are in seconds */
type TCacheOptions = {
    stdTTL: number;
    isCheckerActive: boolean;
    checkPeriod: number;
}

type TData = {
    value: any;
    ttl: number;
};

type TDataK = string | number;
type TDataKArr = string[] | number[];

/**
 * An in-memory cache to allow faster serving of data back
 * to the client.
 */
export const client = ({
    sets,
    ...opts
}: TCacheProps) => {
    const data: Map<TDataK, TData> = new Map();
    const options: TCacheOptions = {
        isCheckerActive: false,
        stdTTL: 300,
        checkPeriod: 600,
        ...opts
    };

    const get = (key: TDataK): any => {
        if (data.get(key) && _check(key, data.get(key))) {
            return _unwrap(data.get(key)!);
        }

        return undefined;
    };

    /**
     * @param key string
     * @param value any
     * @param ttl number - In seconds. Assigning 0 means that the lifetime of the value is infinite
     */
    const set = (key: TDataK, value: any, ttl?: number): void => {
        data.set(key, _wrap(value, ttl));
    };

    /** Delete key(s) in cache */
    const del = (keys: TDataK | TDataKArr) => {
        if (keys instanceof Array) {
            for (const key of keys) {
                data.delete(key);
            }
        } else {
            data.delete(keys);
        }
    };

    /** Internal checker if the key is still valid based on its ttl. Returns true if valid, otherwise false */
    const _check = (key: TDataK, value: TData | undefined): boolean => {
        if (value === undefined) {
            return false;
        }

        const now = Date.now();

        if (value.ttl !== 0 && value.ttl < now) {
            del(key);
            return false;
        }

        return true;
    };

    /** Internal checker that will go through the values in the Map at a set interval to remove stale data from the cache */
    const _checkData = () => {
        for (const key in data) {
            _check(key, data.get(key));
        }

        if (options.isCheckerActive) {
            setTimeout(() => {
                _checkData();
            }, options.checkPeriod * 1000);
        }
    };

    /** Internal function to wrap the value provided before setting to cache */
    const _wrap = (value: any, ttl?: number): TData => {
        const now = Date.now();
        let lifetime = 0;
        const lifetimeMultiplier = 1000;

        if (ttl === undefined) {
            lifetime = now + options.stdTTL * lifetimeMultiplier;
        } else if (ttl > 0) {
            lifetime = now + ttl * lifetimeMultiplier;
        }

        return {
            value: value,
            ttl: lifetime,
        };
    };

    /** Internal function to unwrap the value from cache and return the inserted value without additional data */
    const _unwrap = (data: TData) => {
        return data.value;
    };

    const toggleIncrementalCheck = () => {
        options.isCheckerActive = !options.isCheckerActive;

        if (options.isCheckerActive) {
            _checkData();
        }
    };

    // Initialize interval for data checker.
    _checkData();

    return {
        get,
        set,
        del,
        toggleIncrementalCheck,
    };
};