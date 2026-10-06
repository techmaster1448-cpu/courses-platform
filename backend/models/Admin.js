const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'الاسم الأول مطلوب'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'الاسم الأخير مطلوب'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'كلمة المرور مطلوبة'],
    minlength: [6, 'كلمة المرور يجب أن تكون على الأقل 6 أحرف'],
    select: false
  },
  role: {
    type: String,
    enum: ['مسؤول عام', 'مسؤول دورات', 'مسؤول طلاب'],
    default: 'مسؤول دورات'
  },
  permissions: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: null
  }
});

// تشفير كلمة المرور قبل الحفظ
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

// دالة للتحقق من كلمة المرور
adminSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
