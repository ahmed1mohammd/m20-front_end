import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  ChevronRight,
  Globe,
  Home,
  Sparkles,
  Tag,
  PackageSearch,
  Info,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, setIsCartOpen } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { lang, toggleLanguage, t, isRTL } = useLanguage();

  // Close drawer on route change and lock background scroll while open
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: t('nav.home', 'Home'), path: '/', icon: Home },
    { name: t('nav.men', 'For Him'), path: '/men', icon: Sparkles },
    { name: t('nav.women', 'For Her'), path: '/women', icon: Sparkles },
    { name: t('nav.offers', 'Offers'), path: '/offers', icon: Tag },
    { name: t('nav.trackOrder', 'Track Order'), path: '/track-order', icon: PackageSearch },
    { name: t('nav.about', 'About M20'), path: '/about', icon: Info }
  ];

  const handleImageError = (e) => {
    e.target.src = '/img/m20-logo.png';
  };

  const handleUserClick = () => {
    if (isAuthenticated) {
      navigate('/account');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <header className="sticky top-0 w-full z-40 bg-[#F4F3EF]/95 backdrop-blur-md border-b border-[#174F43]/10">
        <nav className="max-w-[1240px] mx-auto px-4 sm:px-6" aria-label="Main navigation">
          <div className="grid grid-cols-[1fr_auto_1fr] md:flex md:justify-between items-center h-16 md:h-20 py-2">
            
            {/* Mobile menu trigger */}
            <div className="flex items-center justify-self-start md:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="w-10 h-10 inline-flex items-center justify-center rounded-sm border border-[#174F43]/15 bg-white/80 text-[#174F43] hover:border-[#174F43] active:scale-95 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#174F43]"
                aria-label="Open navigation menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-nav-drawer"
              >
                <Menu size={20} strokeWidth={1.75} />
              </button>
            </div>

            {/* Logo (centered on mobile, start on desktop) */}
            <div className="flex-shrink-0 flex items-center justify-self-center md:justify-self-auto md:justify-start">
              <Link to="/" className="flex items-center py-1" aria-label="M20 Home">
                <img 
                  src="/img/m20-logo-emerald.png" 
                  alt="M20 Fine Fragrances" 
                  className="h-10 sm:h-11 md:h-12 lg:h-14 w-auto object-contain transition-transform duration-150 hover:scale-105 drop-shadow-xs"
                  onError={handleImageError}
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-1 justify-center items-center">
              <div className={`flex ${isRTL ? 'space-x-reverse space-x-7 lg:space-x-9' : 'space-x-7 lg:space-x-9'}`}>
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`text-xs uppercase tracking-widest py-2 transition-colors duration-150 ${
                        isActive 
                          ? 'text-[#174F43] border-b-2 border-[#174F43] font-semibold' 
                          : 'text-slate-600 hover:text-[#174F43] font-medium'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Action Icons & Desktop Utilities */}
            <div className={`flex items-center justify-self-end justify-end ${isRTL ? 'space-x-reverse space-x-1 sm:space-x-3' : 'space-x-1 sm:space-x-3'}`}>
              
              {/* Language Switcher Pill (Desktop) */}
              <button
                type="button"
                onClick={toggleLanguage}
                title={lang === 'en' ? 'التحويل إلى العربية' : 'Switch to English'}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#174F43]/20 bg-white/80 hover:bg-[#174F43]/5 text-xs font-semibold text-[#174F43] transition-all cursor-pointer shadow-2xs select-none active:scale-95"
                aria-label="Toggle language"
              >
                <Globe size={13} className="text-[#174F43]/70" />
                <span className="text-[11px] uppercase tracking-wider">{lang === 'en' ? 'AR' : 'EN'}</span>
              </button>

              {/* Search Icon */}
              <button 
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`w-10 h-10 md:w-auto md:h-auto inline-flex items-center justify-center md:p-2 transition-colors duration-150 rounded-sm cursor-pointer ${
                  isSearchOpen ? 'text-[#FF9D00]' : 'text-[#174F43] hover:text-slate-600'
                }`}
                aria-label="Open search input"
                aria-expanded={isSearchOpen}
              >
                <Search size={19} strokeWidth={1.65} />
              </button>
              
              {/* Account Icon (Desktop — mobile accesses account in clean drawer) */}
              <button 
                type="button"
                onClick={handleUserClick}
                className="hidden md:flex text-[#174F43] hover:text-slate-600 p-2 transition-colors duration-150 items-center space-x-1.5 rounded-sm cursor-pointer"
                aria-label={isAuthenticated ? `Account: ${user?.name}` : t('nav.signIn', 'Sign In')}
                title={isAuthenticated ? `Account: ${user?.name}` : t('nav.signIn', 'Sign In')}
              >
                <User size={19} strokeWidth={1.65} />
                {isAuthenticated && (
                  <span className="hidden lg:inline text-[11px] font-semibold tracking-wider uppercase max-w-[80px] truncate text-[#174F43]">
                    {user.name.split(' ')[0]}
                  </span>
                )}
              </button>
              
              {/* Shopping Bag */}
              <button 
                type="button"
                onClick={() => setIsCartOpen(true)} 
                className="w-10 h-10 md:w-auto md:h-auto inline-flex items-center justify-center md:p-2 text-[#174F43] hover:text-slate-600 transition-colors duration-150 relative rounded-sm cursor-pointer" 
                aria-label={`Shopping bag containing ${cartCount} items`}
              >
                <ShoppingBag size={19} strokeWidth={1.65} />
                {cartCount > 0 && (
                  <span className="absolute top-1 end-0.5 md:-top-0.5 md:-end-0.5 bg-[#FF9D00] text-[#0F3830] text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center shadow-2xs">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Search Input Bar */}
        {isSearchOpen && (
          <div className="border-t border-slate-200/80 bg-white/95 backdrop-blur-md py-3.5 px-4 shadow-sm animate-fade-in">
            <div className="max-w-[720px] mx-auto">
              <form onSubmit={handleSearch} className="relative flex items-center">
                <input
                  type="text"
                  placeholder={t('nav.searchPlaceholder', 'Search fragrances by name, family, notes...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full border border-slate-200 rounded-sm py-2.5 ${isRTL ? 'pr-3 pl-10 text-right' : 'pl-3 pr-10 text-left'} text-xs sm:text-sm focus:outline-none focus:border-[#174F43] bg-[#F4F3EF]/60 text-slate-900 placeholder-slate-400`}
                  autoFocus
                />
                <button 
                  type="submit" 
                  className={`absolute ${isRTL ? 'left-1' : 'right-1'} top-1/2 -translate-y-1/2 text-[#174F43] hover:text-[#FF9D00] p-2 cursor-pointer`}
                  aria-label="Submit search"
                >
                  <ChevronRight size={18} strokeWidth={1.75} className={isRTL ? 'rotate-180' : ''} />
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Modern Mobile Slide-Over Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#0F3830]/45 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over panel */}
          <aside
            id="mobile-nav-drawer"
            className={`fixed inset-y-0 start-0 w-[85%] max-w-[340px] bg-[#F4F3EF] shadow-2xl flex flex-col justify-between overflow-y-auto border-e border-slate-200/80 ${
              isRTL ? 'text-right' : 'text-left'
            }`}
          >
            {/* Top section: Header + Language + Nav Links */}
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-slate-200/80">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center"
                  aria-label="M20 Home"
                >
                  <img
                    src="/img/m20-logo-emerald.png"
                    alt="M20 Fine Fragrances"
                    className="h-9 w-auto object-contain"
                    onError={handleImageError}
                  />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-9 h-9 inline-flex items-center justify-center rounded-full border border-slate-200 bg-[#F4F3EF] text-[#174F43] hover:bg-[#174F43] hover:text-white transition-colors cursor-pointer"
                  aria-label="Close navigation menu"
                >
                  <X size={18} strokeWidth={1.75} />
                </button>
              </div>

              {/* Language & Bag Quick Bar */}
              <div className="px-5 py-3.5 flex items-center justify-between gap-2 border-b border-slate-200/60 bg-white/50">
                <div className="inline-flex rounded-sm border border-[#174F43]/15 bg-white p-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (lang !== 'en') toggleLanguage();
                    }}
                    className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer ${
                      lang === 'en' ? 'bg-[#174F43] text-white' : 'text-slate-600 hover:text-[#174F43]'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (lang !== 'ar') toggleLanguage();
                    }}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-sm transition-colors cursor-pointer ${
                      lang === 'ar' ? 'bg-[#174F43] text-white' : 'text-slate-600 hover:text-[#174F43]'
                    }`}
                  >
                    العربية
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-white border border-slate-200 text-xs font-medium text-[#174F43] hover:border-[#174F43] transition-colors cursor-pointer"
                >
                  <ShoppingBag size={14} className="text-[#FF9D00]" />
                  <span>{lang === 'ar' ? 'الحقيبة' : 'Bag'}</span>
                  <span className="bg-[#174F43] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {cartCount}
                  </span>
                </button>
              </div>

              {/* Navigation Links */}
              <div className="px-3.5 py-4 space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-sm transition-all ${
                        isActive
                          ? 'bg-white text-[#174F43] font-semibold border-s-3 border-[#FF9D00] shadow-2xs'
                          : 'text-slate-700 hover:bg-white/70 hover:text-[#174F43] font-medium'
                      }`}
                    >
                      <span className="flex items-center gap-3 text-xs uppercase tracking-widest">
                        <Icon
                          size={16}
                          strokeWidth={1.75}
                          className={isActive ? 'text-[#FF9D00]' : 'text-[#174F43]/70'}
                        />
                        <span>{link.name}</span>
                      </span>
                      <ChevronRight
                        size={15}
                        className={`${isActive ? 'text-[#FF9D00]' : 'text-slate-400'} ${isRTL ? 'rotate-180' : ''}`}
                      />
                    </Link>
                  );
                })}

                <Link
                  to="/policies"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-sm transition-all ${
                    location.pathname === '/policies'
                      ? 'bg-white text-[#174F43] font-semibold border-s-3 border-[#FF9D00] shadow-2xs'
                      : 'text-slate-600 hover:bg-white/70 hover:text-[#174F43] font-medium'
                  }`}
                >
                  <span className="flex items-center gap-3 text-xs uppercase tracking-widest">
                    <HelpCircle size={16} strokeWidth={1.75} className="text-[#174F43]/70" />
                    <span>{t('nav.policies', 'Client Services & FAQ')}</span>
                  </span>
                  <ChevronRight size={15} className={`text-slate-400 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
              </div>
            </div>

            {/* Bottom Account Card */}
            <div className="p-4 border-t border-slate-200/80 bg-white">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/account');
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-sm bg-[#F4F3EF] border border-[#174F43]/15 hover:border-[#174F43] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#174F43] text-white flex items-center justify-center text-xs font-bold uppercase shrink-0">
                      {(user?.name || 'M')[0]}
                    </div>
                    <div className={`min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <p className="text-xs font-semibold text-[#174F43] truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500">{t('nav.myAccount', 'My Account')}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className={`text-[#174F43] shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-sm bg-[#174F43] hover:bg-[#0F3830] text-white text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer"
                >
                  <User size={15} />
                  <span>{t('nav.signIn', 'Sign In')}</span>
                  <ArrowRight size={14} className={isRTL ? 'rotate-180' : ''} />
                </button>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Navbar;
