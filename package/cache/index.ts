type TCacheOptions = {
  /** Standard time-to-live, default option if ttl is not provided during set */
  stdTTL: number;
  checkPeriod: number;
};

type TData = {
  value: any;
  ttl: number;
};

/**
 * An in-memory cache to allow faster serving of data back
 * to the client.
 */
export const client = (opts?: TCacheOptions) => {
  const data: Map<string, TData> = new Map();
  const options: TCacheOptions = {
    stdTTL: 300,
    checkPeriod: 600,
    ...opts,
  };

  const get = (key: string): any => {
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
  const set = (key: string, value: any, ttl?: number): void => {
    data.set(key, _wrap(value, ttl));
  };

  const mget = (keys: string[]) => {
    const obj: Record<string, any> = {};

    for (const key of keys) {
      if (data.get(key)) {
        obj[key] = data.get(key);
      }
    }

    return obj;
  };

  const mset = (data: { key: string; value: any }[]) => {
    for (const keyValuePair of data) {
      set(keyValuePair.key, keyValuePair.value);
    }
  };

  /** Get the value of the key then delete from the cache */
  const take = (key: string): any => {
    const data = get(key);
    if (data !== undefined) {
      del(key);
    }
    return data;
  };

  /** Check if key exists in cache */
  const has = (key: string): boolean => {
    return _check(key, data.get(key)) && data.has(key);
  };

  /** Delete key(s) in cache */
  const del = (keys: string | string[]) => {
    if (keys instanceof Array) {
      for (const key of keys) {
        data.delete(key);
      }
    } else {
      data.delete(keys);
    }
  };

  /** Returns all keys in the cache */
  const keys = (): string[] => {
    return Object.keys(data);
  };

  /** Internal checker if the key is still valid based on its ttl. Returns true if valid, otherwise false */
  const _check = (key: string, value: TData | undefined): boolean => {
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

    setTimeout(() => {
      _checkData();
    }, options.checkPeriod * 1000);
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

  // Initialize interval for data checker.
  _checkData();

  return {
    get,
    set,
    has,
    take,
    keys,
    mget,
    mset,
    del,
  };
};

export const cache = client();
