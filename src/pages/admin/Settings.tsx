const Settings = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl">
      <h1 className="text-2xl font-serif text-[#F0EDE8]">Настройки</h1>
      
      <div className="bg-[#181716] border border-[#2a2a2a] rounded-xl p-6 space-y-8">
        
        <div>
          <h2 className="text-lg font-medium text-[#C9A96E] mb-4">Основные настройки</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8A8880] mb-2">Название</label>
              <input 
                type="text" 
                defaultValue="SaunaRelax"
                disabled
                className="w-full bg-[#0D0C0B] border border-[#2a2a2a] rounded p-3 text-[#8A8880] opacity-70"
              />
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8A8880] mb-2">Телефон (для уведомлений)</label>
              <input 
                type="text" 
                defaultValue="+7 (495) 777-77-77"
                className="w-full bg-[#0D0C0B] border border-[#2a2a2a] rounded p-3 text-[#F0EDE8] focus:outline-none focus:border-[#C9A96E] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8A8880] mb-2">Стандартная ставка (₽/час)</label>
              <input 
                type="number" 
                defaultValue="3000"
                className="w-full bg-[#0D0C0B] border border-[#2a2a2a] rounded p-3 text-[#F0EDE8] focus:outline-none focus:border-[#C9A96E] transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#2a2a2a]">
          <h2 className="text-lg font-medium text-[#C9A96E] mb-4">Безопасность</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#8A8880] mb-2">Новый пароль админ-панели</label>
              <input 
                type="password" 
                placeholder="Оставьте пустым, чтобы не менять"
                className="w-full bg-[#0D0C0B] border border-[#2a2a2a] rounded p-3 text-[#F0EDE8] focus:outline-none focus:border-[#C9A96E] transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button className="bg-[#C9A96E] text-[#0D0C0B] font-medium px-6 py-2 rounded hover:bg-[#D4B881] transition-colors">
            Сохранить настройки
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
