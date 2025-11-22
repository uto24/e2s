import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { DEFAULT_SETTINGS } from '../constants';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm">
          <Save size={18} className="mr-2" />
          Save Changes
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">General Configuration</h3>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">App Name</label>
              <div className="mt-1">
                <input
                  type="text"
                  name="appName"
                  value={settings.appName}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Currency Symbol</label>
              <div className="mt-1">
                <input
                  type="text"
                  name="currency"
                  value={settings.currency}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Global Tax Rate (%)</label>
              <div className="mt-1">
                <input
                  type="number"
                  name="taxRate"
                  step="0.01"
                  value={settings.taxRate}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                />
              </div>
            </div>

             <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Shipping Cost</label>
              <div className="mt-1">
                <input
                  type="number"
                  name="shippingCost"
                  value={settings.shippingCost}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

       <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Affiliate Configuration</h3>
           <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Global Commission Rate (0.1 = 10%)</label>
              <div className="mt-1">
                <input
                  type="number"
                  name="globalCommission"
                  step="0.01"
                  value={settings.globalCommission}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                />
              </div>
            </div>
           </div>
        </div>
       </div>

       <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:p-6 flex items-center justify-between">
          <div>
             <h3 className="text-lg leading-6 font-medium text-gray-900">Maintenance Mode</h3>
             <p className="text-sm text-gray-500">Close the shop for visitors temporarily.</p>
          </div>
          <div className="flex items-center">
            <button 
               onClick={() => setSettings(s => ({...s, maintenanceMode: !s.maintenanceMode}))}
               className={`${settings.maintenanceMode ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              <span className={`${settings.maintenanceMode ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;