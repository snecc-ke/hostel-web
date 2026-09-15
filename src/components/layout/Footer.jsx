import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, Share2, Send, Link as LinkIcon } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-bold text-white">Hostel Hub</span>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              The trusted marketplace for student accommodation. Find, book, and manage hostels with ease.
            </p>
          <div className="flex gap-3">
            <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 transition-colors">
                <Globe size={16} />
            </a>
            <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 transition-colors">
                <Share2 size={16} />
            </a>
            <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 transition-colors">
                <Send size={16} />
            </a>
            <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 transition-colors">
                <LinkIcon size={16} />
            </a>
          </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/search" className="hover:text-blue-400">Find Hostels</Link></li>
              <li><Link to="/about" className="hover:text-blue-400">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400">Contact</Link></li>
              <li><Link to="/register" className="hover:text-blue-400">List Your Property</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help" className="hover:text-blue-400">Help Center</Link></li>
              <li><Link to="/terms" className="hover:text-blue-400">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-400">Privacy Policy</Link></li>
              <li><Link to="/faq" className="hover:text-blue-400">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-blue-400" />
                support@hostelhub.com
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-blue-400" />
                +254 700 000 000
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-blue-400 mt-0.5" />
                Nairobi, Kenya
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            © 2026 Hostel Hub. All rights reserved.
          </p>
          <p className="text-sm text-slate-400">
            Made with ❤️ for students
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;