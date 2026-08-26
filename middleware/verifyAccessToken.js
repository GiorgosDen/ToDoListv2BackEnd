const jwt = require('jsonwebtoken');

const verifyAccessToken = async (req,res,next)=>{
    const authHeader = req.headers.authorization;//get: Bearer /space/ token
    if (!authHeader) {return res.sendStatus(401);}
    const userToken = authHeader.split(" ")[1];
    jwt.verify(userToken,
        process.env.ACCESS_TOKEN_SECRET,
    (error,decodes)=>{
        if(error) return res.status(403).json({ message:"Forbidden Token"});
        req.userID = decodes.userID;
       // console.log(decodes);
        next();
    });
}

module.exports = verifyAccessToken;