export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET
  },
  database: {
    connect: process.env.MONGODB_URI
  }
});