const jwt = require('jsonwebtoken');

const verifyAccessToken = async (req,res,next)=>{
    //Get the token from JWToken cookie
    const userToken = req.cookies.JWToken;
    if (!userToken) {
        return res.status(401).json({ message: "No token provided, access denied" });
    }
    jwt.verify(userToken,
        process.env.ACCESS_TOKEN_SECRET,
    (error,decodes)=>{
        console.log(error);
        if(error) return res.status(403).json({ message:"Forbidden Token"});
        req.userID = decodes.userID;
       // console.log(decodes);
        next();
    });
}

module.exports = verifyAccessToken;