import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, Zap, TrendingUp, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { hostelService } from '../../services/hostelService';

function HomePage() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchHostels() {
      try {
        const data = await hostelService.list({ limit: 6 });
        if (mounted) setHostels(data);
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load hostels');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchHostels();
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      {/* ═════ HERO ═════ */}
      <section className="bg-[#14213D] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E9A23B] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#4A90D9] rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-6 py-24 lg:py-32 relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm mb-8 backdrop-blur-sm border border-white/10">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-slate-200">Trusted by 1,250+ students</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.05] tracking-tight">
            Find Your Perfect
            <br />
            <span className="text-[#E9A23B]">Student Home</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover verified hostels near your campus. Book securely. Live comfortably.
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <Link to="/search">
              <Button size="xl" variant="accent" icon={Search}>Search Hostels</Button>
            </Link>
            <Link to="/register">
              <button className="px-8 py-4 text-base font-medium rounded-[10px] bg-white/15 text-white border border-white/20 hover:bg-white/25 hover:border-white/30 active:scale-[0.98] transition-all duration-150 backdrop-blur-sm inline-flex items-center gap-2">
                List Your Property
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-8 border-t border-white/10">
            <div>
              <p className="text-3xl font-bold text-[#E9A23B]">45+</p>
              <p className="text-xs text-slate-300 mt-1">Verified Hostels</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#E9A23B]">1,250+</p>
              <p className="text-xs text-slate-300 mt-1">Happy Students</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#E9A23B]">4.8★</p>
              <p className="text-xs text-slate-300 mt-1">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═════ FEATURES ═════ */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-sm font-semibold text-[#E9A23B] uppercase tracking-widest mb-3">
              Why Hostel Hub
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#14213D] mb-4 tracking-tight">
              Everything you need for a stress-free search
            </h2>
            <p className="text-lg text-[#5c6470]">
              We've built the safest, simplest way for students to find their next home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <div className="w-14 h-14 bg-[#14213D]/8 rounded-2xl flex items-center justify-center mb-5 mx-auto">
                <Shield className="text-[#14213D]" size={26} />
              </div>
              <h3 className="text-lg font-semibold text-[#14213D] mb-2">Verified Listings</h3>
              <p className="text-sm text-[#5c6470] leading-relaxed">
                Every hostel is manually verified before going live for your peace of mind.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-14 h-14 bg-[#14213D]/8 rounded-2xl flex items-center justify-center mb-5 mx-auto">
                <Zap className="text-[#14213D]" size={26} />
              </div>
              <h3 className="text-lg font-semibold text-[#14213D] mb-2">Instant Booking</h3>
              <p className="text-sm text-[#5c6470] leading-relaxed">
                Book your room in minutes with our secure, student-friendly payment system.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-14 h-14 bg-[#14213D]/8 rounded-2xl flex items-center justify-center mb-5 mx-auto">
                <TrendingUp className="text-[#14213D]" size={26} />
              </div>
              <h3 className="text-lg font-semibold text-[#14213D] mb-2">Best Prices</h3>
              <p className="text-sm text-[#5c6470] leading-relaxed">
                Compare prices side-by-side and find a hostel that fits your budget.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ═════ FEATURED HOSTELS ═════ */}
      <section className="py-24 lg:py-32 bg-[#F4F6F8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-[#E9A23B] uppercase tracking-widest mb-3">
              Hand-picked for you
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#14213D] mb-4 tracking-tight">
              Featured Hostels
            </h2>
            <p className="text-lg text-[#5c6470] max-w-xl mx-auto">
              Top-rated student homes near your campus
            </p>
          </div>

          {loading && (
            <div className="flex justify-center py-16">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {error && (
            <EmptyState
              title="Couldn't load hostels"
              description={error}
              actionLabel="Retry"
              onAction={() => window.location.reload()}
            />
          )}

          {!loading && !error && hostels.length === 0 && (
            <EmptyState title="No hostels yet" description="Check back soon!" />
          )}

          {!loading && !error && hostels.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hostels.map((hostel) => (
                  <Link
                    key={hostel.id}
                    to={`/hostels/${hostel.id}`}
                    className="group block bg-white rounded-2xl overflow-hidden border border-[#E8ECF1] hover:border-[#E9A23B]/40 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={hostel.images?.[0]}
                        alt={hostel.name}
                        className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {hostel.status === 'verified' && (
                        <div className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-600/95 backdrop-blur-sm text-white rounded-full text-xs font-semibold">
                          Verified
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[#14213D] text-base line-clamp-1">{hostel.name}</h3>
                          <p className="text-sm text-[#5c6470] mt-1 line-clamp-1">{hostel.address}</p>
                        </div>
                        <ArrowRight size={20} className="text-[#8f96a3] group-hover:text-[#E9A23B] group-hover:translate-x-1 transition-all mt-1 flex-shrink-0" />
                      </div>
                      <div className="flex items-end justify-between mt-4 pt-4 border-t border-[#F4F6F8]">
                        <div>
                          <span className="text-xl font-bold text-[#E9A23B]">${hostel.price_per_month}</span>
                          <span className="text-sm text-[#5c6470]">/mo</span>
                        </div>
                        <span className="text-xs text-[#8f96a3]">{hostel.available_rooms} of {hostel.total_rooms} rooms</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link to="/search">
                  <Button variant="secondary" size="lg" icon={ArrowRight} iconPosition="right">
                    Browse All Hostels
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ═════ HOW IT WORKS ═════ */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-sm font-semibold text-[#E9A23B] uppercase tracking-widest mb-3">
              Simple process
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#14213D] mb-4 tracking-tight">
              How it works
            </h2>
            <p className="text-lg text-[#5c6470]">Three steps to your new home</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'Search', desc: 'Filter by location, price, and amenities to find your ideal hostel.' },
              { step: '02', title: 'Compare', desc: 'View photos, ratings, and reviews from real students.' },
              { step: '03', title: 'Book', desc: 'Secure your room in minutes with our safe payment system.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-[#E9A23B] text-[#14213D] font-bold text-base rounded-xl flex items-center justify-center mb-4 mx-auto shadow-sm">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-[#14213D] mb-2">{item.title}</h3>
                <p className="text-sm text-[#5c6470] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

           {/* CTA */}
      <section className="py-24 lg:py-32 bg-[#14213D] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#E9A23B] rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Ready to find your home?
          </h2>
          <p className="text-lg text-slate-300 mb-10">
            Join thousands of students who found their perfect hostel through Hostel Hub.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/register">
              <button className="px-8 py-4 text-base font-semibold rounded-[10px] bg-[#E9A23B] text-[#14213D] hover:bg-[#d98a25] active:scale-[0.98] transition-all duration-150 shadow-sm">
                Get Started Free
              </button>
            </Link>
            <Link to="/search">
              <button className="px-8 py-4 text-base font-semibold rounded-[10px] bg-transparent text-[#E9A23B] border-2 border-[#E9A23B] hover:bg-[#E9A23B] hover:text-[#14213D] active:scale-[0.98] transition-all duration-150">
                Browse Hostels
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;