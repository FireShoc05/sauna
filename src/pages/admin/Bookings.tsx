import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Check, X, CreditCard, Search, FileDown, Eye, Edit } from 'lucide-react';

interface Booking {
  id: number;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  comment: string;
  status: string;
  amount: number | null;
  notes: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  'Новая': 'bg-[#E0A84B]/10 text-[#E0A84B] border-[#E0A84B]/30',
  'Подтверждена': 'bg-[#4CAF7D]/10 text-[#4CAF7D] border-[#4CAF7D]/30',
  'Закрыта': 'bg-[#8A8880]/10 text-[#8A8880] border-[#8A8880]/30',
  'Отклонена': 'bg-[#E05C5C]/10 text-[#E05C5C] border-[#E05C5C]/30',
};

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Все');

  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  
  // Close Modal State
  const [amountInput, setAmountInput] = useState('');
  const [notesInput, setNotesInput] = useState('');

  // Edit Modal State
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editGuests, setEditGuests] = useState(1);
  const [editStatus, setEditStatus] = useState('');

  const fetchBookings = async () => {
    try {
      const res = await api.get('/api/admin/bookings');
      setBookings(res.data.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/api/admin/bookings/${id}`, { status });
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert('Ошибка при обновлении статуса');
    }
  };

  const openCloseModal = (booking: Booking) => {
    setActiveBooking(booking);
    setAmountInput(booking.amount?.toString() || '');
    setNotesInput(booking.notes || '');
    setCloseModalOpen(true);
  };

  const openEditModal = (booking: Booking) => {
    setActiveBooking(booking);
    setEditDate(booking.date);
    setEditTime(booking.time);
    setEditGuests(booking.guests);
    setEditStatus(booking.status);
    setEditModalOpen(true);
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBooking) return;
    try {
      await api.put(`/api/admin/bookings/${activeBooking.id}`, {
        date: editDate,
        time: editTime,
        guests: editGuests,
        status: editStatus
      });
      setEditModalOpen(false);
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert('Ошибка при сохранении изменений');
    }
  };

  const submitClose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBooking) return;
    try {
      await api.put(`/api/admin/bookings/${activeBooking.id}`, {
        status: 'Закрыта',
        amount: parseFloat(amountInput),
        notes: notesInput
      });
      setCloseModalOpen(false);
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert('Ошибка при закрытии заявки');
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.phone.includes(search);
    const matchStatus = statusFilter === 'Все' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-serif text-[#F0EDE8]">Список заявок</h1>
        
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
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto bg-[#181716] border border-[#2a2a2a] rounded px-4 py-2 text-sm text-[#F0EDE8] focus:outline-none focus:border-[#C9A96E] transition-colors"
          >
            <option value="Все">Все статусы</option>
            <option value="Новая">Новые</option>
            <option value="Подтверждена">Подтвержденные</option>
            <option value="Закрыта">Закрытые</option>
            <option value="Отклонена">Отклоненные</option>
          </select>

          <button className="flex items-center space-x-2 bg-[#181716] border border-[#2a2a2a] text-[#8A8880] px-4 py-2 rounded text-sm hover:text-[#C9A96E] hover:border-[#C9A96E] transition-colors whitespace-nowrap">
            <FileDown size={16} />
            <span>Экспорт</span>
          </button>
        </div>
      </div>

      <div className="bg-[#181716] border border-[#2a2a2a] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#111111] border-b border-[#2a2a2a]">
                <th className="p-4 text-xs font-medium tracking-widest text-[#8A8880] uppercase">ID</th>
                <th className="p-4 text-xs font-medium tracking-widest text-[#8A8880] uppercase">Гость</th>
                <th className="p-4 text-xs font-medium tracking-widest text-[#8A8880] uppercase">Дата / Время</th>
                <th className="p-4 text-xs font-medium tracking-widest text-[#8A8880] uppercase">Гостей</th>
                <th className="p-4 text-xs font-medium tracking-widest text-[#8A8880] uppercase">Статус</th>
                <th className="p-4 text-xs font-medium tracking-widest text-[#8A8880] uppercase">Сумма</th>
                <th className="p-4 text-xs font-medium tracking-widest text-[#8A8880] uppercase text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#8A8880]">Загрузка...</td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#8A8880]">Ничего не найдено</td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="border-b border-[#2a2a2a] hover:bg-[#111111]/50 transition-colors">
                    <td className="p-4 text-sm text-[#8A8880]">#{b.id}</td>
                    <td className="p-4">
                      <div className="text-[#F0EDE8] font-medium">{b.name}</div>
                      <div className="text-xs text-[#8A8880]">{b.phone}</div>
                    </td>
                    <td className="p-4 text-sm text-[#F0EDE8]">
                      <div>{b.date}</div>
                      <div className="text-[#C9A96E]">{b.time}</div>
                    </td>
                    <td className="p-4 text-sm text-[#F0EDE8]">{b.guests} чел.</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[b.status] || 'bg-gray-500/10 text-gray-500'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-[#F0EDE8]">
                      {b.amount ? `${b.amount.toLocaleString()} ₽` : '—'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {b.status === 'Новая' && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(b.id, 'Подтверждена')}
                              className="p-1.5 bg-[#4CAF7D]/10 text-[#4CAF7D] rounded hover:bg-[#4CAF7D]/20 transition-colors"
                              title="Подтвердить"
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(b.id, 'Отклонена')}
                              className="p-1.5 bg-[#E05C5C]/10 text-[#E05C5C] rounded hover:bg-[#E05C5C]/20 transition-colors"
                              title="Отклонить"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => openEditModal(b)}
                          className="p-1.5 text-[#8A8880] hover:text-[#C9A96E] transition-colors" 
                          title="Редактировать параметры (дату, время, статус)"
                        >
                          <Edit size={16} />
                        </button>
                        {b.status === 'Подтверждена' && (
                          <button 
                            onClick={() => openCloseModal(b)}
                            className="p-1.5 bg-[#C9A96E]/10 text-[#C9A96E] rounded hover:bg-[#C9A96E]/20 transition-colors flex items-center space-x-1"
                            title="Закрыть заявку и ввести сумму"
                          >
                            <CreditCard size={16} />
                          </button>
                        )}
                        <button className="p-1.5 text-[#8A8880] hover:text-[#F0EDE8] transition-colors hidden" title="Просмотр">
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {closeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#181716] border border-[#2a2a2a] rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif text-[#F0EDE8]">Закрытие заявки #{activeBooking?.id}</h2>
              <button onClick={() => setCloseModalOpen(false)} className="text-[#8A8880] hover:text-[#F0EDE8]">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={submitClose} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#8A8880] mb-2">Итоговая сумма (₽)</label>
                <input 
                  type="number" 
                  required
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full bg-[#0D0C0B] border border-[#2a2a2a] rounded p-3 text-[#F0EDE8] focus:outline-none focus:border-[#C9A96E] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#8A8880] mb-2">Заметка (опционально)</label>
                <textarea 
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="w-full bg-[#0D0C0B] border border-[#2a2a2a] rounded p-3 text-[#F0EDE8] focus:outline-none focus:border-[#C9A96E] transition-colors min-h-[100px]"
                />
              </div>
              <div className="pt-4 flex justify-end">
                <button type="submit" className="bg-[#C9A96E] text-[#0D0C0B] font-medium px-6 py-2 rounded hover:bg-[#D4B881] transition-colors">
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#181716] border border-[#2a2a2a] rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif text-[#F0EDE8]">Редактирование #{activeBooking?.id}</h2>
              <button onClick={() => setEditModalOpen(false)} className="text-[#8A8880] hover:text-[#F0EDE8]">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={submitEdit} className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#8A8880] mb-2">Дата</label>
                  <input 
                    type="date" 
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full bg-[#0D0C0B] border border-[#2a2a2a] rounded p-3 text-[#F0EDE8] focus:outline-none focus:border-[#C9A96E] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#8A8880] mb-2">Время</label>
                  <input 
                    type="time" 
                    required
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full bg-[#0D0C0B] border border-[#2a2a2a] rounded p-3 text-[#F0EDE8] focus:outline-none focus:border-[#C9A96E] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#8A8880] mb-2">Кол-во гостей</label>
                  <input 
                    type="number" 
                    min="1"
                    max="10"
                    required
                    value={editGuests}
                    onChange={(e) => setEditGuests(parseInt(e.target.value))}
                    className="w-full bg-[#0D0C0B] border border-[#2a2a2a] rounded p-3 text-[#F0EDE8] focus:outline-none focus:border-[#C9A96E] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#8A8880] mb-2">Статус</label>
                  <select 
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-[#0D0C0B] border border-[#2a2a2a] rounded p-3 text-[#F0EDE8] focus:outline-none focus:border-[#C9A96E] transition-colors"
                  >
                    <option value="Новая">Новая</option>
                    <option value="Подтверждена">Подтверждена</option>
                    <option value="Закрыта">Закрыта</option>
                    <option value="Отклонена">Отклонена</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setEditModalOpen(false)} className="text-[#8A8880] px-4 py-2 rounded hover:text-[#F0EDE8] transition-colors">
                  Отмена
                </button>
                <button type="submit" className="bg-[#C9A96E] text-[#0D0C0B] font-medium px-6 py-2 rounded hover:bg-[#D4B881] transition-colors">
                  Обновить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
