const mongoose = require("mongoose");
const config=require('../config/config');
const seedData=require('./seedData');

const connectDB= async()=>{
   try{
      await mongoose.connect(config.url);
      console.log('Database connected');
      await seedData();
   }
   catch(err){
      console.log('connection error ',err)
      process.exit(1)
   }
}
// connectDB();
module.exports=connectDB;