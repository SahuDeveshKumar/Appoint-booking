const express= require('express');
const bodyparser=require('body-parser');
const connectDB=require('./database/connectDB.js');
const authController = require('./controllers/loginController.js');
const registerController = require('./routes/signupRoute.js');
const patientRouter=require('./routes/patientRoute.js')
const doctorRouter=require('./routes/doctorRoute.js')
const cors = require("cors");

const app=express();
const port=5000;
app.use(cors());

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));


app.post('/api/login', authController.checkLogin);
app.use('/api/signup', registerController);

app.use('/api/patient', patientRouter);
app.use('/api/doctor', doctorRouter);


app.use('/',express.static('users'))
const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => console.log(`Server started  http://localhost:${port}`));
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
