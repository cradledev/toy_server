module.exports = {
  secretKey:
    process.env.SECRET_KEY ||
    "pbOweRnRbFOUJ6dqBZJgJV$MPPnPxhdxUz.L_rMqeFY0EOsZ8xH2K5r0FgUMir",
  port: process.env.PORT || 3001,
  DB: {
    URI:
      process.env.MONGO_URI ||
      "mongodb://127.0.0.1:27017/toy_ecommerce",
    USER: process.env.MONGO_USER,
    PASSWORD: process.env.MONGO_PASSWORD,
  },
};
