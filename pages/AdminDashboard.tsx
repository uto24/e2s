import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, Users, ShoppingBag, DollarSign, 
  ArrowUpRight, ArrowDownRight, AlertCircle, Inbox 
} from 'lucide-react';
import { CURRENCY, MOCK_ORDERS } from '../constants';
import { useShop } from '../services/store';

const AdminDashboard: React.FC = () => {
  const { products } = useShop();
  
  const totalRevenue = MOCK_ORDERS.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = MOCK_ORDERS.length;
  const lowStockProducts = products.filter(p => p.stock < 10);
  
  const data: any[] = [];
  const pieData: any[] = [];
  
  const COLORS = ['#22c55e', '#10B981', '#F59E0B', '#6366f1'];

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg bg-${color}-50 text-${color}-600`}>
          <Icon size={24} />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        {trend > 0 ? (
          <span className="text-green-600 flex items-center font-medium">
            <ArrowUpRight size={16} className="mr-1" /> {trend}%
          </span>
        ) : (
          <span className="text-gray-500 flex items-center font-medium">
            <ArrowUpRight size={16} className="mr-1 text-gray-300" /> 0%
          </span>
        )}
        <span className="text-gray-400 ml-2">vs last month</span>
      </div>
    </div>
  );

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center h-full text-gray-400">
      <Inbox size={48} className="mb-2 opacity-20" />
      <p>{message}</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Export Report
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 shadow-sm transition-colors">
            + New Campaign
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`${CURRENCY}${totalRevenue.toLocaleString()}`} 
          icon={DollarSign} 
          color="green" 
          trend={0} 
        />
        <StatCard 
          title="Total Orders" 
          value={totalOrders} 
          icon={ShoppingBag} 
          color="blue" 
          trend={0} 
        />
        <StatCard 
          title="Active Users" 
          value="0" 
          icon={Users} 
          color="purple" 
          trend={0} 
        />
        <StatCard 
          title="Affiliate Sales" 
          value={`${CURRENCY}0`} 
          icon={TrendingUp} 
          color="indigo" 
          trend={0} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Analytics</h3>
          <div className="h-80 w-full bg-gray-50 rounded-lg border border-dashed border-gray-200">
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Area type="monotone" dataKey="uv" stroke="#22c55e" fillOpacity={1} fill="url(#colorUv)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No revenue data available yet" />
            )}
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Sales by Category</h3>
          <div className="h-64 w-full bg-gray-50 rounded-lg border border-dashed border-gray-200 flex items-center justify-center">
             {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
             ) : (
               <EmptyState message="No sales categories found" />
             )}
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Low Stock Alert</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>The following items are running low on stock: {lowStockProducts.map(p => p.title).join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;