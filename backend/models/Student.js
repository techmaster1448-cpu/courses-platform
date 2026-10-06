const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'الاسم الأول مطلوب'],
    trim: true,
    maxlength: [100, 'الاسم الأول يجب أن لا يتجاوز 100 حرف']
  },
  lastName: {
    type: String,
    required: [true, 'الاسم الأخير مطلوب'],
    trim: true,
    maxlength: [100, 'الاسم الأخير يجب أن لا يتجاوز 100 حرف']
  },
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'البريد الإلكتروني غير صحيح'
    ]
  },
  password: {
    type: String,
    required: [true, 'كلمة المرور مطلوبة'],
    minlength: [6, 'كلمة المرور يجب أن تكون على الأقل 6 أحرف'],
    select: false
  },
  phone: {
    type: String,
    default: null
  },
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: null
  }
});

// تشفير كلمة المرور قبل الحفظ
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

// دالة للتحقق من كلمة المرور
studentSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);
