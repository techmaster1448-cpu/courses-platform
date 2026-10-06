const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'الطالب مطلوب']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'الدورة مطلوبة']
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['مسجل', 'قيد الدراسة', 'اكتمل', 'ملغي'],
    default: 'مسجل'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completionDate: {
    type: Date,
    default: null
  },
  grade: {
    type: Number,
    default: null,
    min: 0,
    max: 100
  },
  certificate: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    maxlength: [1000, 'الملاحظات يجب أن لا تتجاوز 1000 حرف']
  }
});

// فهرس مركب لمنع التسجيل المتكرر
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
