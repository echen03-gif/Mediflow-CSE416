const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const cron = require('node-cron');





app.use(express.json());
app.use(express.static('../public'));
app.use(cookieParser());
app.use(
    cors({
        origin: ["https://mediflow-lnmh.onrender.com", "http://localhost"], 
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
);

const verifyToken = (req, res, next) => {
    // Get token from request headers
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

    console.log("token " + token)

    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "Access token is missing" });
    }

    // Verify token
    jwt.verify(token, "mediflow-jwt-secret-key", (err, decoded) => {
        if (err) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid access token" });
        }

        // If token is valid, save decoded data to request object for later use
        req.user = decoded;
        next();
    });
};

app.use((req, res, next) => {
    const skipPaths = ['/login', '/forgot-password'];
    const isResetRoute = req.path.startsWith('/reset/') && req.method === 'POST';
  
    if (skipPaths.includes(req.path) || isResetRoute) {
        next(); // Skip the middleware for the '/login' route
    } else {
        verifyToken(req, res, next); // Apply the middleware to other routes
    }
});

//PROFILE PIC STUFF

const storage = multer.diskStorage({
    destination: '../public/uploads/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000}, 
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('profilePic');

function checkFileType(file, cb){

    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

const port = 8000;
// The below URL is for npm start and local host
// Local Port: http://localhost:8000/

const uri = process.env.MEDIFLOWKEY;
let mongoose = require("mongoose");

mongoose.connect(uri);

let db = mongoose.connection;

// let server = app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

db.on("connected", function () {
    console.log("Mongo DB Atlas - Mediflow sucessfully connected");
});

// Define Mediflow Schemas/Collections

let Users = require("./models/users.js");
let Procedures = require("./models/procedure.js");
let Equipment = require("./models/equipment.js");
let EquipmentHeads = require("./models/equipmentHead.js");
let Rooms = require("./models/room.js");
let Communication = require("./models/communication.js");
let Processes = require("./models/processes.js");
let Appointment = require("./models/appointment.js");
let Messages = require("./models/messages.js");
const equipment = require("./models/equipment.js");
const equipmentHead = require("./models/equipmentHead.js");

// Define Backend Functions

//Forgot password stuff

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "mediflow416@gmail.com",
      pass: "dvelemvixcjbdilq"
    }
  });

// Socket io Stuff

