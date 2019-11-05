const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('/signup', (req, res) => {
  // See if email is already in the db
  User.findOne({ email: req.body.email }, (err, user) => {
    // if yes, return and error, no create the user in the db 
    if (user) {
      res.json({type: 'error', message: 'Email or password invalid'}) // Helpful for us but not good in production 
    } else {
      let user = new User(req.body);
      user.save( (err, newUser) => {
        if (err) {
          res.json({type: 'error', message: 'database error creating user', error: err}) 
        }
        // assign a token, return the token
        const token = jwt.sign(user.toObject(), process.env.JWT_SECRET, {
          expiresIn: '1d'
        });
        res.status(200).json({type: 'success', user: user.toObject(), token});
      });
    };
  });
});

router.post('/login', (req, res) => {
  // Find the user in the db, if no user return an error 
  User.findOne({email: req.body.email }, (err, user) => {
    if (!user) {
      res.json({type: 'error', message: 'Account not found'})
    } else {
      // if user is found then check auth
      if (user.authenticated(req.body.password)) {
        // if auth'd then sign a token and return the token 
        const token = jwt.sign(user.toObject(), process.env.JWT_SECRET, {
          expiresIn: '1d'
        });
        res.status(200).json({type: 'success', user: user.toObject(), token})
      } else {
        // Auth failed 
        res.json({type: 'error', message: 'Authentification Failiure'});
      };
    };
  });
});

router.post('/me/from/token', (req, res) => {
  // req need to have a token, 
  let token = req.body.token;
  if (!token) {
    res.json({type: 'error', message:'You must include a valid token'})
  } else {
    // if no then return err, if token verify
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      //if any error during verify then return an error 
      if (err) {
        res.json({type: 'error', message: 'Invalid token please log in again'})
      } else {
        //if token is valid look up user in db,
        User.findById(user._id, (err, user) => {
          //if no error return user 
          if (err) {
            res.json({type: 'error', message: 'Database error during validation'})
          } else {
            // if user, return user and token to the front 
            res.json({type: 'success', user: user.toObject(), token});
          };
        });
      };
    });
  };
});

module.exports = router;