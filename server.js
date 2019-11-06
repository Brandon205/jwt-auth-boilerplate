require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const expressJWT = require('express-jwt');
const helmet = require('helmet');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.once('open', () => console.log(`Connected to MongoDB on ${db.host} at ${db.port}`));
db.on('error', (err) => console.log(`Database error: ${err}`));

app.use('/auth', require('./routes/auth'));
app.use('/locked', expressJWT({ secret: process.env.JWT_SECRET }).unless({ method: 'POST' }), require('./routes/locked'));

app.listen(process.env.PORT || 3001)