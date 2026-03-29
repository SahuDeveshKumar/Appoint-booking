const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Department Schema
const departmentSchema = new Schema({
  name: {
    type:String,
    unique:true
  }
});

// Doctor Schema
const doctorSchema = new Schema({
  name: String,
  dob: Date,
  gender: String,
  doctorid: {
    type:String,
    unique:true
  },
  role:String,
  password: String,
  hospital:{ type: Schema.Types.ObjectId, ref: 'Hospital' },
  email: String,
  phone:Number,
  state:String,
  city:String,
  address:String,
  department: { type: Schema.Types.ObjectId, ref: 'Department' }
});

// Patient Schema
const patientSchema = new Schema({
  name: String,
  dob: Date,
  gender: String,
  patientid: {
    type:String,
    unique:true
  },
  role:String,
  password: String,
  phone: Number,
  email: String,
  state:String,
  city:String,
  address:String
});

// Hospital Schema
const hospitalSchema = new Schema({
  name: {
    type:String,
  },
  department: { type: Schema.Types.ObjectId, ref: 'Department' },
  state: String,
  phone: String
});
hospitalSchema.index({name:1,department:1},{unique:true})

// Availability Schema
const availabilitySchema = new Schema({
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor' },
  hospital: { type: Schema.Types.ObjectId, ref: 'Hospital' },
  day: String,
  starttime: String,
  endtime:String
});
availabilitySchema.index({doctor:1,hospital:1},{unique:true})

// Appointment Schema
const appointmentSchema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient' },
  availability: { type: Schema.Types.ObjectId, ref: 'Availability' },
  date:Date,
  slot:String,
  name: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  doctor:{ type: Schema.Types.ObjectId, ref: 'Doctor' }
});

appointmentSchema.index({doctor:1,date:1,patient:1},{unique:true})

// Create models
const Department = mongoose.model('Department', departmentSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);
const Patient = mongoose.model('Patient', patientSchema);
const Hospital = mongoose.model('Hospital', hospitalSchema);
const Availability = mongoose.model('Availability', availabilitySchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);

// Export models
module.exports = {
  Department,
  Doctor,
  Patient,
  Hospital,
  Availability,
  Appointment
};
