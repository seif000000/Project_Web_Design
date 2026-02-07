const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['user', 'admin'] // Ensures only 'user' or 'admin' can be assigned
  }
});

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;
