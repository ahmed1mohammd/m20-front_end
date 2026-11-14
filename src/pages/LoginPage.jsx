import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  User, 
  Phone, 
  Mail, 
  Lock, 
  CheckCircle2, 
  ShieldCheck, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  Globe
} from 'lucide-react';
import SEO from '../components/SEO';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  const { 
    isAuthenticated, 
    login, 
    requestOtp,
    register, 
    verifyOtp, 
    resendOtp,
    pendingEmail,
    setPendingEmail
  } = useAuth();

  const { lang, isRTL, dir, setLang, toggleLang, t } = useLanguage();

  const [activeTab, setActiveTab] = useState(initialMode); // 'login', 'register', or 'otp'
  const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' | 'password'
  const [otpOriginTab, setOtpOriginTab] = useState('login');
  
  // Login fields
  const [loginEmailOtp, setLoginEmailOtp] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // OTP fields
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpInputRefs = useRef([]);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isAuthenticated && activeTab !== 'otp') {
      const target = location.state?.from?.pathname || '/account';
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, activeTab, navigate, location]);

  useEffect(() => {
    let interval = null;
    if (activeTab === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab, resendTimer]);

  const enterOtpStage = ({ email, cooldown = 60, origin = 'login', message }) => {
    setPendingEmail(email);
    setOtpOriginTab(origin);
    setOtpDigits(['', '', '', '', '', '']);
    setActiveTab('otp');
    setResendTimer(cooldown);
    setCanResend(cooldown <= 0);
    setSuccessMsg(
      message ||
        (isRTL
          ? `تم إرسال رمز تحقق مكون من 6 أرقام إلى ${email}`
          : `A 6-digit verification code was sent to ${email}`)
    );
  };

  const handleRequestEmailOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const cleanEmail = loginEmailOtp.trim().toLowerCase();
      const res = await requestOtp({ email: cleanEmail });
      enterOtpStage({
        email: res?.email || cleanEmail,
        cooldown: res?.cooldownSeconds || 60,
        origin: 'login'
      });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || t('auth.failedResend', 'Unable to send verification code.'));
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await login({
        identifier: loginIdentifier.trim(),
        password: loginPassword || undefined
      });
      if (res?.requiresVerification && (res?.email || res?.user?.email)) {
        enterOtpStage({
          email: res.email || res.user.email,
          cooldown: res?.cooldownSeconds || 60,
          origin: 'login',
          message: t('auth.otpInstruction', 'Please enter the verification code sent to your email.')
        });
      } else {
        const target = location.state?.from?.pathname || '/account';
        navigate(target, { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || t('auth.loginFailed', 'Login failed. Please check your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const res = await register({
        name: regName.trim(),
        phone: regPhone.trim(),
        email: regEmail.trim() || undefined,
        password: regPassword || undefined
      });

      if (res?.requiresVerification && res?.email) {
        enterOtpStage({
          email: res.email,
          cooldown: res?.cooldownSeconds || 60,
          origin: 'register'
        });
      } else {
        const target = location.state?.from?.pathname || '/account';
        navigate(target, { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || t('auth.regFailed', 'Registration failed. Please check your inputs.'));
    } finally {
      setLoading(false);
    }
  };

  const applyOtpPaste = (pastedRaw) => {
    const pasted = String(pastedRaw || '').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const updated = ['', '', '', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      updated[i] = pasted[i];
    }
    setOtpDigits(updated);
    const nextFocus = Math.min(5, pasted.length);
    otpInputRefs.current[nextFocus]?.focus();
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      applyOtpPaste(value);
      return;
    }

    const digit = value.replace(/\D/g, '');
    const updated = [...otpDigits];
    updated[index] = digit;
    setOtpDigits(updated);

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData?.getData('text') || '';
    applyOtpPaste(text);
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (code.length < 6) {
      setErrorMsg(t('auth.enterAllDigits', 'Please enter all 6 digits of the verification code.'));
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const targetEmail = (pendingEmail || regEmail || loginEmailOtp || (loginIdentifier.includes('@') ? loginIdentifier : '')).trim().toLowerCase();
      await verifyOtp({
        email: targetEmail,
        otp: code
      });
      setSuccessMsg(t('auth.emailVerified', 'Email verified. Redirecting to your account.'));
      setTimeout(() => {
        const target = location.state?.from?.pathname || '/account';
        navigate(target, { replace: true });
      }, 700);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || t('auth.invalidOtp', 'Invalid or expired verification code.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || resending) return;
    setErrorMsg('');
    setSuccessMsg('');
    setResending(true);
    try {
      const targetEmail = (pendingEmail || regEmail || loginEmailOtp || (loginIdentifier.includes('@') ? loginIdentifier : '')).trim().toLowerCase();
      const res = await resendOtp({
        email: targetEmail
      });
      setSuccessMsg(t('auth.newOtpSent', 'A new verification code was sent to your email.'));
      setResendTimer(res?.cooldownSeconds || 60);
      setCanResend(false);
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.message || t('auth.failedResend', 'Failed to resend code.');
      const waitMatch = String(serverMsg).match(/(\d+)\s*seconds?/i);
      if (err.response?.status === 429 && waitMatch) {
        setResendTimer(parseInt(waitMatch[1], 10));
        setCanResend(false);
      }
      setErrorMsg(serverMsg);
    } finally {
      setResending(false);
    }
  };

  // Dynamic SEO title based on language & active tab
  const getSeoTitle = () => {
    if (isRTL) {
      if (activeTab === 'login') return 'تسجيل الدخول • M20';
      if (activeTab === 'register') return 'إنشاء حساب جديد • M20';
      return 'تأكيد البريد الإلكتروني • M20';
    }
    if (activeTab === 'login') return 'Sign In • M20';
    if (activeTab === 'register') return 'Create Account • M20';
    return 'Verify Email • M20';
  };

  const getSeoDesc = () => {
    if (isRTL) {
      return 'سجّل الدخول أو أنشئ حسابك في M20 لإدارة طلبات العطور الفاخرة، سجل العناوين، والمزايا الحصرية للأعضاء.';
    }
    return 'Sign in or register for an M20 customer account to manage your bespoke perfume orders, address book, and exclusive member privileges.';
  };

  return (
    <main 
      dir={dir} 
      className={`min-h-[85vh] bg-[#F4F3EF] py-12 md:py-20 px-4 sm:px-6 flex items-center justify-center relative overflow-hidden ${
        isRTL ? "font-['Cairo',sans-serif]" : "font-sans"
      }`}
    >
      <SEO 
        title={getSeoTitle()}
        description={getSeoDesc()}
        noIndex={true}
      />
      
      {/* Luxury Background Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#174F43]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="w-full max-w-[460px] mx-auto relative z-10">
        
        {/* Brand Header & Language Switcher */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#174F43] transition-colors uppercase tracking-wider font-medium"
            aria-label={t('auth.returnToBoutique', 'Return to M20 Boutique')}
          >
            {isRTL ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            <span>{t('auth.returnToBoutique', 'Return to M20 Boutique')}</span>
          </Link>

          {/* Language Switcher Pill */}
          <div className="flex items-center bg-white/80 backdrop-blur-xs border border-slate-200/90 rounded-full p-0.5 shadow-2xs text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-full transition-all duration-150 ${
                lang === 'en'
                  ? 'bg-[#174F43] text-white shadow-xs'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('ar')}
              className={`px-2.5 py-1 rounded-full transition-all duration-150 ${
                lang === 'ar'
                  ? 'bg-[#174F43] text-white shadow-xs'
                  : 'text-slate-600 hover:text-black'
              }`}
            >
              AR
            </button>
          </div>
        </div>

        {/* Center Brand Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block transform hover:scale-[1.03] transition-transform duration-200" aria-label="M20 Home">
            <img 
              src="/img/m20-logo-emerald.png" 
              alt="M20 Fine Fragrances" 
              className="h-10 sm:h-11 w-auto object-contain mx-auto drop-shadow-xs"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/img/m20-logo-emerald.png';
              }}
            />
          </Link>
        </div>

        {/* Premium Container */}
        <div className={`bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_-12px_rgba(16,62,54,0.12)] border border-slate-200/80 overflow-hidden relative transition-all ${
          isRTL ? 'text-right' : 'text-left'
        }`}>
          
          {/* Top subtle golden/navy luxury hairline accent */}
          <div className="h-1 w-full bg-gradient-to-r from-[#174F43] via-[#FF9D00] to-[#174F43]" />

          {/* Elegant Card Header */}
          <div className="pt-8 pb-6 px-6 sm:px-8 text-center border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/40">
            <h1 className="text-2xl sm:text-3xl font-serif uppercase tracking-tight text-[#174F43] font-medium leading-snug">
              {activeTab === 'login' 
                ? t('auth.welcomeBack', 'Welcome Back')
                : activeTab === 'register' 
                ? t('auth.signUpTitle', 'Create Account') 
                : t('auth.verifyEmailTitle', 'Verify Email')}
            </h1>
            
            <p className="text-xs text-slate-500 font-light mt-1.5 max-w-xs mx-auto leading-relaxed">
              {activeTab === 'login' 
                ? t('auth.welcomeBackDesc', 'Sign in to access your orders, wishlist, and bespoke atelier.') 
                : activeTab === 'register'
                ? t('auth.createAccountDesc', 'Join M20 for exclusive releases, order tracking, and fast checkout.')
                : t('auth.verifyEmailDesc', 'Enter the 6-digit confirmation code dispatched to your email.')}
            </p>
          </div>

          {/* Interactive Modern Tab Switcher */}
          {activeTab !== 'otp' ? (
            <div className="p-4 sm:px-8 pb-0">
              <div className="bg-slate-100/90 p-1 rounded-xl grid grid-cols-2 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`py-2.5 rounded-lg transition-all duration-200 uppercase tracking-wider text-[11px] font-semibold flex items-center justify-center ${
                    activeTab === 'login'
                      ? 'bg-white text-[#174F43] shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span>{t('auth.signInBtn', 'Sign In')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`py-2.5 rounded-lg transition-all duration-200 uppercase tracking-wider text-[11px] font-semibold flex items-center justify-center ${
                    activeTab === 'register'
                      ? 'bg-white text-[#174F43] shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span>{t('auth.signUpBtn', 'Create Account')}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="px-6 sm:px-8 pt-4">
              <button
                type="button"
                onClick={() => { setActiveTab(otpOriginTab); setOtpDigits(['', '', '', '', '', '']); setErrorMsg(''); setSuccessMsg(''); }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#174F43] font-medium transition-colors cursor-pointer"
              >
                {isRTL ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
                <span>
                  {otpOriginTab === 'register'
                    ? t('auth.returnToRegistration', 'Return to registration')
                    : t('auth.returnToSignIn', 'Return to sign in')}
                </span>
              </button>
            </div>
          )}

          {/* Form Content */}
          <div className="p-6 sm:p-8 pt-5 space-y-4">
            
            {/* Semantic Feedback Alerts */}
            {errorMsg && (
              <div className={`p-3.5 bg-rose-50/90 text-rose-800 border border-rose-200/80 text-xs rounded-xl flex items-start gap-2 animate-fade-in ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="font-semibold shrink-0">•</span>
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className={`p-3.5 bg-emerald-50/90 text-emerald-800 border border-emerald-200/80 text-xs rounded-xl flex items-center gap-2.5 animate-fade-in ${isRTL ? 'flex-row-reverse' : ''}`}>
                <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                <span className="leading-relaxed">{successMsg}</span>
              </div>
            )}

            {/* 1. SIGN IN TAB */}
            {activeTab === 'login' && (
              <div className="space-y-4">
                {/* Sign-In Method Toggle: Email Code (OTP) vs Password */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F4F3EF] border border-slate-200/80 rounded-xl text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => { setLoginMethod('otp'); setErrorMsg(''); setSuccessMsg(''); }}
                    className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      loginMethod === 'otp'
                        ? 'bg-white text-[#174F43] shadow-xs border border-[#174F43]/15'
                        : 'text-slate-500 hover:text-[#174F43]'
                    }`}
                  >
                    <Mail size={13} className={loginMethod === 'otp' ? 'text-[#FF9D00]' : ''} />
                    <span>{t('auth.emailCodeTab', 'Email Code')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoginMethod('password'); setErrorMsg(''); setSuccessMsg(''); }}
                    className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      loginMethod === 'password'
                        ? 'bg-white text-[#174F43] shadow-xs border border-[#174F43]/15'
                        : 'text-slate-500 hover:text-[#174F43]'
                    }`}
                  >
                    <Lock size={13} className={loginMethod === 'password' ? 'text-[#FF9D00]' : ''} />
                    <span>{t('auth.passwordTab', 'Password')}</span>
                  </button>
                </div>

                {loginMethod === 'otp' ? (
                  <form onSubmit={handleRequestEmailOtpSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="login-email-otp" className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold block">
                        {t('auth.email', 'Email Address')}
                      </label>
                      <div className="relative flex items-center bg-slate-50/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#174F43]/15 focus-within:border-[#174F43] border border-slate-200 rounded-xl transition-all duration-150">
                        <Mail size={16} className={`absolute text-slate-400 pointer-events-none ${isRTL ? 'right-3.5' : 'left-3.5'}`} />
                        <input
                          id="login-email-otp"
                          type="email"
                          required
                          value={loginEmailOtp}
                          onChange={(e) => setLoginEmailOtp(e.target.value)}
                          placeholder={t('auth.emailPlaceholder', 'name@example.com')}
                          className={`w-full ${isRTL ? 'pr-10 pl-3.5 text-left' : 'pl-10 pr-3.5'} py-3 text-xs bg-transparent outline-none text-slate-900 placeholder:text-slate-400 font-normal`}
                          dir="ltr"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 font-light leading-relaxed pt-0.5">
                        {t('auth.emailCodeHelper', 'We will email you a 6-digit one-time verification code to sign in securely without a password.')}
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-[#174F43] text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#0F3830] active:scale-[0.99] disabled:bg-slate-300 shadow-[0_10px_20px_-5px_rgba(16,62,54,0.25)] hover:shadow-[0_12px_24px_-5px_rgba(16,62,54,0.35)] transition-all duration-200 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{loading ? t('auth.sendingCode', 'Sending code...') : t('auth.sendCodeBtn', 'Send Verification Code')}</span>
                      {!loading && (isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />)}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="login-identifier" className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold block">
                        {t('auth.phoneOrEmail', 'Phone number or email')}
                      </label>
                      <div className="relative flex items-center bg-slate-50/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#174F43]/15 focus-within:border-[#174F43] border border-slate-200 rounded-xl transition-all duration-150">
                        <User size={16} className={`absolute text-slate-400 pointer-events-none ${isRTL ? 'right-3.5' : 'left-3.5'}`} />
                        <input
                          id="login-identifier"
                          type="text"
                          required
                          value={loginIdentifier}
                          onChange={(e) => setLoginIdentifier(e.target.value)}
                          placeholder={t('auth.phoneOrEmailPlaceholder', '01132687324 or name@example.com')}
                          className={`w-full ${isRTL ? 'pr-10 pl-3.5' : 'pl-10 pr-3.5'} py-3 text-xs bg-transparent outline-none text-slate-900 placeholder:text-slate-400 font-normal`}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="login-password" className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold block">
                        {t('auth.password', 'Password')}
                      </label>
                      <div className="relative flex items-center bg-slate-50/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#174F43]/15 focus-within:border-[#174F43] border border-slate-200 rounded-xl transition-all duration-150">
                        <Lock size={16} className={`absolute text-slate-400 pointer-events-none ${isRTL ? 'right-3.5' : 'left-3.5'}`} />
                        <input
                          id="login-password"
                          type="password"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder={t('auth.passwordPlaceholder', 'Enter your password')}
                          className={`w-full ${isRTL ? 'pr-10 pl-3.5' : 'pl-10 pr-3.5'} py-3 text-xs bg-transparent outline-none text-slate-900 placeholder:text-slate-400 font-normal`}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-[#174F43] text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#0F3830] active:scale-[0.99] disabled:bg-slate-300 shadow-[0_10px_20px_-5px_rgba(16,62,54,0.25)] hover:shadow-[0_12px_24px_-5px_rgba(16,62,54,0.35)] transition-all duration-200 rounded-xl flex items-center justify-center gap-2 mt-2 cursor-pointer"
                    >
                      <span>{loading ? t('auth.authenticating', 'Authenticating...') : t('auth.signInBtn', 'Sign In')}</span>
                      {!loading && (isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />)}
                    </button>
                  </form>
                )}

                <div className="pt-2 text-center text-xs text-slate-500 font-light">
                  <span>{t('auth.noAccount', "Don't have an account?")} </span>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
                    className="text-[#174F43] font-semibold hover:underline cursor-pointer inline-block mx-1"
                  >
                    {t('auth.createOneNow', 'Create one now')}
                  </button>
                </div>
              </div>
            )}

            {/* 2. CREATE ACCOUNT TAB */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="space-y-1.5">
                  <label htmlFor="reg-name" className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold block">
                    {t('auth.fullName', 'Full name')}
                  </label>
                  <div className="relative flex items-center bg-slate-50/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#174F43]/15 focus-within:border-[#174F43] border border-slate-200 rounded-xl transition-all duration-150">
                    <User size={16} className={`absolute text-slate-400 pointer-events-none ${isRTL ? 'right-3.5' : 'left-3.5'}`} />
                    <input
                      id="reg-name"
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder={t('auth.fullNamePlaceholder', 'e.g. Karim Ahmed')}
                      className={`w-full ${isRTL ? 'pr-10 pl-3.5' : 'pl-10 pr-3.5'} py-3 text-xs bg-transparent outline-none text-slate-900 placeholder:text-slate-400`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reg-phone" className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold block">
                    {t('auth.phone', 'Phone number')}
                  </label>
                  <div className="relative flex items-center bg-slate-50/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#174F43]/15 focus-within:border-[#174F43] border border-slate-200 rounded-xl transition-all duration-150">
                    <Phone size={16} className={`absolute text-slate-400 pointer-events-none ${isRTL ? 'right-3.5' : 'left-3.5'}`} />
                    <input
                      id="reg-phone"
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder={t('auth.phonePlaceholder', '01xxxxxxxxx')}
                      className={`w-full ${isRTL ? 'pr-10 pl-3.5' : 'pl-10 pr-3.5'} py-3 text-xs bg-transparent outline-none text-slate-900 placeholder:text-slate-400 font-mono`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reg-email" className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold block">
                    {t('auth.email', 'Email address')}
                  </label>
                  <div className="relative flex items-center bg-slate-50/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#174F43]/15 focus-within:border-[#174F43] border border-slate-200 rounded-xl transition-all duration-150">
                    <Mail size={16} className={`absolute text-slate-400 pointer-events-none ${isRTL ? 'right-3.5' : 'left-3.5'}`} />
                    <input
                      id="reg-email"
                      type="email"
                      required
                      dir="ltr"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder={t('auth.emailPlaceholder', 'name@example.com')}
                      className={`w-full ${isRTL ? 'pr-10 pl-3.5 text-left' : 'pl-10 pr-3.5'} py-3 text-xs bg-transparent outline-none text-slate-900 placeholder:text-slate-400`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reg-password" className="text-[11px] uppercase tracking-wider text-slate-600 font-semibold block">
                    {t('auth.password', 'Password')}
                  </label>
                  <div className="relative flex items-center bg-slate-50/80 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#174F43]/15 focus-within:border-[#174F43] border border-slate-200 rounded-xl transition-all duration-150">
                    <Lock size={16} className={`absolute text-slate-400 pointer-events-none ${isRTL ? 'right-3.5' : 'left-3.5'}`} />
                    <input
                      id="reg-password"
                      type="password"
                      required
                      minLength={4}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder={t('auth.regPasswordPlaceholder', 'Minimum 4 characters')}
                      className={`w-full ${isRTL ? 'pr-10 pl-3.5' : 'pl-10 pr-3.5'} py-3 text-xs bg-transparent outline-none text-slate-900 placeholder:text-slate-400`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-[#174F43] text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#0F3830] active:scale-[0.99] disabled:bg-slate-300 shadow-[0_10px_20px_-5px_rgba(16,62,54,0.25)] hover:shadow-[0_12px_24px_-5px_rgba(16,62,54,0.35)] transition-all duration-200 rounded-xl flex items-center justify-center gap-2 mt-2 cursor-pointer"
                >
                  <span>{loading ? t('auth.sendingCode', 'Sending code...') : t('auth.continueToVerification', 'Continue to Verification')}</span>
                  {!loading && (isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />)}
                </button>

                <div className="pt-2 text-center text-xs text-slate-500 font-light">
                  <span>{t('auth.haveAccount', 'Already registered?')} </span>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
                    className="text-[#174F43] font-semibold hover:underline cursor-pointer inline-block mx-1"
                  >
                    {t('auth.signInLink', 'Sign in')}
                  </button>
                </div>
              </form>
            )}

            {/* 3. OTP VERIFICATION STEP */}
            {activeTab === 'otp' && (
              <div className="space-y-6 text-center">
                <div className="w-12 h-12 bg-[#174F43]/5 text-[#174F43] rounded-2xl flex items-center justify-center mx-auto ring-1 ring-[#174F43]/10">
                  <KeyRound size={22} />
                </div>

                <div className="space-y-1">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-800 font-serif">
                    {t('auth.enterOtp', 'Enter Verification Code')}
                  </h2>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">
                    {t('auth.otpDesc', 'A 6-digit code was sent to')} <br />
                    <strong className="text-slate-900 font-medium dir-ltr inline-block mt-0.5">{pendingEmail || regEmail || loginEmailOtp}</strong>
                  </p>
                  <p className="text-[11px] text-slate-400 font-light leading-relaxed max-w-xs mx-auto">
                    {t('auth.checkSpamHint', 'If you do not see the email in your Primary Inbox, please check your Spam or Updates folder.')}
                  </p>
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-5">
                  <div className="flex justify-center gap-2 sm:gap-2.5 dir-ltr" dir="ltr">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputRefs.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        autoComplete={idx === 0 ? 'one-time-code' : 'off'}
                        maxLength={idx === 0 ? 6 : 1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onPaste={handleOtpPaste}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-11 sm:w-12 h-13 text-center font-mono text-xl font-bold text-[#174F43] bg-slate-50/90 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#174F43]/20 focus:border-[#174F43] outline-none transition-all duration-150"
                        autoFocus={idx === 0}
                        aria-label={`Digit ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpDigits.join('').length < 6}
                    className="w-full h-12 bg-[#174F43] text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#0F3830] active:scale-[0.99] disabled:bg-slate-300 shadow-[0_10px_20px_-5px_rgba(16,62,54,0.25)] transition-all duration-200 rounded-xl flex items-center justify-center cursor-pointer"
                  >
                    {loading ? t('auth.verifying', 'Verifying...') : t('auth.verifyBtn', 'Confirm & Complete')}
                  </button>
                </form>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-light">
                  <span>{t('auth.didNotReceiveEmail', 'Did not receive email?')}</span>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={!canResend || resending}
                    className={`font-medium inline-flex items-center gap-1 uppercase text-xs tracking-wider transition-colors duration-150 ${
                      canResend && !resending
                        ? 'text-[#174F43] hover:underline font-semibold cursor-pointer' 
                        : 'text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <RefreshCw size={12} className={resending ? 'animate-spin' : ''} />
                    <span>
                      {canResend 
                        ? t('auth.resendOtp', 'Resend code') 
                        : (isRTL ? `إعادة الإرسال بعد ${resendTimer} ثانية` : `Resend in ${resendTimer}s`)}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Registration Guarantee */}
            {activeTab !== 'otp' && (
              <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-light">
                <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                <span>{t('auth.secureAuth', '256-bit Encrypted & Secure Authentication')}</span>
              </div>
            )}

          </div>

        </div>

      </div>
    </main>
  );
};

export default LoginPage;
