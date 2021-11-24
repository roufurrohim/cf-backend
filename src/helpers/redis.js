const redis = require("redis");
const {
  REDIS_HOSTNAME,
  REDIS_PORT,
  REDIS_PASSWORD,
} = require("../helpers/env");

const client = redis.createClient({
  host: REDIS_HOSTNAME,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
});

client.on("error", (err) => {
  // eslint-disable-next-line no-console
  console.log(err);
});

const redisAction = {
  set: (key, value) => {
    client.set(key, value);
    return true;
  },
};

module.exports = redisAction;
