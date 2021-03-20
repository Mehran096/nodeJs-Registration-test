require("dotenv").config();
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");
const app = express();
require("./db/conn");
const Register = require("./models/registers")
const port = process.env.PORT || 8000;

 
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

const static_path = path.join(__dirname, "../public");
const template = path.join(__dirname, "../templates/views");
const partial = path.join(__dirname, "../templates/partials");

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template );
hbs.registerPartials(partial);


//get
app.get("/", (req, res) => {
    res.render("index");
})

app.get("/register", (req, res) => {
    res.render("register");
})

app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/secret", auth, (req, res) => {
    res.render("secret");
})

app.get("/about", (req, res) => {
    res.render("about");
})


app.get("/logout", auth, async (req, res) => {
    try{
            //for single logout
        // req.user.tokens = req.user.tokens.filter((currElement) => {
        //         return currElement.token !== req.token
        // })
        
        // for all devices logout
        req.user.tokens = [];
        res.clearCookie("jwt");
        await req.user.save();
        res.render("login");
    }catch(err){
        res.status(500).send(err);
    }
    // res.render("login");
})

//register post 

app.post("/register", async(req, res) => {
    try{

        const password = req.body.password
        const cpassword = req.body.confirmpassword
         if(password===cpassword){
                const registerEmployee = new Register({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                                
                   password: password,
                   confirmpassword: cpassword,
                   gender: req.body.gender,
                   email:  req.body.email,
                   age:  req.body.age
                })

                const token = await registerEmployee.generateAuthToken();
                res.cookie("jwt", token, {
                    expires:new Date(Date.now() + 360000),
                    httpOnly:true
                     // secure:true use for https
                })

               const add = await registerEmployee.save();
               res.status(201).render("index")

         }else{
            res.send("password not matched");
         }
    }catch(err){
        res.status(400).send(err)
    }
})


//login post 

app.post("/login", async(req, res) => {
     try{

         const email = req.body.email;
         const password = req.body.password;
         const userEmail = await Register.findOne({email});
         const isMatch = await bcrypt.compare(password, userEmail.password);
         const token = await userEmail.generateAuthToken();
         res.cookie("jwt", token, {
            expires:new Date(Date.now() + 360000),
            httpOnly:true
            // secure:true use for https
        })
          
         if(isMatch){
             res.status(201).render("index");
         }else{
             res.send("invalid login details");
         }

     }catch(err){
         res.status(400).send("invalid login details");

     }
})


app.listen(port, () => {
    console.log(`connection successfull at port no. ${port}`);
})