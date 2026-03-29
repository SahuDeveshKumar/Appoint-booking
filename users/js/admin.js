// toggle list and add page
let mytoken = localStorage.getItem("token");
if (mytoken === null) {
   window.location.href = "../index.html";
}

const logout = () => {
   if (confirm('Logout')) {
      localStorage.removeItem("role");
      localStorage.removeItem("token");
      sessionStorage.removeItem('user_id')
      window.location.href = "../index.html";
   }
}

const show_appointment_btn = document.getElementById('show_appointment_btn')

const appointment_Interface_btn = document.getElementById('appointment_Interface_btn')
const admin_Interface_btn = document.getElementById('admin_Interface_btn')

const appointment_cont = document.getElementById('appointment_cont')
const innerbox = document.getElementById('innerbox')
const addUserForm = document.getElementById('addUserForm')
const appointment_form = document.getElementById('appointment_form')
const user_id = sessionStorage.getItem('user_id')




appointment_Interface();
// app interface
function appointment_Interface() {
   appointment_cont.style.display = 'block'
   innerbox.style.display = 'none'
   show_appointment();

}




// function book_appointment() {
//    appointment_div.style.display = "block"
//    appointment_cont.style.display = "none"
// }

function clearform() {
   appointment_form.reset();
   addUserForm.reset();
}

appointment_form.addEventListener('submit', (e) => {

   e.preventDefault();

   const formData = new FormData(appointment_form);
   const fdata = Object.fromEntries(formData)
   // console.log(JSON.stringify(fdata))


   fetch('/api/admin/appointments/', {
      method: 'POST',
      body: JSON.stringify({
         user_id: user_id,
         fdata
      }),
      headers: {
         "Content-Type": "application/json",
         Authorization: localStorage.getItem("token"),
      },
   })
      .then((response) => {
         // console.log(response)
         if (!response.ok) {
            if (response.status === 404) {
               localStorage.removeItem("role");
               localStorage.removeItem("token");
               sessionStorage.removeItem('user_id')
               // alert("Invalid or expired token");
               window.location.href = "../index.html";
            }
            if (response.status === 401) {
               localStorage.removeItem("role");
               localStorage.removeItem("token");
               sessionStorage.removeItem('user_id')
               alert("Invalid or expired token");
               window.location.href = "../index.html";
            }
            throw new Error("Network response was not ok");
            // return 
         }
         // console.log(response)
         alert('Appointment Booked');
         appointment_Interface();
      })
      .catch((error) => {
         console.error(error);
         alert('Failed to Book or server error');
      });
   // appointment_form.reset()
   document.getElementById('closeAppointmentBtn').click()

})



function show_appointment() {
   // console.log(user_id)
   appointment_cont.style.display = "block"
   // appointment_div.style.display = "none"
   fetch("/api/admin/appointments/", {
      headers: {
         "Content-Type": "application/json",
         Authorization: localStorage.getItem("token"),
      },
   })
      .then((response) => {

         if (!response.ok) {
            if (response.status === 401) {
               localStorage.removeItem("role");
               localStorage.removeItem("token");
               sessionStorage.removeItem('user_id')
               alert("Invalid or expired token");
               window.location.href = "../index.html";
            }
            if (response.status === 403) {
               alert("Action not allowed");
            }
            throw new Error("Network response was not ok");
            // return 
         }

         return response.json();
      })
      .then((data) => {
         loadAppointment(data);
      })
      .catch((error) => {
         console.error("Error fetching users:", error);
      });
}

function loadAppointment(data) {

   const tableContent = document.getElementById("stu-table-body");

   tableContent.innerHTML = ``;


   for (let j in data) {
      let i = data[j];
      const row = document.createElement("tr");
      row.className = "testTableRow";
      row.id = `${i._id}`
      row.innerHTML += `<td class="testTableDataStu name" >${i.name}</td>`
      row.innerHTML += `<td class="testTableDataStu date">${i.date}</td>`
      row.innerHTML += `<td class="testTableDataStu time">${i.time}</td>`
      row.innerHTML += `<td class="testTableDataStu phone">${i.phone}</td>`
      row.innerHTML += `<td class="testTableDataStu email">${i.email}</td>`
      row.innerHTML += `<td class="testTableDataStu doctor">${i.doctor}</td>`
      row.innerHTML += `<td class="testTableDataStu message">${i.message}</td>`
      row.innerHTML += `<td class="testTableDataStu address">${i.address}</td>`
      row.innerHTML += `<td class="testTableDataStu"><button class="start" onclick="deleteRow(this)" >Cancel</button></td>`
      row.innerHTML += `<td class="testTableDataStu"><button class="edit" onclick="editAppointment(this)">Edit</button>
      <button class="save" style=" display: none" onclick="saveAppointment(this)">Save</button></td>`

      tableContent.appendChild(row);

   }
}

