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
  Eye,
  EyeOff,
  PackageCheck,
  Zap,
  Sparkles,
} from 'lucide-react';
import SEO from '../components/SEO';

/** Labelled input with an inline icon. `ltrInput` keeps emails/phones left-to-right inside RTL pages. */
const Field = ({ id, label, icon: Icon, isRTL, ltrInput, right, ...inputProps }) => {
  const pad =
    ltrInput && isRTL
      ? `pr-11 ${right ? 'pl-12' : 'pl-3.5'} text-left`
      : `ps-11 ${right ? 'pe-12' : 'pe-3.5'}`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs uppercase tracking-[0.14em] text-slate-600 font-semibold block">
        {label}
      </label>
      <div className="relative flex items-center h-12 bg-white border border-slate-300 hover:border-slate-400 focus-within:border-[#174F43] focus-within:ring-1 focus-within:ring-[#174F43] transition-colors">
        <Icon size={17} className="absolute start-3.5 text-slate-400 pointer-events-none" />
        <input
          id={id}
          dir={ltrInput ? 'ltr' : undefined}
          className={`w-full h-full bg-transparent outline-none text-base sm:text-sm text-slate-900 placeholder:text-slate-400 ${pad}`}
          {...inputProps}
        />
        {right}
      </div>
    </div>
  );
};

