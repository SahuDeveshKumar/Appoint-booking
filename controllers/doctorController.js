const db = require('../models/Models');
const appointmentdb = db.Appointment
const availablitydb = db.Availability
const doctordb = db.Doctor
const hospitaldb = db.Hospital



// adding new appointment by doctor
exports.addAppointment = async (req, res) => {
   try {
      // console.log(req.body)
      const { role } = req.user;
      if (role === 'doctor') {
         const bookuser = new appointmentdb({ ...req.body.fdata, userid: req.body.user_id });
         const book = await bookuser.save();

         return res.status(201).json({ "msg": 'Appointment Booked' });
      }
      else {
         return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource.' });
      }

   } catch (error) {
      console.error(error);
      return res.status(500).json({ "msg": 'internal server error' });
   }
}

// get appointments to doctor
exports.getAppointment = async (req, res) => {
   try {
      const { role } = req.user;
      // console.log(req.user)
      // console.log(req.params.id)
      if (role === 'doctor') {
         const appointdata = await appointmentdb.find({ }).populate('patient').populate({
            path: 'availability',
            populate: [
               { path: 'doctor' },
               {
                  path: 'hospital',
                  populate: [{ path: 'department' }]
               }
            ]
         });
         // console.log(users1)
         appointdata.map((i) => {
            if(i.patient!=null)
               i.patient.password = null,
            i.availability.doctor.password = null
         })
         const doctorAppointment=appointdata.filter(i=>i.doctor._id==req.params.id)


         const availableDoc = await availablitydb.find({})
            .populate({
               path: 'doctor',
               populate: {
                  path: 'department',
               }
            })
            .populate('hospital');
         // console.log(availableDoc)
         let availdata = availableDoc.map(i => {
            return {
               _id: i._id,
               doctor: {
                  _id:i.doctor._id,
                  name: i.doctor.name,
                  doctorid: i.doctor.doctorid,
                  department: i.doctor.department.name
               },
               hospital: {
                  name: i.hospital.name,
                  state: i.hospital.state,
                  phone: i.hospital.phone,

               },
               day: JSON.parse(i.day),
               starttime: i.starttime,
               endtime: i.endtime,
            }
         })

         const userData = await doctordb.find({ _id: req.params.id })
         userData[0].password = null



         return res.status(200).json({ appointdata, availdata, userData, doctorAppointment });
      }
      else {
         return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource.' });
      }
   } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "server error" });
   }
}


//updating doctor details
exports.updateUser = async (req, res) => {

   try {
      const { role } = req.user;
      if (role === 'doctor') {
         // console.log(req.params.id, req.body)
         const updatedUser = await doctordb.findByIdAndUpdate(req.params.id, req.body, { new: true });
         updatedUser.password = null
         return res.status(200).json(updatedUser);
      }
      else {
         return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource.' });
      }
   } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "server error" });
   }

}





//deleting appointment by doctor
exports.deleteAppointment = async (req, res) => {
   try {
      const { role } = req.user;
      if (role === 'doctor') {
         const deletedAppointment = await appointmentdb.findByIdAndDelete(req.params.id);
         return res.status(200).json(deletedAppointment);
      }
      else {
         return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource.' });
      }
   } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "server error" });
   }
}


//adding availability of doctor
exports.addAvailability = async (req, res) => {
   try {
      // console.log(req.body)
      const { role } = req.user;
      if (role === 'doctor') {
         const addSlot = new availablitydb({ ...req.body.newAvailability, doctor: req.body.user_id });
         const book = await addSlot.save();

         return res.status(201).json({ "msg": 'Availability Added' });
      }
      else {
         return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource.' });
      }

   } catch (error) {
      console.error(error);
      return res.status(500).json({ "msg": 'internal server error' });
   }
}



//get doctor availability 
exports.getAvailability = async (req, res) => {
   try {
      const { role } = req.user;
      // console.log(req.user,req.params,req.originalUrl)
      if (role === 'doctor') {
         const availData = await availablitydb.find({ doctor: req.params.id }).populate('hospital')
         const hospitalData= await hospitaldb.find({})
         // console.log(users1)

         return res.status(200).json({availData,hospitalData});
      }
      else {
         return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource.' });
      }
   } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "server error" });
   }
}



//update doctor availability 
exports.updateAvailability = async (req, res) => {

   try {
      const { role } = req.user;
      if (role === 'doctor') {
         // console.log(req.params.id, req.body)
         const updatedAvailability = await availablitydb.findByIdAndUpdate(req.params.id, req.body.newAvailability, { new: true });
         return res.status(200).json(updatedAvailability);
      }
      else {
         return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource.' });
      }
   } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "server error" });
   }

}

//deleting avalability by doctor
exports.deleteAvailability = async (req, res) => {
   try {
      const { role } = req.user;
      if (role === 'doctor') {
         const deleteAvalability = await availablitydb.findByIdAndDelete(req.params.id);
         return res.status(200).json(deleteAvalability);
      }
      else {
         return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource.' });
      }
   } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "server error" });
   }
}