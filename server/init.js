/*

    Must be manually run with node init.js

    HardCoded Data -> Admins, Procedures, Processes


*/

const bcrypt = require('bcrypt');
const faker = require('faker');

const departments = ["Cardiology", "Radiology", "Oncology", "Neurology", "Pediatrics", "Orthopedics"];
const staff = ["Cardiology", "Radiology", "Oncology", "Neurology", "Pediatrics", "Orthopedics", "Nurse"];
let Users = require('./models/users.js');
let Procedures = require('./models/procedure.js');
let Equipment = require('./models/equipment.js');
let EquipmentHeads = require('./models/equipmentHead.js')
let Rooms = require('./models/room.js');
let Communication = require('./models/communication.js');
let Processes = require('./models/processes.js');


const uri = process.env.MEDIFLOWKEY;
let mongoose = require('mongoose');

mongoose.connect(uri);

let db = mongoose.connection;

// Create Functions

function createUser(adminBool, email, name, age, gender, password, role, schedule) {

    let createUser = {
        admin: adminBool,
        email: email,
        joined: new Date(),
        name: name,
        age: age,
        gender: gender,
        password: password,
        processes: [],
        role: role,
        schedule: schedule,
    }

    let addUser = new Users(createUser)

    return addUser.save();

}

function createEquipmentHead(name, quantity, type, equipment) {

    let createEquipmentHead = {
        name: name,
        quantity: quantity,
        equipment: [equipment],
        type: type,
    }

    let addEquipmentHead = new EquipmentHeads(createEquipmentHead);

    return addEquipmentHead.save();

}

function createEquipment(name, locationRoom, type) {

    let createEquipment = {
        location: locationRoom,
        name: name,
        status: "Functional",
        type: type
    }

    let addEquipment = new Equipment(createEquipment);

    return addEquipment.save();

}

function createRoom(name, status, type) {

    let createRoom = {
        created: new Date(),
        equipment: [],
        name: name,
        status: status,
        type: type,
        updatedAt: new Date()

    }

    let addRoom = new Rooms(createRoom);

    return addRoom.save();

}

function createProcedure(description, estimatedDuration, name, requiredEquipment, requiredRoomType, staffType, numStaff) {

    let createProcedure = {

        created: new Date(),
        description: description,
        estimatedDuration: estimatedDuration,
        name: name,
        requiredEquipment: requiredEquipment,
        requiredRoomType: requiredRoomType,
        staffType: staffType,
        numStaff: numStaff

    }

    let addProcedure = new Procedures(createProcedure);

    return addProcedure.save();
}


function createProcess(name, procedures) {

    let createProcess = {

        name: name,
        components: procedures


    }

    let addProcess = new Processes(createProcess);

    return addProcess.save();
}

function getRandomSchedule() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    let schedule = {};

    days.forEach(day => {
        let startHour = faker.datatype.number({ min: 6, max: 10 });
        let endHour = startHour + faker.datatype.number({ min: 8, max: 10 });
        schedule[day] = [{
            start: `${startHour.toString().padStart(2, '0')}:00`,
            end: `${endHour.toString().padStart(2, '0')}:00`
        }];
    });

    return schedule;
}

// Populate
const admin_password = "sysAdmin"
const saltRounds = 10;
const hashedPass = bcrypt.hashSync(admin_password, saltRounds);

