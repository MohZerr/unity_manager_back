import { redisClient } from '../../db/dbClients/redisClient.js';

/**
 * Middleware function that caches responses based on the given key prefix and duration.
 *
 * @param {string} keyPrefix - The prefix to be used for generating the cache key.
 * @param {number} duration - The duration (in seconds) for which the response should be cached.
 * @return {Function} A middleware function that can be used in Express.
 */
export default (keyPrefix, duration) => {
  return async (req, res, next) => {
    // check if the response has already been cached
    const key = `${keyPrefix}:${req.originalUrl}`;

    try {
     // Get the response from the cache
      const data = await redisClient.get(key);
      if (data !== null) {
        // Parse the JSON string into an object 
        const jsonData = JSON.parse(data);
        // Send the cached response
        return res.status(200).type('json').send(jsonData);
      } else {
        res.sendResponse = res.send;
        // Override the res.send function with a function that saves the response in the cache
        res.send = async (body) => {
          await redisClient.setEx(key, duration, JSON.stringify(body));
          res.sendResponse(body);
        };
        // Call the next middleware
        next();
      }
    } catch (err) {
      console.error('Redis error:', err);
      next();
    }
  };
}
