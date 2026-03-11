import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Settings, LogOut, FileText } from 'lucide-react';
import axios from 'axios';

const navItems = [
  { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Дашборд' },
  { path: '/admin/bookings', icon: <FileText size={20} />, label: 'Заявки' },
  { path: '/admin/calendar', icon: <Calendar size={20} />, label: 'Календарь' },
  { path: '/admin/guests', icon: <Users size={20} />, label: 'Гости' },
  { path: '/admin/settings', icon: <Settings size={20} />, label: 'Настройки' },
];

const AdminLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await axios.get('http://localhost:3001/api/admin/bookings', { withCredentials: true });
        setIsAuthenticated(true);
      } catch (error) {
        navigate('/admin/login');
      }
    };
    verifyAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3001/api/admin/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      navigate('/admin/login');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-[#0D0C0B] text-[#F0EDE8] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111] border-r border-[#2a2a2a] flex flex-col justify-between hidden md:flex">
        <div>
          <div className="h-20 flex items-center px-8 border-b border-[#2a2a2a]">
            <span className="text-xl font-serif text-[#C9A96E] tracking-wider">SaunaRelax</span>
          </div>
          
          <nav className="mt-8 px-4 flex flex-col space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                    isActive
                      ? 'bg-[#181716] text-[#C9A96E] border-l-2 border-[#C9A96E]'
                      : 'text-[#8A8880] hover:bg-[#181716] hover:text-[#F0EDE8]'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-[#2a2a2a]">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm text-[#8A8880]">Администратор</span>
            <button 
              onClick={handleLogout}
              className="text-[#8A8880] hover:text-[#E05C5C] transition-colors"
              title="Выйти"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#0D0C0B] relative">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