const PrimaryButton = ({ children, ...props }) => (
  <button
    {...props}
    className="group w-full h-12 bg-[#174F43] text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#0F3830] active:scale-[0.99] disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer"
  >
    {children}
  </button>
);

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

  const { lang, isRTL, dir, setLang, t } = useLanguage();

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

  const [showPassword, setShowPassword] = useState(false);

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

  const switchTab = (tab) => {
    setActiveTab(tab);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const BackIcon = isRTL ? ChevronRight : ChevronLeft;
  const FwdIcon = isRTL ? ArrowLeft : ArrowRight;

  const brandHeading =
    activeTab === 'register'
      ? (isRTL ? 'انضم إلى دار M20.' : 'Join the Maison.')
      : activeTab === 'otp'
      ? (isRTL ? 'خطوة أخيرة.' : 'One last step.')
      : (isRTL ? 'أهلاً بعودتك إلى الدار.' : 'Welcome back to the Maison.');

  const benefits = [
    { icon: PackageCheck, text: isRTL ? 'تابع كل طلباتك لحظة بلحظة' : 'Track every order in real time' },
    { icon: Zap, text: isRTL ? 'دفع أسرع وعناوين محفوظة' : 'Faster checkout with saved addresses' },
    { icon: Sparkles, text: isRTL ? 'أولوية الوصول للإصدارات المحدودة' : 'First access to limited releases' },
  ];

  const tabCls = (active) =>
    `flex-1 pb-3 text-xs font-semibold uppercase tracking-[0.18em] border-b-2 transition-colors cursor-pointer ${
      active ? 'border-[#FF9D00] text-[#174F43]' : 'border-slate-200 text-slate-400 hover:text-slate-700'
    }`;

  const passwordToggle = (
    <button
      type="button"
      onClick={() => setShowPassword((v) => !v)}
      className="absolute end-1.5 w-9 h-9 flex items-center justify-center text-slate-400 hover:text-[#174F43] cursor-pointer"
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
    </button>
  );

  return (
    <main
      dir={dir}
      className={`min-h-[85vh] grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] bg-[#F4F3EF] lg:p-6 lg:pb-10 ${
        isRTL ? "font-['Cairo',sans-serif]" : 'font-sans'
      }`}
    >
      <SEO title={getSeoTitle()} description={getSeoDesc()} noIndex={true} />

      {/* ===== Brand panel (desktop) ===== */}
      {/* Brand emerald panel, framed by cream on every side (see main padding) so it never touches the footer. */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#174F43] text-white p-12 xl:p-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 10% 0%, rgba(15,56,48,0.55), transparent 70%)' }}
        />
        <div aria-hidden="true" className="pointer-events-none select-none absolute -bottom-10 inset-x-0 flex justify-center font-serif leading-none text-white/[0.06] text-[20rem] m20-drift-slow">
          M20
        </div>

        <Link to="/" className="relative inline-block w-fit" aria-label="M20 Home">
          <img
            src="/img/m20-logo-white.png"
            alt="M20 Fine Fragrances"
            className="h-11 w-auto object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/img/m20-logo.png';
            }}
          />
        </Link>

        <div className="relative space-y-8 text-start">
          <div className="flex items-center gap-3">
            <span className="h-[1.5px] w-10 bg-[#FF9D00]" />
            <span className="text-xs uppercase tracking-[0.3em] text-[#FF9D00] font-semibold">
              {isRTL ? 'مزايا الأعضاء' : 'MEMBER PRIVILEGES'}
            </span>
          </div>
          <h2 className="text-4xl xl:text-5xl font-serif leading-[1.1] max-w-md">{brandHeading}</h2>
          <ul className="space-y-4">
            {benefits.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3.5 text-white/85 text-base">
                <span className="w-10 h-10 shrink-0 flex items-center justify-center border border-white/20 text-[#FF9D00]">
                  <Icon size={18} strokeWidth={1.6} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs uppercase tracking-[0.3em] text-white/50">{t('common.leaveYourMark', 'Leave your mark.')}</p>
      </aside>

      {/* ===== Form panel ===== */}
      <section className="flex items-center justify-center px-5 sm:px-10 py-10 lg:py-16">
        <div className="w-full max-w-[440px] text-start">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#174F43] transition-colors uppercase tracking-wider font-medium"
              aria-label={t('auth.returnToBoutique', 'Return to M20 Boutique')}
            >
              <BackIcon size={14} />
              <span>{t('auth.returnToBoutique', 'Return to M20 Boutique')}</span>
            </Link>

            <div className="flex items-center border border-slate-300 text-xs font-bold">
              {['en', 'ar'].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`px-3 h-8 uppercase transition-colors cursor-pointer ${
                    lang === l ? 'bg-[#174F43] text-white' : 'text-slate-600 hover:text-black'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile brand */}
          <Link to="/" className="lg:hidden block mb-6" aria-label="M20 Home">
            <img src="/img/m20-logo-emerald.png" alt="M20 Fine Fragrances" className="h-10 w-auto object-contain" />
          </Link>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-serif uppercase text-[#174F43] leading-tight">
            {activeTab === 'login'
              ? t('auth.welcomeBack', 'Welcome Back')
              : activeTab === 'register'
              ? t('auth.signUpTitle', 'Create Account')
              : t('auth.verifyEmailTitle', 'Verify Email')}
          </h1>
          <p className="text-sm text-slate-500 font-light mt-2 leading-relaxed">
            {activeTab === 'login'
              ? t('auth.welcomeBackDesc', 'Sign in to access your orders, wishlist, and bespoke atelier.')
              : activeTab === 'register'
              ? t('auth.createAccountDesc', 'Join M20 for exclusive releases, order tracking, and fast checkout.')
              : t('auth.verifyEmailDesc', 'Enter the 6-digit confirmation code dispatched to your email.')}
          </p>

          {/* Tabs */}
          {activeTab !== 'otp' ? (
            <div className="flex gap-4 mt-8">
              <button type="button" onClick={() => switchTab('login')} className={tabCls(activeTab === 'login')}>
                {t('auth.signInBtn', 'Sign In')}
              </button>
              <button type="button" onClick={() => switchTab('register')} className={tabCls(activeTab === 'register')}>
                {t('auth.signUpBtn', 'Create Account')}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => { setActiveTab(otpOriginTab); setOtpDigits(['', '', '', '', '', '']); setErrorMsg(''); setSuccessMsg(''); }}
              className="mt-6 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#174F43] font-medium transition-colors cursor-pointer"
            >
              <BackIcon size={15} />
              <span>
                {otpOriginTab === 'register'
                  ? t('auth.returnToRegistration', 'Return to registration')
                  : t('auth.returnToSignIn', 'Return to sign in')}
              </span>
            </button>
          )}

          <div className="mt-6 space-y-5">
            {/* Alerts */}
            {errorMsg && (
              <div role="alert" className="p-3.5 bg-rose-50 text-rose-800 border-s-4 border-rose-500 text-sm flex items-start gap-2">
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div role="status" className="p-3.5 bg-emerald-50 text-emerald-800 border-s-4 border-emerald-600 text-sm flex items-center gap-2.5">
                <CheckCircle2 size={17} className="shrink-0 text-emerald-600" />
                <span className="leading-relaxed">{successMsg}</span>
              </div>
            )}

            {/* 1. SIGN IN */}
            {activeTab === 'login' && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 border border-slate-300 bg-white text-xs font-semibold">
                  {[
                    { id: 'otp', icon: Mail, label: t('auth.emailCodeTab', 'Email Code') },
                    { id: 'password', icon: Lock, label: t('auth.passwordTab', 'Password') },
                  ].map(({ id, icon: Icon, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => { setLoginMethod(id); setErrorMsg(''); setSuccessMsg(''); }}
                      className={`h-10 flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                        loginMethod === id ? 'bg-[#174F43] text-white' : 'text-slate-500 hover:text-[#174F43]'
                      }`}
                    >
                      <Icon size={14} className={loginMethod === id ? 'text-[#FF9D00]' : ''} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>

                {loginMethod === 'otp' ? (
                  <form onSubmit={handleRequestEmailOtpSubmit} className="space-y-5">
                    <Field
                      id="login-email-otp"
                      label={t('auth.email', 'Email Address')}
                      icon={Mail}
                      isRTL={isRTL}
                      ltrInput
                      type="email"
                      required
                      autoComplete="email"
                      value={loginEmailOtp}
                      onChange={(e) => setLoginEmailOtp(e.target.value)}
                      placeholder={t('auth.emailPlaceholder', 'name@example.com')}
                    />
                    <p className="text-xs text-slate-500 font-light leading-relaxed -mt-2">
                      {t('auth.emailCodeHelper', 'We will email you a 6-digit one-time verification code to sign in securely without a password.')}
                    </p>
                    <PrimaryButton type="submit" disabled={loading}>
                      <span>{loading ? t('auth.sendingCode', 'Sending code...') : t('auth.sendCodeBtn', 'Send Verification Code')}</span>
                      {!loading && <FwdIcon size={15} className="text-[#FF9D00] transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />}
                    </PrimaryButton>
                  </form>
                ) : (
                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <Field
                      id="login-identifier"
                      label={t('auth.phoneOrEmail', 'Phone number or email')}
                      icon={User}
                      isRTL={isRTL}
                      type="text"
                      required
                      autoComplete="username"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder={t('auth.phoneOrEmailPlaceholder', '01132687324 or name@example.com')}
                    />
                    <Field
                      id="login-password"
                      label={t('auth.password', 'Password')}
                      icon={Lock}
                      isRTL={isRTL}
                      right={passwordToggle}
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder={t('auth.passwordPlaceholder', 'Enter your password')}
                    />
                    <PrimaryButton type="submit" disabled={loading}>
                      <span>{loading ? t('auth.authenticating', 'Authenticating...') : t('auth.signInBtn', 'Sign In')}</span>
                      {!loading && <FwdIcon size={15} className="text-[#FF9D00] transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />}
                    </PrimaryButton>
                  </form>
                )}

                <p className="text-center text-sm text-slate-500 font-light">
                  {t('auth.noAccount', "Don't have an account?")}{' '}
                  <button type="button" onClick={() => switchTab('register')} className="text-[#174F43] font-semibold hover:underline cursor-pointer">
                    {t('auth.createOneNow', 'Create one now')}
                  </button>
                </p>
              </div>
            )}

            {/* 2. CREATE ACCOUNT */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <Field
                  id="reg-name"
                  label={t('auth.fullName', 'Full name')}
                  icon={User}
                  isRTL={isRTL}
                  type="text"
                  required
                  autoComplete="name"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder={t('auth.fullNamePlaceholder', 'e.g. Karim Ahmed')}
                />
                <Field
                  id="reg-phone"
                  label={t('auth.phone', 'Phone number')}
                  icon={Phone}
                  isRTL={isRTL}
                  ltrInput
                  type="tel"
                  required
                  autoComplete="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder={t('auth.phonePlaceholder', '01xxxxxxxxx')}
                />
                <Field
                  id="reg-email"
                  label={t('auth.email', 'Email address')}
                  icon={Mail}
                  isRTL={isRTL}
                  ltrInput
                  type="email"
                  required
                  autoComplete="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder', 'name@example.com')}
                />
                <Field
                  id="reg-password"
                  label={t('auth.password', 'Password')}
                  icon={Lock}
                  isRTL={isRTL}
                  right={passwordToggle}
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={4}
                  autoComplete="new-password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder={t('auth.regPasswordPlaceholder', 'Minimum 4 characters')}
                />
                <div className="pt-1">
                  <PrimaryButton type="submit" disabled={loading}>
                    <span>{loading ? t('auth.sendingCode', 'Sending code...') : t('auth.continueToVerification', 'Continue to Verification')}</span>
                    {!loading && <FwdIcon size={15} className="text-[#FF9D00] transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />}
                  </PrimaryButton>
                </div>
                <p className="text-center text-sm text-slate-500 font-light">
                  {t('auth.haveAccount', 'Already registered?')}{' '}
                  <button type="button" onClick={() => switchTab('login')} className="text-[#174F43] font-semibold hover:underline cursor-pointer">
                    {t('auth.signInLink', 'Sign in')}
                  </button>
                </p>
              </form>
            )}

            {/* 3. OTP */}
            {activeTab === 'otp' && (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 shrink-0 bg-[#174F43] text-[#FF9D00] flex items-center justify-center">
                    <KeyRound size={22} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-800">
                      {t('auth.enterOtp', 'Enter Verification Code')}
                    </h2>
                    <p className="text-sm text-slate-500 font-light leading-relaxed">
                      {t('auth.otpDesc', 'A 6-digit code was sent to')}{' '}
                      <strong dir="ltr" className="text-slate-900 font-medium inline-block">{pendingEmail || regEmail || loginEmailOtp}</strong>
                    </p>
                    <p className="text-xs text-slate-400 font-light leading-relaxed">
                      {t('auth.checkSpamHint', 'If you do not see the email in your Primary Inbox, please check your Spam or Updates folder.')}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-5">
                  <div className="flex justify-center gap-2 sm:gap-2.5" dir="ltr">
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
                        className="w-11 sm:w-[52px] h-14 text-center font-mono text-2xl font-bold text-[#174F43] bg-white border border-slate-300 focus:border-[#174F43] focus:ring-1 focus:ring-[#174F43] outline-none transition-colors"
                        autoFocus={idx === 0}
                        aria-label={`Digit ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <PrimaryButton type="submit" disabled={loading || otpDigits.join('').length < 6}>
                    {loading ? t('auth.verifying', 'Verifying...') : t('auth.verifyBtn', 'Confirm & Complete')}
                  </PrimaryButton>
                </form>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500 font-light">
                  <span>{t('auth.didNotReceiveEmail', 'Did not receive email?')}</span>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={!canResend || resending}
                    className={`inline-flex items-center gap-1.5 uppercase text-xs tracking-wider font-medium transition-colors ${
                      canResend && !resending ? 'text-[#174F43] hover:underline font-semibold cursor-pointer' : 'text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <RefreshCw size={13} className={resending ? 'animate-spin' : ''} />
                    <span>
                      {canResend
                        ? t('auth.resendOtp', 'Resend code')
                        : (isRTL ? `إعادة الإرسال بعد ${resendTimer} ثانية` : `Resend in ${resendTimer}s`)}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {activeTab !== 'otp' && (
              <div className="pt-5 border-t border-slate-200 flex items-center justify-center gap-2 text-xs text-slate-400 font-light">
                <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
                <span>{t('auth.secureAuth', '256-bit Encrypted & Secure Authentication')}</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
