const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'اسم المجال مطلوب'],
    unique: true,
    trim: true,
    maxlength: [100, 'اسم المجال يجب أن لا يتجاوز 100 حرف']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'الوصف يجب أن لا يتجاوز 500 حرف']
  },
  icon: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Category', categorySchema);
