

if (localStorage.getItem("token") === null) {
   window.location.href = "../index.html";
}

const logout = () => {
   if (confirm('Logout')) {
      localStorage.removeItem("role");
      localStorage.removeItem("token");
      window.location.href = "../index.html";
   }
}





const appointment_cont = document.getElementById('appointment_cont')
const appointment_history = document.getElementById('appointment_history')
const profile = document.getElementById('profile_cont')
const availability_cont = document.getElementById('availability_cont')

function displayAppointment() {
   appointment_cont.style.display = 'block'
   appointment_history.style.display = 'none'
   profile.style.display = 'none'
   availability_cont.style.display = 'none'
   fetchAvailableDoc()
}

function displayHistory() {
   appointment_cont.style.display = 'none'
   appointment_history.style.display = 'block'
   profile.style.display = 'none'
   availability_cont.style.display = 'none'
}


function displayAvailability() {
   appointment_cont.style.display = 'none'
   appointment_history.style.display = 'none'
   profile.style.display = 'none'
   availability_cont.style.display = 'block'
   fetchAvailability()
}

function displayProfile() {
   appointment_cont.style.display = 'none'
   appointment_history.style.display = 'none'
   profile.style.display = 'block'
   availability_cont.style.display = 'none'
}

const user_id = sessionStorage.getItem('id')

const appointment_form = document.getElementById('appointment_form')


function clearform() {
   // appointment_form.reset();
   location.reload();
}


// set date min and max selection for appointment
const today = new Date();

// Add one day to today's date for the minimum date
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

// Add 7 days to today's date for the maximum date
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);

// Format the dates to 'YYYY-MM-DD'
const minDate = tomorrow.toISOString().split('T')[0];
const maxDate = nextWeek.toISOString().split('T')[0];

// Set the min and max attributes of the date input
const dateInput = document.getElementById('date');
dateInput.setAttribute('min', minDate);
dateInput.setAttribute('max', maxDate);



appointment_form.addEventListener('submit', (e) => {

   e.preventDefault();

   const formData = new FormData(appointment_form);
   const fdata = Object.fromEntries(formData)
   console.log(fdata)


   fetch('/api/doctor', {
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
         // show_appointment();
      })
      .catch((error) => {
         console.error(error);
         alert('Cannot have multiple appointment with same doctor or server error');
      });
   // appointment_form.reset()
   fetchAvailableDoc()
   location.reload();


})


function loadUserAndAppointment(userData, appointmentData) {

   // console.log(data,'--->me')
   appointment_cont.style.display = "block"

   const tableContent = document.getElementById("stu-table-body");

   tableContent.innerHTML = ``;


   document.getElementById("fullName").value = userData.name
   if (userData.gender == 'male')
      document.getElementsByName("gender")[0].checked = true
   else if (userData.gender == 'female')
      document.getElementsByName("gender")[1].checked = true
   else
      document.getElementsByName("gender")[2].checked = true

   document.getElementById("email").value = userData.email
   document.getElementById("phone").value = userData.phone
   document.getElementById("area").value = userData.address
   document.getElementById("profile_city").value = userData.city

   let dobdate = new Date(userData.dob)
   let birth_month = (dobdate.getMonth() + 1).toString().padStart(2, '0')
   document.getElementById("dob").value = `${dobdate.getFullYear()}-${birth_month}-${dobdate.getDate()}`


   document.getElementById("profile_state").value = userData.state

   let departmentData = JSON.parse(sessionStorage.getItem('department'));
   console.log(typeof (departmentData))
   let profile_department = document.getElementById("profile_department")
   profile_department.innerHTML = ''
   departmentData.map(i => {
      profile_department.innerHTML += `<option value=${i._id}>${i.name}</option>`
   })
   profile_department.value = userData.department

   for (let j in appointmentData) {
      let i = appointmentData[j];
      const row = document.createElement("tr");
      row.className = "testTableRow";
      row.id = `${i._id}`
      row.innerHTML += `<td class="testTableDataStu name" >${i.patient != null ? i.patient.name : i.name}</td>`
      row.innerHTML += `<td class="testTableDataStu phone" >${i.patient != null ? i.patient.phone : i.phone}</td>`
      row.innerHTML += `<td class="testTableDataStu email" >${i.patient != null ? i.patient.email : i.email}</td>`
      row.innerHTML += `<td class="testTableDataStu date">${i.date.substring(0, 10)}</td>`
      row.innerHTML += `<td class="testTableDataStu time">${i.slot}</td>`
      row.innerHTML += `<td class="testTableDataStu time">${i.availability.hospital.department.name}</td>`
      row.innerHTML += `<td class="testTableDataStu doctor">${i.availability.doctor.name} : ${i.availability.hospital.name}</td>`
      row.innerHTML += `<td class="testTableDataStu"><button class="start" onclick="deleteRow(this)" >Cancel</button></td>`
      tableContent.appendChild(row);

   }
}

