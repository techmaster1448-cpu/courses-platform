import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI, enrollmentAPI } from '../services/api';

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getCourse(courseId);
      setCourse(response.data.data);
      setError(null);
    } catch (err) {
      setError('خطأ في تحميل تفاصيل الدورة');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'student') {
      alert('فقط الطلاب يمكنهم الاشتراك في الدورات');
      return;
    }

    try {
      setEnrolling(true);
      await enrollmentAPI.enrollCourse(courseId);
      setIsEnrolled(true);
      alert('تم الاشتراك بنجاح! تحقق من لوحة الطالب');
      navigate('/student-dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'خطأ في الاشتراك');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-gray-600">جاري تحميل تفاصيل الدورة...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={() => navigate('/courses')}
            className="text-blue-600 font-bold hover:text-blue-700 mt-4"
          >
            العودة للدورات
          </button>
        </div>
      </div>
    );
  }

  const capacityPercentage = (course.enrolledCount / course.capacity) * 100;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate('/courses')}
        className="text-blue-600 font-bold hover:text-blue-700 mb-6"
      >
        ← العودة للدورات
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2">
          {/* Title */}
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>

          {/* Category Badge */}
          <div className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded mb-4">
            {course.category?.name}
          </div>

          {/* Course Info */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">👨‍🏫 المدرب</span>
              <span className="font-bold">{course.instructor}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">⏱️ المدة</span>
              <span className="font-bold">{course.duration} ساعة</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">📚 المستوى</span>
              <span className="font-bold">{course.level}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">💰 السعر</span>
              <span className="font-bold text-blue-600 text-lg">{course.price} ريال</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">📅 التواريخ</span>
              <span className="font-bold">
                {new Date(course.startDate).toLocaleDateString('ar-SA')} إلى{' '}
                {new Date(course.endDate).toLocaleDateString('ar-SA')}
              </span>
            </div>
          </div>

          {/* Description */}
          <h2 className="text-2xl font-bold mb-4">وصف الدورة</h2>
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            {course.description}
          </p>

          {/* Learning Outcomes */}
          {course.learningOutcomes && course.learningOutcomes.length > 0 && (
            <>
              <h2 className="text-2xl font-bold mb-4">ما ستتعلمه</h2>
              <ul className="mb-6 space-y-2">
                {course.learningOutcomes.map((outcome, idx) => (
                  <li key={idx} className="text-gray-700">
                    ✓ {outcome}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Requirements */}
          {course.requirements && course.requirements.length > 0 && (
            <>
              <h2 className="text-2xl font-bold mb-4">المتطلبات الأساسية</h2>
              <ul className="mb-6 space-y-2">
                {course.requirements.map((req, idx) => (
                  <li key={idx} className="text-gray-700">
                    • {req}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Schedule */}
          {course.schedule && (
            <>
              <h2 className="text-2xl font-bold mb-4">الجدول الزمني</h2>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <p className="text-gray-700">
                  <strong>الأيام:</strong> {course.schedule.days?.join(', ') || 'غير محدد'}
                </p>
                <p className="text-gray-700">
                  <strong>الوقت:</strong> {course.schedule.time || 'غير محدد'}
                </p>
                {course.schedule.location && (
                  <p className="text-gray-700">
                    <strong>المكان:</strong> {course.schedule.location}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Instructor Bio */}
          {course.instructorBio && (
            <>
              <h2 className="text-2xl font-bold mb-4">عن المدرب</h2>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <p className="text-gray-700">{course.instructorBio}</p>
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {/* Enrollment Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
            {/* Capacity Info */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>المقاعد المتاحة</span>
                <span>
                  {course.enrolledCount}/{course.capacity}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition"
                  style={{ width: `${capacityPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-blue-600 mb-6">
              {course.price} ريال
            </div>

            {/* Enroll Button */}
            {user && user.role === 'student' && !isEnrolled ? (
              <button
                onClick={handleEnroll}
                disabled={enrolling || course.enrolledCount >= course.capacity}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {enrolling ? 'جاري الاشتراك...' : 'اشترك الآن'}
              </button>
            ) : !user ? (
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition mb-4"
              >
                دخول للاشتراك
              </button>
            ) : user.role !== 'student' ? (
              <div className="bg-yellow-100 text-yellow-700 p-3 rounded-lg text-center">
                فقط الطلاب يمكنهم الاشتراك
              </div>
            ) : null}

            {course.enrolledCount >= course.capacity && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg text-center">
                الدورة امتلأت
              </div>
            )}

            {/* Share Buttons */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-gray-600 text-sm mb-3">شارك هذه الدورة</p>
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700">
                  Facebook
                </button>
                <button className="flex-1 bg-sky-400 text-white py-2 rounded text-sm hover:bg-sky-500">
                  Twitter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