function deleteRow(rowId) {
   // console.log(rowId)
   let row = document.getElementById(rowId.parentNode.parentNode.id);
   // console.log(row)
   if (confirm('Confirm ok to Delete Appointment')) {
      fetch("/api/admin/appointments/" + row.id, {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
         },
      })
         .then((response) => {
            if (!response.ok) {
               if (response.status === 401) {
                  localStorage.removeItem("role");
                  localStorage.removeItem("token");
                  sessionStorage.removeItem('user_id')
                  alert("Invalid or expired token");
                  window.location.href = "../index.html";
               }
               throw new Error("Network response was not ok");
            }
            show_appointment(); // Refresh user list after deleting
         })
         .catch((error) => {
            console.error("Error deleting user:", error);
         });
   }
}

function editAppointment(thisid) {
   let row = thisid.parentNode.parentNode.id;
   if (document.getElementById(row).querySelector('.save').style.display == 'block') {//this is for toogle edit and write
      document.getElementById(row).querySelector('.save').style.display = 'none';
      document.getElementById(row).querySelector('.name').contentEditable = "false";
      document.getElementById(row).querySelector('.phone').contentEditable = "false";
      document.getElementById(row).querySelector('.email').contentEditable = "false";
      document.getElementById(row).querySelector('.message').contentEditable = "false";
      document.getElementById(row).querySelector('.address').contentEditable = "false";
      document.getElementById(row).querySelector('.time').contentEditable = "false";
      document.getElementById(row).querySelector('.doctor').contentEditable = "false";
   }
   else {
      document.getElementById(row).querySelector('.edit').style.display = 'none';
      document.getElementById(row).querySelector('.save').style.display = 'block';
      document.getElementById(row).querySelector('.name').contentEditable = "true";
      document.getElementById(row).querySelector('.phone').contentEditable = "true";
      document.getElementById(row).querySelector('.email').contentEditable = "true";
      document.getElementById(row).querySelector('.message').contentEditable = "true";
      document.getElementById(row).querySelector('.address').contentEditable = "true";
      document.getElementById(row).querySelector('.time').contentEditable = "true";
      document.getElementById(row).querySelector('.doctor').contentEditable = "true";
   }
}