function historyAppointments(appoinmentData) {

   const tableContent = document.getElementById("history-table-body");

   tableContent.innerHTML = ``;

   for (let j in appoinmentData) {
      let i = appoinmentData[j];
      const row = document.createElement("tr");
      row.className = "testTableRow";
      row.id = `${i._id}`
      row.innerHTML += `<td class="testTableDataStu name" >${i.patient != null ? i.patient.name : i.name}</td>`
      row.innerHTML += `<td class="testTableDataStu phone" >${i.patient != null ? i.patient.phone : i.phone}</td>`
      row.innerHTML += `<td class="testTableDataStu email" >${i.patient != null ? i.patient.email : i.email}</td>`
      row.innerHTML += `<td class="testTableDataStu date">${i.date.substring(0, 10)}</td>`
      row.innerHTML += `<td class="testTableDataStu time">${i.slot}</td>`
      row.innerHTML += `<td class="testTableDataStu time">${i.availability.hospital.department.name}</td>`
      row.innerHTML += `<td class="testTableDataStu doctor">${i.availability.doctor.name} : ${i.availability.hospital.name}</td>`
      tableContent.appendChild(row);

   }
}

function deleteRow(rowId) {
   // console.log(rowId)
   let row = document.getElementById(rowId.parentNode.parentNode.id);
   // console.log(row)
   if (confirm('Confirm ok to Delete Appointment')) {
      fetch("/api/doctor/" + row.id, {
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
            fetchAvailableDoc(); // Refresh user list after deleting
         })
         .catch((error) => {
            console.error("Error deleting user:", error);
         });
   }
}

// profile update function
document.getElementById("profile_update_form").addEventListener('submit', (e) => {

   e.preventDefault();

   const formData = new FormData(document.getElementById("profile_update_form"));
   const fdata = Object.fromEntries(formData)
   // fdata.dob=new Date(fdata.dob).toISOString()
   // console.log(fdata)

   if (confirm('Confirm to update')) {
      fetch("/api/doctor/" + user_id, {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
         },
         body: JSON.stringify(fdata)
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
            return response.json()
         })
         .then(data => {
            sessionStorage.setItem('name', data.name);
            sessionStorage.setItem('phone', data.phone);
            sessionStorage.setItem('email', data.email);

            setSessionStorage();// call to set current patient details
         })
         .catch((error) => {
            console.error("Error Updating user:", error);
         });
   }
})



let pname = document.getElementById('pname')

let pphone = document.getElementById('pphone')

let pemail = document.getElementById('pemail')



function setSessionStorage() {
   // pname.value = sessionStorage.getItem('name');
   // pname.readOnly = true
   // pphone.value = sessionStorage.getItem('phone');
   // pphone.readOnly = true
   // pemail.value = sessionStorage.getItem('email');
   // pemail.readOnly = true
   document.getElementById('loginPerson').innerHTML = sessionStorage.getItem('name');
}


