const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { verifyToken, isAdmin } = require('../middleware/auth');

// الحصول على جميع الدورات مع التصفية والبحث
router.get('/', async (req, res) => {
  try {
    const { category, search, level, priceMin, priceMax } = req.query;

    let filter = { isActive: true };

    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (level) filter.level = level;
    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = Number(priceMin);
      if (priceMax) filter.price.$lte = Number(priceMax);
    }

    const courses = await Course.find(filter)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// الحصول على دورة محددة
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('category', 'name description');

    if (!course) {
      return res.status(404).json({ error: 'الدورة غير موجودة' });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// إضافة دورة جديدة (للمسؤولين فقط)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    await course.populate('category', 'name');

    res.status(201).json({
      success: true,
      message: 'تم إضافة الدورة بنجاح',
      data: course
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// تعديل دورة (للمسؤولين فقط)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name');

    if (!course) {
      return res.status(404).json({ error: 'الدورة غير موجودة' });
    }

    res.json({
      success: true,
      message: 'تم تعديل الدورة بنجاح',
      data: course
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// حذف دورة (للمسؤولين فقط)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'الدورة غير موجودة' });
    }

    res.json({
      success: true,
      message: 'تم حذف الدورة بنجاح'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
