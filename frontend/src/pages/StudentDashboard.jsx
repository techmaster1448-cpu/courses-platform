import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { enrollmentAPI, authAPI } from '../services/api';

export default function StudentDashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(userData);
    fetchEnrollments(userData.id);
  }, [navigate]);

  const fetchEnrollments = async (studentId) => {
    try {
      setLoading(true);
      const response = await enrollmentAPI.getStudentEnrollments(studentId);
      setEnrollments(response.data.data);
      setError(null);
    } catch (err) {
      setError('خطأ في تحميل الدورات المسجلة');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (enrollmentId) => {
    if (!window.confirm('هل تريد إلغاء الاشتراك من هذه الدورة؟')) {
      return;
    }

    try {
      await enrollmentAPI.unenrollCourse(enrollmentId);
      setEnrollments(enrollments.filter(e => e._id !== enrollmentId));
      alert('تم إلغاء الاشتراك بنجاح');
    } catch (err) {
      alert('خطأ في إلغاء الاشتراك');
      console.error(err);
    }
  };

  if (!user) {
    return <div className="text-center py-12">جاري تحميل...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">لوحة الطالب</h1>
        <p className="text-gray-600 text-lg">
          مرحباً {user.firstName} {user.lastName}
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
          <div className="text-3xl font-bold text-blue-600">{enrollments.length}</div>
          <div className="text-gray-600">الدورات المسجلة</div>
        </div>
        <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded">
          <div className="text-3xl font-bold text-green-600">
            {enrollments.filter(e => e.status === 'اكتمل').length}
          </div>
          <div className="text-gray-600">الدورات المكتملة</div>
        </div>
        <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded">
          <div className="text-3xl font-bold text-yellow-600">
            {enrollments.filter(e => e.status === 'قيد الدراسة').length}
          </div>
          <div className="text-gray-600">قيد الدراسة</div>
        </div>
      </div>

      {/* Enrolled Courses */}
      <h2 className="text-2xl font-bold mb-6">الدورات المسجلة</h2>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">جاري تحميل الدورات...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {!loading && enrollments.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded">
          <p className="text-gray-600 text-lg mb-4">لم تسجل في أي دورات بعد</p>
          <a
            href="/courses"
            className="text-blue-600 font-bold hover:text-blue-700"
          >
            استكشف الدورات المتاحة
          </a>
        </div>
      )}

      {!loading && enrollments.length > 0 && (
        <div className="space-y-6">
          {enrollments.map((enrollment) => (
            <div
              key={enrollment._id}
              className="bg-white rounded-lg shadow-md p-6 flex justify-between items-start"
            >
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">
                  {enrollment.course.title}
                </h3>
                <div className="text-gray-600 mb-4 space-y-1">
                  <p>👨‍🏫 المدرب: {enrollment.course.instructor}</p>
                  <p>⏱️ المدة: {enrollment.course.duration} ساعة</p>
                  <p>💰 السعر: {enrollment.course.price} ريال</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>التقدم</span>
                    <span>{enrollment.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${enrollment.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="inline-block">
                  <span className={`text-xs font-semibold px-3 py-1 rounded ${
                    enrollment.status === 'اكتمل' ? 'bg-green-100 text-green-700' :
                    enrollment.status === 'قيد الدراسة' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {enrollment.status}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleUnenroll(enrollment._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  إلغاء الاشتراك
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
