const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

 const mehranSchema = new mongoose.Schema({
     firstname:{
         type:String,
         require:true
     },

     lastname:{
        type:String,
        require:true
    },

    password:{
        type:String,
        require:true
    },

    confirmpassword:{
        type:String,
        require:true
    },

    gender:{
        type:String,
        require:true
    },

    email:{
        type:String,
        require:true
    },

    age:{
        type:String,
        require:true
    },

    tokens:[{
        token:{
            type:String,
            require:true
        }

    }]
 })

//generating tokens
mehranSchema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_kEY);
        this.tokens = this.tokens.concat({token});
        await this.save();
        return token;

    }catch(err){
        res.send(`the error part ${err}`);

    }
}




 //bcrypt hashing
 mehranSchema.pre("save", async function(next){
     if(this.isModified("password")){
         this.password = await bcrypt.hash(this.password, 10);
         this.confirmpassword =  await bcrypt.hash(this.confirmpassword, 10);
     }
     next();
 })


 const Register = new mongoose.model("Register",  mehranSchema);

 module.exports = Register;