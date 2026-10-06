import React, { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard';
import FilterSidebar from '../components/FilterSidebar';
import { courseAPI } from '../services/api';

export default function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getAllCourses(filters);
      setCourses(response.data.data);
      setError(null);
    } catch (err) {
      setError('خطأ في تحميل الدورات');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">جميع الدورات</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <FilterSidebar onFilterChange={handleFilterChange} filters={filters} />
        </div>

        {/* Courses Grid */}
        <div className="md:col-span-3">
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">جاري تحميل الدورات...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">{error}</p>
            </div>
          )}

          {!loading && courses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">لم يتم العثور على دورات</p>
            </div>
          )}

          {!loading && courses.length > 0 && (
            <>
              <div className="text-gray-600 mb-6">
                عدد الدورات: <span className="font-bold">{courses.length}</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {courses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
