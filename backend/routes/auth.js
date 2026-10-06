const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const { generateToken, verifyToken } = require('../middleware/auth');

// تسجيل طالب جديد
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // التحقق من المدخلات
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        error: 'جميع الحقول مطلوبة (الاسم الأول، الاسم الأخير، البريد، كلمة المرور)'
      });
    }

    // التحقق من وجود الطالب
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ error: 'البريد الإلكتروني موجود بالفعل' });
    }

    // إنشاء طالب جديد
    const student = new Student({
      firstName,
      lastName,
      email,
      password,
      phone
    });

    await student.save();

    // إنشاء رمز JWT
    const token = generateToken(student._id, 'student');

    res.status(201).json({
      success: true,
      message: 'تم التسجيل بنجاح',
      token,
      student: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// تسجيل دخول الطالب
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // التحقق من المدخلات
    if (!email || !password) {
      return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' });
    }

    // البحث عن الطالب (مع اختيار كلمة المرور)
    let student = await Student.findOne({ email }).select('+password');
    let role = 'student';

    // إذا لم يتم العثور على الطالب، ابحث عن مسؤول
    if (!student) {
      student = await Admin.findOne({ email }).select('+password');
      role = 'admin';
    }

    if (!student) {
      return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }

    // التحقق من كلمة المرور
    const isPasswordCorrect = await student.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }

    // تحديث آخر تسجيل دخول
    student.lastLogin = new Date();
    await student.save();

    // إنشاء رمز JWT
    const token = generateToken(student._id, role);

    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// الحصول على بيانات المستخدم الحالي
router.get('/me', verifyToken, async (req, res) => {
  try {
    let user;

    if (req.user.role === 'admin') {
      user = await Admin.findById(req.user.id);
    } else {
      user = await Student.findById(req.user.id).populate('enrolledCourses');
    }

    if (!user) {
      return res.status(404).json({ error: 'المستخدم غير موجود' });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
