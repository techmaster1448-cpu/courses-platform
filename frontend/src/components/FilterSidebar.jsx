import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../services/api';

export default function FilterSidebar({ onFilterChange, filters }) {
  const [categories, setCategories] = useState([]);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAllCategories();
      setCategories(response.data.data);
    } catch (error) {
      console.error('خطأ في جلب الفئات:', error);
    }
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...localFilters, [filterName]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    setLocalFilters({});
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">التصفيات</h3>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          البحث
        </label>
        <input
          type="text"
          placeholder="ابحث عن دورة..."
          value={localFilters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          المجال
        </label>
        <select
          value={localFilters.category || ''}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        >
          <option value="">جميع المجالات</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Level Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          المستوى
        </label>
        <select
          value={localFilters.level || ''}
          onChange={(e) => handleFilterChange('level', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        >
          <option value="">جميع المستويات</option>
          <option value="مبتدئ">مبتدئ</option>
          <option value="متوسط">متوسط</option>
          <option value="متقدم">متقدم</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          نطاق السعر
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            placeholder="من"
            value={localFilters.priceMin || ''}
            onChange={(e) => handleFilterChange('priceMin', e.target.value)}
            className="w-1/2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
          <input
            type="number"
            placeholder="إلى"
            value={localFilters.priceMax || ''}
            onChange={(e) => handleFilterChange('priceMax', e.target.value)}
            className="w-1/2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition font-semibold"
      >
        إعادة تعيين
      </button>
    </div>
  );
}
