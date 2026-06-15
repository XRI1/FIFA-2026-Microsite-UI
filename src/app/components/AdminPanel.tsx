import { useState } from 'react';
import {
  LayoutDashboard,
  Target,
  FileText,
  BarChart3,
  Users,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Eye,
  TrendingUp
} from 'lucide-react';
import { Mission, MISSIONS_DATA } from '../types/mission';

interface AdminPanelProps {
  onLogout?: () => void;
}

export function AdminPanel({ onLogout }: AdminPanelProps = {}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'missions' | 'submissions' | 'analytics'>('overview');
  const adminName = localStorage.getItem('admin_name') || 'Admin';

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'missions' as const, label: 'Missions', icon: Target },
    { id: 'submissions' as const, label: 'Submissions', icon: FileText },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#F0ECE4]">
      {/* Header */}
      <div className="bg-red-dramatic text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Control Panel</h1>
              <p className="opacity-90">LG Superfan League - Mission Management</p>
            </div>
            {onLogout && (
              <div className="text-right">
                <p className="text-sm opacity-90 mb-2">Logged in as: <strong>{adminName}</strong></p>
                <button
                  onClick={onLogout}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-[#F0ECE4] border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-lg-red border-b-2 border-lg-red'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'missions' && <MissionsTab />}
        {activeTab === 'submissions' && <SubmissionsTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
      </div>
    </div>
  );
}

function OverviewTab() {
  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%', icon: Users, color: 'bg-blue-500' },
    { label: 'Active Missions', value: '7', change: 'Week 1', icon: Target, color: 'bg-lg-red' },
    { label: 'Pending Submissions', value: '45', change: 'Review needed', icon: FileText, color: 'bg-lg-yellow' },
    { label: 'Total Points Awarded', value: '125K', change: '+8%', icon: TrendingUp, color: 'bg-lg-green' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-[#F0ECE4] rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-gray-600">{stat.change}</span>
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-[#F0ECE4] rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-lg-red transition-all">
            <Plus className="w-6 h-6 text-lg-red" />
            <span className="font-semibold">Create Mission</span>
          </button>
          <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-lg-purple transition-all">
            <Eye className="w-6 h-6 text-lg-purple" />
            <span className="font-semibold">Review Submissions</span>
          </button>
          <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-lg-green transition-all">
            <BarChart3 className="w-6 h-6 text-lg-green" />
            <span className="font-semibold">View Reports</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#F0ECE4] rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { user: 'Rahul Ahmed', action: 'completed "Standee Selfie"', time: '2 min ago' },
            { user: 'Priya Das', action: 'submitted "Match Night Setup"', time: '5 min ago' },
            { user: 'Karim Hassan', action: 'completed "Flag Quiz"', time: '12 min ago' },
            { user: 'Admin', action: 'approved 5 submissions', time: '1 hour ago' },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between py-3 border-b last:border-0">
              <div>
                <span className="font-semibold">{activity.user}</span>
                <span className="text-gray-600"> {activity.action}</span>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MissionsTab() {
  const [missions, setMissions] = useState(MISSIONS_DATA);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const toggleMissionActive = (id: string) => {
    setMissions(missions.map(m =>
      m.id === id ? { ...m, isActive: !m.isActive } : m
    ));
  };

  const deleteMission = (id: string) => {
    if (confirm('Are you sure you want to delete this mission?')) {
      setMissions(missions.filter(m => m.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mission Management</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-lg-red hover:bg-lg-red/90 text-white font-semibold py-2 px-6 rounded-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Mission
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-[#F0ECE4] rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-4">Create New Mission</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Mission Title</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-lg-red outline-none"
                placeholder="Enter mission title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Mission Type</label>
              <select className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-lg-red outline-none">
                <option>Photo Upload</option>
                <option>Quiz</option>
                <option>Spot & Count</option>
                <option>Predictor</option>
                <option>Comment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Week</label>
              <input
                type="number"
                min="1"
                max="6"
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-lg-red outline-none"
                placeholder="1-6"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Points</label>
              <input
                type="number"
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-lg-red outline-none"
                placeholder="100"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-lg-red outline-none resize-none"
                rows={3}
                placeholder="Mission description"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="flex-1 bg-lg-red hover:bg-lg-red/90 text-white font-semibold py-2 px-6 rounded-lg transition-all">
              Create Mission
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-[#F0ECE4] rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-semibold">Mission</th>
              <th className="text-left p-4 font-semibold">Week</th>
              <th className="text-left p-4 font-semibold">Type</th>
              <th className="text-left p-4 font-semibold">Points</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-left p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {missions.slice(0, 10).map((mission) => (
              <tr key={mission.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-semibold">{mission.title}</div>
                  <div className="text-sm text-gray-600 line-clamp-1">{mission.description}</div>
                </td>
                <td className="p-4">Week {mission.week}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold capitalize">
                    {mission.type.replace('-', ' ')}
                  </span>
                </td>
                <td className="p-4 font-bold text-lg-red">{mission.points}</td>
                <td className="p-4">
                  <button
                    onClick={() => toggleMissionActive(mission.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      mission.isActive
                        ? 'bg-lg-green/20 text-lg-green'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {mission.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(mission.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => deleteMission(mission.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SubmissionsTab() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const submissions = [
    { id: '1', user: 'Rahul Ahmed', mission: 'Standee Selfie', status: 'pending', timestamp: '2 hours ago' },
    { id: '2', user: 'Priya Das', mission: 'Match Night Setup', status: 'pending', timestamp: '3 hours ago' },
    { id: '3', user: 'Karim Hassan', mission: 'Flag Quiz', status: 'approved', timestamp: '5 hours ago' },
    { id: '4', user: 'Nazia Khan', mission: 'LG Trivia', status: 'approved', timestamp: '1 day ago' },
  ];

  const filteredSubmissions = filter === 'all'
    ? submissions
    : submissions.filter(s => s.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Submission Review</h2>
        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold capitalize transition-all ${
                filter === f
                  ? 'bg-lg-red text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredSubmissions.map((submission) => (
          <div key={submission.id} className="bg-[#F0ECE4] rounded-xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg">{submission.mission}</h3>
                <p className="text-gray-600">by {submission.user}</p>
                <p className="text-sm text-gray-500">{submission.timestamp}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {submission.status}
              </span>
            </div>

            <div className="bg-gray-100 h-64 rounded-lg mb-4 flex items-center justify-center">
              <p className="text-gray-500">Submission content preview</p>
            </div>

            {submission.status === 'pending' && (
              <div className="flex gap-3">
                <button className="flex-1 bg-lg-green hover:bg-lg-green/90 text-white font-semibold py-2 px-6 rounded-lg transition-all flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" />
                  Approve
                </button>
                <button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-all flex items-center justify-center gap-2">
                  <X className="w-5 h-5" />
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics & Reports</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#F0ECE4] rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Mission Completion Rate</h3>
          <div className="space-y-3">
            {[
              { name: 'Standee Selfie', completed: 85, total: 100 },
              { name: 'Match Night Setup', completed: 72, total: 100 },
              { name: 'Flag Quiz', completed: 68, total: 100 },
              { name: 'LG Trivia', completed: 55, total: 100 },
            ].map((mission) => (
              <div key={mission.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{mission.name}</span>
                  <span className="font-semibold">{mission.completed}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-lg-red rounded-full"
                    style={{ width: `${mission.completed}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#F0ECE4] rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Team Distribution</h3>
          <div className="space-y-3">
            {[
              { team: 'Argentina', count: 198, percentage: 16 },
              { team: 'Brazil', count: 234, percentage: 19 },
              { team: 'Germany', count: 187, percentage: 15 },
              { team: 'Spain', count: 176, percentage: 14 },
              { team: 'Others', count: 439, percentage: 36 },
            ].map((item) => (
              <div key={item.team}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.team}</span>
                  <span className="font-semibold">{item.count} users</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-lg-deep-purple rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm lg:col-span-2">
          <h3 className="font-bold text-lg mb-4">Weekly Engagement</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart showing weekly user engagement would appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
