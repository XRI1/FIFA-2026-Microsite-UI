import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

export function DemoModeNotice() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gradient-to-r from-lg-yellow to-lg-bright-green text-gray-900 rounded-xl shadow-2xl p-4 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold mb-1">Demo Mode Active</h3>
          <p className="text-sm opacity-90">
            The Supabase backend isn't deployed yet. The app is running in demo mode with mock data.
            To enable full functionality, deploy the Edge Function from Make settings.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-black/10 rounded transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
