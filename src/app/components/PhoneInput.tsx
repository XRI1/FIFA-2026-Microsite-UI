import { useState } from 'react';
import lgLogo from '../../imports/LGE_Electronics_Logo_HeritageRed_Grey_RGB.png';
import mnewmonic from '../../imports/mnewmonic.png';
import { LoadingSpinner } from './FlaticonIcon';

interface PhoneInputProps {
  onSubmit: (phoneNumber: string) => Promise<void>;
}

export function PhoneInput({ onSubmit }: PhoneInputProps) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(phone);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-page min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="premium-panel fifa-match-panel rounded-3xl overflow-hidden">
          {/* Top brand strip */}
          <div className="px-8 pt-8 pb-6 text-center" style={{ background: 'linear-gradient(145deg, rgba(240,236,228,0.9), rgba(255,255,255,0.72))' }}>
            <img src={lgLogo} alt="LG Electronics" className="h-8 w-auto mx-auto mb-4 bg-white px-3 py-1.5 rounded-lg shadow-sm" />
            <img src={mnewmonic} alt="LG Super Fan League" className="h-24 w-auto mx-auto" />
            <p className="text-xs font-bold uppercase tracking-[0.15em] mt-3" style={{ color: '#888' }}>FIFA World Cup 2026 · Bangladesh</p>
          </div>

          {/* Form section */}
          <div className="px-8 py-7 space-y-5" style={{ backgroundColor: '#ffffff' }}>
            <div>
              <p className="text-center font-bold text-gray-800 mb-1">Welcome, Superfan!</p>
              <p className="text-center text-sm text-gray-500 mb-5">Enter your phone to get started</p>
              <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="01XXXXXXXXX"
                maxLength={11}
                className="input-premium"
                disabled={loading}
              />
              {error && <p className="mt-2 text-xs font-semibold" style={{ color: '#C8002C' }}>{error}</p>}
            </div>

            <button type="submit" onClick={handleSubmit} disabled={loading} className="btn-premium w-full flex items-center justify-center gap-2">
              {loading ? <><LoadingSpinner className="w-4 h-4" /> Sending…</> : 'Send OTP →'}
            </button>

            <p className="text-center text-xs text-gray-400 pt-1">
              By continuing you agree to the LG Superfan League rules
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
