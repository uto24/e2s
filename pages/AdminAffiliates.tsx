
import React, { useState, useEffect } from 'react';
import { Check, X, DollarSign, UserCheck, AlertCircle, Inbox, UserPlus, ExternalLink } from 'lucide-react';
import { MOCK_WITHDRAWS, CURRENCY } from '../constants';
import { useShop } from '../services/store';
import { User } from '../types';

const AdminAffiliates: React.FC = () => {
  const { getPendingAffiliates, reviewAffiliate } = useShop();
  const [activeTab, setActiveTab] = useState<'withdraws' | 'applications' | 'affiliates'>('applications');
  const [pendingApplicants, setPendingApplicants] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchApplicants = async () => {
      setLoading(true);
      try {
        const users = await getPendingAffiliates();
        setPendingApplicants(users);
      } catch (e) {
        console.error("Failed to fetch applicants", e);
      }
      setLoading(false);
  };

  useEffect(() => {
      if (activeTab === 'applications') {
          fetchApplicants();
      }
  }, [activeTab]);

  const handleReview = async (userId: string, action: 'approve' | 'reject') => {
      if (!window.confirm(`Are you sure you want to ${action} this applicant?`)) return;
      
      try {
          await reviewAffiliate(userId, action);
          setPendingApplicants(prev => prev.filter(u => u.uid !== userId));
      } catch (error) {
          console.error("Failed to review", error);
          alert("Action failed");
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Affiliate Management</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="-mb-px flex space-x-8 min-w-max">
          <button
            onClick={() => setActiveTab('applications')}
            className={`${
              activeTab === 'applications'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <UserPlus size={16} className="mr-2" /> Applications
             {pendingApplicants.length > 0 && (
                 <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs animate-pulse">
                   {pendingApplicants.length}
                 </span>
             )}
          </button>
          <button
            onClick={() => setActiveTab('withdraws')}
            className={`${
              activeTab === 'withdraws'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <DollarSign size={16} className="mr-2" /> Withdraw Requests
            <span className="ml-2 bg-green-100 text-green-600 py-0.5 px-2 rounded-full text-xs">
              {MOCK_WITHDRAWS.filter(w => w.status === 'pending').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('affiliates')}
            className={`${
              activeTab === 'affiliates'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <UserCheck size={16} className="mr-2" /> All Affiliates
          </button>
        </nav>
      </div>

      {/* Application Tab */}
      {activeTab === 'applications' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             {loading ? (
                 <div className="p-12 text-center text-gray-500">Loading applicants...</div>
             ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promotion Method</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Info</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Links</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Decision</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {pendingApplicants.length > 0 ? (
                                pendingApplicants.map((user) => (
                                    <tr key={user.uid} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-700 line-clamp-2 max-w-xs">{user.affiliateInfo?.promotionMethod}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <div className="font-medium capitalize">{user.affiliateInfo?.paymentMethod}</div>
                                            <div>{user.affiliateInfo?.accountNumber}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {user.affiliateInfo?.socialLink ? (
                                                <a href={user.affiliateInfo.socialLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center">
                                                    Profile <ExternalLink size={12} className="ml-1"/>
                                                </a>
                                            ) : <span className="text-gray-400">N/A</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button 
                                                onClick={() => handleReview(user.uid, 'approve')}
                                                className="bg-green-100 text-green-700 px-3 py-1 rounded-md hover:bg-green-200 mr-2 transition-colors"
                                            >
                                                Approve
                                            </button>
                                            <button 
                                                onClick={() => handleReview(user.uid, 'reject')}
                                                className="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Inbox size={32} className="text-gray-300 mb-2" />
                                            <p>No pending applications.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
             )}
          </div>
      )}

      {/* Withdraws Tab */}
      {activeTab === 'withdraws' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Affiliate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {MOCK_WITHDRAWS.length > 0 ? (
                  MOCK_WITHDRAWS.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{request.affiliateName}</div>
                        <div className="text-xs text-gray-500">{request.affiliateEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{CURRENCY}{request.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">{request.method}</div>
                        <div className="text-xs text-gray-500">{request.accountDetails}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            request.status === 'paid' ? 'bg-green-100 text-green-800' :
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                          {request.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {request.status === 'pending' ? (
                          <div className="flex justify-end space-x-2">
                            <button className="p-1 bg-green-50 text-green-600 rounded hover:bg-green-100" title="Approve & Pay">
                              <Check size={18} />
                            </button>
                            <button className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100" title="Reject">
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Inbox size={32} className="text-gray-300 mb-2" />
                        <p>No withdrawal requests pending.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'affiliates' && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Affiliates List</h3>
          <p className="text-gray-500">No active affiliates found (mock data).</p>
        </div>
      )}
    </div>
  );
};

export default AdminAffiliates;
