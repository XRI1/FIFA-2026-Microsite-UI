import { useState, useEffect } from 'react';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';
import { supabase } from '../../utils/supabase/client';

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const sessionToken = localStorage.getItem('admin_session');

    if (!sessionToken) {
      setLoading(false);
      return;
    }

    try {
      // Verify session
      const { data: session, error } = await supabase
        .from('admin_sessions')
        .select('*, admin_users(*)')
        .eq('session_token', sessionToken)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !session || !session.admin_users?.is_active) {
        // Invalid or expired session
        handleLogout();
        setLoading(false);
        return;
      }

      console.log(' Admin session valid:', session.admin_users.name);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Session check error:', err);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (adminId: string, sessionToken: string) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_id');
    localStorage.removeItem('admin_name');
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0ECE4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lg-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <AdminPanel onLogout={handleLogout} />;
}
