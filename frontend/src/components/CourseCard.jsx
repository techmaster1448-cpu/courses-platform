import React from 'react';
import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
  const capacityPercentage = (course.enrolledCount / course.capacity) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      {/* Course Image */}
      {course.imageUrl && (
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
      )}

      {/* Course Content */}
      <div className="p-4">
        {/* Category Badge */}
        <div className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded mb-2">
          {course.category?.name || 'بدون تصنيف'}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {course.title}
        </h3>

        {/* Instructor */}
        <p className="text-gray-600 text-sm mb-2">
          👨‍🏫 المدرب: {course.instructor}
        </p>

        {/* Duration & Price */}
        <div className="flex justify-between text-sm text-gray-600 mb-3">
          <span>⏱️ {course.duration} ساعة</span>
          <span className="font-bold text-blue-600">{course.price} ريال</span>
        </div>

        {/* Capacity Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>المقاعد المتاحة</span>
            <span>{course.enrolledCount}/{course.capacity}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition"
              style={{ width: `${capacityPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Level Badge */}
        <div className="mb-3">
          <span className={`text-xs font-semibold px-2 py-1 rounded ${
            course.level === 'مبتدئ' ? 'bg-green-100 text-green-700' :
            course.level === 'متوسط' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {course.level}
          </span>
        </div>

        {/* View Details Button */}
        <Link
          to={`/courses/${course._id}`}
          className="block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          عرض التفاصيل
        </Link>
      </div>
    </div>
  );
}
