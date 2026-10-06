import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('coursesPlatformToken');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold hover:text-blue-100">
            مهارات المستقبل
          </Link>

          {/* Navigation Menu */}
          <nav className={`flex gap-6 items-center ${isMenuOpen ? 'block' : 'hidden md:flex'}`}>
            <Link to="/" className="hover:text-blue-100 transition">
              الرئيسية
            </Link>
            <Link to="/courses" className="hover:text-blue-100 transition">
              الدورات
            </Link>

            {user ? (
              <>
                {user.role === 'student' && (
                  <Link to="/student-dashboard" className="hover:text-blue-100 transition">
                    لوحة الطالب
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin-dashboard" className="hover:text-blue-100 transition">
                    لوحة التحكم
                  </Link>
                )}
                <span className="text-blue-100">
                  مرحباً {user.firstName}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  تسجيل خروج
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-100 transition">
                  دخول
                </Link>
                <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition">
                  تسجيل
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
