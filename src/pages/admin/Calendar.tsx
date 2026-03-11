import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  format, startOfMonth, endOfMonth, eachDayOfInterval, 
  startOfWeek, endOfWeek, isSameMonth, isToday, addMonths, subMonths
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface Booking {
  id: number;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: string;
}


const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('https://sauna-bot-uf1j.onrender.com/api/admin/bookings', { withCredentials: true });
        setBookings(res.data.bookings.filter((b: Booking) => b.status !== 'Отклонена'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const dateFormat = "d";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  // Map bookings to dates (naively comparing 'yyyy-MM-dd' formatted strings)
  const getBookingsForDay = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return bookings.filter(b => b.date === dayStr);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-serif text-[#F0EDE8]">Календарь</h1>
          <div className="flex items-center bg-[#181716] border border-[#2a2a2a] rounded overflow-hidden">
            <button className="px-3 py-1 text-sm bg-[#2a2a2a] text-[#F0EDE8]">Месяц</button>
            <button className="px-3 py-1 text-sm text-[#8A8880] hover:text-[#F0EDE8]">Неделя</button>
            <button className="px-3 py-1 text-sm text-[#8A8880] hover:text-[#F0EDE8]">День</button>
          </div>
        </div>

        <button className="flex items-center space-x-2 bg-[#C9A96E] text-[#0D0C0B] px-4 py-2 rounded text-sm font-medium hover:bg-[#D4B881] transition-colors whitespace-nowrap">
          <Plus size={16} />
          <span>Добавить заявку</span>
        </button>
      </div>

      <div className="bg-[#181716] border border-[#2a2a2a] rounded-xl overflow-hidden flex flex-col h-[calc(100vh-160px)] min-h-[600px]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
          <h2 className="text-lg font-medium text-[#F0EDE8] capitalize">
            {format(currentMonth, 'LLLL yyyy', { locale: ru })}
          </h2>
          <div className="flex space-x-2">
            <button onClick={prevMonth} className="p-2 border border-[#2a2a2a] rounded text-[#8A8880] hover:text-[#F0EDE8] hover:bg-[#2a2a2a] transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button onClick={nextMonth} className="p-2 border border-[#2a2a2a] rounded text-[#8A8880] hover:text-[#F0EDE8] hover:bg-[#2a2a2a] transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-[#2a2a2a] bg-[#111111]">
          {weekDays.map(day => (
            <div key={day} className="py-2 text-center text-xs font-medium tracking-widest text-[#8A8880] uppercase">
              {day}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 grid grid-cols-7 grid-rows-5 md:grid-rows-6">
          {loading ? (
            <div className="col-span-7 flex items-center justify-center text-[#8A8880]">Загрузка календаря...</div>
          ) : (
            days.map((day) => {
              const dayBookings = getBookingsForDay(day);
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isTodayDate = isToday(day);

              return (
                <div 
                  key={day.toString()} 
                  className={`border-r border-b border-[#2a2a2a] p-1 md:p-2 flex flex-col ${!isCurrentMonth ? 'bg-[#111111]/50 opacity-50' : 'hover:bg-[#2a2a2a]/20'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-xs md:text-sm font-medium ${isTodayDate ? 'bg-[#C9A96E] text-[#0D0C0B] w-6 h-6 rounded-full flex items-center justify-center' : 'text-[#8A8880]'}`}>
                      {format(day, dateFormat)}
                    </span>
                  </div>
                  
                  <div className="flex flex-col space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                    {dayBookings.map((b) => (
                      <div 
                        key={b.id} 
                        className={`text-[10px] md:text-xs px-1.5 py-0.5 rounded truncate flex items-center space-x-1 border border-transparent ${
                          b.status === 'Новая' ? 'bg-[#E0A84B]/10 text-[#E0A84B] border-[#E0A84B]/30' :
                          b.status === 'Подтверждена' ? 'bg-[#4CAF7D]/10 text-[#4CAF7D] border-[#4CAF7D]/30' :
                          b.status === 'Закрыта' ? 'bg-[#8A8880]/10 text-[#8A8880] border-[#8A8880]/30' :
                          'bg-[#E05C5C]/10 text-[#E05C5C] border-[#E05C5C]/30'
                        }`}
                        title={`${b.time} - ${b.name}`}
                      >
                        <span className="font-semibold">{b.time}</span>
                        <span className="truncate hidden md:inline">{b.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
