import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Copy, DollarSign, MousePointer, TrendingUp, Wallet, ArrowRight } from 'lucide-react';
import { AFFILIATE_STATS, CURRENCY } from '../constants';
import { useAuth } from '../services/store';
import { Navigate } from 'react-router-dom';
import { UserRole } from '../types';

const AffiliateDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user || user.role !== UserRole.AFFILIATE) {
    return <Navigate to="/" replace />;
  }

  const totalEarnings = AFFILIATE_STATS.reduce((acc, cur) => acc + cur.earnings, 0);
  const totalClicks = AFFILIATE_STATS.reduce((acc, cur) => acc + cur.clicks, 0);
  const referralLink = `${window.location.origin}/?ref=${user.affiliate_id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Affiliate Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {user.name}. Track your performance and earnings.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Edit Profile
          </button>
          <button className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Withdraw Funds
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Earnings</dt>
                  <dd className="text-lg font-medium text-gray-900">{CURRENCY}{totalEarnings.toFixed(2)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Current Balance</dt>
                  <dd className="text-lg font-medium text-gray-900">{CURRENCY}{user.balance.toFixed(2)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <MousePointer className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Clicks</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalClicks}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Conversion Rate</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalClicks > 0 
                      ? ((AFFILIATE_STATS.reduce((a, b) => a + b.conversions, 0) / totalClicks) * 100).toFixed(1) 
                      : 0}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Link */}
      <div className="bg-white shadow sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Your Referral Link</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Share this link to earn commission on any purchase made within 30 days.</p>
          </div>
          <div className="mt-5 sm:flex sm:items-center">
            <div className="w-full sm:max-w-lg">
              <div className="flex rounded-md shadow-sm">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="focus:ring-green-500 focus:border-green-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 p-3 bg-gray-50"
                />
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm hover:bg-gray-100 rounded-r-md"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Earnings History (Last 7 Days)</h3>
          <div className="h-72 w-full flex items-center justify-center bg-gray-50 rounded-lg text-gray-400">
             {AFFILIATE_STATS.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={AFFILIATE_STATS}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tickFormatter={(str) => str.slice(5)} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${CURRENCY}${value}`, 'Earnings']} />
                    <Bar dataKey="earnings" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
             ) : <p>No earnings data</p>}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Clicks vs Conversions</h3>
          <div className="h-72 w-full flex items-center justify-center bg-gray-50 rounded-lg text-gray-400">
             {AFFILIATE_STATS.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={AFFILIATE_STATS}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tickFormatter={(str) => str.slice(5)} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
             ) : <p>No traffic data</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateDashboard;