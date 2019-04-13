const mongoose = require('mongoose');
const Todo = require('../models/todo');
const dotenv = require('dotenv').config();

exports.getAllTodos = (req, res, next) => {
  // console.log('get all items');
  // res.status(200).json({
  //   message: 'get all items'
  // });
  const userId =  req.userData.id;
  Todo.find({ createdBy: userId })
    .select('_id name description done createdBy createdAt')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        todos: docs.map(doc => {
          return {
            ...doc._doc,
            request: {
              type: 'GET',
              description: 'get todo by id',
              url: `${process.env.BASE_URL}/todo/${doc._id}`
            }
          }
        })
      }
      res.status(200).json(response);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: error });
    });
};

exports.createTodo = (req, res, next) => {

  const { name, description, done, createdBy } = req.body;

  const todo = new Todo({
    _id: mongoose.Types.ObjectId(),
    createdBy: createdBy,
    name: name,
    description: description,
    done: done,
    createdAt: new Date()
  });
  todo.save()
    .then(result => {
      console.log('result : ', result);
      res.status(201).json({
        _id: result._id,
        name: result.name,
        description: result.description,
        done: result.done,
        createdBy: result.createdBy,
        createdAt: result.createdAt,
        request: {
          type: 'GET',
          description: 'get todo by id',
          url: `${process.env.BASE_URL}/todo/${result._id}`
        }
      });
    })
    .catch(error => {
      console.log('error : ', error)
      res.status(500).json({ error: error });
    });
};

exports.getTodo = (req, res, next) => {
  // console.log('get item by id');
  // res.status(200).json({
  //   message: 'get item by id'
  // });

  const id = req.params.todoId;
  Todo.findById(id)
    .select('name description done createdBy createdAt')
    .exec()
    .then(doc => {
      console.log('from database : ', doc);
      if (doc) {
        if (doc._doc.createdBy == req.userData.id) {
          res.status(200).json({
            ...doc._doc,
            request: {
              type: 'GET',
              description: 'get list of all todos',
              url: `${process.env.BASE_URL}/todos`
            }
          });
        } else {
          res.status(401).json({ message: 'Auth failed' });
        }
      } else {
        res.status(404).json({
          error: {
            message: 'Not Found'
          }
        });
      }
    })
    .catch(error => {
      console.log('error in fatching data from database');
      res.status(500).json({
        error: error
      });
    })
};

exports.updateTodo = (req, res, next) => {
  // console.log('update item');
  // res.status(200).json({
  //   message: 'update item'
  // });

  const todoId = req.params.todoId;
  console.log('item body : ', req.body);
  const updateTodo = req.body;
  Todo.update({ _id: todoId }, { $set: updateTodo })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        ...updateTodo,
        request: {
          type: 'GET',
          description: 'get todo by id',
          url: `${process.env.BASE_URL}/todo/${todoId}`
        }
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: error });
    })
};

exports.deleteTodo = (req, res, next) => {
  // console.log('delete item');
  // res.status(200).json({
  //   message: 'delete item'
  // });

  const id = req.params.todoId;
  Todo.remove({ _id: id })
    .exec()
    .then(response => res.status(200).json({
      message: 'todo deleted',
      request: {
        type: 'POST',
        description: 'create todo',
        url: `${process.env.BASE_URL}/todo`,
        body: {
          name: 'String',
          description: 'String',
          done: 'Boolean',
          createdBy: 'ObjectId'
        }
      }
    }))
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: error });
    });
};