# **Low Cost Patient Monitor**

## **Aim**

The aim of this project is to help gain an understanding of the procedures and technologies that go into developing a full stack web application. A prototype low cost patient monitoring system is used to help achieve this goal.

## **Purpose of:**

### **Embedded**

The embedded part of the project consists of a simple system that is used to monitor a patient's body temperature and position. It uses an LM35DT to collect temperature and a MPU6050 gyroscope/accelerometer to record the patient's position. This data is continuously sent to the api along with the mac address of the wifi module which is used as the patient ID. 

### **API**

The API makes use of mongoDB to store data collected from both the client and the embedded system. Patient information such as first name, last name, age, and ID is retrieved from the client and stored. The patient information and records may be matched using the ID recorded for each patient by the embedded system. GET, POST, PATCH and DELETE requests are handled here. 

- GET /api/patient

    This route should return an array of all patient objects stored in the database.

- GET /api/patient/:id

    This route should return a single patient object. The patient returned should have an ID that matches the one specified in the request.

- POST /api/patient

    This route should handle the creation of a new patient object. The parameters of this object should be taken from the JSON body of the incoming request.

    ```json
    {
    	"fname": <first name>,
    	"lname": <last name>,
    	"age": <age>,
    	"patient_id": <mac address of the wifi module attached to the patient>
    }
    ```

- PATCH /api/patient/:id

    This route should allow a user to edit any of the details of a specified patient object identified by their ID. The route should respond with the newly edited patient object.

- DELETE /api/patient/:id

    This route should allow a user to delete a specified patient object identified by their ID. The route should respond with a message that indicates weather the operation was successful.

### **Database**

Stores two key types of data. Namely "patient" and "record" objects. 
The patient object consists of: 
- First name
- Last name
- Age
- Patient ID

While the records object consist of: 
- Temperture
- Position
- Patient ID
- Last Updated

### **Frontend(client)**  


The frontend should consist of the following:

1. A main page where a grid of patient cards are displayed. Each card shows the patient's first and last name and their current position. 

    Each card also have an edit and delete button. When the edit button is pressed, the view is modified to accommodate new values to be sent to the backend in a PATCH request for the patient object. When the delete button is clicked, a DELETE request is sent to the backend to remove the specified patient object.

2. A secondary page that shows the details of a single patient. This view is shown if a user clicks on one of the patient cards from the main view. This new view shows only the details of the patient in focus. The patient's first and last name is displayed along with their current position, their current temperature in numerical form as well as a graph of the patients temperature over time. The graph should show temperature of the patient over the time span of the last half hour. This graph should update as soon as new a record data point is received by the backend and saved in the database. The graph should display a plot of temperature vs last_updated.

There should be a BACK button that, when clicked, returns the user to the patient grid view.








