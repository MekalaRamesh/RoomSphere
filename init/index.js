
const mongoose = require("mongoose");
 
const initData = require("./data.js");

const Listing = require("../models/listing.js");




const mongoUrl = "mongodb://127.0.0.1:27017/wander"



main()
  .then( ()=>{
    console.log("connected sucessfully")
  })
  .catch((err) =>{
    console.log(err);
  })
  

async function main() {
    await mongoose.connect(mongoUrl);
    
}

const initDb = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({...obj,  owner:"670cf5ba4993568ef4899d14"}))
    await Listing.insertMany(initData.data);
    console.log("data added")
}

initDb();