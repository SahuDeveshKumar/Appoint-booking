const db = require('../models/Models');
const appointmentdb = db.Appointment
const availablitydb = db.Availability
const patientsdb=db.Patient


exports.editAppointment = async (req, res) => {

   try {
      const { role } = req.user;
      if (role === 'patient') {
         // console.log(req.params.id, req.body)
         const updatedUser = await patientsdb.findByIdAndUpdate(req.params.id, req.body, { new: true });
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


exports.getAllAppointment = async (req, res) => {
   try {
      const { role } = req.user;
      // console.log(req.user)
      // console.log(req.params.id)
      if (role === 'patient') {
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

         const patientAppointment=appointdata.filter(i=>i.patient!=null && i.patient._id==req.params.id)

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

         const userData = await patientsdb.find({ _id: req.params.id })
         userData[0].password = null


         return res.status(200).json({ appointdata, availdata, userData,patientAppointment });
      }
      else {
         return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource.' });
      }
   } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "server error" });
   }
}

exports.bookAppointment = async (req, res) => {
   try {
      // console.log(req.body)
      const { role } = req.user;
      if (role === 'patient') {
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

exports.deleteAppointment = async (req, res) => {
   try {
      const { role } = req.user;
      if (role === 'patient') {
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