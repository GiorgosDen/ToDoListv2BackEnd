require('dotenv').config();

const allowedOriginsList = [
     process.env.API_URL,
     process.env.CLIENT_URL,
     process.env.FRONT_URL,
     process.env.BACK_URL,
     'http://localhost:3000',
     'http://localhost:5173'
].filter(Boolean);

const corsOptions = {
     origin: function (origin, callback) {
          if (!origin) return callback(null, true);
          
          if (allowedOriginsList.indexOf(origin) !== -1) {
               callback(null, true);
          } else {
               callback(new Error('Blocked by CORS policy'));
          }
     },
     credentials: true
};

module.exports = corsOptions;