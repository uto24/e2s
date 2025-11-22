import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, Users, ShoppingBag, DollarSign, 
  ArrowUpRight, ArrowDownRight, AlertCircle 
} from 'lucide-react';
import { CURRENCY, MOCK_ORDERS, AFFILIATE_STATS, PRODUCTS } from '../constants';

const AdminDashboard: React.FC = () => {
  // Calculate real stats from mock data
  const totalRevenue = MOCK_ORDERS.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = MOCK_ORDERS.length;
  const lowStockProducts = PRODUCTS.filter(p => p.stock < 10);
  
  const data = [
    { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
  ];

  const pieData = [
    { name: 'Electronics', value: 400 },
    { name: 'Fashion', value: 300 },
    { name: 'Home', value: 300 },
    { name: 'Beauty', value: 200 },
  ];
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899'];

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
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
          <span className="text-red-600 flex items-center font-medium">
            <ArrowDownRight size={16} className="mr-1" /> {Math.abs(trend)}%
          </span>
        )}
        <span className="text-gray-400 ml-2">vs last month</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Export Report
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 shadow-sm">
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
          color="indigo" 
          trend={12.5} 
        />
        <StatCard 
          title="Total Orders" 
          value={totalOrders} 
          icon={ShoppingBag} 
          color="blue" 
          trend={8.2} 
        />
        <StatCard 
          title="Active Users" 
          value="1,204" 
          icon={Users} 
          color="purple" 
          trend={-2.4} 
        />
        <StatCard 
          title="Affiliate Sales" 
          value={`${CURRENCY}4,320`} 
          icon={TrendingUp} 
          color="green" 
          trend={24.0} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Analytics</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Area type="monotone" dataKey="uv" stroke="#4F46E5" fillOpacity={1} fill="url(#colorUv)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Sales by Category</h3>
          <div className="h-64">
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
          </div>
          <div className="mt-4 space-y-3">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-gray-600">{entry.name}</span>
                </div>
                <span className="font-medium text-gray-900">{((entry.value / 1200) * 100).toFixed(0)}%</span>
              </div>
            ))}
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