import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Men', path: '/men' },
    { name: 'Women', path: '/women' },
    { name: 'Offers', path: '/offers' },
    { name: 'About', path: '/about' }
  ];

  const handleImageError = (e) => {
    e.target.src = '/img/logo-light.png';
  };

  return (
    <>
      <nav className={`sticky top-0 w-full z-50 transition-all duration-300 bg-white ${isScrolled ? 'shadow-sm border-b border-slate-100' : 'border-b border-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden z-20">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-[#03204E] hover:text-slate-600 focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
              </button>
            </div>

            {/* Left - Logo */}
            <div className="flex-shrink-0 flex items-center justify-center md:justify-start absolute md:static left-1/2 -translate-x-1/2 md:translate-x-0 z-10 w-auto">
              <Link to="/" className="flex items-center">
                <img 
                  src="/img/web logo -light.png" 
                  alt="ÉLAN" 
                  className="h-10 sm:h-12 object-contain"
                  onError={handleImageError}
                />
              </Link>
            </div>

            {/* Center - Desktop Nav */}
            <div className="hidden md:flex flex-1 justify-center items-center">
              <div className="flex space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-xs uppercase tracking-widest py-2 transition-colors ${
                      location.pathname === link.path 
                        ? 'text-[#03204E] border-b border-[#03204E] font-medium' 
                        : 'text-slate-500 hover:text-[#03204E]'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right - Icons */}
            <div className="flex items-center justify-end space-x-4 sm:space-x-6 z-20 md:w-auto">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-[#03204E] hover:text-slate-600 transition-colors"
                aria-label="Search"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>
              
              <Link to="/account" className="text-[#03204E] hover:text-slate-600 transition-colors hidden sm:block" aria-label="Account">
                <User size={20} strokeWidth={1.5} />
              </Link>
              
              <button onClick={() => setIsCartOpen(true)} className="text-[#03204E] hover:text-slate-600 transition-colors relative" aria-label="Cart">
                <ShoppingBag size={20} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#03204E] text-white text-[9px] font-medium h-4 w-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Drawer */}
        <div 
          className={`absolute top-full left-0 w-full bg-white border-b border-slate-100 transition-all duration-300 overflow-hidden ${
            isSearchOpen ? 'max-h-32 py-4' : 'max-h-0 py-0'
          }`}
        >
          <div className="max-w-3xl mx-auto px-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search fragrances..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-b border-slate-200 py-2 pl-2 pr-10 text-sm focus:outline-none focus:border-[#03204E] bg-transparent transition-colors text-slate-800 placeholder-slate-400"
                autoFocus={isSearchOpen}
              />
              <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#03204E] p-2">
                <ChevronRight size={20} strokeWidth={1.5} />
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-white transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-screen border-b border-slate-100 shadow-sm' : 'max-h-0'
        }`}>
          <div className="px-4 py-6 space-y-4 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-xs uppercase tracking-widest py-3 border-b border-slate-50 transition-colors ${
                  location.pathname === link.path 
                    ? 'text-[#03204E] font-medium' 
                    : 'text-slate-500'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/account"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest py-3 text-slate-500 hover:text-[#03204E] flex items-center space-x-3"
            >
              <User size={16} strokeWidth={1.5} />
              <span>Account</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
