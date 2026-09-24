import React, { useState, useEffect, createContext, useContext } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Shield, Lock, MessageCircle, Search, Star, Building2, BarChart3, Wallet } from 'lucide-react';

export const AuthRoleContext = createContext({
  role: null,
  setRole: () => {},
});

export function useAuthRole() {
  return useContext(AuthRoleContext);
}

function useLoopTypewriter(text, typeSpeed = 90, eraseSpeed = 40, pauseMs = 2000) {
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState('typing');

  useEffect(() => {
    let timer;
    if (phase === 'typing') {
      if (displayed.length < text.length) {
        timer = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), typeSpeed);
      } else {
        timer = setTimeout(() => setPhase('pausing'), pauseMs);
      }
    } else if (phase === 'pausing') {
      timer = setTimeout(() => setPhase('erasing'), 100);
    } else if (phase === 'erasing') {
      if (displayed.length > 0) {
        timer = setTimeout(() => setDisplayed(text.slice(0, displayed.length - 1)), eraseSpeed);
      } else {
        timer = setTimeout(() => setPhase('typing'), 400);
      }
    }
    return () => clearTimeout(timer);
  }, [displayed, phase, text, typeSpeed, eraseSpeed, pauseMs]);

  return displayed;
}

function CardLogo() {
  const typed = useLoopTypewriter('Hostel Hub', 100, 50, 2000);
  return (
    <span className="text-2xl font-bold min-h-[2rem]" style={{ color: '#14213D' }}>
      {typed}
      <span
        className="inline-block w-[2px] h-[1em] align-middle ml-0.5 animate-blink"
        style={{ backgroundColor: '#E9A23B' }}
      />
    </span>
  );
}

const RIGHT_CONTENT = {
  default: {
    headline: 'Find your perfect tenant home',
    subtext: 'Join thousands of tenants and landlords using Hostel Hub to make accommodation simple, safe, and secure.',
    features: [
      { icon: Shield, title: 'Verified Listings', desc: 'Every hostel is manually verified for safety' },
      { icon: Lock, title: 'Secure Payments', desc: 'Your money is protected until check-in' },
      { icon: MessageCircle, title: 'Direct Communication', desc: 'Chat directly with hostel owners' },
    ],
  },
  tenant: {
    headline: 'Start your tenant journey',
    subtext: 'Search verified hostels, chat with landlords, and book your perfect room in minutes.',
    features: [
      { icon: Search, title: 'Search Verified Hostels', desc: 'Browse hundreds of accommodation listings' },
      { icon: MessageCircle, title: 'Chat with Landlords', desc: 'Ask questions and get answers fast' },
      { icon: Star, title: 'Leave Reviews', desc: 'Help other tenants choose wisely' },
    ],
  },
  landlord: {
    headline: 'List your first hostel',
    subtext: 'Manage properties, track bookings, and get paid on time — all from one dashboard.',
    features: [
      { icon: Building2, title: 'List Unlimited Properties', desc: 'Add as many hostels and rooms as you need' },
      { icon: BarChart3, title: 'Track Occupancy & Earnings', desc: 'Real-time analytics on your business' },
      { icon: Wallet, title: 'Get Paid On Time', desc: 'Secure payments straight to your account' },
    ],
  },
};

const ENTRANCE_DURATION_MS = 1200;

