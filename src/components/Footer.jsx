import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { InstagramIcon, TikTokIcon, FacebookIcon, YouTubeIcon, WhatsAppIcon } from './SocialIcons';

const Footer = () => {
  const [logoSrc, setLogoSrc] = useState('/img/web logo -dark.png');

  return (
    <footer className="bg-[#03204E] text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1 flex flex-col space-y-6">
            <Link to="/" className="inline-block">
              <img 
                src={logoSrc}
                alt="ÉLAN Logo"
                className="h-10 sm:h-14 w-auto object-contain"
                onError={() => setLogoSrc('/img/logo-dark.png')}
              />
            </Link>
            <p className="text-white/80 font-serif text-lg italic">
              Leave Your Mark.
            </p>
            <div className="flex space-x-4 text-white/60">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-white transition-colors p-1">
                <InstagramIcon className="w-5 h-5 fill-current" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok" className="hover:text-white transition-colors p-1">
                <TikTokIcon className="w-5 h-5 fill-current" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-white transition-colors p-1">
                <FacebookIcon className="w-5 h-5 fill-current" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:text-white transition-colors p-1">
                <YouTubeIcon className="w-5 h-5 fill-current" />
              </a>
              <a href="https://wa.me/201132687324" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="hover:text-white transition-colors p-1">
                <WhatsAppIcon className="w-5 h-5 fill-current" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-serif text-lg tracking-wider mb-2">Shop</h3>
            <Link to="/shop" className="text-white/60 hover:text-white transition-colors text-sm">All Fragrances</Link>
            <Link to="/men" className="text-white/60 hover:text-white transition-colors text-sm">Men</Link>
            <Link to="/women" className="text-white/60 hover:text-white transition-colors text-sm">Women</Link>
            <Link to="/offers" className="text-white/60 hover:text-white transition-colors text-sm">Offers</Link>
          </div>

          {/* Company */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-serif text-lg tracking-wider mb-2">Company</h3>
            <Link to="/about" className="text-white/60 hover:text-white transition-colors text-sm">About Us</Link>
            <Link to="/about" className="text-white/60 hover:text-white transition-colors text-sm">Our Story</Link>
          </div>

          {/* Help */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-serif text-lg tracking-wider mb-2">Help</h3>
            <Link to="/policies" className="text-white/60 hover:text-white transition-colors text-sm">Shipping Policy</Link>
            <Link to="/policies" className="text-white/60 hover:text-white transition-colors text-sm">Returns & Refunds</Link>
            <Link to="/policies" className="text-white/60 hover:text-white transition-colors text-sm">Privacy Policy</Link>
            <Link to="/policies" className="text-white/60 hover:text-white transition-colors text-sm">Terms & Conditions</Link>
            <Link to="/policies" className="text-white/60 hover:text-white transition-colors text-sm">FAQ</Link>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1 flex flex-col space-y-4">
            <h3 className="font-serif text-lg tracking-wider mb-2">Stay in the ÉLAN World</h3>
            <p className="text-white/60 text-sm mb-2">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="flex w-full border-b border-white/30 pb-2 focus-within:border-white transition-colors">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-transparent w-full text-sm outline-none text-white placeholder-white/40"
                required
              />
              <button 
                type="submit" 
                className="text-white/60 hover:text-white transition-colors ml-2"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <p>© 2026 ÉLAN. All rights reserved.</p>
          <p className="font-serif italic tracking-wide">Designed to Leave a Mark.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
