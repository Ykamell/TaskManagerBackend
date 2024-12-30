const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose); 

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: Boolean, default: false},
  description: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  id: { type: Number, unique: true }, 
});

TaskSchema.plugin(AutoIncrement, { inc_field: 'id' });

module.exports = mongoose.model('Task', TaskSchema);