let data = JSON.parse(sessionStorage.getItem('department'))
let select = document.getElementById('department')
select.innerHTML = ""
let option1 = document.createElement('option');
// option.id=i._id
option1.value = ""
option1.text = 'Select Specialist'
select.add(option1)
data.forEach(i => {
   let option = document.createElement('option');
   // option.id=i._id
   option.value = i._id
   option.text = i.name
   option.id = i._id
   select.add(option)
})



var availableDoc, bookedAppointment, allAppointments, historyAppointment;
function fetchAvailableDoc() {
   // Your code here
   fetch('/api/doctor/' + user_id, {
      method: 'GET',
      headers: {
         "Content-Type": "application/json",
         Authorization: localStorage.getItem("token"),
      }
   })
      .then(res => {
         if (!res.ok) {
            throw new Error("Network response was not ok");
         }
         return res.json();
      })
      .then(data => {
         console.log(data)
         availableDoc = data.availdata;
         allAppointments = data.appointdata;
         const today = new Date();
         // Filter the appointments
         bookedAppointment = data.doctorAppointment.filter(appointment => {
            const appointmentDate = new Date(appointment.date);
            return appointmentDate >= today; // Only keep appointments that are today or later
         });

         historyAppointment = data.doctorAppointment.filter(appointment => {
            const appointmentDate = new Date(appointment.date);
            return appointmentDate < today; // Only keep appointments that are today or later
         });


         historyAppointments(historyAppointment)
         loadUserAndAppointment(data.userData[0], bookedAppointment)
         setSessionStorage();// call to set current patient details
         fetchAvailability()

      })
};
fetchAvailableDoc()


function getDoctor() {
   let state = document.getElementById('state').value
   let date = new Date(document.getElementById('date').value).getDay()
   let department = document.getElementById('department').value
   if (date !== "" && state !== "" && department !== "") {
      let selectDoctor = document.getElementById("doctor");
      let dep = document.getElementById(department).innerHTML
      let docData = availableDoc.filter(i => i.hospital.state == state && i.day[date] == 1 && i.doctor.department == dep)

      console.log(docData)
      if (docData.length != 0) {
         selectDoctor.innerHTML = "";
         docData.forEach(i => {
            let option = document.createElement("option");
            option.text = `${i.doctor.name} : ${i.hospital.name}`;
            option.value = `${i.doctor._id}`;
            option.id = i.doctor.doctorid
            selectDoctor.add(option);
         });

      }
      else {
         selectDoctor.innerHTML = ""
         let option = document.createElement('option')
         option.text = `Not Available`;
         option.value = '';
         option.selected = true
         selectDoctor.add(option)
      }
      getSlot();
   }

}

