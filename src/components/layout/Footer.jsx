import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, MessageCircle, Send, Share2 } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-[#0F1115] text-slate-400">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-[#E9A23B] rounded-lg flex items-center justify-center">
                <span className="text-[#0F1115] font-bold text-lg">H</span>
              </div>
              <span className="text-lg font-bold text-white">Hostel Hub</span>
            </div>
            <p className="text-sm text-slate-400 mb-5 leading-relaxed">
              The trusted marketplace for student accommodation. Find, book, and manage hostels with ease.
            </p>
            <div className="flex gap-2">
              {[Globe, MessageCircle, Send, Share2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 bg-white/5 rounded-lg hover:bg-[#E9A23B] hover:text-[#0F1115] transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/search" className="text-slate-300 hover:text-[#E9A23B] transition-colors">Find Hostels</Link></li>
              <li><Link to="/about" className="text-slate-300 hover:text-[#E9A23B] transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-slate-300 hover:text-[#E9A23B] transition-colors">Contact</Link></li>
              <li><Link to="/register" className="text-slate-300 hover:text-[#E9A23B] transition-colors">List Your Property</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Support</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-slate-300 hover:text-[#E9A23B] transition-colors">Help Center</a></li>
              <li><a href="#" className="text-slate-300 hover:text-[#E9A23B] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-slate-300 hover:text-[#E9A23B] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-300 hover:text-[#E9A23B] transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-[#E9A23B] flex-shrink-0" />
                <span className="text-slate-300">support@hostelhub.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-[#E9A23B] flex-shrink-0" />
                <span className="text-slate-300">+254 700 000 000</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#E9A23B] mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">Nairobi, Kenya</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">© 2026 Hostel Hub. All rights reserved.</p>
          <p className="text-sm text-slate-400">Made with ❤️ for students</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;