import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const TOKEN_KEY = process.env.REACT_APP_JWT_TOKEN_KEY;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor لإضافة رمز JWT إلى جميع الطلبات
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor للتعامل مع الأخطاء
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Methods
export const courseAPI = {
  // الحصول على جميع الدورات
  getAllCourses: (filters = {}) =>
    api.get('/courses', { params: filters }),

  // الحصول على دورة محددة
  getCourse: (id) =>
    api.get(`/courses/${id}`),

  // إضافة دورة جديدة
  createCourse: (courseData) =>
    api.post('/courses', courseData),

  // تعديل دورة
  updateCourse: (id, courseData) =>
    api.put(`/courses/${id}`, courseData),

  // حذف دورة
  deleteCourse: (id) =>
    api.delete(`/courses/${id}`)
};

export const categoryAPI = {
  // الحصول على جميع الفئات
  getAllCategories: () =>
    api.get('/categories'),

  // الحصول على فئة محددة
  getCategory: (id) =>
    api.get(`/categories/${id}`),

  // إضافة فئة
  createCategory: (categoryData) =>
    api.post('/categories', categoryData),

  // تعديل فئة
  updateCategory: (id, categoryData) =>
    api.put(`/categories/${id}`, categoryData),

  // حذف فئة
  deleteCategory: (id) =>
    api.delete(`/categories/${id}`)
};

export const authAPI = {
  // تسجيل طالب جديد
  register: (userData) =>
    api.post('/auth/register', userData),

  // تسجيل الدخول
  login: (credentials) =>
    api.post('/auth/login', credentials),

  // الحصول على بيانات المستخدم الحالي
  getCurrentUser: () =>
    api.get('/auth/me')
};

export const enrollmentAPI = {
  // الحصول على حجوزات الطالب
  getStudentEnrollments: (studentId) =>
    api.get(`/enrollments/student/${studentId}`),

  // الاشتراك في دورة
  enrollCourse: (courseId) =>
    api.post('/enrollments', { courseId }),

  // إلغاء الاشتراك
  unenrollCourse: (enrollmentId) =>
    api.delete(`/enrollments/${enrollmentId}`)
};

export default api;
