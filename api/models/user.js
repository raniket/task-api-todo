const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: { type: String, require: true },
  lastName: { type: String, require: true },
  email: {
    type: String,
    require: true,
    unique: true,
    match: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
  },
  password: { type: String, require: true },
});

module.exports = mongoose.model('User', userSchema);
