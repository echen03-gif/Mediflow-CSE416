/*

    Must be manually run with node init.js

    HardCoded Data -> Admins, Procedures, Processes


*/

const bcrypt = require('bcrypt');
const faker = require('faker');

const departments = ["Cardiology", "Radiology", "Oncology", "Neurology", "Pediatrics", "Emergency"];
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

function createProcedure(description, estimatedDuration, name, requiredEquipment, requiredRoomType, locationRoom, staffType, numStaff) {

    let createProcedure = {

        created: new Date(),
        description: description,
        estimatedDuration: estimatedDuration,
        name: name,
        requiredEquipment: requiredEquipment,
        requiredRoomType: requiredRoomType,
        location: locationRoom,
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

    // for (let i = 0; i < 10; i++) {
    //     let department = departments[Math.floor(Math.random() * departments.length)];
    //     let name = faker.name.findName();
    //     let email = faker.internet.email(); 
    //     let age = faker.datatype.number({ min: 25, max: 60 }); 
    //     let gender = faker.random.arrayElement(["Male", "Female"]); 

    //     await createUser(false, email, name, age, gender, hashedPass, department, staffID, getRandomSchedule());
    // }

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

    let heartLungMachineOne = await createEquipment("Heart-Lung Machine One", storageRoom, "Cardiology");
    let heartLungMachineHead = await createEquipmentHead("Heart Lung Machine", 1, "Cardiology", heartLungMachineOne);

    let ctMachineOne = await createEquipment("CT Machine One", storageRoom, "Radiology");
    let testEquipmentCT = await createEquipmentHead("CT Machine", 1, "Radiology", ctMachineOne);

    // PROCEDURES

    let heartSurgeryPreOp = await createProcedure("Patient needs to complete chest x-ray, blood tests, and fasting diet requirements.", 30, "Heart Surgery PreOP", 0, [], null, null, "Nurse", 2);
    let heartSurgeryOp = await createProcedure("Patient needs to undergo anesthesia in which the performing doctor will execute the surgery", 60, "Heart Surgery OP", 1, ['Heart Lung Machine'], "Cardiology", heartRoom, "Cardiology", 1);
    let heartSurgeryPostOp = await createProcedure("Patient needs to rest and be monitored", 60, "Heart Surgery PostOP", 2, ['CT Machine'], "ICU", icu, "Radiology", 1);

    // PROCESSES

    let heartSurgery = await createProcess("Heart Surgery", [heartSurgeryPreOp, heartSurgeryOp, heartSurgeryPostOp]);

    if (db) db.close();
    console.log('Preset Data Inserted into DB');

}

populate()
    .catch((err) => {
        console.log('ERROR: ' + err);
        if (db) db.close();
    });
