const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { verifyToken, isAdmin } = require('../middleware/auth');

// الحصول على جميع الفئات
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// الحصول على فئة محددة
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ error: 'الفئة غير موجودة' });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// إضافة فئة جديدة (للمسؤولين فقط)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();

    res.status(201).json({
      success: true,
      message: 'تم إضافة الفئة بنجاح',
      data: category
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// تعديل فئة (للمسؤولين فقط)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ error: 'الفئة غير موجودة' });
    }

    res.json({
      success: true,
      message: 'تم تعديل الفئة بنجاح',
      data: category
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// حذف فئة (للمسؤولين فقط)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ error: 'الفئة غير موجودة' });
    }

    res.json({
      success: true,
      message: 'تم حذف الفئة بنجاح'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
