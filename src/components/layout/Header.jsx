import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, LogIn } from 'lucide-react';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/search', label: 'Find Hostels' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-navy border-b border-navy-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gold rounded-lg flex items-center justify-center">
              <span className="text-navy font-bold text-lg">H</span>
            </div>
            <span className="text-xl font-bold text-white">Hostel Hub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? 'text-gold' : 'text-gray-300 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              <LogIn size={16} />
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-gold hover:bg-gold-dark text-navy font-semibold text-sm rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-navy border-t border-navy-light py-4 px-4 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg font-medium ${
                  isActive ? 'bg-gold/20 text-gold' : 'text-gray-300 hover:bg-navy-light'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="pt-3 border-t border-navy-light space-y-2">
            <Link to="/login" className="block">
              <button className="w-full px-4 py-2 border border-navy-light text-white font-medium rounded-lg hover:bg-navy-light">
                Login
              </button>
            </Link>
            <Link to="/register" className="block">
              <button className="w-full px-4 py-2 bg-gold text-navy font-semibold rounded-lg hover:bg-gold-dark">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;