import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft, 
  ArrowUp, 
  Check, 
  Mail, 
  MapPin, 
  Phone, 
  ChevronDown, 
  Sparkles,
  PackageCheck
} from 'lucide-react';
import { InstagramIcon, TikTokIcon, FacebookIcon, WhatsAppIcon } from './SocialIcons';
import { getPublicSettings } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const [logoSrc, setLogoSrc] = useState('/img/m20-logo-emerald.png');
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const { t, isRTL } = useLanguage();

  const [socialLinks, setSocialLinks] = useState({
    whatsapp: '201132687324',
    instagram: 'https://instagram.com/m20.perfumes',
    facebook: 'https://facebook.com/m20.perfumes.eg',
    tiktok: 'https://tiktok.com/@m20.perfumes',
    phone: '01132687324'
  });

  useEffect(() => {
    let isMounted = true;
    getPublicSettings()
      .then((settings) => {
        if (!isMounted || !settings) return;
        setSocialLinks({
          whatsapp: settings.socialMedia?.whatsapp || settings.whatsappNumber || '201132687324',
          instagram: settings.socialMedia?.instagram || 'https://instagram.com/m20.perfumes',
          facebook: settings.socialMedia?.facebook || 'https://facebook.com/m20.perfumes.eg',
          tiktok: settings.socialMedia?.tiktok || 'https://tiktok.com/@m20.perfumes',
          phone: settings.socialMedia?.phone || settings.supportPhone || '01132687324'
        });
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanWhatsapp = socialLinks.whatsapp.replace(/[^0-9]/g, '');
  const cleanPhone = socialLinks.phone.replace(/[^0-9+]/g, '');

  return (
    <footer className="relative bg-[#0F3830] text-white border-t border-[#174F43] selection:bg-[#FF9D00] selection:text-[#0F3830] overflow-hidden">
      
      {/* ========================================================
          1. Continuous Moving Brand Typographic Texture (Watermark)
          ======================================================== */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 flex flex-col justify-around py-2 opacity-100"
        aria-hidden="true"
      >
        {/* Track 1: Moving Left */}
        <div className="w-full overflow-hidden">
          <div className="m20-marquee-left whitespace-nowrap">
            <div className="flex items-center gap-7 pr-7 text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-[0.28em] uppercase text-white/[0.05]">
              <span>M20 PARFUMS</span>
              <span className="text-white/[0.03]">•</span>
              <span>CAIRO</span>
              <span className="text-white/[0.03]">•</span>
              <span>EXTRAIT DE PARFUM</span>
              <span className="text-white/[0.03]">•</span>
              <span>LEAVE YOUR MARK</span>
              <span className="text-white/[0.03]">•</span>
              <span>M20</span>
              <span className="text-white/[0.03]">•</span>
              <span>HAUTE PARFUMERIE</span>
              <span className="text-white/[0.03]">•</span>
            </div>
            <div className="flex items-center gap-7 pr-7 text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-[0.28em] uppercase text-white/[0.05]">
              <span>M20 PARFUMS</span>
              <span className="text-white/[0.03]">•</span>
              <span>CAIRO</span>
              <span className="text-white/[0.03]">•</span>
              <span>EXTRAIT DE PARFUM</span>
              <span className="text-white/[0.03]">•</span>
              <span>LEAVE YOUR MARK</span>
              <span className="text-white/[0.03]">•</span>
              <span>M20</span>
              <span className="text-white/[0.03]">•</span>
              <span>HAUTE PARFUMERIE</span>
              <span className="text-white/[0.03]">•</span>
            </div>
          </div>
        </div>

        {/* Track 2: Moving Right */}
        <div className="w-full overflow-hidden">
          <div className="m20-marquee-right whitespace-nowrap">
            <div className="flex items-center gap-7 pr-7 text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-[0.28em] uppercase text-white/[0.045]">
              <span>HAUTE PARFUMERIE</span>
              <span className="text-white/[0.03]">•</span>
              <span>M20</span>
              <span className="text-white/[0.03]">•</span>
              <span>CAIRO</span>
              <span className="text-white/[0.03]">•</span>
              <span>EXTRAIT DE PARFUM</span>
              <span className="text-white/[0.03]">•</span>
              <span>M20 PARFUMS</span>
              <span className="text-white/[0.03]">•</span>
              <span>LEAVE YOUR MARK</span>
              <span className="text-white/[0.03]">•</span>
            </div>
            <div className="flex items-center gap-7 pr-7 text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-[0.28em] uppercase text-white/[0.045]">
              <span>HAUTE PARFUMERIE</span>
              <span className="text-white/[0.03]">•</span>
              <span>M20</span>
              <span className="text-white/[0.03]">•</span>
              <span>CAIRO</span>
              <span className="text-white/[0.03]">•</span>
              <span>EXTRAIT DE PARFUM</span>
              <span className="text-white/[0.03]">•</span>
              <span>M20 PARFUMS</span>
              <span className="text-white/[0.03]">•</span>
              <span>LEAVE YOUR MARK</span>
              <span className="text-white/[0.03]">•</span>
            </div>
          </div>
        </div>

        {/* Track 3: Moving Left */}
        <div className="w-full overflow-hidden">
          <div className="m20-marquee-left whitespace-nowrap">
            <div className="flex items-center gap-7 pr-7 text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-[0.28em] uppercase text-white/[0.05]">
              <span>M20</span>
              <span className="text-white/[0.03]">•</span>
              <span>EXTRAIT DE PARFUM</span>
              <span className="text-white/[0.03]">•</span>
              <span>M20 PARFUMS</span>
              <span className="text-white/[0.03]">•</span>
              <span>CAIRO</span>
              <span className="text-white/[0.03]">•</span>
              <span>LEAVE YOUR MARK</span>
              <span className="text-white/[0.03]">•</span>
              <span>M20</span>
              <span className="text-white/[0.03]">•</span>
              <span>HAUTE PARFUMERIE</span>
              <span className="text-white/[0.03]">•</span>
            </div>
            <div className="flex items-center gap-7 pr-7 text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-[0.28em] uppercase text-white/[0.05]">
              <span>M20</span>
              <span className="text-white/[0.03]">•</span>
              <span>EXTRAIT DE PARFUM</span>
              <span className="text-white/[0.03]">•</span>
              <span>M20 PARFUMS</span>
              <span className="text-white/[0.03]">•</span>
              <span>CAIRO</span>
              <span className="text-white/[0.03]">•</span>
              <span>LEAVE YOUR MARK</span>
              <span className="text-white/[0.03]">•</span>
              <span>M20</span>
              <span className="text-white/[0.03]">•</span>
              <span>HAUTE PARFUMERIE</span>
              <span className="text-white/[0.03]">•</span>
            </div>
          </div>
        </div>

        {/* Track 4: Moving Right */}
        <div className="w-full overflow-hidden">
          <div className="m20-marquee-right whitespace-nowrap">
            <div className="flex items-center gap-7 pr-7 text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-[0.28em] uppercase text-white/[0.045]">
              <span>M20 PARFUMS</span>
              <span className="text-white/[0.03]">•</span>
              <span>LEAVE YOUR MARK</span>
              <span className="text-white/[0.03]">•</span>
              <span>HAUTE PARFUMERIE</span>
              <span className="text-white/[0.03]">•</span>
              <span>M20</span>
              <span className="text-white/[0.03]">•</span>
              <span>CAIRO</span>
              <span className="text-white/[0.03]">•</span>
              <span>EXTRAIT DE PARFUM</span>
              <span className="text-white/[0.03]">•</span>
            </div>
            <div className="flex items-center gap-7 pr-7 text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-[0.28em] uppercase text-white/[0.045]">
              <span>M20 PARFUMS</span>
              <span className="text-white/[0.03]">•</span>
              <span>LEAVE YOUR MARK</span>
              <span className="text-white/[0.03]">•</span>
              <span>HAUTE PARFUMERIE</span>
              <span className="text-white/[0.03]">•</span>
              <span>M20</span>
              <span className="text-white/[0.03]">•</span>
              <span>CAIRO</span>
              <span className="text-white/[0.03]">•</span>
              <span>EXTRAIT DE PARFUM</span>
              <span className="text-white/[0.03]">•</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. Compact Newsletter Section ("THE M20 PRIVÉ")
          ======================================================== */}
      <div className="relative border-b border-white/10 bg-transparent z-10">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 py-5 sm:py-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
            
            {/* Newsletter Editorial Intro */}
            <div className={`lg:col-span-6 space-y-1 text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}>
              <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[9px] uppercase tracking-[0.25em] text-[#FF9D00] font-semibold ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Sparkles size={10} className="text-[#FF9D00]" />
                <span>{t('footer.priveTag', 'THE M20 PRIVÉ')}</span>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-serif tracking-tight text-white uppercase">
                {t('footer.joinTitle', 'JOIN THE MAISON')}
              </h3>
              <p className={`text-xs text-slate-300/85 font-light max-w-lg mx-auto ${isRTL ? 'lg:mr-0' : 'lg:ml-0'} leading-relaxed`}>
                {t('footer.joinDesc', 'Receive private invitations to new extraits de parfum, limited releases, and exclusive member privileges.')}
              </p>
            </div>

            {/* Newsletter Subscription Form */}
            <div className="lg:col-span-6">
              {isSubscribed ? (
                <div className={`flex items-center justify-center ${isRTL ? 'lg:justify-end space-x-reverse space-x-2' : 'lg:justify-start space-x-2'} text-xs text-white bg-white/10 border border-[#FF9D00] p-3 rounded-sm`}>
                  <Check size={14} className="text-[#FF9D00] flex-shrink-0" />
                  <span className="font-medium text-slate-100">{t('footer.subSuccess', 'Thank you for subscribing to M20. Your journey begins here.')}</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto lg:max-w-none">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('footer.emailPlaceholder', 'Enter your email address')}
                      required
                      className={`w-full bg-white/[0.07] border border-white/20 text-white placeholder-slate-400 text-xs px-3.5 py-2.5 rounded-sm outline-none focus:border-[#FF9D00] focus:bg-white/[0.12] transition-colors ${isRTL ? 'text-right' : 'text-center sm:text-left'}`}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className={`inline-flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} bg-[#FF9D00] hover:bg-[#E68D00] text-[#0F3830] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] transition-colors rounded-sm flex-shrink-0 cursor-pointer`}
                  >
                    <span>{t('footer.subscribe', 'SUBSCRIBE')}</span>
                    <span>
                      {isRTL ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
                    </span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================
          3. Main Content Section (Restored Logo & Compact Columns)
          ======================================================== */}
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 py-6 sm:py-8 relative z-10 bg-transparent">
        
        {/* ----------------------------------------------------
            A. MOBILE VIEW (block md:hidden)
            ---------------------------------------------------- */}
        <div className="block md:hidden space-y-6">
          
          {/* Brand Header with Restored Original Logo */}
          <div className="text-center space-y-2">
            <Link 
              to="/" 
              className="inline-flex bg-[#F4F3EF] px-3 py-1.5 rounded-sm shadow-xs hover:opacity-95 transition-opacity mx-auto" 
              aria-label="M20 Home"
            >
              <img 
                src={logoSrc}
                alt="M20 Fine Fragrances"
                className="h-8 w-auto object-contain"
                onError={() => setLogoSrc('/img/m20-logo.png')}
              />
            </Link>

            <p className="text-xs text-slate-300/85 font-light leading-relaxed max-w-xs mx-auto">
              {t('footer.brandDesc', 'An artisanal Egyptian fragrance house dedicated to creating distinctive, long-lasting perfumes in Cairo.')}
            </p>
          </div>

          {/* Quick Contact Interactive Pills Grid */}
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <a
              href={`https://wa.me/${cleanWhatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 py-2 px-2.5 rounded-sm bg-white/[0.05] border border-white/10 hover:border-[#25D366] text-xs text-slate-200 transition-colors"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 fill-[#25D366]" />
              <span className="font-medium text-[11px]">{t('footer.whatsapp', 'WhatsApp')}</span>
            </a>

            <a
              href={`tel:${cleanPhone}`}
              className="flex items-center justify-center gap-2 py-2 px-2.5 rounded-sm bg-white/[0.05] border border-white/10 hover:border-[#FF9D00] text-xs text-slate-200 transition-colors"
            >
              <Phone size={12} className="text-[#FF9D00]" />
              <span className="font-medium text-[11px]">{t('footer.callUs', 'Call Us')}</span>
            </a>

            <a
              href="mailto:contact@m20fragrance.com"
              className="flex items-center justify-center gap-2 py-2 px-2.5 rounded-sm bg-white/[0.05] border border-white/10 hover:border-[#FF9D00] text-xs text-slate-200 transition-colors"
            >
              <Mail size={12} className="text-[#FF9D00]" />
              <span className="font-medium text-[11px]">{t('footer.emailUs', 'Email')}</span>
            </a>

            <div className="flex items-center justify-center gap-2 py-2 px-2.5 rounded-sm bg-white/[0.03] border border-white/10 text-xs text-slate-300">
              <MapPin size={12} className="text-[#FF9D00]" />
              <span className="font-medium text-[11px]">{t('footer.cairoEgypt', 'Cairo, Egypt')}</span>
            </div>
          </div>

          {/* Social Icons Bar */}
          <div className="text-center pt-0.5">
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#FF9D00] block mb-2 font-semibold">
              {t('footer.followUs', 'FOLLOW OUR JOURNEY')}
            </span>
            <div className="flex items-center justify-center gap-2.5">
              <a 
                href={socialLinks.facebook} 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Facebook" 
                className="w-8 h-8 rounded-full border border-white/15 bg-white/5 hover:bg-[#FF9D00] hover:text-[#0F3830] hover:border-[#FF9D00] transition-colors flex items-center justify-center"
              >
                <FacebookIcon className="w-3.5 h-3.5 fill-current" />
              </a>
              <a 
                href={socialLinks.instagram} 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Instagram" 
                className="w-8 h-8 rounded-full border border-white/15 bg-white/5 hover:bg-[#FF9D00] hover:text-[#0F3830] hover:border-[#FF9D00] transition-colors flex items-center justify-center"
              >
                <InstagramIcon className="w-3.5 h-3.5 fill-current" />
              </a>
              <a 
                href={socialLinks.tiktok} 
                target="_blank" 
                rel="noreferrer" 
                aria-label="TikTok" 
                className="w-8 h-8 rounded-full border border-white/15 bg-white/5 hover:bg-[#FF9D00] hover:text-[#0F3830] hover:border-[#FF9D00] transition-colors flex items-center justify-center"
              >
                <TikTokIcon className="w-3.5 h-3.5 fill-current" />
              </a>
              <a 
                href={`https://wa.me/${cleanWhatsapp}`} 
                target="_blank" 
                rel="noreferrer" 
                aria-label="WhatsApp" 
                className="w-8 h-8 rounded-full border border-white/15 bg-white/5 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors flex items-center justify-center"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
              </a>
            </div>
          </div>

          {/* Accordion Navigation for Mobile */}
          <div className="border-t border-b border-white/10 divide-y divide-white/10 pt-0.5">
            
            {/* Accordion 1: Collections */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('collections')}
                className={`w-full py-2.5 flex items-center justify-between ${isRTL ? 'text-right' : 'text-left'} text-xs uppercase tracking-[0.2em] font-semibold text-white cursor-pointer select-none`}
              >
                <span>{t('footer.collections', 'COLLECTIONS')}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${openSection === 'collections' ? 'rotate-180 text-[#FF9D00]' : 'text-slate-400'}`}
                />
              </button>
              {openSection === 'collections' && (
                <div className={`pb-2.5 space-y-2 text-xs text-slate-300 font-light flex flex-col ${isRTL ? 'pr-2' : 'pl-2'}`}>
                  <Link to="/shop" className="hover:text-white transition-colors py-0.5">{t('footer.allFragrances', 'All Fragrances')}</Link>
                  <Link to="/men" className="hover:text-white transition-colors py-0.5">{t('footer.forHim', 'For Him')}</Link>
                  <Link to="/women" className="hover:text-white transition-colors py-0.5">{t('footer.forHer', 'For Her')}</Link>
                  <Link to="/offers" className="hover:text-white transition-colors py-0.5 flex items-center gap-2">
                    <span>{t('footer.specialOffers', 'Special Offers')}</span>
                    <span className="text-[9px] uppercase tracking-wider bg-[#FF9D00]/20 text-[#FF9D00] px-1.5 py-0.5 rounded-full border border-[#FF9D00]/30">{t('common.sale', 'Sale')}</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Accordion 2: The Maison */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('maison')}
                className={`w-full py-2.5 flex items-center justify-between ${isRTL ? 'text-right' : 'text-left'} text-xs uppercase tracking-[0.2em] font-semibold text-white cursor-pointer select-none`}
              >
                <span>{t('footer.theMaison', 'THE MAISON')}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${openSection === 'maison' ? 'rotate-180 text-[#FF9D00]' : 'text-slate-400'}`}
                />
              </button>
              {openSection === 'maison' && (
                <div className={`pb-2.5 space-y-2 text-xs text-slate-300 font-light flex flex-col ${isRTL ? 'pr-2' : 'pl-2'}`}>
                  <Link to="/about" className="hover:text-white transition-colors py-0.5">{t('footer.aboutM20', 'About M20')}</Link>
                  <Link to="/about" className="hover:text-white transition-colors py-0.5">{t('footer.storyHeritage', 'Our Story & Heritage')}</Link>
                  <Link to="/about" className="hover:text-white transition-colors py-0.5">{t('footer.craftsmanship', 'Artisanal Craftsmanship')}</Link>
                  <Link to="/policies" className="hover:text-white transition-colors py-0.5">{t('footer.sustainability', 'Sustainability & Quality')}</Link>
                </div>
              )}
            </div>

            {/* Accordion 3: Client Services */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('services')}
                className={`w-full py-2.5 flex items-center justify-between ${isRTL ? 'text-right' : 'text-left'} text-xs uppercase tracking-[0.2em] font-semibold text-white cursor-pointer select-none`}
              >
                <span>{t('footer.clientServices', 'CLIENT SERVICES')}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${openSection === 'services' ? 'rotate-180 text-[#FF9D00]' : 'text-slate-400'}`}
                />
              </button>
              {openSection === 'services' && (
                <div className={`pb-2.5 space-y-2 text-xs text-slate-300 font-light flex flex-col ${isRTL ? 'pr-2' : 'pl-2'}`}>
                  <Link to="/track-order" className="text-[#FF9D00] hover:text-amber-300 transition-colors py-0.5 font-semibold flex items-center gap-1.5">
                    <PackageCheck size={13} />
                    <span>{t('footer.trackOrder', 'Track Your Order')}</span>
                  </Link>
                  <Link to="/policies" className="hover:text-white transition-colors py-0.5">{t('footer.shippingPolicy', 'Shipping Policy')}</Link>
                  <Link to="/policies" className="hover:text-white transition-colors py-0.5">{t('footer.returnsRefunds', 'Returns & Refunds')}</Link>
                  <Link to="/policies" className="hover:text-white transition-colors py-0.5">{t('footer.privacyTerms', 'Privacy & Terms')}</Link>
                  <Link to="/policies" className="hover:text-white transition-colors py-0.5">{t('footer.faqAssistance', 'FAQ & Assistance')}</Link>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* ----------------------------------------------------
            B. DESKTOP VIEW (hidden md:grid)
            ---------------------------------------------------- */}
        <div className={`hidden md:grid md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8 mb-5 ${isRTL ? 'text-right' : 'text-left'}`}>
          
          {/* Brand Column with Restored Original Logo */}
          <div className={`lg:col-span-2 flex flex-col space-y-3 ${isRTL ? 'pl-0 lg:pl-6 text-right' : 'pr-0 lg:pr-6 text-left'}`}>
            
            {/* Restored Original Logo Card */}
            <div>
              <Link 
                to="/" 
                className="inline-flex w-fit bg-[#F4F3EF] px-3 py-1.5 rounded-sm shadow-xs hover:opacity-95 transition-opacity" 
                aria-label="M20 Home"
              >
                <img 
                  src={logoSrc}
                  alt="M20 Fine Fragrances"
                  className="h-8 sm:h-9 w-auto object-contain"
                  onError={() => setLogoSrc('/img/m20-logo.png')}
                />
              </Link>
            </div>
            
            <p className="text-xs text-slate-300/85 font-light leading-relaxed max-w-sm">
              {t('footer.brandDesc', 'An artisanal Egyptian fragrance house dedicated to creating distinctive, long-lasting perfumes in Cairo.')}
            </p>

            {/* Interactive Contact Items */}
            <div className="pt-0.5 space-y-1.5 text-xs text-slate-400 font-light">
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} hover:text-slate-200 transition-colors`}>
                <MapPin size={13} className="text-[#FF9D00] flex-shrink-0" />
                <span>{t('footer.cairoEgypt', 'Cairo, Egypt')}</span>
              </div>

              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                <Mail size={13} className="text-[#FF9D00] flex-shrink-0" />
                <a 
                  href="mailto:contact@m20fragrance.com" 
                  className="hover:text-white transition-colors duration-150 hover:underline decoration-[#FF9D00] underline-offset-4"
                >
                  contact@m20fragrance.com
                </a>
              </div>

              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                <Phone size={13} className="text-[#FF9D00] flex-shrink-0" />
                <a 
                  href={`tel:${cleanPhone}`} 
                  className="hover:text-white transition-colors duration-150 hover:underline decoration-[#FF9D00] underline-offset-4 font-mono text-[11px]"
                >
                  {socialLinks.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Column 1: Collections */}
          <div className="flex flex-col space-y-2.5">
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
                {t('footer.collections', 'COLLECTIONS')}
              </h4>
              <div className={`mt-1 h-[2px] bg-[#FF9D00] w-5 rounded-full ${isRTL ? 'mr-0 ml-auto' : ''}`} />
            </div>

            <div className="flex flex-col space-y-1.5 text-xs text-slate-300 font-light">
              <Link to="/shop" className="hover:text-white transition-colors py-0.5">{t('footer.allFragrances', 'All Fragrances')}</Link>
              <Link to="/men" className="hover:text-white transition-colors py-0.5">{t('footer.forHim', 'For Him')}</Link>
              <Link to="/women" className="hover:text-white transition-colors py-0.5">{t('footer.forHer', 'For Her')}</Link>
              <Link to="/offers" className="hover:text-white transition-colors py-0.5 flex items-center gap-1.5">
                <span>{t('footer.specialOffers', 'Special Offers')}</span>
                <span className="text-[9px] uppercase tracking-wider bg-[#FF9D00]/20 text-[#FF9D00] px-1.5 py-0.2 rounded-full border border-[#FF9D00]/30">{t('common.sale', 'Sale')}</span>
              </Link>
            </div>
          </div>

          {/* Navigation Column 2: The Maison */}
          <div className="flex flex-col space-y-2.5">
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
                {t('footer.theMaison', 'THE MAISON')}
              </h4>
              <div className={`mt-1 h-[2px] bg-[#FF9D00] w-5 rounded-full ${isRTL ? 'mr-0 ml-auto' : ''}`} />
            </div>

            <div className="flex flex-col space-y-1.5 text-xs text-slate-300 font-light">
              <Link to="/about" className="hover:text-white transition-colors py-0.5">{t('footer.aboutM20', 'About M20')}</Link>
              <Link to="/about" className="hover:text-white transition-colors py-0.5">{t('footer.storyHeritage', 'Our Story & Heritage')}</Link>
              <Link to="/about" className="hover:text-white transition-colors py-0.5">{t('footer.craftsmanship', 'Artisanal Craftsmanship')}</Link>
              <Link to="/policies" className="hover:text-white transition-colors py-0.5">{t('footer.sustainability', 'Sustainability & Quality')}</Link>
            </div>
          </div>

          {/* Navigation Column 3: Client Services & Socials */}
          <div className="flex flex-col space-y-2.5">
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
                {t('footer.clientServices', 'CLIENT SERVICES')}
              </h4>
              <div className={`mt-1 h-[2px] bg-[#FF9D00] w-5 rounded-full ${isRTL ? 'mr-0 ml-auto' : ''}`} />
            </div>

            <div className="flex flex-col space-y-1.5 text-xs text-slate-300 font-light">
              <Link to="/track-order" className="text-[#FF9D00] hover:text-amber-300 font-medium transition-colors py-0.5 flex items-center gap-1.5">
                <PackageCheck size={13} className="flex-shrink-0" />
                <span>{t('footer.trackOrder', 'Track Your Order')}</span>
              </Link>
              <Link to="/policies" className="hover:text-white transition-colors py-0.5">{t('footer.shippingPolicy', 'Shipping Policy')}</Link>
              <Link to="/policies" className="hover:text-white transition-colors py-0.5">{t('footer.returnsRefunds', 'Returns & Refunds')}</Link>
              <Link to="/policies" className="hover:text-white transition-colors py-0.5">{t('footer.privacyTerms', 'Privacy & Terms')}</Link>
              <Link to="/policies" className="hover:text-white transition-colors py-0.5">{t('footer.faqAssistance', 'FAQ & Assistance')}</Link>
            </div>

            {/* Social Icons Bar (Desktop) */}
            <div className="pt-1">
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#FF9D00] block mb-1.5 font-semibold">
                {t('footer.followUs', 'Follow Us')}
              </span>
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                <a 
                  href={socialLinks.facebook} 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="Facebook" 
                  className="w-7 h-7 rounded-full border border-white/15 bg-white/5 hover:bg-[#FF9D00] hover:text-[#0F3830] hover:border-[#FF9D00] transition-colors flex items-center justify-center cursor-pointer"
                >
                  <FacebookIcon className="w-3 h-3 fill-current" />
                </a>
                <a 
                  href={socialLinks.instagram} 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="Instagram" 
                  className="w-7 h-7 rounded-full border border-white/15 bg-white/5 hover:bg-[#FF9D00] hover:text-[#0F3830] hover:border-[#FF9D00] transition-colors flex items-center justify-center cursor-pointer"
                >
                  <InstagramIcon className="w-3 h-3 fill-current" />
                </a>
                <a 
                  href={socialLinks.tiktok} 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="TikTok" 
                  className="w-7 h-7 rounded-full border border-white/15 bg-white/5 hover:bg-[#FF9D00] hover:text-[#0F3830] hover:border-[#FF9D00] transition-colors flex items-center justify-center cursor-pointer"
                >
                  <TikTokIcon className="w-3 h-3 fill-current" />
                </a>
                <a 
                  href={`https://wa.me/${cleanWhatsapp}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="WhatsApp" 
                  className="w-7 h-7 rounded-full border border-white/15 bg-white/5 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors flex items-center justify-center cursor-pointer"
                >
                  <WhatsAppIcon className="w-3 h-3 fill-current" />
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================
            4. Compact Bottom Bar (Copyright, Tagline, Legal Links)
            ======================================================== */}
        <div className="relative pt-3 border-t border-white/10">
          <div className={`flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-slate-400 font-light ${isRTL ? 'md:text-right' : 'md:text-left'}`}>
            
            {/* Copyright & Tagline */}
            <div className={`flex flex-col sm:flex-row items-center gap-2 sm:gap-3 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <p>© {new Date().getFullYear()} M20. {t('footer.rights', 'All rights reserved.')}</p>
              <span className="hidden sm:inline text-white/20">•</span>
              <p className="text-[#FF9D00] font-serif italic text-xs sm:text-sm font-semibold tracking-wide">
                {t('common.leaveYourMark', 'Leave your mark.')}
              </p>
            </div>

            {/* Legal Links & Scroll to Top Button */}
            <div className={`flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Link 
                to="/policies" 
                className="hover:text-white transition-colors duration-150 hover:underline decoration-[#FF9D00] underline-offset-4"
              >
                {t('footer.privacyPolicy', 'Privacy Policy')}
              </Link>
              <span className="text-white/20">•</span>
              <Link 
                to="/policies" 
                className="hover:text-white transition-colors duration-150 hover:underline decoration-[#FF9D00] underline-offset-4"
              >
                {t('footer.termsOfService', 'Terms of Service')}
              </Link>
              <span className="text-white/20">•</span>
              <Link 
                to="/policies" 
                className="hover:text-white transition-colors duration-150 hover:underline decoration-[#FF9D00] underline-offset-4"
              >
                {t('footer.shippingDetails', 'Shipping Details')}
              </Link>
              
              {/* Back to Top Pill */}
              <button
                type="button"
                onClick={scrollToTop}
                aria-label="Back to Top"
                className="group inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 hover:bg-[#FF9D00] text-slate-300 hover:text-[#0F3830] border border-white/10 hover:border-[#FF9D00] text-[10px] font-semibold tracking-wider uppercase transition-colors cursor-pointer"
              >
                <span>TOP</span>
                <ArrowUp size={10} className="group-hover:-translate-y-0.5 transition-transform duration-150" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
