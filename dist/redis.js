"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
// import { Redis } from '@upstash/redis'
const ioredis_1 = require("ioredis");
if (process.env.NODE_ENV === 'production') {
    exports.redis = new ioredis_1.Redis({
        host: process.env.UPSTASH_REDIS_REST_URL,
        password: process.env.UPSTASH_REDIS_REST_TOKEN,
        tls: {}
    });
}
else {
    exports.redis = new ioredis_1.Redis({
        host: "localhost",
        port: 6379
    });
}
// export const redis = process.env.NODE_ENV === 'production'
//    ? new Redis
// export const redis = new Redis({
//     url: process.env.UPSTASH_REDIS_REST_URL as string,
//     token: process.env.UPSTASH_REDIS_REST_TOKEN
// })
