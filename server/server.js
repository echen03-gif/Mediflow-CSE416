const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { createServer } = require('node:http');
const { Server } = require('socket.io');


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['https://mediflow-lnmh.onrender.com', "http://localhost:3000"], // Matches all subdomains of onrender.com
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

const verifyToken = (req, res, next) => {
    // Get token from request headers
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access token is missing' });
    }
  
    // Verify token
    jwt.verify(token, 'mediflow-jwt-secret-key', (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, message: 'Invalid access token' });
      }
      
      // If token is valid, save decoded data to request object for later use
      req.user = decoded;
      next();
    });
  };


app.use((req, res, next) => {
    if (req.path === '/login') {
        next(); // Skip the middleware for the '/login' route
    } else {
        verifyToken(req, res, next); // Apply the middleware to other routes
    }
});



const port = 8000;
// The below URL is for npm start and local host
// Local Port: http://localhost:8000/

const uri = process.env.MEDIFLOWKEY;
let mongoose = require('mongoose');

mongoose.connect(uri);

let db = mongoose.connection;

// let server = app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

db.on('connected', function () {

    console.log("Mongo DB Atlas - Mediflow sucessfully connected");

})

// Define Mediflow Schemas/Collections

let Users = require('./models/users.js');
let Procedures = require('./models/procedure.js');
let Equipment = require('./models/equipment.js');
let EquipmentHeads = require('./models/equipmentHead.js')
let Rooms = require('./models/room.js');
let Communication = require('./models/communication.js');
let Processes = require('./models/processes.js');
let Appointment = require('./models/appointment.js');
const equipment = require('./models/equipment.js');
const equipmentHead = require('./models/equipmentHead.js');

// Define Backend Functions

// Socket io Stuff

const socketServer = createServer(app);
const io = new Server(socketServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
    },
})

socketServer.listen(port, () => {

    console.log('socket server running at port: ' + port);

});

const chatRooms = new Map()
const userSocketMap = new Map();


io.on('connection', (socket) => {

    console.log('user ' + socket.id + ' connected');

    socket.on('userConnected', (userId) => {
        let x = userSocketMap.get(userId)

        if(!x) {
            console.log("Saving socket from user: " + userId+ " as " + socket.id)
            userSocketMap.set(userId, socket.id);
        }
    });

    socket.on('disconnect', () => {

        let userIdToDelete = null;
        for (let [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userIdToDelete = userId;
                break; // Stop searching once we find the user
            }
        }
        if (userIdToDelete !== null) {
            userSocketMap.delete(userIdToDelete);
            console.log(`User ${userIdToDelete} disconnected and removed from map`);
        } else {
            console.log(`No user found for socket ${socket.id} on disconnect`);
        }
    });

    socket.on("chatStart", (recipientUserId) => {
    
        let senderUserId = null;
        //iterate over the map to find the userId for the current socket.id
        for (let [key, value] of userSocketMap.entries()) {
            if (value === socket.id) {
                senderUserId = key;
                break;
            }
        }
        const roomKey = [senderUserId, recipientUserId].sort().join('-'); 
    
        if (userSocketMap.has(recipientUserId)) {
            const recipientSocketId = userSocketMap.get(recipientUserId);
    
            if (!chatRooms.has(roomKey)) {
                chatRooms.set(roomKey, new Set([senderUserId, recipientUserId]));
                console.log(`Created a new room for users: ${roomKey}`);
            } else {
                console.log(`Room already exists for users: ${roomKey}, reusing it.`);
            }
    
            socket.join(roomKey);
            io.to(recipientSocketId).socketsJoin(roomKey);
    
            socket.emit('chatReady', { roomID: roomKey, initiatedByMe: true, message: `You started a chat with ${recipientUserId}` });
            io.to(recipientSocketId).emit('chatReady', { roomID: roomKey, initiatedByMe: false, message: `Chat started by ${senderUserId}` });
    
            console.log(`Both users ${senderUserId} and ${recipientUserId} have joined room: ${roomKey}`);
        } else {
            console.log(`User ${recipientUserId} is not currently connected.`);
            socket.emit('userOffline', { recipientUserId });
        }
    });

    socket.on('sendMessage', ({ roomID, text, sender }) => {
       
        const message = {
            id: 0, 
            text: text,
            sender: sender,
            timestamp: new Date() 
        };

        io.in(roomID).emit('receiveMessage', message);
        console.log(`Message sent in room ${roomID}: ${text}`);
    });

})


// GET FUNCTIONS

app.get('/users', async (req, res) => {

    let users = await Users.find();

    res.send(users);

});

app.get('/userID/:userId', async (req, res) => {

    const { userId } = req.params;

    let user = await Users.findOne({ _id: userId });

    res.send(user);
})

