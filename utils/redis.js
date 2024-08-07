import redis from 'redis'; // Importing the redis library
import { promisify } from 'util'; // Importing promisify utility from util module

/**
 * Class for performing operations with Redis service
 */
class RedisClient {
  constructor() {
    this.client = redis.createClient(); // Creates a new Redis client instance that connects to the Redis server
    this.getAsync = promisify(this.client.get).bind(this.client); // Converts the get method of the Redis client to return a promise instead of using a callback

    this.client.on('error', (error) => { // Sets up an event listener for the error event
      console.log(`Redis client not connected to the server: ${error.message}`); // Logs the error message to the console if an error occurs
    });

    this.client.on('connect', () => { // Sets up an event listener for the connect event
      // console.log('Redis client connected to the server'); // Logs a message to the console when the client connects (currently commented out)
    });
  }

  /**
   * Checks if connection to Redis is Alive
   * @return {boolean} true if connection alive or false if not
   */
  isAlive() {
    return this.client.connected; // Returns true if the Redis client is connected, otherwise returns false
  }

  /**
   * gets value corresponding to key in redis
   * @key {string} key to search for in redis
   * @return {string} value of key
   */
  async get(key) {
    const value = await this.getAsync(key); // Retrieves the value associated with the provided key from Redis using the promisified get method
    return value; // Returns the value
  }

  /**
   * Creates a new key in redis with a specific TTL
   * @key {string} key to be saved in redis
   * @value {string} value to be assigned to key
   * @duration {number} TTL of key
   * @return {undefined} No return
   */
  async set(key, value, duration) {
    this.client.setex(key, duration, value); // Sets a key-value pair in Redis with an expiration time (TTL) specified by duration
  }

  /**
   * Deletes key in redis service
   * @key {string} key to be deleted
   * @return {undefined} No return
   */
  async del(key) {
    this.client.del(key); // Deletes the key-value pair associated with the provided key from Redis
  }
}

const redisClient = new RedisClient(); // Creates an instance of the RedisClient class

export default redisClient; // Exports the redisClient instance so it can be imported and used in other parts of the application