const socketServer = createServer(app);
const io = new Server(socketServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

socketServer.listen(port, () => {
    console.log("socket server running at port: " + port);
});

const chatRooms = new Map();
const userSocketMap = new Map();

io.on("connection", (socket) => {
    console.log("user " + socket.id + " connected");

    socket.on("userConnected", (userId) => {
        let x = userSocketMap.get(userId);
    
        if (!x) {
            console.log("Saving socket from user: " + userId + " as " + socket.id);
            userSocketMap.set(userId, socket.id);
        }
    });

    socket.on("disconnect", () => {
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

    socket.on('joinRoom', (roomId) => {
        console.log(`Client wants to join room: ${roomId}`);
        socket.join(roomId);
      });

    socket.on('leaveRoom', (roomId) => {
        console.log(`Client wants to leave room: ${roomId}`);
        socket.leave(roomId);
      });



    socket.on("sendMessage", async ({ roomID, text, sender, senderId }) => {
        const message = new Messages({
            roomID: roomID,
            text: text,
            sender: sender,
            senderID: senderId,
            timestamp: new Date(),
        });

        await message.save();

        const numSocketsInRoom = io.sockets.adapter.rooms.get(roomID)?.size || 0;
        if(numSocketsInRoom === 2){
            io.in(roomID).emit("receiveMessage", message);
        } else {
            //This means tthat the other user is not in the chat room and should be sent a notification
            //we gotta find the other socket first
            const userIds = roomID.split("-");
            const currentUserID = senderId;
            const otherUserID = userIds.find(id => id !== currentUserID);
            const otherSocketID = userSocketMap.get(otherUserID);
            const otherSocket = io.sockets.sockets.get(otherSocketID);

            console.log(sender)
            console.log(text)
            if(otherSocket){
                otherSocket.emit('notification', {sender: sender, text: text, roomID: roomID});
            }
            
            io.in(roomID).emit("receiveMessage", message);
        }
        
        console.log(`Message sent in room ${roomID}: ${text}`);
    });
});

const roundToNearestMinute = (date) => {
    return new Date(Math.floor(date.getTime() / 60000) * 60000);
};

const addHours = (date, hours) => {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
};

cron.schedule('* * * * *', async () => {
    console.log(`[Cron Job] Running job at ${new Date().toLocaleString()}`);

    const now = new Date();
    console.log(now)
    console.log(new Date(now.getTime() + 10 * 60 * 1000 + 60000))

    try {
        const upcomingAppointments = await Appointment.find({
            'procedures.scheduledStartTime': {
                $gte: now,
                $lte: new Date(now.getTime() + 10 * 60 * 1000 + 60000), // Check up to 10 minutes + 1 minute buffer to ensure we cover the range
            },
            status: 'pending' // Only notify for pending appointments
        }).populate('procedures.staff');

        console.log(`[Cron Job] Found ${upcomingAppointments.length} upcoming appointments`);

        for (const appointment of upcomingAppointments) {


            const relevantProcedures = appointment.procedures.filter(procedure => {
                const startTime = new Date(procedure.scheduledStartTime).getTime();
                return startTime >= now.getTime() && startTime <= new Date(now.getTime() + 10 * 60 * 1000 + 60000).getTime();
            });

            for (const procedure of relevantProcedures) {

                if (!procedure.notificationsSent) {
                    procedure.notificationsSent = [];
                }


                //const startTime = addHours(new Date(procedure.scheduledStartTime), 4).getTime();
                const startTime = new Date(procedure.scheduledStartTime).getTime()

                // Calculate the difference in minutes
                const diffInMinutes = Math.round((startTime - now.getTime()) / (60 * 1000));                    console.log(diffInMinutes)
                console.log(diffInMinutes)


                let updated = false;

                for (const staff of procedure.staff) {
                    const userSocketId = userSocketMap.get(staff._id.toString());

                    if (diffInMinutes === 10 && !procedure.notificationsSent.includes('10-min')) {
                        // Send 10-minute notification
                        const message = `Reminder: You have a procedure scheduled in 10 minutes: ${procedure.name}.`;
                        if (userSocketId) {
                            io.to(userSocketId).emit('apptnotification', message);
                            console.log(`[Cron Job] Sent 10-minute reminder to user ${staff._id}`);
                        }
                        procedure.notificationsSent.push('10-min');
                        updated = true;
                    }

                    if (diffInMinutes === 5 && !procedure.notificationsSent.includes('5-min')) {
                        // Send 5-minute notification
                        const message = `Reminder: You have a procedure scheduled in 5 minutes: ${procedure.name}.`;
                        if (userSocketId) {
                            io.to(userSocketId).emit('apptnotification', message);
                            console.log(`[Cron Job] Sent 5-minute reminder to user ${staff._id}`);
                        }
                        procedure.notificationsSent.push('5-min');
                        updated = true;
                    }

                    if (diffInMinutes === 0 && !procedure.notificationsSent.includes('start')) {
                        // Send start notification
                        const message = `Your procedure is scheduled to start now: ${procedure.name}.`;
                        if (userSocketId) {
                            io.to(userSocketId).emit('apptnotification', message);
                            console.log(`[Cron Job] Sent start reminder to user ${staff._id}`);
                        }
                        procedure.notificationsSent.push('start');
                        updated = true;
                    }
                }

                if (updated) {
                    console.log('updated')
                    await Appointment.updateOne(
                        { 'procedures._id': procedure._id },
                        { $set: { 'procedures.$.notificationsSent': procedure.notificationsSent } }
                    ); // Save only once after all notifications are sent
                }
            }
        }
    } catch (error) {
        console.log('[Cron Job] Error checking for upcoming appointments:', error);
    }
});

// GET FUNCTIONS

app.get("/users", async (req, res) => {
    let users = await Users.find();

    res.send(users);
});

app.get("/userID/:userId", async (req, res) => {
    
    const { userId } = req.params;

    let user = await Users.findOne({ _id: userId });

    res.send(user);
});

app.get("/appointments/:userId", async (req, res) => {
    
    const { userId } = req.params;

    const appointmentDetails = [];
    const user = await Users.findOne({ _id: userId });
    const appointments = user.appointments;
    for(const appointmentId of appointments){
        const appointment = await Appointment.findOne({_id: appointmentID});

        const processName = await Processes.findOne({ _id: appointment.process });
        const patientName = await Users.findOne({_id: appointment.patient });

        appointmentDetails.push({processName, patientName});
    }

    res.send(user);
});

app.get("/user/:email", async (req, res) => {
    const { email } = req.params;

    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get("/procedures", async (req, res) => {
    let procedures = await Procedures.find();

    res.send(procedures);
});

app.get("/messages/:roomID", async (req, res) => {
    const roomID = req.params.roomID;
    let messages = await Messages.find({ roomID: roomID });
    res.send(messages);
});
app.get("/equipment", async (req, res) => {
    let equipment = await Equipment.find();

    res.send(equipment);
});

app.get("/equipmentHead", async (req, res) => {
    let equipmentHead = await EquipmentHeads.find();

    res.send(equipmentHead);
});

app.get("/rooms", async (req, res) => {
    let rooms = await Rooms.find();

    res.send(rooms);
});

app.get("/communication", async (req, res) => {
    let communication = await Communication.find();

    res.send(communication);
});

app.get("/processes", async (req, res) => {
    let processes = await Processes.find();

    res.send(processes);
});

app.get("/appointments", async (req, res) => {
    let appointments = await Appointment.find();

    res.send(appointments);
});


app.get('/profileappt', async (req, res) => {
    try {
        let appointments = await Appointment.find()
            .populate({
                path: 'procedures.procedure', // Ensure this path matches the schema path
                model: 'Procedure'
            });
        res.send(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving appointments.");
    }
});

app.get("/appointments/pending", async (req, res) => {
    try {
        let pendingAppointments = await Appointment.find({ status: "pending" });
        res.send(pendingAppointments);
    } catch (error) {
        res
            .status(500)
            .send({
                message: "Error fetching pending appointments",
                error: error.message,
            });
    }
});

app.get("/check-session", (req, res) => {
    console.log(req.session);
    if (req.session.user) {
        res.send({ loggedIn: true });
    } else {
        res.send({ loggedIn: false });
    }
});

app.get('/processes/user/:userId', async (req, res) => {
    console.log("here")
    const { userId } = req.params;

    try {
        const user = await Users.findOne({_id: userId}).populate('processes');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.processes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/procedures/user/:userId', async (req, res) => {

    try {
        const user = await Users.findOne({_id:req.params.userId}).populate({
            path: 'processes',
            populate: { path: 'components' }  
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const procedures = user.processes.map(process => process.components).flat();
        res.json(procedures);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



app.post('/profile-upload/:userId', async (req, res) => {
    upload(req, res, async (error) => {
        if (error) {
            console.log("Error 1 " + error)
            return res.status(500).json({ message: error });
        }
        if (!req.file) {
            console.log("Error 2 " + error)

            return res.status(400).json({ message: 'Please upload a file!' });
        }

        try {
            const { userId } = req.params;

            const user = await Users.findByIdAndUpdate(userId, { profilePic: req.file.path }, { new: true });
            res.status(200).json({ message: 'Profile picture updated successfully!', imagePath: user.profilePic });
        } catch (err) {
            console.log("Error 3 " + err)

            res.status(500).json({ message: "Error uploading!" });
        }
    });
});


app.post("/decode", async (req, res) => {
    const cookieHeader = req.body.cookies;
    console.log("Hopefully there are cookies");
    console.log(req.body.cookies);

    res.send(cookieHeader);
});

// POST FUNCTIONS

app.post("/createUser", async (req, res) => {
    const { admin, name, email, password, role, schedule } = req.body;

    // Extract schedule data for each day
    const processedSchedule = {};
    for (const day in schedule) {
        processedSchedule[day] = schedule[day].map(({ start, end }) => ({
            start,
            end,
        }));
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
        schedule: processedSchedule, 
        resetPasswordToken: "",
        resetPasswordExpire: new Date()

    });

    res.send(await newUser.save());
});

app.post("/createProcedure", async (req, res) => {
    // need a way to decide procedure ids?

    const newProcedure = new Procedures({
        created: new Date(),
        description: req.body.description,
        estimatedDuration: req.body.timeDuration,
        name: req.body.name,
        procedureID: 0,
        requiredRoomType: req.body.requiredRoomType,
        staffType: req.body.staffType,
    
    });

    res.send(await newProcedure.save());
});

app.post("/createEquipmentHead", async (req, res) => {
    const newEquipmentHead = new EquipmentHeads({
        name: req.body.name,
        quantity: 0,
        equipment: [],
        type: req.body.type,
    });

    res.send(await newEquipmentHead.save());
});

app.post("/createEquipment", async (req, res) => {
    const newEquipment = new Equipment({
        created: new Date(),
        location: req.body.location,
        name: req.body.name,
        status: "Functional",
        type: req.body.type,
        updatedAt: new Date(),
    });

    res.send(await newEquipment.save());
});

app.post("/createRoom", async (req, res) => {
    const newRoom = new Rooms({
        created: new Date(),
        equipment: [],
        name: req.body.name,
        status: req.body.status,
        type: req.body.type,
        updatedAt: new Date(),
        roomID: req.body.roomID,
    });

    res.send(await newRoom.save());
});

app.post("/createProcess", async (req, res) => {
    const newProcess = new Processes({
        name: req.body.name,
        components: req.body.components,
        created: new Date(),
    });

    res.send(await newProcess.save());
});

app.post("/login", async (req, res) => {
    console.log("Trying to login...");
    const { username, password } = req.body;
    const user = await Users.findOne({ email: username });
    if (user && bcrypt.compareSync(password, user.password)) {
        console.log("Logged in");
        const token = jwt.sign(
            { id: user._id, admin: user.role },
            "mediflow-jwt-secret-key",
            { expiresIn: "3h" }
        );

    
        res.send({ success: true, user: user._id, name: user.name, token: token, profilePic: user.profilePic });
    } else {
        console.log("Failed to Login");
        res.send({
            success: false,
            message: "Invalid Input: Incorrect Email/Password!",
        });
    }
});

app.post("/requestAppointment", async (req, res) => {
    const newAppointment = new Appointment({
        created: new Date(),
        patient: req.body.patient,
        procedures: req.body.procedures,
        process: req.body.process,
        status: 'pending'
    });

    res.send(await newAppointment.save());
});

app.post('/forgot-password', async (req, res) => {

    const { email } = req.body;    

    try {
      const user = await Users.findOne({ email });
      if (!user) {
        return res.status(404).send('User not found');
      }
      const token = crypto.randomBytes(20).toString('hex');

      user.resetPasswordToken = token;

      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      
      await user.save();
  
      const mailOptions = {
        from: 'mediflow416@gmail.com',
        to: user.email,
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
        Please click on the following link, or paste this into your browser to complete the process:
        https://mediflow-lnmh.onrender.com/reset/${token}`
      };
      

      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          console.log('There was an error: ', err);
        } else {
          res.status(200).json('Recovery email sent');
        }
      });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

app.post('/reset/:token', async (req, res) => {
    try {

        console.log(req.params.token)
        const user = await Users.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });
    
        if (!user) {
            return res.status(400).send('Password reset token is invalid or has expired.');
        }
    
        const saltRounds = 10;
        const hashedPass = bcrypt.hashSync(req.body.password, saltRounds);
        user.password = hashedPass
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
    
        await user.save();
        res.status(200).send('Password has been updated');
        } catch (err) {
            res.status(500).send('Server error');
        }
  });

// PUT FUNCTIONS

app.put('/updateAppointmentStatus', async (req, res) => {
    const { appointmentId, newStatus } = req.body;

    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(appointmentId, {
            status: newStatus
        }, { new: true }); // Return the updated document

        if (!updatedAppointment) {
            return res.status(404).send('Appointment not found.');
        }

        res.send(updatedAppointment);
    } catch (error) {
        res.status(400).send(error);
    }
});


app.put("/changeEquipmentHead", async (req, res) => {
    let equipmentHeadUpdate = await equipmentHead.findOne({
        name: req.body.name,
    });

    equipmentHeadUpdate.quantity += 1;

    equipmentHeadUpdate.equipment.push(req.body.equipment);

    await equipmentHeadUpdate.save();

    res.send("Equipemnt Head Updated");
});

app.put("/changeStaffAppointment", async (req, res) => {
    let staffUpdate = await Users.findOne({ _id: req.body.staffName._id });

    staffUpdate.appointments.push(req.body.appointment);

    await staffUpdate.save();

    res.send("Users's Appointment Updated");
});

app.put("/changeRoomAppointment", async (req, res) => {

    console.log(req.body.roomObject);
    
    let roomUpdate = await Rooms.findOne({ _id: req.body.roomObject._id });

    roomUpdate.appointments.push(req.body.appointment);

    await roomUpdate.save();

    res.send("Users's Appointment Updated");
});

app.put("/changeEquipmentAppointment", async (req, res) => {
    let equipmentUpdate = await Equipment.findOne({
        _id: req.body.equipment._id,
    });

    equipmentUpdate.appointments.push(req.body.appointment);

    await equipmentUpdate.save();

    res.send("Equipment Updated");
});

module.exports = { app, socketServer };
