const jwt = require("jsonwebtoken");
const Register = require("../models/registers");


const auth = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        const verifyUSer = await  jwt.verify(token, process.env.SECRET_KEY);
        // console.log(verifyUSer);
        const user = await Register.findOne({_id:verifyUSer._id});
        // console.log(user);

        req.token = token;
        req.user = user;
        next();

    }catch(err){
        res.status(401).send(err);

    }
}

module.exports = auth;