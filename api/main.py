from dns.message import Truncated
from flask import Flask, request, jsonify, json
from flask_restful import Api, Resource
from datetime import datetime 
from flask_cors import CORS
from flask_pymongo import PyMongo
from marshmallow import Schema, fields, ValidationError
from bson.json_util import dumps
from json import loads
from keys import keys

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://admin:"+keys["password"]+"@cluster0.jsdue.mongodb.net/ECSE3038_Project?retryWrites=true&w=majority" 

mongo = PyMongo(app)

CORS(app) 
api = Api(app)


class PatientSchema(Schema):
    fname = fields.String(required=True)
    lname = fields.String(required=True)
    age = fields.Integer(required=True)
    patient_id = fields.String(required=True)


class RecordSchema(Schema):
    patient_id = fields.String(required=True)
    position = fields.String(required=False)
    temperature = fields.Float(required=True)
    last_updated = fields.String(required=True)


@app.route("/")
def welcome():   
    return "Welcome!"

class Patient(Resource):
    def get(self):
        patients = mongo.db.patients.find()
        return jsonify(loads(dumps(patients)))

    def post(self):
        try:
            fname = request.json["fname"]
            lname = request.json["lname"]
            age = request.json["age"]
            patient_id = request.json["patient_id"]

            newPatient = {
                "fname": fname,
                "lname": lname,
                "age": age,
                "patient_id": patient_id
            }
            mongo.db.patients.insert_one(newPatient)
            return loads(dumps(newPatient))
        except ValidationError as ve:
            return ve.messages, 400

class PatientID(Resource):
    def get(self, id):
        patient = mongo.db.patients.find_one({"patient_id":id})
        return jsonify(loads(dumps(patient)))

    def patch(self, id):
        mongo.db.patients.update_one({"patient_id":id}, {"$set": request.json})
        patient = mongo.db.patients.find_one({"patient_id":id})
        return jsonify(loads(dumps(patient)))

    def delete(self, id):
        check = mongo.db.patients.delete_one({"patient_id":id})

        if check.deleted_count == 1:
            return {
                "success": True
            }
        else:
            return {
                "success": False
            }, 400

class Record(Resource):
    def post(self):
        try:
            patient_id = request.json["patient_id"]
            position = request.json["position"]
            temperature = request.json["temperature"]
            last_updated = datetime.now().strftime("%c")

            patientRecord = {
                "patient_id": patient_id,
                "position": position,
                "temperature": temperature,
                "last_updated": last_updated
            }
            mongo.db.records.insert_one(patientRecord)
            return {"success": True} 
        except ValidationError as ve:
            return ve.messages, 400

api.add_resource(Patient, "/api/patient")  
api.add_resource(PatientID, "/api/patient/<path:id>")
api.add_resource(Record, "/api/record")

if __name__ == "__main__":
    app.run(
        debug=True,
        # port = 3000,
        host = "0.0.0.0"
    )