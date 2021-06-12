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

    fetch("http://localhost:5000/api/patient", {
        method: "POST",
        body: JSON.stringify(jsonBody),
        headers: {
            "Content-type": "application/json",
        }
    })
    .then((res) => res.json())
    .then((json) => console.log(json));


});

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

// fetch(connectionURL.concat("/api/patient"), {
//     method: "POST",
//     body: JSON.stringify(jsonBody),
//     headers:{
//         "Content-type": "application/json",
//     },
// })
