import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, Phone, User as UserIcon, ArrowRight, ArrowLeft, ShieldCheck, KeyRound, CheckCircle2, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authMode, 
    setAuthMode, 
    login, 
    requestOtp,
    register, 
    verifyOtp, 
    resendOtp,
    pendingEmail,
    setPendingEmail
  } = useAuth();
  const { isRTL, t } = useLanguage();
  
  // Login states
  const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' | 'password'
  const [loginEmailOtp, setLoginEmailOtp] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [otpOriginMode, setOtpOriginMode] = useState('login');

  // Register states
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // OTP State
  const [otpCode, setOtpCode] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [resending, setResending] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthModalOpen || authMode !== 'otp' || resendTimer <= 0) return undefined;
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isAuthModalOpen, authMode, resendTimer]);

  if (!isAuthModalOpen) return null;

  const enterOtpStep = ({ email, cooldown = 60, origin = 'login', msg }) => {
    setPendingEmail(email);
    setOtpOriginMode(origin);
    setOtpCode('');
    setResendTimer(cooldown);
    setCanResend(cooldown <= 0);
    setAuthMode('otp');
    setSuccessMsg(msg || `${t('auth.otpSentTo', 'We sent a 6-digit verification code to')} ${email}`);
  };

  const handleRequestEmailOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const cleanEmail = loginEmailOtp.trim().toLowerCase();
      const res = await requestOtp({ email: cleanEmail });
      enterOtpStep({
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
        enterOtpStep({
          email: res.email || res.user.email,
          cooldown: res?.cooldownSeconds || 60,
          origin: 'login',
          msg: t('auth.otpSentTo', 'Please verify your email with the 6-digit code sent.')
        });
      } else {
        closeAuthModal();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || t('common.error', 'Login failed. Please check your credentials.'));
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
        enterOtpStep({
          email: res.email,
          cooldown: res?.cooldownSeconds || 60,
          origin: 'register'
        });
      } else {
        closeAuthModal();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || t('common.error', 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const targetEmail = (pendingEmail || regEmail || loginEmailOtp || (loginIdentifier.includes('@') ? loginIdentifier : '')).trim().toLowerCase();
      await verifyOtp({
        email: targetEmail,
        otp: otpCode.trim()
      });
      setSuccessMsg(t('auth.welcomeBack', 'Welcome to M20! Verification successful.'));
      setTimeout(() => {
        closeAuthModal();
      }, 900);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || t('auth.invalidOtp', 'Invalid or expired verification code.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || resending) return;
    setErrorMsg('');
    setSuccessMsg('');
    setResending(true);
    try {
      const targetEmail = (pendingEmail || regEmail || loginEmailOtp || (loginIdentifier.includes('@') ? loginIdentifier : '')).trim().toLowerCase();
      const res = await resendOtp({ email: targetEmail });
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

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={closeAuthModal}
    >
      <div 
        className={`relative w-full max-w-[440px] bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200/80 overflow-hidden ${isRTL ? 'text-right' : 'text-left'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top subtle hairline accent */}
        <div className="h-1 w-full bg-gradient-to-r from-[#174F43] via-[#FF9D00] to-[#174F43]" />

        {/* Header */}
        <div className="pt-6 pb-5 px-6 sm:px-7 flex justify-between items-start border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/40">
          <div className="space-y-1">
            <img 
              src="/img/m20-logo-emerald.png" 
              alt="M20 Fine Fragrances" 
              className="h-8 sm:h-9 w-auto object-contain mb-2 drop-shadow-sm"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/img/m20-logo.png';
              }}
            />
            <h2 className="text-xl sm:text-2xl font-serif uppercase tracking-tight text-[#174F43] font-medium">
              {authMode === 'login' ? t('auth.signInTitle', 'WELCOME BACK') : authMode === 'register' ? t('auth.signUpTitle', 'CREATE ACCOUNT') : t('auth.enterOtp', 'VERIFY EMAIL')}
            </h2>
            <p className="text-xs text-slate-500 font-light max-w-xs leading-relaxed">
              {authMode === 'login' 
                ? t('auth.haveAccount', 'Sign in to access your order history and privileges.') 
                : authMode === 'register'
                ? t('auth.noAccount', 'Join the Maison to track orders easily and receive exclusive privileges.')
                : t('auth.otpSentTo', 'Confirm your 6-digit code sent via email.')}
            </p>
          </div>

          <button
            onClick={closeAuthModal}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switch */}
        {authMode !== 'otp' ? (
          <div className="px-6 sm:px-7 pt-4">
            <div className="bg-slate-100/90 p-1 rounded-xl grid grid-cols-2 text-xs font-medium">
              <button
                onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
                className={`py-2 rounded-lg transition-all duration-200 uppercase tracking-wider text-[11px] font-semibold flex items-center justify-center cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-white text-[#174F43] shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {t('nav.signIn', 'Sign In')}
              </button>
              <button
                onClick={() => { setAuthMode('register'); setErrorMsg(''); }}
                className={`py-2 rounded-lg transition-all duration-200 uppercase tracking-wider text-[11px] font-semibold flex items-center justify-center cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-white text-[#174F43] shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {t('auth.signUpBtn', 'Create Account')}
              </button>
            </div>
          </div>
        ) : (
          <div className="px-6 sm:px-7 pt-4 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => { setAuthMode(otpOriginMode); setErrorMsg(''); setSuccessMsg(''); }}
              className={`inline-flex items-center ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'} text-slate-500 hover:text-[#174F43] font-medium cursor-pointer`}
            >
              {isRTL ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
              <span>
                {otpOriginMode === 'register'
                  ? t('auth.returnToRegistration', 'Return to registration')
                  : t('auth.returnToSignIn', 'Return to sign in')}
              </span>
            </button>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#174F43]">{t('auth.enterOtp', 'Enter Verification Code')}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 sm:p-7 pt-4 space-y-4">
          {errorMsg && (
            <div className="p-3 text-xs bg-rose-50 text-rose-800 border border-rose-200/80 rounded-xl">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className={`p-3 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-xl flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
              <CheckCircle2 size={16} className="flex-shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {authMode === 'login' && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F4F3EF] border border-slate-200/80 rounded-xl text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => { setLoginMethod('otp'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    loginMethod === 'otp'
                      ? 'bg-white text-[#174F43] shadow-xs'
                      : 'text-slate-500 hover:text-[#174F43]'
                  }`}
                >
                  <Mail size={12} className={loginMethod === 'otp' ? 'text-[#FF9D00]' : ''} />
                  <span>{t('auth.emailCodeTab', 'Email Code')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginMethod('password'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    loginMethod === 'password'
                      ? 'bg-white text-[#174F43] shadow-xs'
                      : 'text-slate-500 hover:text-[#174F43]'
                  }`}
                >
                  <Lock size={12} className={loginMethod === 'password' ? 'text-[#FF9D00]' : ''} />
                  <span>{t('auth.passwordTab', 'Password')}</span>
                </button>
              </div>

              {loginMethod === 'otp' ? (
                <form onSubmit={handleRequestEmailOtp} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">{t('auth.email', 'Email Address')}</label>
                    <input
                      type="email"
                      required
                      value={loginEmailOtp}
                      onChange={(e) => setLoginEmailOtp(e.target.value)}
                      placeholder="you@email.com"
                      dir="ltr"
                      className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#174F43] focus:bg-white"
                    />
                    <p className="text-[11px] text-slate-500 font-light mt-1.5 leading-relaxed">
                      {t('auth.emailCodeHelper', 'We will email you a 6-digit one-time verification code to sign in securely without a password.')}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-11 bg-[#174F43] text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#0F3830] active:scale-[0.99] disabled:bg-slate-400 shadow-[0_10px_20px_-5px_rgba(16,62,54,0.25)] transition-all rounded-xl flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} mt-2 cursor-pointer`}
                  >
                    <span>{loading ? t('auth.sendingCode', 'Sending code...') : t('auth.sendCodeBtn', 'SEND CODE')}</span>
                    {!loading && (isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />)}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">{t('auth.phoneOrEmail', 'Phone Number or Email')}</label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        required
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="01012345678 or you@email.com"
                        className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#174F43] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">{t('auth.password', 'Password')}</label>
                    <div className="relative flex items-center">
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#174F43] focus:bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-11 bg-[#174F43] text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#0F3830] active:scale-[0.99] disabled:bg-slate-400 shadow-[0_10px_20px_-5px_rgba(16,62,54,0.25)] transition-all rounded-xl flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} mt-2 cursor-pointer`}
                  >
                    <span>{loading ? t('common.loading', 'LOGGING IN...') : t('auth.signInBtn', 'SIGN IN')}</span>
                    {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                  </button>
                </form>
              )}
            </div>
          )}

          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('auth.fullName', 'Full Name')} *</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Ahmed Farouk"
                  className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#174F43] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('auth.phone', 'Phone Number')} *</label>
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="01012345678"
                  className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#174F43] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('auth.email', 'Email Address')} *</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="you@email.com"
                  dir="ltr"
                  className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#174F43] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t('auth.password', 'Password (Optional)')}</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#174F43] focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full h-11 bg-[#174F43] text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#0F3830] active:scale-[0.99] disabled:bg-slate-400 shadow-[0_10px_20px_-5px_rgba(16,62,54,0.25)] transition-all rounded-xl flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} mt-2 cursor-pointer`}
              >
                <span>{loading ? t('common.loading', 'CREATING ACCOUNT...') : t('auth.signUpBtn', 'CREATE ACCOUNT')}</span>
                {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
              </button>
            </form>
          )}

          {authMode === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-4 text-center">
              <div className="w-11 h-11 bg-[#174F43]/5 text-[#174F43] rounded-xl flex items-center justify-center mx-auto">
                <KeyRound size={20} />
              </div>
              <p className="text-xs text-slate-600 font-light leading-relaxed">
                {t('auth.otpDesc', 'A 6-digit code was sent to')}<br />
                <strong className="font-semibold text-slate-900 dir-ltr inline-block">{pendingEmail || regEmail || loginEmailOtp}</strong>
              </p>
              <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                {t('auth.checkSpamHint', 'If you do not see the email in your Primary Inbox, please check your Spam or Updates folder.')}
              </p>
              
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                required
                autoFocus
                dir="ltr"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="• • • • • •"
                className="w-full text-center tracking-[0.8em] text-2xl font-mono py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#174F43]/15 focus:border-[#174F43] outline-none"
              />

              <button
                type="submit"
                disabled={loading || otpCode.length < 6}
                className="w-full h-11 bg-[#174F43] text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#0F3830] disabled:bg-slate-300 transition-all rounded-xl cursor-pointer"
              >
                <span>{loading ? t('auth.verifying', 'VERIFYING...') : t('auth.verifyBtn', 'CONFIRM CODE')}</span>
              </button>

              <div className="pt-2 text-xs text-slate-500 flex justify-between items-center">
                <span>{t('auth.didNotReceiveEmail', "Didn't get code?")}</span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend || resending}
                  className={`inline-flex items-center gap-1 uppercase text-[11px] font-semibold ${
                    canResend && !resending
                      ? 'text-[#174F43] underline cursor-pointer'
                      : 'text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <RefreshCw size={11} className={resending ? 'animate-spin' : ''} />
                  <span>
                    {canResend
                      ? t('auth.resendOtp', 'Resend Code')
                      : (isRTL ? `إعادة الإرسال (${resendTimer})` : `Resend (${resendTimer}s)`)}
                  </span>
                </button>
              </div>
            </form>
          )}

          {authMode !== 'otp' && (
            <div className={`pt-3 border-t border-slate-100 flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} text-[11px] text-slate-400 font-light`}>
              <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
              <span>256-bit Encrypted & Secure Authentication</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
