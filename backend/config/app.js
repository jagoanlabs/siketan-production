require('dotenv').config();

module.exports = {
  // appKey: process.env.APP_KEY,
  // appUrl: process.env.APP_URL,
  appPort: Number(process.env.APP_PORT || 5001)
};
