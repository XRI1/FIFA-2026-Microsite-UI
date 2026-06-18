import { useState } from 'react';
import { Link } from 'react-router';
import { supabase } from '../../../utils/supabase/client';
import lgLogo from '../../imports/LGE_Electronics_Logo_HeritageRed_Grey_RGB.png';
import { FlaticonIcon } from './FlaticonIcon';

interface AdminLoginProps {
  onLoginSuccess: (adminId: string, sessionToken: string) => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!adminId || !password) {
      setError('Please enter both Admin ID and Password');
      return;
    }

    setLoading(true);

    try {
      // Verify admin credentials
      const { data: admin, error: authError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('admin_id', adminId)
        .eq('is_active', true)
        .single();

      if (authError || !admin) {
        setError('Invalid Admin ID or Password');
        setLoading(false);
        return;
      }

      // Simple password verification (in production, use proper password hashing!)
      if (admin.password_hash !== password) {
        setError('Invalid Admin ID or Password');
        setLoading(false);
        return;
      }

      // Create session token
      const sessionToken = `${admin.id}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

      // Save session
      const { error: sessionError } = await supabase
        .from('admin_sessions')
        .insert({
          admin_id: admin.id,
          session_token: sessionToken,
          expires_at: expiresAt
        });

      if (sessionError) {
        console.error('Session error:', sessionError);
        setError('Failed to create session. Please try again.');
        setLoading(false);
        return;
      }

      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', admin.id);

      console.log('✅ Admin login successful:', admin.name);

      // Store session in localStorage
      localStorage.setItem('admin_session', sessionToken);
      localStorage.setItem('admin_id', admin.admin_id);
      localStorage.setItem('admin_name', admin.name);

      // Call success callback
      onLoginSuccess(admin.admin_id, sessionToken);

    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-dramatic flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl shadow-2xl p-8 space-y-6" style={{ backgroundColor: "#F0ECE4" }}>
          {/* Header */}
          <div className="text-center space-y-4">
            <img
              src={lgLogo}
              alt="LG Electronics"
              className="h-10 w-auto mx-auto"
            />
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 font-lg-smart tracking-wide">
              SUPER FAN LEAGUE
            </h1>
            <div className="w-20 h-20 bg-gradient-to-br from-lg-deep-purple to-lg-purple rounded-full flex items-center justify-center mx-auto">
              <FlaticonIcon name="shield" className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Admin Login</h2>
              <p className="text-sm text-gray-600 mt-2">FIFA 2026 Bangladesh</p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="adminId" className="block text-sm font-medium text-gray-700 mb-2">
                Admin ID
              </label>
              <input
                id="adminId"
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="Enter your admin ID"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-lg-deep-purple focus:ring-2 focus:ring-lg-deep-purple/20 outline-none transition-all"
                disabled={loading}
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-lg-deep-purple focus:ring-2 focus:ring-lg-deep-purple/20 outline-none transition-all"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 flex items-center gap-2">
                <FlaticonIcon name="alert" className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-lg-deep-purple to-lg-purple hover:from-lg-purple hover:to-lg-deep-purple text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <FlaticonIcon name="shield" className="w-5 h-5" />
                  Login to Admin Panel
                </>
              )}
            </button>
          </form>

          {/* Default Credentials Notice */}
          <div className="bg-lg-yellow/20 border-2 border-lg-yellow rounded-xl p-4">
            <p className="text-xs text-gray-700 font-semibold mb-2">Default Credentials (Demo):</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p><strong>Admin ID:</strong> admin</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
            <p className="text-xs text-red-600 font-semibold mt-2">
              ⚠️ Change password in production!
            </p>
          </div>

          {/* Back to User App */}
          <div className="text-center">
            <Link
              to="/"
              className="text-sm text-lg-deep-purple hover:text-lg-purple font-semibold transition-colors"
            >
              ← Back to User App
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
