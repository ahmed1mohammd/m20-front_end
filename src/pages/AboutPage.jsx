import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white text-[#03204E]">
      
      {/* Editorial Hero Banner */}
      <section className="relative w-full py-16 md:py-24 bg-[#FAF8F5] border-b border-slate-100 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4 relative z-10">
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400 font-medium block">
            The Atelier Story
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight uppercase text-[#03204E]">
            OUR STORY — ÉLAN
          </h1>
          <p className="text-lg sm:text-xl font-serif italic text-slate-600 max-w-xl mx-auto pt-2">
            More Than a Fragrance.
          </p>
          <div className="w-16 h-[1px] bg-[#03204E] mx-auto pt-4 opacity-40"></div>
        </div>
      </section>

      {/* Main Story Content */}
      <section className="py-12 md:py-20 max-w-5xl mx-auto px-6">
        <div className="space-y-14 text-left">
          
          {/* Opening Statement - Clean, no borders, natural text formatting */}
          <div className="py-4 text-center max-w-3xl mx-auto">
            <p className="text-xl sm:text-3xl font-serif text-[#03204E] leading-relaxed italic">
              "ÉLAN started with a simple belief: a fragrance should do more than smell good — it should leave a mark."
            </p>
          </div>

          {/* Full Width Image - Natural size, no borders, no cropping */}
          <div className="w-full">
            <img
              src="/img/Story.png"
              alt="ÉLAN Story"
              className="w-full h-auto object-contain block"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/img/About.png';
              }}
            />
          </div>

          {/* Story Paragraphs in 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 pt-4">
            
            <div className="space-y-8">
              <div className="space-y-3">
                <span className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-semibold block">
                  01. Presence & Character
                </span>
                <p className="text-sm font-light text-slate-600 leading-relaxed">
                  We created ÉLAN as a modern Egyptian fragrance brand for people who see perfume as part of their presence, their character, and the way they’re remembered.
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-semibold block">
                  02. Unique Personality
                </span>
                <p className="text-sm font-light text-slate-600 leading-relaxed">
                  Every ÉLAN fragrance has its own personality. Some are bold and warm, others fresh, elegant, woody, floral, or gourmand — giving you the freedom to find the scent that feels like you.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <span className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-semibold block">
                  03. 20% Eau de Parfum
                </span>
                <p className="text-sm font-light text-slate-600 leading-relaxed">
                  Our fragrances are crafted as 20% Eau de Parfum, bringing together character, concentration, and an experience designed for everyday wear.
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-semibold block">
                  04. Redefining Luxury
                </span>
                <p className="text-sm font-light text-slate-600 leading-relaxed">
                  But ÉLAN isn’t about following one definition of luxury. For us, luxury is finding a fragrance you connect with — one that becomes part of your identity without needing to say a word.
                </p>
              </div>
            </div>

          </div>

          {/* Highlight Callout Box */}
          <div className="border-t border-b border-slate-100 py-12 text-center space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400 font-medium">
              This is only the beginning of our story.
            </p>
            <h2 className="text-4xl sm:text-5xl font-serif text-[#03204E] tracking-wider uppercase font-normal">
              ÉLAN
            </h2>
            <p className="text-base font-serif italic text-[#03204E]">
              Leave Your Mark.
            </p>
            <div className="pt-4">
              <Link
                to="/shop"
                className="inline-flex items-center space-x-2 bg-[#03204E] text-white px-8 py-3.5 text-xs tracking-[0.2em] font-medium uppercase hover:bg-slate-800 transition-colors rounded-sm shadow-sm"
              >
                <span>EXPLORE THE COLLECTION</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default AboutPage;
