import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, Zap, TrendingUp } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { demoHostels } from '../../data/demoData';

function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find Your Perfect <span className="text-blue-400">Student Home</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Discover verified hostels near your campus. Book securely. Live comfortably.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/search">
                <Button size="xl" icon={Search}>
                  Search Hostels
                </Button>
              </Link>
              <Link to="/register">
                <Button size="xl" variant="secondary">
                  List Your Property
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Why Choose Hostel Hub?</h2>
            <p className="text-slate-600">Everything you need for a stress-free hostel search</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <Shield className="text-blue-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Verified Listings</h3>
              <p className="text-sm text-slate-600">Every hostel is verified for your safety and peace of mind.</p>
            </Card>
            <Card>
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                <Zap className="text-emerald-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Instant Booking</h3>
              <p className="text-sm text-slate-600">Book your room in minutes with our secure payment system.</p>
            </Card>
            <Card>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Best Prices</h3>
              <p className="text-sm text-slate-600">Compare prices and find the perfect fit for your budget.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Hostels */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Featured Hostels</h2>
              <p className="text-slate-600 mt-1">Top-rated hostels near you</p>
            </div>
            <Link to="/search">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoHostels.slice(0, 3).map((hostel) => (
              <Card key={hostel.id} padding="p-0" hover>
                <img src={hostel.image} alt={hostel.name} className="w-full h-48 object-cover rounded-t-xl" />
                <div className="p-5">
                  <h3 className="font-bold text-slate-900">{hostel.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{hostel.address}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold text-blue-600">${hostel.price}<span className="text-sm text-slate-500">/mo</span></span>
                    <span className="text-sm text-slate-600">⭐ {hostel.rating}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to find your home?</h2>
          <p className="text-blue-100 text-lg mb-8">Join thousands of students who found their perfect hostel.</p>
          <Link to="/register">
            <Button size="xl" variant="secondary">Get Started Free</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;