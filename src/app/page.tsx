import Link from 'next/link';
import { TEMPLATE_STYLES } from '@/lib/templates';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Star } from 'lucide-react';

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white selection:bg-[#D4AF37] selection:text-black">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8">
          <Star size={14} className="text-[#D4AF37] fill-[#D4AF37]" />
          <span className="text-[10px] uppercase tracking-widest text-neutral-300">Catalogue d&apos;Excellence</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-serif mb-6 tracking-tight">
          Choisissez votre <br /> <span className="text-[#D4AF37]">Univers Prestige</span>
        </h1>
        <p className="text-neutral-400 text-lg font-light max-w-xl mx-auto leading-relaxed italic">
          Sélectionnez un modèle pour personnaliser votre invitation interactive et émerveiller vos convives.
        </p>
      </section>

      {/* Grid */}
      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.values(TEMPLATE_STYLES).map((template) => (
            <div
              key={template.id}
              className="group relative bg-[#1a1a1a] border border-white/5 rounded-[2rem] overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-700 hover:shadow-[0_20px_50px_rgba(212,175,55,0.1)]"
            >
              {/* Image Container */}
              <div className="aspect-[4/5] overflow-hidden relative">
                <img
                  src={template.previewUrl}
                  alt={template.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-60" />

                {/* Badge */}
                <div className="absolute top-6 right-6">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] uppercase tracking-widest border border-white/10">
                    5 Pages
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl font-serif mb-2 tracking-wide">{template.name}</h3>
                <p className="text-neutral-500 text-sm mb-8 font-light line-clamp-2 italic leading-relaxed">
                  &quot;{template.description}&quot;
                </p>

                <Link href={`/i/demo-token?style=${template.id}`}>
                  <Button variant="outline" className="w-full group/btn border-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37]">
                    Voir la Démo
                    <ArrowRight size={16} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Decoration */}
      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] text-neutral-600">
          Powered by Invitation Web App Engine
        </p>
      </footer>
    </div>
  );
}
