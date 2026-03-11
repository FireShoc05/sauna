import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, MessageCircle, Star, RefreshCw } from 'lucide-react';

interface Guest {
  name: string;
  phone: string;
  visits: number;
  lastVisit: string;
  totalSpent: number | null;
  tag?: string;
}

const Guests = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const res = await axios.get('https://sauna-bot-uf1j.onrender.com/api/admin/guests', { withCredentials: true });
        setGuests(res.data.guests);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuests();
  }, []);

  const filteredGuests = guests.filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase()) || 
    g.phone.includes(search)
  );

  const formatWaLink = (guest: Guest) => {
    const phone = guest.phone.replace(/\D/g, '');
    const text = encodeURIComponent(`Здравствуйте, ${guest.name}! 👋\n\nЖдем вас снова в SaunaRelax 🧖`);
    return `https://wa.me/${phone}?text=${text}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-serif text-[#F0EDE8]">Гости (CRM)</h1>
        
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8880]" size={16} />
            <input 
              type="text" 
              placeholder="Поиск по имени/телефону..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#181716] border border-[#2a2a2a] rounded pl-10 pr-4 py-2 text-sm text-[#F0EDE8] focus:outline-none focus:border-[#C9A96E] transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#181716] border border-[#2a2a2a] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#111111] border-b border-[#2a2a2a]">
                <th className="p-4 text-xs font-medium tracking-widest text-[#8A8880] uppercase">Имя</th>
                <th className="p-4 text-xs font-medium tracking-widest text-[#8A8880] uppercase">Телефон</th>
                <th className="p-4 text-xs font-medium tracking-widest text-[#8A8880] uppercase">Визитов</th>
                <th className="p-4 text-xs font-medium tracking-widest text-[#8A8880] uppercase">Последний визит</th>
                <th className="p-4 text-xs font-medium tracking-widest text-[#8A8880] uppercase">Потрачено</th>
                <th className="p-4 text-xs font-medium tracking-widest text-[#8A8880] uppercase">Теги</th>
                <th className="p-4 text-xs font-medium tracking-widest text-[#8A8880] uppercase text-right">Связь</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#8A8880]">Загрузка базы гостей...</td>
                </tr>
              ) : filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#8A8880]">Нет гостей</td>
                </tr>
              ) : (
                filteredGuests.map((g, idx) => (
                  <tr key={idx} className="border-b border-[#2a2a2a] hover:bg-[#111111]/50 transition-colors">
                    <td className="p-4 text-sm text-[#F0EDE8] font-medium">{g.name}</td>
                    <td className="p-4 text-sm text-[#8A8880]">{g.phone}</td>
                    <td className="p-4 text-sm text-[#F0EDE8]">{g.visits}</td>
                    <td className="p-4 text-sm text-[#F0EDE8]">{g.lastVisit}</td>
                    <td className="p-4 text-sm text-[#C9A96E]">{g.totalSpent ? `${g.totalSpent.toLocaleString()} ₽` : '—'}</td>
                    <td className="p-4">
                      {g.visits > 3 && (
                        <span className="flex items-center space-x-1 text-xs px-2 py-1 rounded-full border bg-[#C9A96E]/10 text-[#C9A96E] border-[#C9A96E]/30 w-max">
                          <Star size={12} />
                          <span>VIP</span>
                        </span>
                      )}
                      {g.visits === 2 && g.visits <= 3 && (
                        <span className="flex items-center space-x-1 text-xs px-2 py-1 rounded-full border bg-[#4CAF7D]/10 text-[#4CAF7D] border-[#4CAF7D]/30 w-max">
                          <RefreshCw size={12} />
                          <span>Постоянный</span>
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end">
                        <a 
                          href={formatWaLink(g)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 p-1.5 bg-[#4CAF7D]/10 text-[#4CAF7D] rounded hover:bg-[#4CAF7D]/20 transition-colors"
                          title="Написать в WhatsApp"
                        >
                          <MessageCircle size={16} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Guests;
