const dbs = require('../models/Models')
const doctordb=dbs.Doctor
const patientdb=dbs.Patient
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt')
const { JWT_SECRET } = require('dotenv').config().parsed;

exports.checkLogin = async (req, res) => {

   let { userid, password } = req.body;
   try {
      // userid='student',password='student@123'
      // userid='admin',password='admin@123'
      // console.log(req.body)
      // doc@
      
      const doc= await doctordb.findOne({doctorid:userid})
      const avl= await dbs.Availability.find({}).populate('doctor').populate({
         path: 'hospital',
         populate:{
            path:'department',
         }
       })
      const pnt= await patientdb.findOne({patientid:userid})
      // if(check=='doc@'){
      // const user= await doctordb.findOne({doctorid:userid})
      // }
      // if(check=='pnt@'){
      //    const user= await patientdb.findOne({patientid:userid})
      // }
      // console.log(user,req.body)

      if (!doc && !pnt ) {
         return res.status(404).json({ message: 'User not found' });
      }
      let user
      if(doc){
         user=doc
      }
      else{
         user=pnt
      }
      const passwordmatched = await bcrypt.compare(password, user.password);
      // console.log(passwordmatched)
      if (!passwordmatched) {
         return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const payload = {
         user: {
            userid: doc?user.doctorid:user.patientid,
            role: user.role
         },
      };
      // console.log(payload)
      
      jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (error, token) => {
         if (error) throw error;
         user["password"] = undefined;
         res.status(200).json({ token, user,avl});
      });
   } 
   catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
   }
}

