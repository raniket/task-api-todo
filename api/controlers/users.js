const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.find({ email })
    .exec()
    .then(user => {
      if (user.length < 1) return res.status(401).json({ message: 'Auth faild' });
      bcrypt.compare(password, user[0].password, (error, result) => {
        if (error) return res.status(401).json({ message: 'Auth failed' });
        if (result) {
          const token = jwt.sign({
            email: user[0].email,
            id: user[0]._id
          },
            process.env.JWT_SECRET,
            {
              expiresIn: "2 days"
            });
          return res.status(200).json({
            firstName: user[0].firstName,
            lastName: user[0].lastName,
            token: token
          });
        }
        res.status(401).json({ message: 'Auth failed' });
      })
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: error });
    });
};

exports.signup = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  User.find({ email: email }).exec()
    .then(user => {
      if (user.length >= 1) {
        res.status(409).json({ message: 'User already exists with this email id' });
      } else {
        bcrypt.hash(password, 10, (error, hash) => {
          if (error) {
            console.log(error);
            res.status(500).json({ error: error })
          } else {
            const user = new User({
              _id: mongoose.Types.ObjectId(),
              firstName: firstName,
              lastName: lastName,
              email: email,
              password: hash
            });
            user.save()
              .then(result => {
                console.log(result)
                res.status(201).json({ message: 'User created' });
              })
              .catch(error => {
                console.log(error);
                res.status(500).json({ error: error });
              });
          }
        });
      }
    });
};

exports.getUser = (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
    .exec()
    .then(user => {
      res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      })
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: error });
    });
};

exports.getAllUsers = (req, res, next) => {
  User.find()
    .select('_id firstName lastName email')
    .exec()
    .then(users => {
      const response = {
        count: users.length,
        users: users.map(user => {
          return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            request: {
              type: 'GET',
              description: 'get user by id',
              url: `${process.env.BASE_URL}/user/${user._id}`
            }
          }
        })
      };
      res.status(200).json(response);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: error });
    });
};

exports.deleteUser = (req, res, next) => {
  const userId = req.params.userId;
  User.remove({ _id: userId })
    .exec()
    .then(response => {
      res.status(200).json({
        message: 'user deleted',
        request: {
          type: 'POST',
          description: 'create user',
          url: `${process.env.BASE_URL}/user`,
          body: {
            firstName: 'String',
            lastName: 'String',
            email: 'String',
            password: 'String'
          }
        }
      })
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: error });
    });
};