export default () => ({
  port: parseInt(process.env.PORT ?? '3001', 10),
  mongodbUri: process.env.MONGODB_URI,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
})