function getSlot() {
   let date = document.getElementById('date').value
   let doc = document.getElementById('doctor')
   let selecteDoc = doc.options[doc.selectedIndex];
   console.log(date, selecteDoc)
   if (selecteDoc.value) {


      let docid = selecteDoc.id
      let docval = selecteDoc.value
      let Doc = availableDoc.filter(i => i.doctor.doctorid == docid)
      let slotArr = ["1:00:00 pm - 1:30:00 pm", "1:30:00 pm - 2:00:00 pm"];

      bookedAppointment.forEach(i => {
         if (i.doctor == docval && i.date.substring(0, 10) == date) {
            slotArr.push(i.slot);
         }
      }
      )


      const startTimeInput = Doc[0].starttime;
      const endTimeInput = Doc[0].endtime;
      document.getElementById('availability').value = Doc[0]._id
      document.getElementById('patient').value = sessionStorage.getItem('id')


      // Parse input values and set doctor's availability
      const doctorAvailabilityStart = new Date();
      doctorAvailabilityStart.setHours(parseInt(startTimeInput.split(':')[0]), parseInt(startTimeInput.split(':')[1]), 0);

      const doctorAvailabilityEnd = new Date();
      doctorAvailabilityEnd.setHours(parseInt(endTimeInput.split(':')[0]), parseInt(endTimeInput.split(':')[1]), 0);

      // Define the appointment duration in minutes
      const appointmentDuration = 30;

      // Initialize the current time to the start of availability
      let currentTime = new Date(doctorAvailabilityStart);

      // Create an array to store available slots
      const availableSlots = [];

      // Generate available slots within the specified time range
      while (currentTime.getTime() + appointmentDuration * 60 * 1000 <= doctorAvailabilityEnd.getTime()) {
         const slotStartTime = new Date(currentTime);
         const slotEndTime = new Date(currentTime.getTime() + appointmentDuration * 60 * 1000);

         availableSlots.push({ start: slotStartTime, end: slotEndTime });

         currentTime = new Date(currentTime.getTime() + appointmentDuration * 60 * 1000);
      }

      // Display available slots to the patient
      let availableSlotsContainer = document.getElementById('slot');
      availableSlotsContainer.innerHTML = "";
      availableSlots.forEach((slot, index) => {
         let option = document.createElement('option')
         option.text = `${slot.start.toLocaleTimeString()} - ${slot.end.toLocaleTimeString()}`;
         option.value = `${slot.start.toLocaleTimeString()} - ${slot.end.toLocaleTimeString()}`;
         // availableSlots.forEach(i => {
         // console.log(option.text)
         // console.log(slotArr.indexOf(`${slot.start.toLocaleTimeString()} - ${slot.end.toLocaleTimeString()}`))
         if (slotArr.indexOf(`${slot.start.toLocaleTimeString()} - ${slot.end.toLocaleTimeString()}`) == -1) {
            availableSlotsContainer.add(option)
         }
         // })



      });

   }
   else {
      let availableSlotsContainer = document.getElementById('slot')
      availableSlotsContainer.innerHTML = ""
      let option = document.createElement('option')
      option.text = `Select Time`;
      option.value = '';
      availableSlotsContainer.add(option)
   }

}


// doctor availability operations


const availabilityTableBody = document.getElementById('availability-table-body');
const availabilityForm = document.getElementById('availability_update_form');
const availabilitySubmitBtn = document.getElementById('availability_submit_btn');
const availabilityUpdateBtn = document.getElementById('availability_update_btn');


let editingAvailabilityId = null;

function renderTable() {

   availabilityTableBody.innerHTML = '';
   availabilityData.forEach((i) => {
      const row = document.createElement('tr');
      row.innerHTML = `
           <td>${i.hospital.name}</td>
           <td>${getDaysFromValue(i.day)}</td>
           <td>${i.starttime}</td>
           <td>${i.endtime}</td>
           <td><span class="btn btn-primary" onclick="editAvailability('${i._id}')">Edit</span></td>
       `;
      availabilityTableBody.appendChild(row);
   });
}

function getDaysFromValue(dayValue) {
   const days = JSON.parse(dayValue);
   const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
   return dayNames.filter((day, index) => days[index] === 1).join(', ');
}

function editAvailability(id) {
   const data = availabilityData.find(item => item._id === id);
   if (data) {
      editingAvailabilityId = id;
      document.getElementById('hospital_availability').value = data.hospital._id;
      const days = JSON.parse(data.day);
      document.querySelectorAll('input[name="day"]').forEach((checkbox, index) => {
         checkbox.checked = days[index] === 1;
      });
      document.querySelector('[name="starttime"]').value = data.starttime;
      document.querySelector('[name="endtime"]').value = data.endtime;
      availabilitySubmitBtn.disabled = true;
      availabilityUpdateBtn.disabled = false;
   }
}


