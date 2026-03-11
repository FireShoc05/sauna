import { useEffect } from 'react';
import { motion } from 'framer-motion';

// Sample luxurious spa/sauna HD placeholders
const photos = [
  { id: 1, class: 'md:col-span-2 md:row-span-2', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', alt: 'Главная парная' },
  { id: 2, class: 'md:col-span-1 md:row-span-1', url: 'https://images.unsplash.com/photo-1583416750470-965b2707b355?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Зона отдыха' },
  { id: 3, class: 'md:col-span-1 md:row-span-1', url: 'https://images.unsplash.com/photo-1596178065887-f27320f78cc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Детали интерьера' },
  { id: 4, class: 'md:col-span-1 md:row-span-2', url: 'https://images.unsplash.com/photo-1565623833408-d77ce2ab6d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Холодная купель' },
  { id: 5, class: 'md:col-span-1 md:row-span-1', url: 'https://images.unsplash.com/photo-1620000617307-e837ea8cfbf8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', alt: 'Банные принадлежности' },
  { id: 6, class: 'md:col-span-2 md:row-span-1', url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', alt: 'Большое джакузи' },
];

const Photos = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background relative z-10">
      <div className="container mx-auto px-6">
        
        {/* Header Elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24 flex flex-col items-center text-center border-b border-accent/20 pb-12"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl text-foreground font-serif mb-6">Галерея</h1>
          <p className="text-muted-foreground tracking-wide font-light max-w-2xl mx-auto">
            Окунитесь в атмосферу роскоши и уединения. Пространство, где каждая деталь продумана для вашего идеального отдыха.
          </p>
        </motion.div>

        {/* Masonry / Bento Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[300px] gap-2 md:gap-4 lg:gap-6">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className={`group relative overflow-hidden bg-secondary/50 cursor-pointer ${photo.class}`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-110"
                style={{ backgroundImage: `url(${photo.url})` }}
              />
              
              {/* Subtle hover overlay and vignette */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <span className="text-white/80 font-serif text-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  {photo.alt}
                </span>
              </div>
              
              {/* Permanent vignette for luxurious feel */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 pointer-events-none" />
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Photos;
