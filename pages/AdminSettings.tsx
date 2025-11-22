import React, { useState, useEffect } from 'react';
import { Save, Sliders, Power } from 'lucide-react';
import { useShop } from '../services/store';

const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useShop();
  const [localSettings, setLocalSettings] = useState(settings);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = () => {
    const payload = {
      ...localSettings,
      taxRate: Number(localSettings.taxRate),
    };

    updateSettings(payload);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const toggleMaintenance = () => {
    const newVal = !localSettings.maintenanceMode;
    const updated = { ...localSettings, maintenanceMode: newVal };
    setLocalSettings(updated);
    updateSettings(updated);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <button 
          onClick={handleSave}
          className={`flex items-center px-4 py-2 rounded-lg text-white shadow-sm w-full sm:w-auto justify-center transition-colors ${isSaved ? 'bg-green-600' : 'bg-red-600 hover:bg-red-700'}`}
        >
          <Save size={18} className="mr-2" />
          {isSaved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* General Config */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center mb-4">
            <Sliders className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg leading-6 font-medium text-gray-900">General Configuration</h3>
          </div>
          
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">App Name</label>
              <div className="mt-1">
                <input
                  type="text"
                  name="appName"
                  value={localSettings.appName}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
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
                  value={localSettings.taxRate}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

       {/* Maintenance Mode */}
       <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-start">
             <div className="flex-shrink-0">
               <Power className="h-6 w-6 text-gray-400" />
             </div>
             <div className="ml-3">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Maintenance Mode</h3>
                <p className="text-sm text-gray-500">Close the shop for visitors temporarily.</p>
             </div>
          </div>
          <div className="flex items-center">
            <button 
               onClick={toggleMaintenance}
               className={`${localSettings.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
            >
              <span className={`${localSettings.maintenanceMode ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;