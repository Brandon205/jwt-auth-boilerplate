require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const expressJWT = require('express-jwt');

const app = express();
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

mongoose.connect('mongodb://localhost/jwt', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.once('open', () => console.log(`Connected to MongoDB on ${db.host} at ${db.port}`));
db.on('error', (err) => console.log(`Database error: ${err}`));

app.use('/auth', require('./routes/auth'));

app.listen(process.env.PORT || 3001)