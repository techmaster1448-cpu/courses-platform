const mongoose = require('mongoose');
require('dotenv').config();

const Category = require('./models/Category');
const Course = require('./models/Course');
const Student = require('./models/Student');
const Admin = require('./models/Admin');

const seedDatabase = async () => {
  try {
    // الاتصال بقاعدة البيانات
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ تم الاتصال بقاعدة البيانات');

    // حذف البيانات القديمة
    await Category.deleteMany({});
    await Course.deleteMany({});
    await Student.deleteMany({});
    await Admin.deleteMany({});
    console.log('✅ تم حذف البيانات القديمة');

    // إنشاء الفئات
    const categories = await Category.insertMany([
      {
        name: 'البرمجة',
        description: 'دورات في البرمجة وتطوير التطبيقات'
      },
      {
        name: 'التصميم',
        description: 'دورات في التصميم الجرافيكي والويب'
      },
      {
        name: 'اللغات',
        description: 'دورات تعليم اللغات الأجنبية'
      },
      {
        name: 'التسويق الرقمي',
        description: 'دورات في التسويق الإلكتروني والإعلانات'
      },
      {
        name: 'إدارة الأعمال',
        description: 'دورات إدارة الأعمال والقيادة'
      }
    ]);
    console.log('✅ تم إنشاء الفئات');

    // إنشاء دورات تجريبية
    const courses = await Course.insertMany([
      {
        title: 'تعلم JavaScript من الصفر',
        description: 'دورة شاملة لتعليم JavaScript للمبتدئين. ستتعلم الأساسيات والمفاهيم المتقدمة مع مشاريع عملية.',
        category: categories[0]._id,
        instructor: 'أحمد علي',
        instructorEmail: 'ahmed@example.com',
        duration: 40,
        price: 299,
        startDate: new Date('2024-11-01'),
        endDate: new Date('2024-12-01'),
        capacity: 30,
        enrolledCount: 15,
        level: 'مبتدئ',
        requirements: ['لا توجد متطلبات سابقة'],
        learningOutcomes: ['فهم أساسيات JavaScript', 'كتابة برامج فعالة', 'بناء تطبيقات ويب تفاعلية']
      },
      {
        title: 'React.js المتقدم',
        description: 'دورة متقدمة في React.js تغطي الحالة المتقدمة، الخوادم، وإدارة الحالة.',
        category: categories[0]._id,
        instructor: 'فاطمة محمد',
        instructorEmail: 'fatima@example.com',
        duration: 50,
        price: 499,
        startDate: new Date('2024-11-15'),
        endDate: new Date('2025-01-15'),
        capacity: 25,
        enrolledCount: 12,
        level: 'متقدم',
        requirements: ['خبرة في JavaScript', 'فهم HTML و CSS'],
        learningOutcomes: ['بناء تطبيقات React معقدة', 'إدارة الحالة مع Redux', 'الأداء والتحسين']
      },
      {
        title: 'تصميم واجهات المستخدم UI/UX',
        description: 'تعلم أساسيات تصميم واجهات المستخدم والتجربة المستخدم الجيدة.',
        category: categories[1]._id,
        instructor: 'ليلى حسن',
        instructorEmail: 'layla@example.com',
        duration: 35,
        price: 399,
        startDate: new Date('2024-11-10'),
        endDate: new Date('2024-12-15'),
        capacity: 20,
        enrolledCount: 8,
        level: 'مبتدئ',
        requirements: [],
        learningOutcomes: ['مبادئ التصميم', 'أدوات التصميم', 'تجربة المستخدم']
      },
      {
        title: 'تعلم الإنجليزية من المستوى الأول',
        description: 'دورة اللغة الإنجليزية للمبتدئين. تعلم المحادثة والقراءة والكتابة.',
        category: categories[2]._id,
        instructor: 'محمود سالم',
        instructorEmail: 'mahmoud@example.com',
        duration: 60,
        price: 199,
        startDate: new Date('2024-11-05'),
        endDate: new Date('2025-01-05'),
        capacity: 40,
        enrolledCount: 25,
        level: 'مبتدئ',
        requirements: [],
        learningOutcomes: ['المحادثة الأساسية', 'القراءة والكتابة', 'المفردات']
      },
      {
        title: 'التسويق الرقمي الشامل',
        description: 'دورة متكاملة في التسويق الرقمي تغطي SEO و SEM و Social Media Marketing.',
        category: categories[3]._id,
        instructor: 'سارة إبراهيم',
        instructorEmail: 'sarah@example.com',
        duration: 45,
        price: 349,
        startDate: new Date('2024-11-20'),
        endDate: new Date('2024-12-20'),
        capacity: 35,
        enrolledCount: 18,
        level: 'متوسط',
        requirements: ['فهم أساسي للإنترنت والمبيعات'],
        learningOutcomes: ['استراتيجيات التسويق', 'إدارة الحملات', 'تحليل البيانات']
      },
      {
        title: 'إدارة المشاريع والقيادة',
        description: 'تعلم مهارات إدارة المشاريع والقيادة الفعالة في بيئة العمل.',
        category: categories[4]._id,
        instructor: 'عمر الشريف',
        instructorEmail: 'omar@example.com',
        duration: 40,
        price: 399,
        startDate: new Date('2024-12-01'),
        endDate: new Date('2025-01-01'),
        capacity: 30,
        enrolledCount: 20,
        level: 'متوسط',
        requirements: ['خبرة عملية'],
        learningOutcomes: ['تخطيط المشاريع', 'القيادة والتحفيز', 'حل المشاكل']
      },
      {
        title: 'Python للمبتدئين',
        description: 'دورة شاملة لتعليم Python البرمجة للمبتدئين مع مشاريع عملية.',
        category: categories[0]._id,
        instructor: 'علي منصور',
        instructorEmail: 'ali@example.com',
        duration: 50,
        price: 279,
        startDate: new Date('2024-12-10'),
        endDate: new Date('2025-01-10'),
        capacity: 25,
        enrolledCount: 10,
        level: 'مبتدئ',
        requirements: [],
        learningOutcomes: ['أساسيات Python', 'معالجة البيانات', 'بناء تطبيقات']
      },
      {
        title: 'Figma - أداة التصميم الحديثة',
        description: 'تعلم كيفية استخدام Figma لتصميم واجهات المستخدم والنماذج الأولية.',
        category: categories[1]._id,
        instructor: 'نور الدين',
        instructorEmail: 'nour@example.com',
        duration: 30,
        price: 279,
        startDate: new Date('2024-11-25'),
        endDate: new Date('2024-12-25'),
        capacity: 20,
        enrolledCount: 5,
        level: 'مبتدئ',
        requirements: [],
        learningOutcomes: ['استخدام Figma', 'تصميم النماذج', 'التعاون والمشاركة']
      }
    ]);
    console.log('✅ تم إنشاء الدورات');

    // إنشاء طالب تجريبي
    await Student.create({
      firstName: 'محمد',
      lastName: 'علي',
      email: 'student@test.com',
      password: 'test123',
      phone: '+966501234567'
    });
    console.log('✅ تم إنشاء طالب تجريبي');

    // إنشاء مسؤول تجريبي
    await Admin.create({
      firstName: 'إدارة',
      lastName: 'المنصة',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'مسؤول عام'
    });
    console.log('✅ تم إنشاء مسؤول تجريبي');

    console.log('\n========================================');
    console.log('✅ تم إنشاء البيانات التجريبية بنجاح!');
    console.log('========================================\n');
    console.log('📧 بيانات الدخول:');
    console.log('- طالب: student@test.com / test123');
    console.log('- مسؤول: admin@test.com / admin123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ خطأ:', error.message);
    process.exit(1);
  }
};

seedDatabase();
