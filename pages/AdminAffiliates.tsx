import React, { useState } from 'react';
import { Check, X, DollarSign, UserCheck, AlertCircle } from 'lucide-react';
import { MOCK_WITHDRAWS, CURRENCY } from '../constants';

const AdminAffiliates: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'withdraws' | 'affiliates'>('withdraws');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Affiliate Management</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('withdraws')}
            className={`${
              activeTab === 'withdraws'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <DollarSign size={16} className="mr-2" /> Withdraw Requests
            <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
              {MOCK_WITHDRAWS.filter(w => w.status === 'pending').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('affiliates')}
            className={`${
              activeTab === 'affiliates'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <UserCheck size={16} className="mr-2" /> All Affiliates
          </button>
        </nav>
      </div>

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
                {MOCK_WITHDRAWS.map((request) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'affiliates' && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Affiliates List</h3>
          <p className="text-gray-500">Functionality to view and manage all registered affiliates.</p>
        </div>
      )}
    </div>
  );
};

export default AdminAffiliates;