import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { courseAPI } from '../services/api';

export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedCourses();
  }, []);

  const fetchFeaturedCourses = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getAllCourses();
      setFeaturedCourses(response.data.data.slice(0, 6));
      setError(null);
    } catch (err) {
      setError('خطأ في تحميل الدورات');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">مرحباً بك في منصة مهارات المستقبل</h1>
          <p className="text-xl mb-8 text-blue-100">
            اكتسب مهارات جديدة من أفضل المدربين المتخصصين
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/courses"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition"
            >
              استكشف الدورات
            </Link>
            <Link
              to="/register"
              className="border-2 border-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition"
            >
              انضم الآن
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">لماذا تختارنا؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-bold mb-2">مدربون معتمدون</h3>
              <p className="text-gray-600">
                تعلم من أفضل الخبراء في المجال بخبرات عملية واسعة
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="text-xl font-bold mb-2">دورات مرنة</h3>
              <p className="text-gray-600">
                تعلم بوتيرتك الخاصة مع جداول زمنية مرنة تناسب حياتك
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-2">شهادات معترف بها</h3>
              <p className="text-gray-600">
                احصل على شهادات معترف بها تعزز سيرتك الذاتية
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">الدورات المميزة</h2>
            <Link to="/courses" className="text-blue-600 font-bold hover:text-blue-700">
              عرض جميع الدورات →
            </Link>
          </div>

          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-600">جاري تحميل الدورات...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">هل أنت جاهز لبدء رحلتك؟</h2>
          <p className="text-xl mb-8 text-blue-100">
            انضم إلى آلاف المتعلمين الذين حققوا أهدافهم معنا
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition inline-block"
          >
            تسجيل مجاني الآن
          </Link>
        </div>
      </section>
    </div>
  );
}
