const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
const faceDetect = require('./controllers/faceDetect.js');
const getUser = require('./controllers/getUser.js');
const images = require('./controllers/images.js');


//declareDatabase
const dataBase = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  }
});
//end.




//clarifai
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", process.env.CLARIFAI_KEY)
//end.

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => { res.send('dataBase') });

app.post('/signin', signin.handleSignin(bcrypt, dataBase));

app.post('/faceDetect', (req, res) => { faceDetect.handleFaceDetect(req, res) });

app.post('/register', register.handleRegister(bcrypt, dataBase));



app.get('/profile/:id', getUser.getUser(dataBase))


app.put('/image', images.imagesCount(dataBase))







app.listen(process.env.PORT || 3000, () => {
  console.log(`app is active on ${process.env.PORT}`);
})