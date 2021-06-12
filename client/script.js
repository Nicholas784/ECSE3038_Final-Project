function createPatientCard(patient) {

    var patientCardDiv = document.createElement("DIV");
    patientCardDiv.classList.add("patient-card");

    var patientEditDiv = document.createElement("DIV");
    patientEditDiv.classList.add("edit");
    patientEditDiv.setAttribute("onclick", "openForm('" + patient.patient_id + "')");

    var editIcon = document.createElement("I");
    editIcon.classList.add("fas","fa-edit");


    var iconSpan = document.createElement("SPAN");
    iconSpan.setAttribute("id", "icon");
    iconSpan.appendChild(editIcon);
    patientEditDiv.appendChild(iconSpan);

    var patientEditSpan = document.createElement("SPAN");
    patientEditSpan.setAttribute("id", "edit");
    patientEditSpan.innerHTML = " Edit";
    patientEditDiv.appendChild(patientEditSpan);
    patientCardDiv.appendChild(patientEditDiv);

    var cardContentDiv = document.createElement("DIV");
    cardContentDiv.classList.add("card-content");
    cardContentDiv.setAttribute("onclick", "goToChart('" + patient.patient_id + "')");

    var patientImgDiv = document.createElement("DIV");
    patientImgDiv.classList.add("card-img");

    var patientImgImg = document.createElement("IMG");
    patientImgImg.setAttribute("id", "patient-img");
    // patientImgImg.setAttribute("alt", "Image");

    patientImgDiv.appendChild(patientImgImg);
    cardContentDiv.appendChild(patientImgDiv);

    var patientInfoDiv = document.createElement("DIV");
    patientInfoDiv.classList.add("patient-info");

    var patientNameDiv = document.createElement("DIV");
    patientNameDiv.classList.add("patient-name");

    var patientFnameSpan = document.createElement("SPAN");
    patientFnameSpan.setAttribute("id", "fname");
    patientFnameSpan.innerHTML = patient.fname;
    patientNameDiv.appendChild(patientFnameSpan);

    var patientLnameSpan = document.createElement("SPAN");
    patientLnameSpan.setAttribute("id", "lname");
    patientLnameSpan.innerHTML = " " + patient.lname;
    patientNameDiv.appendChild(patientLnameSpan);

    patientInfoDiv.appendChild(patientNameDiv);

    var patientPositionDiv = document.createElement("DIV");
    patientPositionDiv.classList.add("patient-position");

    var patientPositionSpan = document.createElement("SPAN");
    patientPositionSpan.setAttribute("id", "position");
    patientPositionSpan.innerHTML = "position";
    patientPositionDiv.appendChild(patientPositionSpan);

    patientInfoDiv.appendChild(patientPositionDiv);
    cardContentDiv.appendChild(patientInfoDiv);
    patientCardDiv.appendChild(cardContentDiv);

    var patientDeleteDiv = document.createElement("DIV");
    patientDeleteDiv.classList.add("delete");
    patientDeleteDiv.setAttribute("onclick", "deletePatient('" + patient.patient_id + "')");

    var deleteIcon = document.createElement("I");
    deleteIcon.classList.add("far", "fa-trash-alt");

    var deleteIconSpan = document.createElement("SPAN");
    deleteIconSpan.setAttribute("id", "icon");
    deleteIconSpan.appendChild(deleteIcon);
    patientDeleteDiv.appendChild(deleteIconSpan);

    var patientDeleteSpan = document.createElement("SPAN");
    patientDeleteSpan.setAttribute("id", "delete");
    patientDeleteSpan.innerHTML = " Delete";
    patientDeleteDiv.appendChild(patientDeleteSpan);
    patientCardDiv.appendChild(patientDeleteDiv);

    return patientCardDiv;
}

function getPatients(){
    return fetch("http://localhost:5000/api/patient")
    .then(res => res.json())
    .then((json) => {
        var patients = json;
        return patients;
    });
}

async function drawCard(){
    let patients = await getPatients();
    patients.forEach((patient) => {
        var container = document.querySelector(".container");
        container.appendChild(createPatientCard(patient));
    });
}

window.onload = function() {
    drawCard();
}   

function openForm(id){
    document.getElementById("edit-form").style.display = "block";

    fetch("http://localhost:5000/api/patient/" + id)
    .then((res) => res.json())
    .then((json) => {
        let patient = json;
        console.log(patient);
        document.getElementById("patient-fname").value = patient.fname;
        document.getElementById("patient-lname").value = patient.lname;
        document.getElementById("patient-age").value = patient.age;
        document.getElementById("patient-id").value = patient.patient_id;
    });

    document.getElementById("submit-patient").addEventListener("click", function(event){
        event.preventDefault();
        
        let first_name = document.getElementById("patient-fname").value;
        let last_name = document.getElementById("patient-lname").value;
        let age = document.getElementById("patient-age").value;
        let patient_id = document.getElementById("patient-id").value;
        
        let jsonBody = {
            "fname": first_name,
            "lname": last_name,
            "age": age,
            "patient_id": patient_id
        };
        
        fetch("http://localhost:5000/api/patient/" + id, {
            method: "PATCH",
            body: JSON.stringify(jsonBody),
            headers: {
                "Content-type": "application/json",
            }
        })
        .then((res) => res.json())
        .then((json) => console.log(json));
        
            // setTimeout(window.location.href = "index.html" , 1000);
    });
}

function closeForm(){
    document.getElementById("edit-form").style.display = "none";
    window.location.href = "index.html";
}

function deletePatient(id){
    fetch("http://localhost:5000/api/patient/" + id, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json",
        }
    });

    // setTimeout("location.reload(true);", 500);
}

function goToChart(){
    window.location.href = "patientChart.html";
}


function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}