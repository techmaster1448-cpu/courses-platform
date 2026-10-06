const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB متصل بنجاح'))
  .catch(err => console.error('❌ خطأ في الاتصال بـ MongoDB:', err));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'مرحباً بك في منصة دورات مهارات المستقبل',
    version: '1.0.0'
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/enrollments', require('./routes/enrollments'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: err.message || 'حدث خطأ على الخادم'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'الصفحة غير موجودة'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على المنفذ ${PORT}`);
});