function saveAppointment(thisid) {
   let row = thisid.parentNode.parentNode.id;

   let name = document.getElementById(row).querySelector('.name').innerHTML;
   let phone = document.getElementById(row).querySelector('.phone').innerHTML;
   let email = document.getElementById(row).querySelector('.email').innerHTML;
   let msg = document.getElementById(row).querySelector('.message').innerHTML;
   let address = document.getElementById(row).querySelector('.address').innerHTML;
   let time = document.getElementById(row).querySelector('.time').innerHTML;
   let doctor = document.getElementById(row).querySelector('.doctor').innerHTML;

   document.getElementById(row).querySelector('.name').innerHTML = name;
   document.getElementById(row).querySelector('.phone').innerHTML = phone;
   document.getElementById(row).querySelector('.email').innerHTML = email;
   document.getElementById(row).querySelector('.message').innerHTML = msg;
   document.getElementById(row).querySelector('.address').innerHTML = address;
   document.getElementById(row).querySelector('.time').innerHTML = time;
   document.getElementById(row).querySelector('.doctor').innerHTML = doctor;

   document.getElementById(row).querySelector('.name').contentEditable = "false";
   document.getElementById(row).querySelector('.phone').contentEditable = "false";
   document.getElementById(row).querySelector('.email').contentEditable = "false";
   document.getElementById(row).querySelector('.address').contentEditable = "false";
   document.getElementById(row).querySelector('.time').contentEditable = "false";
   document.getElementById(row).querySelector('.doctor').contentEditable = "false";
   document.getElementById(row).querySelector('.message').contentEditable = "false";

   fetch("/api/admin/appointments/" + row, {
      method: "PUT",
      headers: {
         "Content-Type": "application/json",
         Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({
         name: name,
         phone: phone,
         email: email,
         msg: msg,
         address: address,
         time: time,
         doctor: doctor
      }),
   })
      .then((response) => {
         if (!response.ok) {
            if (response.status === 401) {
               localStorage.removeItem("role");
               localStorage.removeItem("token");
               sessionStorage.removeItem('user_id')
               alert("Invalid or expired token");
               window.location.href = "../index.html";
            }
            throw new Error("Network response was not ok");
         }
         // Refresh user list after saving
         alert('updated successfully');
         show_appointment();
      })
      .catch((error) => {
         console.error("Error saving user:", error);
      });
}





function admin_Interface() {

   appointment_cont.style.display = 'none'
   innerbox.style.display = 'block'
   fetch_user();
}

// fetchUsers();
// function add_user() {
//    let on = document.getElementById('addUserForm');
//    let off = document.getElementById('innerbox');
//    on.style.display = 'block';
//    off.style.display = 'none';
//    image.style.display = "none";
// }

// function show_user() {
//    let off = document.getElementById('addUserForm');
//    let on = document.getElementById('innerbox');
//    on.style.display = 'block';
//    off.style.display = 'none';
//    image.style.display = "none";
//    fetch_user();
// }

// functional operations
// fetchUsers();


function fetch_user() {
   fetch("/api/admin/user", {
      headers: {
         "Content-Type": "application/json",
         Authorization: localStorage.getItem("token"),
      },
   })
      .then((response) => {
         if (!response.ok) {
            if (response.status === 401) {
               localStorage.removeItem("role");
               localStorage.removeItem("token");
               sessionStorage.removeItem('user_id')
               alert("Invalid or expired token");
               window.location.href = "../index.html";
            }
            throw new Error("Network response was not ok");
         }
         return response.json();
      })
      .then((data) => {
         loadUsers(data);
      })
      .catch((error) => {
         console.error("Error fetching users:", error);
      });
}

function loadUsers(data) {



   const tableContent = document.getElementById("admin-table-body");

   tableContent.innerHTML = ``;


   for (let j in data) {
      let i = data[j];
      const row = document.createElement("tr");
      row.className = "testTableRow";
      row.id = `${i._id}`
      row.innerHTML += `<td class="testTableDataStu name" >${i.username}</td>`
      row.innerHTML += `<td class="testTableDataStu age" >${i.age}</td>`
      row.innerHTML += `<td class="testTableDataStu dob">${i.dob}</td>`
      row.innerHTML += `<td class="testTableDataStu ">${i.role}</td>`
      row.innerHTML += `<td class="testTableDataStu phone">${i.phone}</td>`
      row.innerHTML += `<td class="testTableDataStu email">${i.email}</td>`
      row.innerHTML += `<td class="testTableDataStu address">${i.add}</td>`
      row.innerHTML += `<td class="testTableDataStu"><button class="start" onclick="deleteUser(this)" >Delete</button></td>`
      row.innerHTML += `<td class="testTableDataStu"><button class="edit" onclick="editUser(this)">Edit</button>
      <button class="save" style=" display: none" onclick="saveUser(this)">Save</button></td>`
      tableContent.appendChild(row);

   }

}



function deleteUser(thisid) {
   var divid = thisid.parentNode.parentNode.id;
   let item = document.getElementById(divid).querySelector('.name').innerHTML;
   if (confirm('Deleting: ' + item)) {
      fetch("/api/admin/user/" + divid, {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
         },
      })
         .then((response) => {
            if (!response.ok) {
               if (response.status === 401) {
                  localStorage.removeItem("role");
                  localStorage.removeItem("token");
                  sessionStorage.removeItem('user_id')
                  alert("Invalid or expired token");
                  window.location.href = "../index.html";
               }
               throw new Error("Network response was not ok");
            }
            fetch_user();; // Refresh user list after deleting
         })
         .catch((error) => {
            console.error("Error deleting user:", error);
         });
   }
}

