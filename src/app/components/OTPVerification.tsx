import { useState, useEffect, useRef } from 'react';
import { Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import lgLogo from '../../imports/LGE_Electronics_Logo_HeritageRed_Grey_RGB.png';
import mnewmonic from '../../imports/mnewmonic.png';

interface OTPVerificationProps {
  phoneNumber: string;
  onVerified: () => void;
  onBack: () => void;
}

export function OTPVerification({ phoneNumber, onVerified, onBack }: OTPVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(digit => digit !== '') && !loading) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpCode: string) => {
    setLoading(true);
    setError('');

    try {
      // Dummy OTP - Accept any 4-digit code
      console.log(`✅ OTP verified (dummy mode): ${otpCode}`);
      setSuccess(true);

      // Wait a moment to show success, then proceed
      setTimeout(() => {
        onVerified();
      }, 500);

    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError('Verification failed. Please try again.');
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendTimer(30);
    setOtp(['', '', '', '']);
    setError('');
    console.log('📱 OTP resend requested (dummy mode)');
  };

  return (
    <div className="premium-page min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="premium-panel fifa-match-panel rounded-3xl p-8 space-y-6">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="text-center space-y-4">
            {success ? (
              <div className="w-20 h-20 bg-lg-green rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
            ) : (
              <img src={mnewmonic} alt="LG Super Fan League" className="h-24 w-auto mx-auto" />
            )}
            <h2 className="text-xl font-bold text-gray-900">Verify OTP</h2>
            <p className="text-sm text-gray-600">
              Enter the 4-digit code sent to<br />
              <span className="font-semibold text-gray-900">{phoneNumber}</span>
            </p>
            <div className="bg-lg-yellow/20 border border-lg-yellow rounded-lg p-3">
              <p className="text-xs text-gray-700">
                <strong>Demo Mode:</strong> Enter any 4-digit code (e.g., 1234)
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 border-gray-200 focus:border-lg-red focus:ring-2 focus:ring-lg-red/20 outline-none transition-all"
                  disabled={loading || success}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {error && (
              <div className="text-center">
                <p className="text-sm text-lg-bright-purple font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="text-center">
                <p className="text-sm text-lg-green font-medium flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Verification successful!
                </p>
              </div>
            )}

            {loading && (
              <div className="text-center">
                <Loader2 className="w-6 h-6 animate-spin text-lg-red mx-auto" />
              </div>
            )}
          </div>

          <div className="text-center space-y-2">
            {resendTimer > 0 ? (
              <p className="text-sm text-gray-500">
                Resend OTP in <span className="font-semibold text-lg-red">{resendTimer}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-sm font-semibold text-lg-gray hover:text-lg-red transition-colors"
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
