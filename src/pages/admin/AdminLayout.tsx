import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Settings, LogOut, FileText, Menu, X, ChevronRight } from 'lucide-react';
import api from '@/lib/api';

const navItems = [
  { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Дашборд' },
  { path: '/admin/bookings', icon: <FileText size={20} />, label: 'Заявки' },
  { path: '/admin/calendar', icon: <Calendar size={20} />, label: 'Календарь' },
  { path: '/admin/guests', icon: <Users size={20} />, label: 'Гости' },
  { path: '/admin/settings', icon: <Settings size={20} />, label: 'Настройки' },
];

const AdminLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await api.get('/api/admin/bookings');
        setIsAuthenticated(true);
      } catch (error) {
        navigate('/admin/login');
      }
    };
    verifyAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (!isAuthenticated) return null;

  // Find current page label for mobile header
  const currentPage = navItems.find(
    item => location.pathname === item.path || 
    (item.path !== '/admin' && location.pathname.startsWith(item.path))
  );

  return (
    <div className="flex h-screen bg-[#0D0C0B] text-[#F0EDE8] overflow-hidden font-sans">

      {/* ========== MOBILE TOP BAR (md:hidden) ========== */}
      <div className="fixed top-0 left-0 right-0 z-50 md:hidden bg-[#111111] border-b border-[#2a2a2a] h-14 flex items-center justify-between px-4">
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-[#8A8880] hover:text-[#C9A96E] transition-colors"
        >
          <Menu size={22} />
        </button>
        <span className="text-sm font-serif text-[#C9A96E] tracking-wider">
          {currentPage?.label || 'SaunaRelax'}
        </span>
        <button 
          onClick={handleLogout}
          className="p-2 text-[#8A8880] hover:text-[#E05C5C] transition-colors"
          title="Выйти"
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* ========== MOBILE SIDEBAR OVERLAY (md:hidden) ========== */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/60 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ========== MOBILE SLIDE-OUT SIDEBAR (md:hidden) ========== */}
      <aside 
        className={`
          fixed top-0 left-0 bottom-0 z-[70] w-64 bg-[#111111] border-r border-[#2a2a2a]
          flex flex-col justify-between md:hidden
          transform transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div>
          <div className="h-14 flex items-center justify-between px-6 border-b border-[#2a2a2a]">
            <span className="text-lg font-serif text-[#C9A96E] tracking-wider">SaunaRelax</span>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 text-[#8A8880] hover:text-[#F0EDE8] transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <nav className="mt-6 px-3 flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-[#C9A96E]/10 text-[#C9A96E] border-l-2 border-[#C9A96E]'
                      : 'text-[#8A8880] active:bg-[#181716] active:text-[#F0EDE8]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={16} className="text-[#C9A96E]/60" />}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-[#2a2a2a]">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-[#8A8880] active:bg-[#181716] active:text-[#E05C5C] transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm">Выйти</span>
          </button>
        </div>
      </aside>

      {/* ========== DESKTOP SIDEBAR (hidden on mobile, md:flex) ========== */}
      <aside className="w-64 bg-[#111111] border-r border-[#2a2a2a] flex-col justify-between hidden md:flex">
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

      {/* ========== MAIN CONTENT ========== */}
      <main className="flex-1 overflow-y-auto bg-[#0D0C0B] relative">
        <div className="pt-14 md:pt-0">
          <div className="p-4 md:p-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
