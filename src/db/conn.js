const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/install-data", {
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then( () => {
    console.log("connection success");
}).catch((err) => {

    console.log("connection failed")
})