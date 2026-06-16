import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../../../utils/supabase/client';
import mnewmonic from '../../imports/mnewmonic-1.png';
import { FlaticonIcon } from "./FlaticonIcon";

interface NameInputProps {
  phoneNumber: string;
  onSubmit: (name: string) => Promise<void>;
}

export function NameInput({ phoneNumber, onSubmit }: NameInputProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);

  const checkNameAvailability = async (nameToCheck: string) => {
    if (!nameToCheck || nameToCheck.length < 3) {
      setAvailable(null);
      return;
    }

    setChecking(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('name')
        .eq('name', nameToCheck)
        .single();

      if (error && error.code === 'PGRST116') {
        // No rows found - name is available
        setAvailable(true);
      } else if (data) {
        // Name already exists
        setAvailable(false);
      }
    } catch (err) {
      console.error('Error checking name:', err);
    } finally {
      setChecking(false);
    }
  };

  const handleNameChange = (value: string) => {
    // Only allow alphanumeric and spaces
    const sanitized = value.replace(/[^a-zA-Z0-9 ]/g, '');
    setName(sanitized);
    setError('');

    // Debounce check
    if (sanitized.length >= 3) {
      const timer = setTimeout(() => {
        checkNameAvailability(sanitized);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setAvailable(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || name.length < 3) {
      setError('Name must be at least 3 characters');
      return;
    }

    if (!available) {
      setError('This name is already taken. Please choose another.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(name);
    } catch (err) {
      if (err instanceof Error && err.message.includes('duplicate')) {
        setError('This name is already taken. Please choose another.');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to save name');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-page min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="premium-panel fifa-match-panel rounded-3xl p-8 space-y-6">
          <div className="text-center space-y-4">
            <img src={mnewmonic} alt="LG Super Fan League" className="h-24 w-auto mx-auto" />
            <h2 className="text-xl font-bold text-gray-900">Choose Your Name</h2>
            <p className="text-sm text-gray-600">
              Pick a unique name for the leaderboard<br />
              <span className="font-semibold text-gray-900">{phoneNumber}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., RahulTheSuperfan"
                  maxLength={100}
                  className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:border-lg-red focus:ring-2 focus:ring-lg-red/20 outline-none transition-all text-lg"
                  disabled={loading}
                  autoFocus
                />
                {checking && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  </div>
                )}
                {!checking && available === true && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <FlaticonIcon name="check" className="w-5 h-5" />
                  </div>
                )}
                {!checking && available === false && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <FlaticonIcon name="alert" className="w-5 h-5" />
                  </div>
                )}
              </div>

              {name.length > 0 && name.length < 3 && (
                <p className="mt-2 text-sm text-gray-500">
                  {3 - name.length} more character{3 - name.length !== 1 ? 's' : ''}
                </p>
              )}

              {available === true && (
                <p className="mt-2 text-sm text-lg-green font-medium flex items-center gap-1">
                  <FlaticonIcon name="check" className="w-4 h-4" />
                  Name is available!
                </p>
              )}

              {available === false && (
                <p className="mt-2 text-sm text-lg-bright-purple font-medium flex items-center gap-1">
                  <FlaticonIcon name="alert" className="w-4 h-4" />
                  This name is already taken
                </p>
              )}

              {error && (
                <p className="mt-2 text-sm text-lg-bright-purple font-medium">{error}</p>
              )}
            </div>

            <div className="premium-panel-soft rounded-xl p-4 space-y-2 text-sm text-gray-600">
              <p className="font-semibold text-gray-900">Name Rules:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>At least 3 characters</li>
                <li>Must be unique</li>
                <li>Letters, numbers, and spaces only</li>
                <li>Will be shown on leaderboard</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading || !available || !name}
              className="w-full bg-lg-red hover:bg-lg-red/90 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Continue'
              )}
            </button>
          </form>

          <div className="text-center text-xs text-gray-500">
            Your name will be visible to all users on the leaderboard
          </div>
        </div>
      </div>
    </div>
  );
}
