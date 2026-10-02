require('dotenv').config();
const allowedOriginsList = [
     process.env.API_URL,
     process.env.CLIENT_URL,
     process.env.FRONT_URL
];

//credentials:true allows cookies to be received and sent
const corsOptions = {
     origin:allowedOriginsList,
     credentials: true
}

module.exports = corsOptions;