document.getElementById('availability_update_form').addEventListener('submit',(event)=>{
   event.preventDefault(); // Prevent default form submission

   const fData = new FormData(availabilityForm);
   const formData=Object.fromEntries(fData)

   const checkboxes = document.querySelectorAll('input[name="day"]');
   
   // Initialize an empty object for days
   const selectedDays = {};

   // Iterate over the checkboxes
   checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
         selectedDays[checkbox.value] = 1; // Add checked day to the object
      }
   });


   const newAvailability = {
      doctor: user_id, // Replace with actual doctor value
      hospital: formData['hospital'],
      day: JSON.stringify(selectedDays),
      starttime: formData['starttime'],
      endtime: formData['endtime']
   };

   // If editing, update the existing data, else add new data
   if (editingAvailabilityId) {
      // const item = availabilityData.find(item => item._id === editingAvailabilityId);
      newAvailability["_id"] = editingAvailabilityId

      fetch('/api/doctor/availability/' + editingAvailabilityId, {
         method: 'PUT', // or 'PUT' for update if needed
         body: JSON.stringify({ newAvailability, user_id: user_id, }),
         headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
         },

      })
         .then((response) => {
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
            }
            alert('Response submitted')
            renderTable(); // Re-render table with updated data
            resetForm();
            availabilitySubmitBtn.disabled = false;
            availabilityUpdateBtn.disabled = true;
         })
         .catch((error) => {
            console.error('Error:', error);
         });

      editingAvailabilityId = null;
   }
   else {
      // Send data to your personal API using fetch
      fetch('/api/doctor/availability/', {
         method: 'POST', // or 'PUT' for update if needed
         body: JSON.stringify({ newAvailability, user_id: user_id, }),
         headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
         },

      })
         .then((response) => {
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
            }
            alert('Response submitted')
            renderTable(); // Re-render table with updated data
            resetForm();
            availabilitySubmitBtn.disabled = false;
            availabilityUpdateBtn.disabled = true;
         })
         .catch((error) => {
            console.error('Error:', error);
         });

   }
   fetchAvailability()

})

function resetForm() {
   availabilityForm.reset();
   document.querySelectorAll('input[name="day"]').forEach(checkbox => checkbox.checked = false);
}

// availabilityForm.addEventListener('submit', function (event) {
//    submitAvailability(event);
// });

// availabilitySubmitBtn.addEventListener('click', function (event) {
//    submitAvailability(event);
// });

// availabilityUpdateBtn.addEventListener('click', function (event) {
//    submitAvailability(event);
// });



let availabilityData, hospitalsData;
function fetchAvailability() {
   // Your code here
   fetch('/api/doctor/availability/' + user_id, {
      method: 'GET',
      headers: {
         "Content-Type": "application/json",
         Authorization: localStorage.getItem("token"),
      }
   })
      .then(res => {
         if (!res.ok) {
            throw new Error("Network response was not ok");
         }
         return res.json();
      })
      .then(data => {
         availabilityData = data.availData

         let profile_department = document.getElementById("profile_department").value
         hospitalsData = data.hospitalData.filter(i=>i.department==profile_department)
         let hospital_select = document.getElementById("hospital_availability")
         
         hospital_select.innerHTML = ''
         hospitalsData.map(i => {
            hospital_select.innerHTML += `<option value=${i._id}>${i.name}</option>`
         })
         // console.log(hospitalsData, availabilityData)
      })

   // availabilityData = [
   //    {
   //       "_id": "675ea59e67a9a8564feb01a6",
   //       "doctor": "675ea59e67a9a8564feb019a",
   //       "hospital": "675ea59e67a9a8564feb0194",
   //       "day": "{\"0\":1,\"3\":1,\"6\":1}",
   //       "starttime": "10:00",
   //       "endtime": "16:00"
   //    },
   //    {
   //       "_id": "675ea59e67a9a8564feb01a3",
   //       "doctor": "675ea59e67a9a8564feb0197",
   //       "hospital": "675ea59e67a9a8564feb0191",
   //       "day": "{\"1\":1,\"2\":1,\"6\":1}",
   //       "starttime": "10:00",
   //       "endtime": "12:00"
   //    }
   // ]
   renderTable()
};


