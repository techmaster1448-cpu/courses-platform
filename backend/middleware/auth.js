const jwt = require('jsonwebtoken');

// Middleware للتحقق من رمز JWT
exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'لم يتم توفير رمز تحقق' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'رمز التحقق غير صحيح أو انتهت صلاحيته' });
  }
};

// Middleware للتحقق من أن المستخدم طالب
exports.isStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'هذا الإجراء متاح فقط للطلاب' });
  }
  next();
};

// Middleware للتحقق من أن المستخدم مسؤول
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'هذا الإجراء متاح فقط للمسؤولين' });
  }
  next();
};

// دالة لإنشاء رمز JWT
exports.generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};
