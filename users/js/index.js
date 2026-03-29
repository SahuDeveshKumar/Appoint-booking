// const { json } = require("body-parser");

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

// console.log(token,role,"token & role")

if (token !== null && role === "doctor") {
  window.location.href = "./doctor.html";
} else if (token !== null && role === "patient") {
  window.location.href = "./patient.html";
}

const useridRegex = /^[a-zA-Z_\d]{5,16}$/;
const userRegex = /^[a-zA-Z\s]{5,16}$/;
const passwordRegex = /^[A-Za-z0-9!@#$%^&*]{8,}$/
const phoneRegex = /^\d{10}$/;



document.getElementById('loginform').addEventListener('submit', e => {
  e.preventDefault();
  const data = document.getElementById('loginform')
  const formData = new FormData(data);
  const fdata = Object.fromEntries(formData)
  console.log(JSON.stringify(fdata))

  if (!useridRegex.test(fdata.userid)) {
    alert('Not valid username')
    return false
  }
  if (!passwordRegex.test(fdata.password)) {
    alert('Not valid password')
    return false
  }

  fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify(fdata),
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then((response) => {
      // console.log(response)
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("role");
          localStorage.removeItem("token");
          sessionStorage.removeItem('user_id')
          // alert("Invalid or expired token");
          window.location.href = "../index.html";
        }
        throw new Error("Invalid username, password, or role");
        // return 
      }
      return response.json();
    })
    .then((data) => {
      console.log(data)
      const token = data.token;
      const role = data.user.role === "doctor" ? "doctor" : "patient"; // Fix the role assignment

      localStorage.setItem("role", role);
      localStorage.setItem("token", token);
      
      if (role === "doctor") {
        window.location.href = "../doctor.html";
        sessionStorage.setItem("user_id", data.user.doctorid);
        sessionStorage.setItem("id", data.user._id);
        sessionStorage.setItem("phone", data.user.phone);
        sessionStorage.setItem("email", data.user.email);
        sessionStorage.setItem("name", data.user.name);
        // sessionStorage.setItem("user_id", data.user.city);
      } else {
        window.location.href = "../patient.html";
        sessionStorage.setItem("user_id", data.user.patientid);
        sessionStorage.setItem("id", data.user._id);
        sessionStorage.setItem("phone", data.user.phone);
        sessionStorage.setItem("email", data.user.email);
        sessionStorage.setItem("name", data.user.name);
      }
    })
    .catch((error) => {
      // Improve error handling by showing the error message in the alert
      alert("Error: " + error.message);
    });


})


const patientSignup = document.getElementById('signupPatient');
const doctorSignup = document.getElementById('signupDoctor');
const loginPage = document.getElementById('loginbox');

function showPatientSignup() {
  patientSignup.style.display = 'block'
  doctorSignup.style.display = 'none'
  loginPage.style.display = 'none'

}
function showDoctorSignup() {
  patientSignup.style.display = 'none'
  doctorSignup.style.display = 'block'
  loginPage.style.display = 'none'

}
function showLogin() {
  loginPage.style.display = 'block'
  doctorSignup.style.display = 'none'
  patientSignup.style.display = 'none'
}

function validateFormSubmit(name, userid, password, phone, form) {
  if (!userRegex.test(name)) {
    myalert('Enter valid username')
    return false
  }
  if (!passwordRegex.test(password)) {
    myalert(`Enter valid password
    Password must be at least 8 characters long
    include at least one uppercase letter, one lowercase letter, one special character, and one number`)
    return false
  }
  if (!useridRegex.test(userid)) {
    myalert('Enter valid User ID')
    return false
  }
  if (!phoneRegex.test(phone)) {
    myalert('Enter valid phone number');
    return false
  }

  // const form = document.getElementById('signupPatientForm')
  const formData = new FormData(form);
  const fdata = Object.fromEntries(formData)
  console.log(JSON.stringify(fdata))
  fetch('/api/signup', {
    method: 'POST',
    body: JSON.stringify(fdata),
    headers: {
      "Content-Type": "application/json",
    }
  })
    .then((response) => {
      // console.log(response)
      if (!response.ok) {
        myalert("Failed to register sever error or user already exist with USER ID");
        // return 
      }
      else {
        myalert('Successfully Register')
      }
    })
    .catch((error) => {
      // Improve error handling by showing the error message in the alert
      alert("Error: " + error.message);
    });
  form.reset();
}

document.getElementById('signupPatientForm').addEventListener('submit', e => {
  e.preventDefault();
  let patientname = document.getElementsByName('name')[1].value.trim()
  let userid = document.getElementsByName('patientid')[0].value.trim()
  let password = document.getElementsByName('password')[2].value.trim()
  let phone = document.getElementsByName('phone')[1].value.trim()

  let form = document.getElementById('signupPatientForm')
  validateFormSubmit(patientname, userid, password, phone, form);

})

document.getElementById('signupDoctorForm').addEventListener('submit', e => {
  e.preventDefault();
  let doctorname = document.getElementsByName('name')[0].value.trim()
  let userid = document.getElementsByName('doctorid')[0].value.trim()
  let password = document.getElementsByName('password')[1].value.trim()
  let phone = document.getElementsByName('phone')[0].value.trim()

  let form = document.getElementById('signupDoctorForm')
  validateFormSubmit(doctorname, userid, password, phone, form)

})





//popup model
let hospitals;
function myalert(message) {
  document.getElementById("popupMessage").innerHTML = message;
  document.getElementById("popupOverlay").style.display = "flex";
}

function closePopup() {
  document.getElementById("popupOverlay").style.display = "none";
}


(function (){

  fetch('/api/signup')
  .then(res=>{
    if(!res.ok){
        console.error('Failed to fetch departments sever error');
    }
    return res.json()
  })
  .then(data=>{
    // console.log(data)
    hospitals=data.hospitals
    sessionStorage.setItem('department',JSON.stringify(data.departments))
    let select=document.getElementById('department')
    select.innerHTML=""
    let option1=document.createElement('option');
      // option.id=i._id
      option1.value=""
      option1.text='Select Specialist'
      select.add(option1)
    data.departments.forEach(i=>{
      let option=document.createElement('option');
      // option.id=i._id
      option.value=i._id
      option.text=i.name
      select.add(option)
    })
  })

})();

function checkHospitals(){
let dep=document.getElementById('department')
if(dep){
  let hos=document.getElementById('hospital')
  hos.innerHTML='';
  let data=hospitals.filter(i=>dep.value==i.department)
  data.map(i=>{
    hos.innerHTML+=`<option value=${i._id}>${i.name}</option>`
  })
}
}

