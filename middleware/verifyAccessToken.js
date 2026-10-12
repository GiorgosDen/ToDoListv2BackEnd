const jwt = require('jsonwebtoken');

const verifyAccessToken = async (req,res,next)=>{
    //Get the accessToken
    const userToken = req.headers.authorization;
    if (!userToken || !userToken.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No token provided, access denied" });
    }
    const accessToken = userToken.split(' ')[1];
    jwt.verify(accessToken,
        process.env.ACCESS_TOKEN_SECRET,
    (error,decodes)=>{
        console.log("ACTUAL JWT ERROR:", error);
        if(error) return res.status(410).json({ message:"Forbidden Token"});
        req.userID = decodes.userID;
       // console.log(decodes);
        next();
    });
}

module.exports = verifyAccessToken;