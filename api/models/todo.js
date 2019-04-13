const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, require: true },
  description: { type: String, require: true },
  done: { type: Boolean, require: true, default: false },
  createdAt: { type: Date, rquired: false, default: Date.now }
});

module.exports = mongoose.model('Todo', todoSchema);
