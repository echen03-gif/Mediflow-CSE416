/*

    Must be manually run with node init.js

    HardCoded Data -> Admins, Procedures, Processes


*/

const bcrypt = require('bcrypt');

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

function createUser(adminBool, email, name, password, role, staffID, status){

    testUser = {
        admin: adminBool,
        email: email,
        name: name,
        password: password,
        role: role,
        staffID: staffID,
        status: status
    }

    let addUser = new Users(testUser)

    return addUser.save();

}


// Populate

const populate = async () => {
    
    if (db) db.close();
    console.log('Preset Data Inserted into DB');

}

populate()
    .catch((err) => {
        console.log('ERROR: ' + err);
        if (db) db.close();
    });
