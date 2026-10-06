import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* About */}
          <div>
            <h4 className="text-lg font-bold mb-4">عن المنصة</h4>
            <p className="text-gray-400 text-sm">
              منصة تدريبية متخصصة تقدم دورات عالية الجودة في مختلف المجالات.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">روابط سريعة</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><a href="/" className="hover:text-white transition">الرئيسية</a></li>
              <li><a href="/courses" className="hover:text-white transition">الدورات</a></li>
              <li><a href="/" className="hover:text-white transition">عن المركز</a></li>
              <li><a href="/" className="hover:text-white transition">الاتصال بنا</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold mb-4">التصنيفات</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><a href="/courses" className="hover:text-white transition">البرمجة</a></li>
              <li><a href="/courses" className="hover:text-white transition">التصميم</a></li>
              <li><a href="/courses" className="hover:text-white transition">التسويق</a></li>
              <li><a href="/courses" className="hover:text-white transition">اللغات</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">التواصل</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>📧 info@skills-future.com</li>
              <li>📞 +966 XX XXX XXXX</li>
              <li>📍 الرياض، السعودية</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-700 mb-4" />

        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm">
          <p>&copy; 2024 منصة دورات مهارات المستقبل. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
