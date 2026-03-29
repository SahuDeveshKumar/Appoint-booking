let {DB_STRING}=require('dotenv').config().parsed;
module.exports={url:DB_STRING};
