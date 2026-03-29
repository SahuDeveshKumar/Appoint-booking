const dbs = require('../models/Models')
const doctordb=dbs.Doctor
const patientdb=dbs.Patient
const departmentdb = dbs.Department
const hospitaldb = dbs.Hospital
// const appointmentdb = require('../models/appointmentModel');
const bcrypt = require('bcrypt');


exports.signup = async (req, res) => {
   try {

      console.log(req.body)
      req.body.password = await bcrypt.hash(req.body.password, 10);
      if(req.body.role=='doctor'){
         const newuser = new doctordb({ ...req.body});
      console.log(newuser)
      const inserteduser = await newuser.save();
      }
      else{
         const newuser = new patientdb({ ...req.body});
      // console.log(newuser)
      const inserteduser = await newuser.save();
      }
         

      // console.log(newuser,'  new msg  ',inserteduser)
      return res.status(201).json({ "msg": 'Successfully created' });
   } catch (error) {
      console.error(error);
      return res.status(500).json({ "msg": 'server error or duplicate entry' });
   }
};

exports.getDepartments= async (req,res)=>{
   try{
      let departments=await departmentdb.find({})
      let hospitals=await hospitaldb.find({})
      return res.status(200).json({departments,hospitals});
   }
   catch(err){
      console.log('fetching department error', err)
      return res.status(500).json({ "msg": 'server error'})
   }
}