const populate = async () => {

    // SYS ADMIN
    let sysAdmin = await createUser(true, "sysAdmin@gmail.com", "SYSTEM ADMIN", 28, "Male", hashedPass, "admin",
        {
            Monday: [{ start: "00:00", end: "23:59" }],
            Tuesday: [{ start: "00:00", end: "23:59" }],
            Wednesday: [{ start: "00:00", end: "23:59" }],
            Thursday: [{ start: "00:00", end: "23:59" }],
            Friday: [{ start: "00:00", end: "23:59" }],
            Saturday: [{ start: "00:00", end: "23:59" }],
            Sunday: [{ start: "00:00", end: "23:59" }]
        });

    // USERS

     for (let i = 0; i < 2; i++) {
         let department = staff[5];
         let name = faker.name.findName();
         let email = faker.internet.email(); 
         let age = faker.datatype.number({ min: 25, max: 60 }); 
         let gender = faker.random.arrayElement(["Male", "Female"]); 

         await createUser(false, email, name, age, gender, hashedPass, department, getRandomSchedule());
     }

     for (let i = 0; i < 7; i++) {
        let department = staff[i];
        let name = faker.name.findName();
        let email = faker.internet.email(); 
        let age = faker.datatype.number({ min: 25, max: 60 }); 
        let gender = faker.random.arrayElement(["Male", "Female"]); 

        await createUser(false, email, name, age, gender, hashedPass, department, getRandomSchedule());
    }
    
    for (let i = 0; i < 3; i++) {
        let department = staff[7];
        let name = faker.name.findName();
        let email = faker.internet.email(); 
        let age = faker.datatype.number({ min: 25, max: 60 }); 
        let gender = faker.random.arrayElement(["Male", "Female"]); 

        await createUser(false, email, name, age, gender, hashedPass, department, getRandomSchedule());
    }

    // ROOMS

    let storageRoom = await createRoom("Storage Room", "OPEN", "Storage");
    let heartRoom = await createRoom("Room 101", "OPEN", "Cardiology");
    let icu = await createRoom("Room 102", "OPEN", "ICU");
    let baseRoomNumber = 103;
    for (let i = 0; i < departments.length; i++) {
        let roomName = `Room ${baseRoomNumber + i}`;
        let department = departments[i];
        await createRoom(roomName, "OPEN", department);
    }

    // EQUIPMENT

    // Heart-Lung Machine
    let heartLungMachineOne = await createEquipment("Heart-Lung Machine One", storageRoom, "Cardiology");
    let heartLungMachineTwo = await createEquipment("Heart-Lung Machine Two", storageRoom, "Cardiology");
    let heartLungMachineHead = await createEquipmentHead("Heart Lung Machine", 2, "Cardiology", heartLungMachineOne, heartLungMachineTwo);

    // CT Machine
    let ctMachineOne = await createEquipment("CT Machine One", storageRoom, "Radiology");
    let ctMachineTwo = await createEquipment("CT Machine Two", storageRoom, "Radiology");
    let ctMachineHead = await createEquipmentHead("CT Machine", 2, "Radiology", ctMachineOne, ctMachineTwo);


    let surgicalInstrumentsOne = await createEquipment("Surgical Instruments Set One", storageRoom, "Orthopedics");
    let surgicalInstrumentsTwo = await createEquipment("Surgical Instruments Set Two", storageRoom, "Orthopedics");
    let surgicalInstrumentsHead = await createEquipmentHead("Surgical Instruments", 2, "Orthopedics", surgicalInstrumentsOne, surgicalInstrumentsTwo);

    let prostheticHipOne = await createEquipment("Prosthetic Hip One", storageRoom, "Orthopedics");
    let prostheticHipTwo = await createEquipment("Prosthetic Hip Two", storageRoom, "Orthopedics");
    let prostheticHipHead = await createEquipmentHead("Prosthetic Hip", 2, "Orthopedics", prostheticHipOne, prostheticHipTwo);


    let xrayMachineOne = await createEquipment("X-ray Machine One", storageRoom, "Radiology");
    let xrayMachineTwo = await createEquipment("X-ray Machine Two", storageRoom, "Radiology");
    let xrayMachineHead = await createEquipmentHead("X-ray Machine", 2, "Radiology", xrayMachineOne, xrayMachineTwo);

    // Casting Materials for Fracture Treatment
    let castingMaterialsOne = await createEquipment("Casting Materials One", storageRoom, "Orthopedics");
    let castingMaterialsTwo = await createEquipment("Casting Materials Two", storageRoom, "Orthopedics");
    let castingMaterialsHead = await createEquipmentHead("Casting Materials", 2, "Orthopedics", castingMaterialsOne, castingMaterialsTwo);

    // Infusion Pump for Chemotherapy
    let infusionPumpOne = await createEquipment("Infusion Pump One", storageRoom, "Oncology");
    let infusionPumpTwo = await createEquipment("Infusion Pump Two", storageRoom, "Oncology");
    let infusionPumpHead = await createEquipmentHead("Infusion Pump", 2, "Oncology", infusionPumpOne, infusionPumpTwo);

    // IV Fluids for Chemotherapy
    let ivFluidsOne = await createEquipment("IV Fluids One", storageRoom, "Oncology");
    let ivFluidsTwo = await createEquipment("IV Fluids Two", storageRoom, "Oncology");
    let ivFluidsHead = await createEquipmentHead("IV Fluids", 2, "Oncology", ivFluidsOne, ivFluidsTwo);


    // PROCEDURES

    // Heart Surgery
    let heartSurgeryPreOp = await createProcedure("Patient needs blood tests monitoring, and fasting diet requirements.", 30, "Heart Surgery PreOP", [], null, "Nurse", 2);
    let heartSurgeryOp = await createProcedure("Patient needs to undergo anesthesia in which the performing doctor will execute the surgery", 60, "Heart Surgery OP", ['Heart Lung Machine'], "Cardiology", "Cardiology", 1);
    let heartSurgeryPostOp = await createProcedure("Patient needs to rest and be monitored", 60, "Heart Surgery PostOP", ['CT Machine'], "ICU", "Radiology", 1);

    // Hip Replacement
    let hipReplacementPreOp = await createProcedure("Patient needs pre-operative blood tests, X-rays, and fasting diet requirements.", 60, "Hip Replacement PreOP", [], null, "Nurse", 3);
    let hipReplacementOp = await createProcedure("Patient undergoes anesthesia and the surgeon replaces the damaged hip joint with a prosthetic.", 120, "Hip Replacement OP", ['Surgical Instruments', 'Prosthetic Hip'], "Orthopedics", "Orthopedics", 3);
    let hipReplacementPostOp = await createProcedure("Patient needs to be monitored for complications and start physical therapy.", 90, "Hip Replacement PostOP", ['Physical Therapy Equipment'], "ICU", "Nurse", 2);

    // Fractures
    let fractureTreatmentPreOp = await createProcedure("Patient needs X-rays and initial assessment.", 45, "Fracture Treatment PreOP", ['X-ray Machine'], "Radiology", "Nurse", 1);
    let fractureTreatmentOp = await createProcedure("Patient undergoes procedure to set the fracture and apply a cast.", 60, "Fracture Treatment OP", ['Casting Materials'], "Orthopedics", "Orthopedics", 2);
    let fractureTreatmentPostOp = await createProcedure("Patient needs follow-up X-rays and monitoring for proper healing.", 45, "Fracture Treatment PostOP", ['X-ray Machine'], "Radiology", "Nurse", 1);

    // Chemotherapy
    let chemoPreOp = await createProcedure("Patient needs blood tests and assessment for chemotherapy suitability.", 45, "Chemotherapy PreOP", [], "Oncology", "Nurse", 2);
    let chemoOp = await createProcedure("Patient receives chemotherapy infusion.", 120, "Chemotherapy OP", ['Infusion Pump'], "Oncology", "Oncology", 1);
    let chemoPostOp = await createProcedure("Patient needs monitoring for side effects and hydration therapy.", 60, "Chemotherapy PostOP", ['IV Fluids'], "Oncology", "Nurse", 1);

    // Pediatric Checkup
    let pedCheckupPreOp = await createProcedure("Patient needs a preliminary health history and development assessment.", 20, "Pediatric Checkup PreOP", [], "Pediatrics", "Nurse", 1);
    let pedCheckupOp = await createProcedure("Patient undergoes a comprehensive physical examination including growth measurements, immunization updates, and developmental screening.", 40, "Pediatric Checkup OP", [], "Pediatrics", "Pediatrics", 1);
    let pedCheckupPostOp = await createProcedure("Patient receives follow-up instructions and health education.", 20, "Pediatric Checkup PostOP", [], "Pediatrics", "Nurse", 1);

    // PROCESSES

    let heartSurgery = await createProcess("Heart Surgery", [heartSurgeryPreOp, heartSurgeryOp, heartSurgeryPostOp]);
    let hipReplacement = await createProcess("Hip Replacement", [hipReplacementPreOp, hipReplacementOp, hipReplacementPostOp]);
    let fractureTreatment = await createProcess("Fracture Treatment", [fractureTreatmentPreOp, fractureTreatmentOp, fractureTreatmentPostOp]);
    let chemotherapy = await createProcess("Chemotherapy", [chemoPreOp, chemoOp, chemoPostOp]);
    let pediatricCheckup = await createProcess("Pediatric Checkup", [pedCheckupPreOp, pedCheckupOp, pedCheckupPostOp]);

    if (db) db.close();
    console.log('Preset Data Inserted into DB');

}

populate()
    .catch((err) => {
        console.log('ERROR: ' + err);
        if (db) db.close();
    });