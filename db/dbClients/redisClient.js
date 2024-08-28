import 'dotenv/config';

import { createClient } from 'redis';

const redisClient = createClient({
    password: process.env.REDIS_PASS || 'password',
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || '6379',
    }
});

async function redisConnexion() {
    console.log('Connecting to Redis...');
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (error) {
        console.error('Error connecting to Redis:', error.message);
    }
}



export {redisConnexion, redisClient};
