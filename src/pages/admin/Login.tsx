import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const AdminLogin = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // NOTE: Configure correct backend URL (e.g. from env)
      const res = await axios.post('https://sauna-bot-uf1j.onrender.com/api/admin/login', { login, password }, {
        withCredentials: true
      });
      
      if (res.data.success) {
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка подключения');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0C0B] flex items-center justify-center font-sans p-4">
      <motion.div
        animate={isShaking ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="bg-[#181716] border border-[#2a2a2a] rounded-xl p-8 max-w-sm w-full relative"
      >
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-serif text-[#C9A96E] tracking-wider mb-2">SaunaRelax</h1>
          <p className="text-[#8A8880] text-sm">Панель управления</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#8A8880] mb-2 text-left">Логин</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full bg-[#0D0C0B] border border-[#2a2a2a] rounded p-3 text-[#F0EDE8] focus:outline-none focus:border-[#C9A96E] transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#8A8880] mb-2 text-left">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0D0C0B] border border-[#2a2a2a] rounded p-3 text-[#F0EDE8] focus:outline-none focus:border-[#C9A96E] transition-colors"
              required
            />
          </div>

          {error && (
            <p className="text-[#E05C5C] text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#C9A96E] text-[#0D0C0B] font-medium p-3 rounded hover:bg-[#D4B881] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
