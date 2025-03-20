// import { Redis as upstashRedis } from '@upstash/redis'
import { Redis } from "ioredis";

export let redis: Redis

if(process.env.NODE_ENV === 'production') {
    redis = new Redis({
        host: process.env.UPSTASH_REDIS_REST_URL!.replace("https://", ""),
        password: process.env.UPSTASH_REDIS_REST_TOKEN!,
        tls: {}
    })
} else {
    redis = new Redis({
       host: "localhost",
       port: 6379
    })
}

// export const redis = process.env.NODE_ENV === 'production'
//    ? new upstashRedis({
//         url: process.env.UPSTASH_REDIS_REST_URL as string,
//         token: process.env.UPSTASH_REDIS_REST_TOKEN!
//    }) : new Redis({
//         host: 'localhost',
//         port: 6379
//    })

// // export const redis = new upstashRedis({
//     url: process.env.UPSTASH_REDIS_REST_URL as string,
//     token: process.env.UPSTASH_REDIS_REST_TOKEN!,
// })