function editUser(thisid) {
   let row = thisid.parentNode.parentNode.id;
   if (document.getElementById(row).querySelector('.save').style.display == 'block') {//this is for toogle edit and write
      document.getElementById(row).querySelector('.save').style.display = 'none';
      document.getElementById(row).querySelector('.name').contentEditable = "false";
      document.getElementById(row).querySelector('.phone').contentEditable = "false";
      document.getElementById(row).querySelector('.email').contentEditable = "false";
      document.getElementById(row).querySelector('.age').contentEditable = "false";
      document.getElementById(row).querySelector('.address').contentEditable = "false";
      document.getElementById(row).querySelector('.dob').contentEditable = "false";
      
   }
   else {
      document.getElementById(row).querySelector('.edit').style.display = 'none';
      document.getElementById(row).querySelector('.save').style.display = 'block';
      document.getElementById(row).querySelector('.name').contentEditable = "true";
      document.getElementById(row).querySelector('.phone').contentEditable = "true";
      document.getElementById(row).querySelector('.email').contentEditable = "true";
      document.getElementById(row).querySelector('.age').contentEditable = "true";
      document.getElementById(row).querySelector('.address').contentEditable = "true";
      document.getElementById(row).querySelector('.dob').contentEditable = "true";
   }
}

function saveUser(thisid) {
   let row = thisid.parentNode.parentNode.id;

   let name = document.getElementById(row).querySelector('.name').innerHTML;
   let phone = document.getElementById(row).querySelector('.phone').innerHTML;
   let email = document.getElementById(row).querySelector('.email').innerHTML;
   let age = document.getElementById(row).querySelector('.age').innerHTML;
   let address = document.getElementById(row).querySelector('.address').innerHTML;
   let dob = document.getElementById(row).querySelector('.dob').innerHTML;

   document.getElementById(row).querySelector('.name').innerHTML = name;
   document.getElementById(row).querySelector('.phone').innerHTML = phone;
   document.getElementById(row).querySelector('.email').innerHTML = email;
   document.getElementById(row).querySelector('.age').innerHTML = age;
   document.getElementById(row).querySelector('.address').innerHTML = address;
   document.getElementById(row).querySelector('.dob').innerHTML = dob;

   document.getElementById(row).querySelector('.name').contentEditable = "false";
   document.getElementById(row).querySelector('.phone').contentEditable = "false";
   document.getElementById(row).querySelector('.email').contentEditable = "false";
   document.getElementById(row).querySelector('.address').contentEditable = "false";
   document.getElementById(row).querySelector('.dob').contentEditable = "false";
   
   document.getElementById(row).querySelector('.age').contentEditable = "false";

   fetch("/api/admin/user/" + row, {
      method: "PUT",
      headers: {
         "Content-Type": "application/json",
         Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({
         name: name,
         phone: phone,
         email: email,
         age: age,
         add: address,
         dob:dob
      }),
   })
      .then((response) => {
         if (!response.ok) {
            if (response.status === 401) {
               localStorage.removeItem("role");
               localStorage.removeItem("token");
               sessionStorage.removeItem('user_id')
               alert("Invalid or expired token");
               window.location.href = "../index.html";
            }
            throw new Error("Network response was not ok");
         }
         // Refresh user list after saving
         alert('updated successfully');
         fetch_user();
      })
      .catch((error) => {
         console.error("Error saving user:", error);
      });
}

// add user
document.getElementById('addUserForm').addEventListener('submit', e => {
   e.preventDefault();
   const form = document.getElementById('addUserForm')
   const formData = new FormData(form);
   const fdata = Object.fromEntries(formData)
   // console.log(JSON.stringify(fdata))

   fetch('/api/admin/user', {
      method: 'POST',
      body: JSON.stringify({
         fdata
      }),
      headers: {
         "Content-Type": "application/json",
         Authorization: localStorage.getItem("token"),
      },
   })
      .then((response) => {
         // console.log(response)
         if (!response.ok) {
            if (response.status === 404) {
               localStorage.removeItem("role");
               localStorage.removeItem("token");
               sessionStorage.removeItem('user_id')
               // alert("Invalid or expired token");
               window.location.href = "../index.html";
            }
            if (response.status === 401) {
               localStorage.removeItem("role");
               localStorage.removeItem("token");
               sessionStorage.removeItem('user_id')
               alert("Invalid or expired token");
               window.location.href = "../index.html";
            }
            throw new Error("Network response was not ok");
            // return 
         }
         // console.log(response)
         alert('successfully added');
         admin_Interface();
      })
      .catch((error) => {
         console.error(error);
         alert('Failed to add duplicate entry or server error');
      });
   // form.reset()
   document.getElementById('closeUserBtn').click()
   

})
// successful login

