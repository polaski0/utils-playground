declare const config: {
    stdTTL?: number;
    isCheckerActive?: boolean;
    checkPeriod?: number;
    sets?: {
        name: string;
        enabled: boolean;
        /** ttl must be in seconds if you're supplying a number */
        ttl: string | number;
    }[];
}

export default config;
