import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SteamParticles from '@/components/SteamParticles';
import AnimatedCounter from '@/components/AnimatedCounter';

const services = [
  { id: 1, icon: '🔥', title: 'Финская парная', desc: 'Классическая финская сауна с мягким паром.' },
  { id: 2, icon: '🌊', title: 'Купель', desc: 'Холодное погружение для восстановления и тонуса.' },
  { id: 3, icon: '💧', title: 'Джакузи', desc: 'Расслабление в теплой воде с гидромассажем.' },
  { id: 4, icon: '🎤', title: 'Караоке', desc: 'Приватное развлечение с профессиональным звуком.' },
  { id: 5, icon: '🍽️', title: 'Ресторан', desc: 'Заказ еды прямо в номер из ресторана в здании.' },
  { id: 6, icon: '📶', title: 'Удобства', desc: 'Высокоскоростной Wi-Fi, халяль меню и своя парковка.' },
];

export const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    className="mb-16 md:mb-24 flex flex-col items-center text-center"
  >
    <h2 className="text-4xl md:text-5xl lg:text-6xl text-foreground font-serif mb-4">{title}</h2>
    {subtitle && <p className="text-muted-foreground max-w-xl mx-auto tracking-wide font-light">{subtitle}</p>}
    <motion.div 
      className="h-[1px] bg-accent mt-8"
      initial={{ width: 0 }}
      whileInView={{ width: "100px" }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
    />
  </motion.div>
);

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.startsWith('7') || val.startsWith('8')) val = val.slice(1);
    let formatted = '+7';
    if (val.length > 0) formatted += ` (${val.substring(0, 3)}`;
    if (val.length >= 4) formatted += `) ${val.substring(3, 6)}`;
    if (val.length >= 7) formatted += `-${val.substring(6, 8)}`;
    if (val.length >= 9) formatted += `-${val.substring(8, 10)}`;
    setFormData({ ...formData, phone: formatted === '+7' ? '' : formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('https://sauna-bot-uf1j.onrender.com/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (res.ok) {
        setIsSuccess(true);
      } else {
        setErrorMsg(data.error || 'Произошла ошибка. Попробуйте позже.');
      }
    } catch (err) {
      setErrorMsg('Не удалось связаться с сервером.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 400]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80; 
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-[#0a0908]">
        <SteamParticles />
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center mt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-[6rem] font-serif leading-[1.1] text-foreground tracking-tight mb-6">
              Место, где время<br/><span className="text-white/90">останавливается.</span>
            </h1>
            
            <motion.div 
              className="h-[1px] bg-accent w-24 mb-6"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
            />

            <p className="text-lg md:text-xl text-muted-foreground font-light tracking-wide mb-12">
              Финская баня &middot; Купель &middot; Джакузи &middot; Москва
            </p>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button 
                onClick={() => scrollTo('booking')}
                className="bg-transparent border border-accent text-accent hover:bg-accent hover:text-background transition-all duration-300 px-8 py-6 rounded-none uppercase tracking-widest text-xs"
              >
                Забронировать
              </Button>
              <button 
                onClick={() => scrollTo('about')}
                className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm uppercase tracking-widest flex items-center"
              >
                Узнать подробнее <span className="ml-2">→</span>
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Yandex Badge Absolute */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-8 hidden md:flex items-center space-x-3 text-xs font-light text-muted-foreground"
        >
          <div className="flex text-accent"><Star fill="currentColor" size={14} /></div>
          <span>5.0 &middot; «Хорошее место 2026» — Яндекс</span>
        </motion.div>
      </section>

      {/* ABOUT / PHILOSOPHY */}
      <section id="about" className="py-32 bg-background relative z-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.9 }}
              className="max-w-xl"
            >
              <h2 className="text-3xl md:text-4xl font-serif mb-8 text-foreground leading-snug">
                Уединение в центре шумного мегаполиса
              </h2>
              <div className="space-y-6 text-muted-foreground font-light leading-relaxed text-lg">
                <p>
                  SaunaRelax — это больше, чем просто парная. Это закрытое пространство для тех, кто ценит комфорт, эстетику и абсолютную приватность.
                </p>
                <p>
                  Мы создали атмосферу, где каждая деталь служит вашему расслаблению. Никаких посторонних, только вы и ваши близкие.
                </p>
              </div>
            </motion.div>

            <div className="flex flex-col space-y-12 lg:pl-20 border-l border-accent/20">
              {[
                { value: 6, label: "Гостей единовременно (приватный формат)", dec: 0 },
                { value: 146, label: "Отзывов на Яндексе", dec: 0 },
                { value: 5.0, label: "Средняя оценка", dec: 1 }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  className="flex flex-col"
                >
                  <div className="text-4xl md:text-5xl font-serif text-accent mb-2">
                    <AnimatedCounter value={stat.value} decimals={stat.dec} duration={2} />
                  </div>
                  <div className="text-sm uppercase tracking-widest text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-32 bg-[#0a0a09]">
        <div className="container mx-auto px-6">
          <SectionHeader title="Что вас ждет" subtitle="Идеальные условия для вашего отдыха" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, i) => (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                whileHover={{ y: -4, borderColor: "rgba(201, 169, 110, 0.5)" }}
                className="bg-card border border-secondary p-8 flex flex-col transition-all duration-300 group"
              >
                <div className="text-3xl mb-6 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">{svc.icon}</div>
                <h3 className="text-xl font-serif mb-3 text-foreground">{svc.title}</h3>
                <p className="text-muted-foreground font-light text-sm leading-relaxed">{svc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-32 bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <SectionHeader title="Условия" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border border-secondary p-10 md:p-16 relative"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <div className="flex flex-col space-y-2 mb-8">
                  <span className="text-muted-foreground text-sm uppercase tracking-widest">Дневное время</span>
                  <span className="text-3xl sm:text-4xl font-serif text-accent flex items-baseline gap-2">
                      <span className="text-2xl text-foreground font-light">от</span> 1 500 ₽ <span className="text-lg text-muted-foreground font-light">/ час</span>
                  </span>
                </div>
                <div className="flex flex-col space-y-2">
                  <span className="text-muted-foreground text-sm uppercase tracking-widest">Вечер / Выходные</span>
                  <span className="text-3xl sm:text-4xl font-serif text-accent flex items-baseline gap-2">
                      <span className="text-2xl text-foreground font-light">до</span> 3 500 ₽ <span className="text-lg text-muted-foreground font-light">/ час</span>
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col justify-center space-y-6 md:border-l md:border-secondary md:pl-12">
                <div className="flex items-center space-x-3 text-foreground font-light">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>Вместимость до 6 человек</span>
                </div>
                <div className="flex items-center space-x-3 text-foreground font-light border-b border-secondary pb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  <span>Предварительная запись обязательна</span>
                </div>
                
                <div>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground mb-3 block">Способы оплаты:</span>
                  <div className="flex flex-wrap gap-4 text-sm text-foreground/80 font-light">
                    <span>Предоплата</span>
                    <span className="text-secondary-foreground/30">•</span>
                    <span>Наличные</span>
                    <span className="text-secondary-foreground/30">•</span>
                    <span>Карта</span>
                    <span className="text-secondary-foreground/30">•</span>
                    <span>СБП</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* YANDEX BADGE ROW */}
      <section className="border-y border-secondary/50 py-6 bg-[#0a0908]">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 text-muted-foreground font-light text-sm mb-4 md:mb-0">
              <Star className="text-accent" fill="currentColor" size={16} />
              <span>«SaunaRelax отмечена Яндексом как "Хорошее место 2026"»</span>
              <span className="hidden lg:inline ml-2 text-foreground">&middot; 5.0 (146 отзывов)</span>
          </div>
          <a href="#" className="text-sm font-light text-foreground border-b border-accent hover:text-accent transition-colors">
            Читать отзывы →
          </a>
        </div>
      </section>

      {/* BOOKING */}
      <section id="booking" className="py-32 bg-background">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <SectionHeader title="Забронируйте ваш вечер" subtitle="Оставьте заявку, и наш администратор свяжется с вами для подтверждения бронирования" />
          
          {isSuccess ? (
             <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="mt-12 p-12 border border-accent/30 bg-secondary/10 flex flex-col items-center text-center"
             >
               <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-6 text-accent text-3xl">✓</div>
               <h3 className="text-3xl font-serif text-foreground mb-4">Ваша заявка отправлена</h3>
               <p className="text-muted-foreground font-light text-lg">Мы свяжемся с вами в ближайшее время для подтверждения деталей.</p>
             </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-12 space-y-8 text-left"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <Input 
                    placeholder="Ваше имя" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-transparent border-t-0 border-x-0 border-b border-secondary focus-visible:ring-0 focus-visible:border-accent rounded-none shadow-none px-0 text-base" 
                  />
                </div>
                <div className="space-y-1">
                  <Input 
                    type="tel" 
                    placeholder="Телефон (+7...)" 
                    required 
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="bg-transparent border-t-0 border-x-0 border-b border-secondary focus-visible:ring-0 focus-visible:border-accent rounded-none shadow-none px-0 text-base" 
                  />
                </div>
                <div className="space-y-1">
                  <Input 
                    type="date" 
                    placeholder="Дата" 
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="bg-transparent border-t-0 border-x-0 border-b border-secondary focus-visible:ring-0 focus-visible:border-accent rounded-none shadow-none px-0 text-base text-muted-foreground" 
                  />
                </div>
                <div className="space-y-1">
                  <Input 
                    type="time" 
                    placeholder="Время" 
                    required
                    min="10:00"
                    max="22:00"
                    step="3600"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="bg-transparent border-t-0 border-x-0 border-b border-secondary focus-visible:ring-0 focus-visible:border-accent rounded-none shadow-none px-0 text-base text-muted-foreground" 
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <div className="text-sm text-foreground mb-3 tracking-wide">Количество человек (1-6)</div>
                  <Input 
                    type="number" 
                    min="1" 
                    max="6" 
                    required
                    value={formData.guests}
                    onChange={(e) => setFormData({...formData, guests: e.target.value})}
                    className="bg-transparent border-t-0 border-x-0 border-b border-secondary focus-visible:ring-0 focus-visible:border-accent rounded-none shadow-none px-0 text-base" 
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <textarea 
                    placeholder="Комментарий / пожелания (Например: нужен дубовый веник...)" 
                    rows={3}
                    value={formData.comment}
                    onChange={(e) => setFormData({...formData, comment: e.target.value})}
                    className="w-full bg-transparent border-t-0 border-x-0 border-b border-secondary focus-visible:outline-none focus-visible:border-accent rounded-none shadow-none px-0 py-2 text-base resize-none text-foreground placeholder:text-muted-foreground" 
                  />
                </div>
              </div>
              
              {errorMsg && (
                <div className="text-destructive text-sm text-center font-light">{errorMsg}</div>
              )}

              <div className="pt-8 flex justify-center">
                <Button 
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="bg-transparent border border-accent text-accent hover:bg-accent hover:text-background transition-all duration-300 px-12 rounded-none uppercase tracking-widest text-sm w-full md:w-auto disabled:opacity-50"
                >
                  {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                </Button>
              </div>
            </motion.form>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
