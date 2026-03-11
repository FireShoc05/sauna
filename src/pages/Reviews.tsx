import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "Екатерина В.",
    date: "12 Марта 2026",
    text: "Потрясающее место. Настолько всё продумано до мелочей: от освещения до мягкости полотенец. Купель просто восторг! Обязательно вернемся снова.",
    rating: 5,
    size: "large", // Takes up more space in the bento grid
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Михаил С.",
    date: "5 Марта 2026",
    text: "Отмечали день рождения в узком кругу. Очень понравилась приватность — никто тебя не видит и не слышит. Парная на высшем уровне, пар мягкий.",
    rating: 5,
    size: "medium",
  },
  {
    id: 3,
    name: "Анна и Сергей",
    date: "28 Февраля 2026",
    text: "Идеально для романтического вечера. Сервис незаметный, но безупречный. Еду заказали из ресторана прямо в номер.",
    rating: 5,
    size: "small",
  },
  {
    id: 4,
    name: "Дмитрий К.",
    date: "15 Февраля 2026",
    text: "Были с коллегами после тяжелого проекта. Отличная зона отдыха с караоке, джакузи огромное. 10 из 10.",
    rating: 5,
    size: "tall", // Taller card to break the symmetry
    image: "https://images.unsplash.com/photo-1571249714856-11b0e3e20092?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Ольга П.",
    date: "10 Февраля 2026",
    text: "Очень чисто. Для меня это самое главное. Плюс роскошный дизайн интерьера — чувствуешь себя в дорогом спа-салоне, а не в обычной бане.",
    rating: 5,
    size: "wide",
  },
  {
    id: 6,
    name: "Игорь",
    date: "2 Февраля 2026",
    text: "Лучшая парная в Москве за эти деньги.",
    rating: 5,
    size: "small",
  }
];

const ReviewStars = ({ count }: { count: number }) => (
  <div className="flex space-x-1 mb-4">
    {[...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={14} 
        className={i < count ? "text-accent fill-accent" : "text-muted"} 
      />
    ))}
  </div>
);

const Reviews = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Helper to map size to Tailwind grid classes for Bento effect
  const getSizeClasses = (size: string) => {
    switch(size) {
      case 'large': return 'md:col-span-2 md:row-span-2';
      case 'wide': return 'md:col-span-2 md:row-span-1';
      case 'tall': return 'md:col-span-1 md:row-span-2';
      case 'medium': return 'md:col-span-1 md:row-span-1';
      default: return 'md:col-span-1 md:row-span-1';
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background relative z-10">
      <div className="container mx-auto px-6">
        
        {/* Header Elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between border-b border-accent/20 pb-8 gap-6"
        >
          <div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-foreground font-serif mb-4">Отзывы</h1>
            <p className="text-muted-foreground tracking-wide font-light max-w-lg">
              Что говорят наши гости о проведенном времени в SaunaRelax.
            </p>
          </div>
          
          <div className="flex flex-col items-start md:items-end bg-secondary/30 p-4 rounded-sm border border-secondary/50">
            <div className="text-3xl font-serif text-accent flex items-center space-x-2">
              <span>5.0</span>
              <Star className="text-accent fill-accent" size={24} />
            </div>
            <span className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Оценка на картах (146 отзывов)</span>
          </div>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[250px] gap-4 md:gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`group relative overflow-hidden bg-card border border-secondary p-6 md:p-8 flex flex-col justify-between transition-colors hover:border-accent/40 ${getSizeClasses(review.size)}`}
            >
              {/* If image exists, add it as a background with an overlay */}
              {review.image && (
                <>
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-20 grayscale group-hover:grayscale-0"
                    style={{ backgroundImage: `url(${review.image})` }}
                  />
                  {/* Gradient overlay to ensure text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
                </>
              )}

              <div className="relative z-10 flex-grow flex flex-col">
                <ReviewStars count={review.rating} />
                <p className={`font-light text-foreground/90 leading-relaxed ${review.size === 'large' ? 'text-xl md:text-2xl' : 'text-base md:text-lg'}`}>
                  "{review.text}"
                </p>
              </div>

              <div className="relative z-10 mt-6 flex items-center justify-between">
                <span className="font-serif text-accent text-lg">{review.name}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{review.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <a href="#" className="inline-flex items-center text-sm uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors border-b border-transparent hover:border-accent pb-1">
            Смотреть все отзывы на Яндексе →
          </a>
        </motion.div>

      </div>
    </div>
  );
};

export default Reviews;