function AuthLayout() {
  const location = useLocation();
  const [role, setRoleState] = useState(null);
  const [cardKey, setCardKey] = useState(0);

  // Controls the card entrance state
  const [cardEntered, setCardEntered] = useState(false);
  const [hoverEnabled, setHoverEnabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Replay card entrance on route change
  useEffect(() => {
    setRoleState(null);
    setCardEntered(false);
    setHoverEnabled(false);
    setIsHovered(false);
    setCardKey((k) => k + 1);

    // Two-step: paint initial state, then flip to entered state → triggers CSS transition
    const t0 = setTimeout(() => setCardEntered(true), 50);
    const t1 = setTimeout(() => setHoverEnabled(true), ENTRANCE_DURATION_MS + 100);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
    };
  }, [location.pathname]);

  // Replay card entrance when role is chosen
  const setRole = (newRole) => {
    setCardEntered(false);
    setHoverEnabled(false);
    setIsHovered(false);
    setRoleState(newRole);
    setCardKey((k) => k + 1);

    setTimeout(() => setCardEntered(true), 50);
    setTimeout(() => setHoverEnabled(true), ENTRANCE_DURATION_MS + 100);
  };

  const cardShadow = (hoverEnabled && isHovered)
    ? '0 20px 50px rgba(74, 144, 217, 0.45)'
    : '0 10px 30px rgba(0,0,0,0.5)';

  const content = RIGHT_CONTENT[role] || RIGHT_CONTENT.default;
  const headlineTyped = useLoopTypewriter(content.headline, 90, 40, 2000);

  const words = content.headline.split(' ');
  const goldStart = words.slice(0, -2).join(' ').length + 1;
  const typedWhite = headlineTyped.slice(0, goldStart);
  const typedGold = headlineTyped.slice(goldStart);

  // Card entrance styles driven by state → CSS transitions
  const cardStyle = {
    backgroundColor: '#F4F6F8',
    boxShadow: cardShadow,
    opacity: cardEntered ? 1 : 0,
    transform: cardEntered
      ? 'translateY(0) rotate(0) scale(1)'
      : 'translateY(40px) rotate(-4deg) scale(0.92)',
    transition:
      'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), ' +
      'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), ' +
      'box-shadow 0.4s ease',
  };

  return (
    <AuthRoleContext.Provider value={{ role, setRole }}>
      <div className="min-h-screen flex bg-black">
        {/* Left — Card */}
        <div className="flex-1 flex items-center justify-center p-6 bg-black">
          <div
            key={cardKey}
            className="w-full max-w-md rounded-2xl p-8"
            onMouseEnter={() => { if (hoverEnabled) setIsHovered(true); }}
            onMouseLeave={() => setIsHovered(false)}
            style={cardStyle}
          >
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#14213D' }}>
                <span className="font-bold text-xl" style={{ color: '#E9A23B' }}>H</span>
              </div>
              <CardLogo />
            </Link>

            <Outlet context={{ role, setRole }} />
          </div>
        </div>

        {/* Right — Black panel */}
        <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-black">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full" style={{ backgroundColor: 'rgba(233, 162, 59, 0.06)' }}></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full" style={{ backgroundColor: 'rgba(74, 144, 217, 0.06)' }}></div>

          <div
            key={`right-${cardKey}`}
            className="relative w-full max-w-md"
            style={{
              paddingTop: '96px',
              paddingLeft: '64px',
              paddingRight: '64px',
              opacity: cardEntered ? 1 : 0,
              transition: 'opacity 1s ease-out 0.3s',
            }}
          >
            <div className="mb-4 fade-in-delay-1">
              <span
                className="inline-block px-3 py-1 text-xs font-semibold rounded-full tracking-wider uppercase"
                style={{ backgroundColor: 'rgba(233, 162, 59, 0.15)', color: '#E9A23B' }}
              >
                Trusted Platform
              </span>
            </div>

            <h2 className="text-4xl font-bold mb-5 leading-tight text-white min-h-[4.5rem]">
              <span>{typedWhite}</span>
              <span style={{ color: '#E9A23B' }}>{typedGold}</span>
              <span
                className="inline-block w-[3px] h-[1em] align-middle ml-1 animate-blink"
                style={{ backgroundColor: '#E9A23B' }}
              />
            </h2>

            <p className="text-lg mb-10 leading-relaxed fade-in-delay-2" style={{ color: '#9CA3AF' }}>
              {content.subtext}
            </p>

            <div className="space-y-6">
              {content.features.map((f, idx) => {
                const Icon = f.icon;
                return (
                  <div key={idx} className={`flex items-start gap-4 fade-in-delay-${idx + 3}`}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(233, 162, 59, 0.15)' }}>
                      <Icon size={20} style={{ color: '#E9A23B' }} />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{f.title}</p>
                      <p className="text-sm" style={{ color: '#6B7280' }}>{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AuthRoleContext.Provider>
  );
}

export default AuthLayout;