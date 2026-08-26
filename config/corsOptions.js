require('dotenv').config();
const corsOptionsList = [
     process.env.API_URL,
     process.env.CLIENT_URL,
];

module.exports = corsOptionsList;