// const availdb = require('../models/availablityModel');
const dbs = require('../models/Models');
const doctordb = dbs.Doctor
const hospitaldb = dbs.Hospital
const patientdb = dbs.Patient
const appointmentdb = dbs.Appointment
const availabilitydb = dbs.Availability
const departmentdb = dbs.Department
const bcrypt = require('bcrypt')

const seedData = async () => {
  try {
    // let dataExist = await hospitaldb.find();
    // if (dataExist.length == 0) {
    //   const adminPassword = await bcrypt.hash('admin@123', 10);
    //   const studentPassword = await bcrypt.hash('student@123', 10);
    // }

    const departments = [
      { name: 'dermatology' },
      { name: 'endocrinology' },
      { name: 'gastroenterology' },
      { name: 'hematology' },
      { name: 'neurology' },
      { name: 'obstetrics-gynecology' },
      { name: 'ophthalmology' },
      { name: 'oncology' },
      { name: 'orthopedics' },
      { name: 'psychiatry' },
      { name: 'radiology' },
      { name: 'urology' },
      { name: 'dentistry' },
      { name: 'pulmonology' },
      { name: 'rheumatology' },
      { name: 'gynecology' },
      { name: 'allergy-immunology' },
      { name: 'cardiothoracic-surgery' }
    ];

    const hospitals=[
      { "name": "AIIMS - Ansari Nagar", "state": "delhi", "phone": "011-12345678" },
      { "name": "AIIMS - Begumpet", "state": "telangana", "phone": "040-12345678" },
      { "name": "AIIMS - Parel", "state": "maharashtra", "phone": "022-12345678" },
      { "name": "AIIMS - Raja Annamalai Puram", "state": "tamil nadu", "phone": "044-12345678" },
      { "name": "AIIMS - Vijayawada", "state": "andhra pradesh", "phone": "0866-12345678" },
      { "name": "Apollo Hospitals - Bannerghatta", "state": "karnataka", "phone": "080-12345678" },
      { "name": "Apollo Hospitals - ECIL", "state": "telangana", "phone": "040-22345678" },
      { "name": "Apollo Hospitals - Greams Road", "state": "tamil nadu", "phone": "044-22345678" },
      { "name": "Apollo Hospitals - Vijayawada", "state": "andhra pradesh", "phone": "0866-22345678" },
      { "name": "Fortis Hospital - Banjara Hills", "state": "telangana", "phone": "040-52345678" },
      { "name": "Fortis Hospital - Chennai", "state": "tamil nadu", "phone": "044-32345678" },
      { "name": "Fortis Hospital - Mogappair", "state": "tamil nadu", "phone": "044-42345678" },
      { "name": "Fortis Hospital - Mulund", "state": "maharashtra", "phone": "022-32345678" },
      { "name": "Fortis Hospital - Vashi", "state": "maharashtra", "phone": "022-42345678" },
      { "name": "Fortis Hospital - Vijayawada", "state": "andhra pradesh", "phone": "0866-32345678" },
      { "name": "Manipal Hospital - Bangalore", "state": "karnataka", "phone": "080-22345678" },
      { "name": "Manipal Hospital - Delhi", "state": "delhi", "phone": "011-22345678" },
      { "name": "Manipal Hospital - Jubilee Hills", "state": "telangana", "phone": "040-22345678" },
      { "name": "Manipal Hospital - Kadri", "state": "karnataka", "phone": "0824-22345678" },
      { "name": "Manipal Hospital - Malleshwaram", "state": "karnataka", "phone": "080-32345678" },
      { "name": "Manipal Hospital - Old Airport Road", "state": "karnataka", "phone": "080-42345678" },
      { "name": "Manipal Hospital - Vijayawada", "state": "andhra pradesh", "phone": "0866-42345678" },
      { "name": "Max Super Speciality Hospital - Saket", "state": "delhi", "phone": "011-32345678" },
      { "name": "Max Super Speciality Hospital - Vaishali", "state": "delhi", "phone": "011-42345678" },
      { "name": "Medanta - The Medicity, Bellandur", "state": "karnataka", "phone": "080-52345678" },
      { "name": "Medanta - The Medicity, Chennai", "state": "tamil nadu", "phone": "044-52345678" },
      { "name": "Medanta - The Medicity, Gachibowli", "state": "telangana", "phone": "040-52345678" },
      { "name": "Medanta - The Medicity, Gurgaon", "state": "haryana", "phone": "0124-52345678" },
      { "name": "Medanta - The Medicity, Thoraipakkam", "state": "tamil nadu", "phone": "044-62345678" },
      { "name": "Medanta - The Medicity, Vasant Kunj", "state": "delhi", "phone": "011-52345678" },
      { "name": "Medanta - The Medicity, Vijayawada", "state": "andhra pradesh", "phone": "0866-52345678" }
    ]
    

    const departmentsData = await departmentdb.findOne({}) || await departmentdb.insertMany(departments );
    const department1 = await departmentdb.findOne({ name: 'cardiology' }) || await departmentdb.create({ name: 'cardiology' });
    const department2 = await departmentdb.findOne({ name: 'pediatrics' }) || await departmentdb.create({ name: 'pediatrics' });
    const department3 = await departmentdb.findOne({ name: 'dermatology' }) || await departmentdb.create({ name: 'dermatology' });

    // Seed hospitals
    const hospital1 = await hospitaldb.findOne({ name: 'Apollo Hospitals - Secunderabad' }) || await hospitaldb.create({
      name: "Apollo Hospitals - Secunderabad",
      department: department1._id,
      state: 'telangana',
      phone: "040-42345678"
    });

    const hospital2 = await hospitaldb.findOne({ name: "Apollo Hospitals - Jubilee Hills" }) || await hospitaldb.create({
      name: "Apollo Hospitals - Jubilee Hills",
      department: department2._id,
      state: 'telangana',
      phone: "040-32345678"
    });

    const hospital3 = await hospitaldb.findOne({ name: "Apollo Hospitals - ECIL" }) || await hospitaldb.create({
      name: "Apollo Hospitals - ECIL",
      department: department3._id,
      state: 'telangana',
      phone: "040-22345678"
    });
    
    // Seed doctors
    const doctor1 = await doctordb.findOne({ doctorid: 'doctor_01' }) || await doctordb.create({
      name: 'dr. smith',
      dob: new Date('1990-01-15'),
      gender: 'male',
      doctorid: 'doctor_01',
      password: await bcrypt.hash('Password@123', 10),
      hospital: hospital1._id,
      email: 'drsmith@gmail.com',
      department: department1._id,
      role: 'doctor',
      phone: 6267756161,
      state: 'telangana',
      city: 'hyderabad',
      address:'Nagaram, Bandlaguda'
    });

    const doctor2 = await doctordb.findOne({ doctorid: 'doctor_02' }) || await doctordb.create({
      name: 'dr. johnson',
      dob: new Date('1990-01-15'),
      gender: 'female',
      doctorid: 'doctor_02',
      password: await bcrypt.hash('Password@123', 10),
      hospital: hospital2._id,
      email: 'drjohnson@gmail.com',
      department: department2._id,
      role: 'doctor',
      phone: 6267756161,
      state: 'telangana',
      city: 'hyderabad',
      address:'nagole, Bandlaguda'
    });

    // Seed patients
    const patient1 = await patientdb.findOne({ patientid: 'patient_01' }) || await patientdb.create({
      name: 'john doe',
      dob: new Date('1990-01-15'),
      gender: 'male',
      patientid: 'patient_01',
      password: await bcrypt.hash('Password@123', 10),
      phone: 1234567890,
      email: 'john.doe@gmail.com',
      role: 'patient',
      state: 'telangana',
      city: 'hyderabad',
      address:'Nagaram, Bandlaguda'
    });

    const patient2 = await patientdb.findOne({ patientid: 'patient_02' }) || await patientdb.create({
      name: 'jane smith',
      dob: new Date('1985-05-20'),
      gender: 'female',
      patientid: 'patient_02',
      password: await bcrypt.hash('Password@123', 10),
      phone: 9876543210,
      email: 'jane.smith@gmail.com',
      role: 'patient',
      state: 'maharashtra',
      city: 'pune',
      address:'nagole, Bandlaguda'
    });


    // Seed availabilities
    const availability1 = await availabilitydb.findOne({ doctor: doctor1._id, hospital: hospital1._id}) ||
      await availabilitydb.create({
        doctor: doctor1._id,
        hospital: hospital1._id,
        day: '{"1":1,"2":1,"6":1}',
        starttime: '10:00',
        endtime: '12:00'
      });

    const availability2 = await availabilitydb.findOne({ doctor: doctor2._id, hospital: hospital2._id}) ||
      await availabilitydb.create({
        doctor: doctor2._id,
        hospital: hospital2._id,
        day: '{"0":1,"3":1,"6":1}',
        starttime: '10:00',
        endtime:"16:00"
      });

    // Seed appointments
    let appointments= await appointmentdb.findOne({});
    const getCurrentDate = () => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(date.getDate()).padStart(2, '0');
    
      return `${year}-${month}-${day}`;
    };
    if(!appointments){
    const appointment1 = await appointmentdb.findOne({ patient: patient1._id, availability: availability1._id }) ||
      await appointmentdb.create({
        patient: patient1._id,
        availability: availability1._id,
        date: getCurrentDate(),
        slot:"11:00:00 AM - 11:30:00 AM",
        doctor:doctor1._id
      });

    const appointment2 = await appointmentdb.findOne({ patient: patient2._id, availability: availability2._id }) ||
      await appointmentdb.create({
        patient: patient2._id,
        availability: availability2._id,
        date: getCurrentDate(),
        slot:"10:00:00 AM - 10:30:00 AM",
        doctor:doctor2._id
      });
    }

    // grtting current date for seeding appointment data
    

    console.log('Data seeded successfully');

  }
  catch (err) {
    console.log('seeding data error ', err);
    process.exit(1)
  }
}

module.exports = seedData;