const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'اسم الدورة مطلوب'],
    trim: true,
    maxlength: [200, 'اسم الدورة يجب أن لا يتجاوز 200 حرف']
  },
  description: {
    type: String,
    required: [true, 'وصف الدورة مطلوب'],
    maxlength: [2000, 'الوصف يجب أن لا يتجاوز 2000 حرف']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'مجال الدورة مطلوب']
  },
  instructor: {
    type: String,
    required: [true, 'اسم المدرب مطلوب'],
    trim: true
  },
  instructorEmail: {
    type: String,
    trim: true
  },
  instructorBio: {
    type: String,
    maxlength: [500, 'السيرة الذاتية يجب أن لا تتجاوز 500 حرف']
  },
  duration: {
    type: Number,
    required: [true, 'مدة الدورة مطلوبة'],
    min: [1, 'المدة يجب أن تكون على الأقل 1 ساعة']
  },
  price: {
    type: Number,
    required: [true, 'سعر الدورة مطلوب'],
    min: [0, 'السعر لا يمكن أن يكون سالب']
  },
  startDate: {
    type: Date,
    required: [true, 'تاريخ البدء مطلوب']
  },
  endDate: {
    type: Date,
    required: [true, 'تاريخ الانتهاء مطلوب']
  },
  capacity: {
    type: Number,
    required: [true, 'عدد المقاعد مطلوب'],
    min: [1, 'يجب أن يكون هناك مقعد واحد على الأقل']
  },
  enrolledCount: {
    type: Number,
    default: 0,
    min: 0
  },
  schedule: {
    days: [String],
    time: String,
    location: String
  },
  imageUrl: {
    type: String,
    default: null
  },
  level: {
    type: String,
    enum: ['مبتدئ', 'متوسط', 'متقدم'],
    default: 'مبتدئ'
  },
  requirements: [String],
  learningOutcomes: [String],
  materials: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// التحقق من أن تاريخ الانتهاء بعد تاريخ البدء
courseSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Course', courseSchema);
