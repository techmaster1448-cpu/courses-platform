import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseAPI, categoryAPI } from '../services/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    instructor: '',
    duration: '',
    price: '',
    startDate: '',
    endDate: '',
    capacity: ''
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.role !== 'admin') {
      navigate('/login');
      return;
    }
    setUser(userData);
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesRes, categoriesRes] = await Promise.all([
        courseAPI.getAllCourses(),
        categoryAPI.getAllCategories()
      ]);
      setCourses(coursesRes.data.data);
      setCategories(categoriesRes.data.data);
    } catch (err) {
      console.error('خطأ في تحميل البيانات:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await courseAPI.updateCourse(editingCourse._id, formData);
        alert('تم تعديل الدورة بنجاح');
      } else {
        await courseAPI.createCourse(formData);
        alert('تم إضافة الدورة بنجاح');
      }
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        category: '',
        instructor: '',
        duration: '',
        price: '',
        startDate: '',
        endDate: '',
        capacity: ''
      });
      setEditingCourse(null);
      fetchData();
    } catch (err) {
      alert('خطأ: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('هل تريد حذف هذه الدورة؟')) return;
    try {
      await courseAPI.deleteCourse(courseId);
      alert('تم حذف الدورة بنجاح');
      fetchData();
    } catch (err) {
      alert('خطأ في حذف الدورة');
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category._id,
      instructor: course.instructor,
      duration: course.duration,
      price: course.price,
      startDate: course.startDate?.slice(0, 10),
      endDate: course.endDate?.slice(0, 10),
      capacity: course.capacity
    });
    setShowForm(true);
  };

  if (!user) {
    return <div className="text-center py-12">جاري تحميل...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">لوحة التحكم الإدارية</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b">
        <button
          onClick={() => setActiveTab('courses')}
          className={`py-2 px-4 font-bold transition ${
            activeTab === 'courses'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          إدارة الدورات
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`py-2 px-4 font-bold transition ${
            activeTab === 'categories'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          إدارة الفئات
        </button>
      </div>

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">الدورات</h2>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingCourse(null);
                setFormData({
                  title: '',
                  description: '',
                  category: '',
                  instructor: '',
                  duration: '',
                  price: '',
                  startDate: '',
                  endDate: '',
                  capacity: ''
                });
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {showForm ? 'إلغاء' : '+ إضافة دورة جديدة'}
            </button>
          </div>

          {/* Course Form */}
          {showForm && (
            <form onSubmit={handleSubmitCourse} className="bg-white p-6 rounded-lg shadow-md mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="title"
                  placeholder="اسم الدورة"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                  className="px-4 py-2 border rounded"
                />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  required
                  className="px-4 py-2 border rounded"
                >
                  <option value="">اختر الفئة</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="instructor"
                  placeholder="اسم المدرب"
                  value={formData.instructor}
                  onChange={handleFormChange}
                  required
                  className="px-4 py-2 border rounded"
                />
                <input
                  type="number"
                  name="duration"
                  placeholder="المدة (ساعة)"
                  value={formData.duration}
                  onChange={handleFormChange}
                  required
                  className="px-4 py-2 border rounded"
                />
                <input
                  type="number"
                  name="price"
                  placeholder="السعر"
                  value={formData.price}
                  onChange={handleFormChange}
                  required
                  className="px-4 py-2 border rounded"
                />
                <input
                  type="number"
                  name="capacity"
                  placeholder="عدد المقاعد"
                  value={formData.capacity}
                  onChange={handleFormChange}
                  required
                  className="px-4 py-2 border rounded"
                />
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleFormChange}
                  required
                  className="px-4 py-2 border rounded"
                />
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleFormChange}
                  required
                  className="px-4 py-2 border rounded"
                />
              </div>
              <textarea
                name="description"
                placeholder="وصف الدورة"
                value={formData.description}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 border rounded mt-4"
                rows="4"
              ></textarea>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mt-4"
              >
                {editingCourse ? 'تحديث' : 'إضافة'}
              </button>
            </form>
          )}

          {/* Courses List */}
          <div className="space-y-4">
            {courses.map(course => (
              <div key={course._id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{course.title}</h3>
                    <p className="text-gray-600">المدرب: {course.instructor}</p>
                    <p className="text-gray-600">المدة: {course.duration} ساعة | السعر: {course.price} ريال</p>
                    <p className="text-gray-600">المقاعد: {course.enrolledCount}/{course.capacity}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditCourse(course)}
                      className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div>
          <h2 className="text-2xl font-bold mb-6">الفئات ({categories.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map(cat => (
              <div key={cat._id} className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-bold">{cat.name}</h3>
                <p className="text-gray-600">{cat.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
