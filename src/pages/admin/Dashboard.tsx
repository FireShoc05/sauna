import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { DollarSign, FileText, Activity, Users } from 'lucide-react';

interface StatsData {
  cards: {
    revenue: number;
    bookings: number;
    active: number;
    uniqueGuests: number;
  };
  charts: {
    revenueByDay: { date: string, total: number }[];
    statusCounts: { status: string, count: number }[];
  }
}

const COLORS: Record<string, string> = {
  'Новая': '#E0A84B',
  'Подтверждена': '#4CAF7D',
  'Закрыта': '#8A8880',
  'Отклонена': '#E05C5C',
};

const STATS_COLORS = ['#E0A84B', '#4CAF7D', '#8A8880', '#E05C5C', '#C9A96E'];

const Dashboard = () => {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('https://sauna-bot-uf1j.onrender.com/api/admin/stats', {
          withCredentials: true
        });
        setData(res.data);
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#8A8880] animate-pulse">Загрузка данных...</p>
      </div>
    );
  }

  const pieData = data.charts.statusCounts.map(item => ({
    name: item.status,
    value: item.count
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif text-[#F0EDE8]">Дашборд</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#181716] border border-[#2a2a2a] rounded-xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#8A8880] font-medium uppercase text-xs tracking-widest">Выручка</h3>
            <div className="p-2 bg-[#C9A96E]/10 rounded text-[#C9A96E]">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="text-3xl font-serif text-[#F0EDE8]">
            {data.cards.revenue.toLocaleString('ru-RU')} ₽
          </div>
        </div>

        <div className="bg-[#181716] border border-[#2a2a2a] rounded-xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#8A8880] font-medium uppercase text-xs tracking-widest">Заявок</h3>
            <div className="p-2 bg-[#C9A96E]/10 rounded text-[#C9A96E]">
              <FileText size={20} />
            </div>
          </div>
          <div className="text-3xl font-serif text-[#F0EDE8]">
            {data.cards.bookings}
          </div>
        </div>

        <div className="bg-[#181716] border border-[#2a2a2a] rounded-xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#8A8880] font-medium uppercase text-xs tracking-widest">В работе</h3>
            <div className="p-2 bg-[#C9A96E]/10 rounded text-[#C9A96E]">
              <Activity size={20} />
            </div>
          </div>
          <div className="text-3xl font-serif text-[#F0EDE8]">
            {data.cards.active}
          </div>
          <p className="text-xs text-[#8A8880] mt-2">Новых или подтвержд.</p>
        </div>

        <div className="bg-[#181716] border border-[#2a2a2a] rounded-xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#8A8880] font-medium uppercase text-xs tracking-widest">Гостей</h3>
            <div className="p-2 bg-[#C9A96E]/10 rounded text-[#C9A96E]">
              <Users size={20} />
            </div>
          </div>
          <div className="text-3xl font-serif text-[#F0EDE8]">
            {data.cards.uniqueGuests}
          </div>
          <p className="text-xs text-[#8A8880] mt-2">Уникальных номеров</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#181716] border border-[#2a2a2a] rounded-xl p-6">
          <h3 className="text-[#F0EDE8] font-medium mb-6">Выручка по дням (Закрытые)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.charts.revenueByDay} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="date" stroke="#8A8880" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8A8880" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val} ₽`} />
                <Tooltip 
                  cursor={{ fill: '#2a2a2a' }}
                  contentStyle={{ backgroundColor: '#111111', borderColor: '#2a2a2a', color: '#F0EDE8' }}
                />
                <Bar dataKey="total" fill="#C9A96E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#181716] border border-[#2a2a2a] rounded-xl p-6">
          <h3 className="text-[#F0EDE8] font-medium mb-6">Статусы заявок</h3>
          <div className="h-72">
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
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || STATS_COLORS[index % STATS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111111', borderColor: '#2a2a2a', color: '#F0EDE8' }}
                  itemStyle={{ color: '#F0EDE8' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#8A8880' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