app.get('/user/:email', async (req, res) => {

    const { email } = req.params;

    try {
      const user = await Users.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

app.get('/procedures', async (req, res) => {

    let procedures = await Procedures.find();

    res.send(procedures);

});

app.get('/equipment', async (req, res) => {

    let equipment = await Equipment.find();

    res.send(equipment);

});


app.get('/equipmentHead', async (req, res) => {

    let equipmentHead = await EquipmentHeads.find();

    res.send(equipmentHead);

});

app.get('/rooms', async (req, res) => {

    let rooms = await Rooms.find();

    res.send(rooms);

});

app.get('/communication', async (req, res) => {

    let communication = await Communication.find();

    res.send(communication);

});

app.get('/processes', async (req, res) => {

    let processes = await Processes.find();

    res.send(processes);

});

app.get('/appointments', async (req, res) => {

    let appointments = await Appointment.find();

    res.send(appointments);

});


app.get('/check-session', (req, res) => {
    if (req.session.userId) {
        res.send({ loggedIn: true });
    } else {
        res.send({ loggedIn: false });
    }
});



app.post('/decode', async (req, res)=>{

    const cookieHeader = req.body.cookies;
    console.log("Hopefully there are cookies")
    console.log(req.body.cookies);

    // if (!cookieHeader) {
    //     return res.status(400).send('No cookies found in the request.');
    //   }

    //   const cookies = cookieHeader.split('; ');
    //   const jwtCookie = cookies.find(cookie => cookie.startsWith('user='));

    //   if (!jwtCookie) {
    //     return res.status(400).send('JWT cookie not found.');
    //   }

    //   const jwtToken = jwtCookie.split('=')[1];

    //   // Decode the JWT token
    //   const decodedToken = jwtDecode(jwtToken);
    //   console.log('Decoded Token:', decodedToken);

    res.send(cookieHeader);

});

// POST FUNCTIONS


app.post('/createUser', async (req, res) => {
    const { admin, name, email, password, role, schedule } = req.body;

    // Extract schedule data for each day
    const processedSchedule = {};
    for (const day in schedule) {
        processedSchedule[day] = schedule[day].map(({ start, end }) => ({ start, end }));
    }

    const newUser = new Users({
        admin,
        name,
        email,
        joined: new Date(),
        password,
        processes: [],
        role,
        staffID: req.body.staffID,
        schedule: processedSchedule, // Use the processed schedule data
    });

    res.send(await newUser.save());
});

app.post('/createProcedure', async (req, res) => {

    // need a way to decide procedure ids?

    const newProcedure = new Procedures({

        created: new Date(),
        description: req.body.description,
        estimatedDuration: req.body.timeDuration,
        name: req.body.name,
        procedureID: 0,
        requiredRoomType: req.body.requiredRoomType,
        staffType: req.body.staffType

    })

    res.send(await newProcedure.save());

});

app.post('/createEquipmentHead', async (req, res) => {

    const newEquipmentHead = new EquipmentHeads({

        name: req.body.name,
        quantity: 0,
        equipment: [],
        type: req.body.type

    })

    res.send(await newEquipmentHead.save());

});

app.post('/createEquipment', async (req, res) => {

    const newEquipment = new Equipment({
        
        created: new Date(),
        location: req.body.location,
        name: req.body.name,
        status: "Functional",
        type: req.body.type,
        updatedAt: new Date()
    })

    res.send(await newEquipment.save());

});

app.post('/createRoom', async (req, res) => {

    const newRoom = new Rooms({
        
        created: new Date(),
        equipment: [],
        name: req.body.name,
        status: req.body.status,
        type: req.body.type,
        updatedAt: new Date(),
        roomID: req.body.roomID
    })

    res.send(await newRoom.save());

});

app.post('/createProcess', async (req, res) => {

    const newProcess = new Processes({

        name: req.body.name,
        components: req.body.components,
        created: new Date()
        
    })

    res.send(await newProcess.save());

});

app.post('/login', async (req, res) => {
    console.log("Trying to login...");
    const { username, password } = req.body;
    const user = await Users.findOne({ email: username });
    if (user && bcrypt.compareSync(password, user.password)) {
        console.log('Logged in');
        const token = jwt.sign({ id: user._id, admin: user.role }, 'mediflow-jwt-secret-key', { expiresIn: '3h' });

        // res.cookie('token', token, {
        //     path: "/",
        //     //sameSite: 'None',
        //     secure: false,
        //     //domain: ".onrender.com",
        //     httpOnly: true
        // });

        res.send({ success: true, user: user._id, name: user.name, token: token });
    } else {
        console.log("Failed to Login");
        res.send({ success: false, message: 'Invalid Input: Incorrect Email/Password!' });
    }
});

// app.post('/logout', async (req, res) => {
//     console.log("logging out")
//     res.clearCookie('token', {
//         path: "/",
//         //domain: ".onrender.com",
//         //sameSite: 'None',
//         //secure: true
//     }).sendStatus(200);
// });


app.post('/createAppointment' , async (req, res) => {

    const newAppointment = new Appointment({

        created: new Date(),
        patientName: req.body.name,
        procedures: req.body.procedures,
        scheduledStartTime: req.body.start,
        scheduledEndTime: req.body.end,
        process: req.body.process,
        location: req.body.room
    })

    res.send(await newAppointment.save());


});


// PUT FUNCTIONS

app.put('/changeEquipmentHead', async (req, res) => {

    let equipmentHeadUpdate = await equipmentHead.findOne({name: req.body.name});

    equipmentHeadUpdate.quantity += 1;

    equipmentHeadUpdate.equipment.push(req.body.equipment);

    await equipmentHeadUpdate.save();

    res.send("Equipemnt Head Updated");


});

app.put('/changeStaffAppointment', async (req,res) =>{


    let staffUpdate = await Users.findOne({_id: req.body.staffName._id});

    staffUpdate.appointments.push(req.body.appointment);

    await staffUpdate.save();

    res.send("Users's Appointment Updated");
});

app.put('/changeRoomAppointment', async (req,res) =>{


    let roomUpdate = await Rooms.findOne({_id: req.body.roomName._id});

    roomUpdate.appointments.push(req.body.appointment);

    await roomUpdate.save();

    res.send("Users's Appointment Updated");
});

app.put('/changeEquipmentAppointment', async (req, res) => {

    let equipmentUpdate = await Equipment.findOne({_id: req.body.equipment._id});

    equipmentUpdate.appointments.push(req.body.appointment);

    await equipmentUpdate.save();

    res.send("Equipment Updated");

});

module.exports = {app, socketServer};