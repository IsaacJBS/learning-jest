const express = require('express');
const app = express();
const mongoose = require('mongoose');
const user = require('./models/User');
const bcrypt = require('bcrypt');
const { genSalt } = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = 'socorroalgumacoisa';

app.use(express.urlencoded({extended: false}));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/guiapics', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {

}).catch(err => {
  console.log(err);
})

const User = mongoose.model('User', user);

app.get('/', async (req, res) => {
  res.json({});
})

app.post('/user', async (req, res) => {
  const {name, email, password} = req.body;
  if(!name) {
    return res.sendStatus(400)
  }
  if(!email) {
    return res.sendStatus(400)
  }
  if(!password) {
    return res.sendStatus(400)
  }

  try {
    const user = await User.findOne({"email": email})
    if(user) {
      res.statusCode = 400
      res.json({error: 'Email já cadastrado'})
      return
    }

    const salt = await genSalt(10);
    const hash = await bcrypt.hash(password, salt)

    let newUser = new User({name, email, password: hash})
    await newUser.save();
    return res.json({email})
  } catch (error) {
    res.sendStatus(500)
  }
})

app.post('/auth', async (req, res) => {
  const {email, password} = req.body;

  const user = await User.findOne({'email': email});

  if(!user) {
    res.statusCode = 403;
    res.json({errors: {email: 'Email não cadastrado'}})
    return 
  }

  const isPassRight = await bcrypt.compare(password, user.password);

  if(!isPassRight) {
    res.statusCode = 403;
    res.json({errors: {password: 'Senha incorreta'}})
    return
  }

  jwt.sign({email, name: user.name, id: user._id}, secret, {expiresIn: '48h'}, (err, token) => {
    if(err) {
      res.sendStatus(500);
      console.log(err)
    } else {
      res.json({token})
    }
  })
})

app.delete('/user/:email', async (req, res) => {
  const {email} = req.params;
  await User.deleteOne({'email':email});
  res.sendStatus(200);
})


module.exports = app;