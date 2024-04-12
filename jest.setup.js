if (typeof TextEncoder === "undefined") {
  const { TextEncoder, TextDecoder } = require("util");
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

jest.setTimeout(10000);

const mongoose = require('mongoose');

const uri = process.env.MEDIFLOWKEY;

async function connectDB() {
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return mongoose;
}

beforeAll(async () => {
  await connectDB();

});

afterAll(async () => {

  mongoose.connection.close().then(() => done());
 
});
