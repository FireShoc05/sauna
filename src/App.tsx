import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

// Pages
import Home from '@/pages/Home';
import Reviews from '@/pages/Reviews';
import Photos from '@/pages/Photos';

// Admin Pages
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminLogin from '@/pages/admin/Login';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminBookings from '@/pages/admin/Bookings';
import AdminCalendar from '@/pages/admin/Calendar';
import AdminGuests from '@/pages/admin/Guests';
import AdminSettings from '@/pages/admin/Settings';

const navLinks = [
  { path: '/', label: 'Главная' },
  { path: '/reviews', label: 'Отзывы' },
  { path: '/photos', label: 'Галерея' },
];

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 80);
  });

  // Force transparent header only on home page when at top
  const isHomePage = location.pathname === '/';
  const headerBgClass = isScrolled || !isHomePage 
    ? 'bg-background/90 backdrop-blur-md border-b border-accent/20 py-4' 
    : 'bg-transparent py-6';

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="calendar" element={<AdminCalendar />} />
          <Route path="guests" element={<AdminGuests />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    );
  }

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBgClass}`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="text-2xl font-serif text-accent tracking-wider font-medium">
            SaunaRelax
          </Link>
          
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((s) => (
              <Link
                key={s.path}
                to={s.path}
                className={`text-sm font-light uppercase tracking-widest transition-colors duration-300 ${
                  location.pathname === s.path ? 'text-accent' : 'text-muted-foreground hover:text-accent'
                }`}
              >
                {s.label}
              </Link>
            ))}
          </div>

          <button 
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl flex flex-col justify-center items-center"
          >
            <button 
              className="absolute top-6 right-6 text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={32} />
            </button>
            <div className="flex flex-col space-y-8 items-center">
              {navLinks.map((s) => (
                <Link
                  key={s.path}
                  to={s.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-2xl font-serif transition-colors ${
                    location.pathname === s.path ? 'text-accent' : 'text-foreground hover:text-accent'
                  }`}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative w-full overflow-hidden min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/photos" element={<Photos />} />
        </Routes>
      </main>

      {/* GLOBAL FOOTER */}
      <footer id="contacts" className="border-t border-accent/20 bg-[#0a0a09] py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 font-light">
            <div className="md:col-span-1">
              <div className="text-2xl font-serif text-foreground tracking-wider mb-6">
                SaunaRelax
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Премиальное пространство для уединения и полного расслабления в ритме столицы.
              </p>
            </div>
            
            <div className="flex flex-col space-y-4">
              <h4 className="uppercase text-xs tracking-widest text-foreground font-medium mb-2">Адрес</h4>
              <p className="text-muted-foreground text-sm">Москва, ул. Примерная, д. 15<br/>Большой Каретный переулок</p>
            </div>
            
            <div className="flex flex-col space-y-4">
              <h4 className="uppercase text-xs tracking-widest text-foreground font-medium mb-2">Контакты</h4>
              <p className="text-muted-foreground text-sm">+7 (495) 777-77-77</p>
              <p className="text-muted-foreground text-sm">info@saunarelax.ru</p>
            </div>
            
            <div className="flex flex-col space-y-4">
              <h4 className="uppercase text-xs tracking-widest text-foreground font-medium mb-2">Режим работы</h4>
              <p className="text-muted-foreground text-sm">Ежедневно<br/>Круглосуточно</p>
            </div>
          </div>
          
          <div className="border-t border-secondary mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
            <p>&copy; 2026 SaunaRelax. Все права защищены.</p>
            <p className="mt-2 md:mt-0">Разработано с заботой о вас.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default App;
