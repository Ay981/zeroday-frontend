import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { sendOtp, verifyOtp } from '../api/auth';
import { Shield, Check, AlertCircle, RefreshCw, X } from 'lucide-react';

export const Verify: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const [canResend, setCanResend] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);

    // Get email from multiple sources: URL params, localStorage, or authenticated user
    const emailFromUrl = searchParams.get('email');
    const emailFromStorage = localStorage.getItem('pending_registration_email');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = (window as unknown as { queryClient?: { getQueryData: (key: unknown[]) => unknown } })?.queryClient?.getQueryData(['auth-user']) || null;
    const userEmailFromAuth = (user && typeof user === 'object' && 'email' in user) ? (user as { email?: string }).email || null : null;
    
    const userEmail = emailFromUrl || emailFromStorage || userEmailFromAuth;

  useEffect(() => {
    // send initial OTP
    let mounted = true;
    (async () => {
      try {
        await sendOtp(userEmail || undefined);
        if (!mounted) return;
        setCanResend(false);
        setResendTimer(60);
      } catch (e) {
        setError('Failed to send verification code.');
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userEmail]);

  useEffect(() => {
    if (!canResend) {
      const t = setInterval(() => {
        setResendTimer((s) => {
          if (s <= 1) {
            setCanResend(true);
            clearInterval(t);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
      return () => clearInterval(t);
    }
  }, [canResend]);

  const codeString = digits.join('');

  useEffect(() => {
    // auto-submit when all digits are filled
    if (codeString.length === 6 && !isLoading) {
      handleVerify(codeString);
    }
  }, [codeString]);

  const handleVerify = async (otpCode?: string) => {
    const codeToSend = otpCode ?? codeString;
    if (codeToSend.length !== 6) return;
    setIsLoading(true);
    setError(null);

    try {
      await verifyOtp({ otp: codeToSend, email: userEmail || undefined });
      setSuccess(true);
      // Clean up localStorage on successful verification
      localStorage.removeItem('pending_registration_email');
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err: unknown) {
        setError((typeof err === 'object' && err && 'response' in err && (err as any).response?.data?.message) ? (err as any).response.data.message : 'Invalid or expired code.');
      // clear inputs on failure
      setDigits(Array(6).fill(''));
      inputsRef.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setIsLoading(true);
    setError(null);
    try {
      await sendOtp(userEmail || undefined);
      setCanResend(false);
      setResendTimer(60);
    } catch (e) {
        setError('Failed to resend code. Try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInput = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;
    const v = value.slice(-1);
    const next = [...digits];
    next[index] = v;
    setDigits(next);
    if (v && inputsRef.current[index + 1]) inputsRef.current[index + 1]!.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (digits[index]) {
        const next = [...digits];
        next[index] = '';
        setDigits(next);
      } else if (inputsRef.current[index - 1]) {
        inputsRef.current[index - 1]!.focus();
      }
    }

    if (e.key === 'ArrowLeft' && inputsRef.current[index - 1]) inputsRef.current[index - 1]!.focus();
    if (e.key === 'ArrowRight' && inputsRef.current[index + 1]) inputsRef.current[index + 1]!.focus();

    if (e.key === 'Enter') {
      if (codeString.length === 6) handleVerify();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').trim();
    const onlyDigits = pasted.replace(/\D/g, '');
    if (!/^[0-9]{6}$/.test(onlyDigits)) return;
    const arr = onlyDigits.split('');
    setDigits(arr);
    setTimeout(() => inputsRef.current[5]?.focus(), 0);
  };

  const clearInputs = () => {
    setDigits(Array(6).fill(''));
    setError(null);
    inputsRef.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-black text-green-200 px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-lg p-8 rounded-lg border border-green-800 bg-[#020202] shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-green-900 text-green-200">
            <Shield size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-green-300">Terminal Verification</h2>
            <p className="text-sm text-green-500">Enter the 6-digit code sent to your email.</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-md border border-red-700 bg-red-900/30 p-3 mb-4 text-sm font-bold text-red-300">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-center mb-4">
          <div className="flex gap-2">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                value={d}
                onChange={(e) => handleInput(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                inputMode="numeric"
                maxLength={1}
                className={`w-12 h-12 text-center text-lg font-mono bg-black text-green-300 border border-green-800 rounded focus:outline-none focus:ring-2 focus:ring-green-400 ${d ? 'shadow-[0_0_8px_rgba(16,185,129,0.12)]' : ''}`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => handleVerify()}
            disabled={isLoading || digits.join('').length !== 6}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-700 text-black font-bold rounded disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : (
              <>
                <Check size={14} />
                <span>Verify Identity</span>
              </>
            )}
          </button>

          <button
            onClick={clearInputs}
            className="inline-flex items-center gap-2 px-3 py-2 border border-green-800 text-green-300 rounded"
          >
            <X size={14} />
            Clear
          </button>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleResend}
            disabled={!canResend || isLoading}
            className="inline-flex items-center gap-2 px-3 py-2 bg-transparent border border-green-800 text-green-300 rounded disabled:opacity-50"
          >
            <RefreshCw size={14} />
            {canResend ? 'Resend Code' : `Resend in ${resendTimer}s`}
          </button>

          {success && <div className="text-green-300 font-black">Verified ✓</div>}
        </div>
      </div>
    </div>
  );
};
