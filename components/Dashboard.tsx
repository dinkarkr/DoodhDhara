
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area 
} from 'recharts';
import { MilkEntry } from '../types';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Droplets, 
  Wallet,
  Users
} from 'lucide-react';

interface DashboardProps {
  entries: MilkEntry[];
  contractorsCount: number;
}

const Dashboard: React.FC<DashboardProps> = ({ entries, contractorsCount }) => {
  const stats = useMemo(() => {
    const totalPurchase = entries
      .filter(e => e.type === 'PURCHASE')
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    const totalSales = entries
      .filter(e => e.type === 'SALE')
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    const totalQty = entries
      .filter(e => e.type === 'PURCHASE')
      .reduce((acc, curr) => acc + curr.quantity, 0);

    const profit = totalSales - totalPurchase;

    return { totalPurchase, totalSales, totalQty, profit };
  }, [entries]);

  const chartData = useMemo(() => {
    const monthlyMap: Record<string, { month: string; purchase: number; sale: number }> = {};
    
    // Last 6 months or so
    entries.forEach(entry => {
      const date = new Date(entry.date);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { month: monthKey, purchase: 0, sale: 0 };
      }
      
      if (entry.type === 'PURCHASE') monthlyMap[monthKey].purchase += entry.amount;
      else monthlyMap[monthKey].sale += entry.amount;
    });

    return Object.values(monthlyMap);
  }, [entries]);

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center text-sm font-medium ${trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">
          {typeof value === 'number' ? `₹${value.toLocaleString('en-IN')}` : value}
        </h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Business Overview</h1>
        <p className="text-slate-500 mt-1">Real-time performance metrics and milk collection stats.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Purchases" 
          value={stats.totalPurchase} 
          icon={Wallet} 
          color="bg-blue-500"
          trend={12}
        />
        <StatCard 
          title="Total Sales" 
          value={stats.totalSales} 
          icon={TrendingUp} 
          color="bg-indigo-500"
          trend={8}
        />
        <StatCard 
          title="Milk Collected" 
          value={`${stats.totalQty.toLocaleString('en-IN')} Ltr`} 
          icon={Droplets} 
          color="bg-sky-500"
        />
        <StatCard 
          title="Active Contractors" 
          value={contractorsCount} 
          icon={Users} 
          color="bg-violet-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Revenue vs Expense</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="sale" name="Sales (Revenue)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="purchase" name="Purchase (Expense)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Cash Flow Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSale" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area 
                  type="monotone" 
                  dataKey="sale" 
                  stroke="#6366f1" 
                  fillOpacity={1} 
                  fill="url(#colorSale)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
