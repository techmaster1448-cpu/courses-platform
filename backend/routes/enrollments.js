const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Student = require('../models/Student');
const { verifyToken, isStudent } = require('../middleware/auth');

// الحصول على حجوزات الطالب
router.get('/student/:studentId', verifyToken, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.params.studentId })
      .populate('course', 'title instructor duration startDate endDate price')
      .populate('student', 'firstName lastName email');

    res.json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// الحصول على جميع الحجوزات لدورة معينة
router.get('/course/:courseId', verifyToken, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ course: req.params.courseId })
      .populate('student', 'firstName lastName email phone')
      .populate('course', 'title capacity');

    res.json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// الاشتراك في دورة
router.post('/', verifyToken, isStudent, async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user.id;

    // التحقق من وجود الدورة
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'الدورة غير موجودة' });
    }

    // التحقق من السعة
    if (course.enrolledCount >= course.capacity) {
      return res.status(400).json({ error: 'الدورة امتلأت' });
    }

    // التحقق من عدم الاشتراك المسبق
    const existingEnrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (existingEnrollment) {
      return res.status(400).json({ error: 'أنت مشترك بالفعل في هذه الدورة' });
    }

    // إنشاء الحجز
    const enrollment = new Enrollment({
      student: studentId,
      course: courseId
    });

    await enrollment.save();

    // تحديث عدد الطلاب المشتركين
    course.enrolledCount += 1;
    await course.save();

    // إضافة الدورة إلى قائمة الطالب
    await Student.findByIdAndUpdate(
      studentId,
      { $push: { enrolledCourses: courseId } }
    );

    res.status(201).json({
      success: true,
      message: 'تم الاشتراك بنجاح',
      data: enrollment
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// إلغاء الاشتراك
router.delete('/:enrollmentId', verifyToken, isStudent, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ error: 'الحجز غير موجود' });
    }

    // التحقق من أن الطالب هو صاحب الحجز
    if (enrollment.student.toString() !== req.user.id) {
      return res.status(403).json({ error: 'لا يمكنك حذف حجز شخص آخر' });
    }

    // حذف الحجز
    await Enrollment.findByIdAndDelete(req.params.enrollmentId);

    // تحديث عدد الطلاب المشتركين
    const course = await Course.findById(enrollment.course);
    if (course) {
      course.enrolledCount = Math.max(0, course.enrolledCount - 1);
      await course.save();
    }

    // إزالة الدورة من قائمة الطالب
    await Student.findByIdAndUpdate(
      enrollment.student,
      { $pull: { enrolledCourses: enrollment.course } }
    );

    res.json({
      success: true,
      message: 'تم إلغاء الاشتراك بنجاح'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
