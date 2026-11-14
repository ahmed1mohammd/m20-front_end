import React, { useEffect, useState } from 'react';
import OfferCarousel from '../components/OfferCarousel';
import BrandMarquee from '../components/BrandMarquee';
import MostWanted from '../components/MostWanted';
import SignatureFilmSection from '../components/SignatureFilmSection';
import OffersSection from '../components/OffersSection';
import AboutElan from '../components/AboutElan';
import FeaturesBar from '../components/FeaturesBar';
import SEO from '../components/SEO';
import { getHomepageData } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const HomePage = () => {
  const [homeData, setHomeData] = useState(null);
  const { lang, t } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getHomepageData();
      setHomeData(data);
    };
    fetchData();
  }, []);

  const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'M20 Haute Parfumerie',
    'url': 'https://m20fragrance.com',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://m20fragrance.com/shop?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  const seoTitle = lang === 'ar'
    ? 'دار M20 للعطور الفاخرة • عطور نيش مصرية أصلية'
    : 'M20 | Signature Haute Parfumerie • Fine Artisanal Fragrances';

  const seoDesc = lang === 'ar'
    ? 'دار M20 لصناعة العطور الفاخرة في مصر بتوقيع Extrait de Parfum. اكتشف M20 NOIR ورويال فيتيفر وسولاي بلان مع توصيل سريع لكافة المحافظات.'
    : 'M20 Haute Parfumerie crafts artisan luxury perfumes in Egypt with enduring sillage. Discover M20 NOIR, Royal Vetiver, Velvet Iris, and Imperial Oud with express delivery.';

  return (
    <div className="bg-[#F4F3EF]">
      <SEO 
        title={seoTitle}
        description={seoDesc}
        keywords="عطور M20, برفيوم مصري فاخر, M20 perfumes, luxury fragrances Egypt, eau de parfum Cairo, M20 Noir, best perfume brand Egypt, buy perfume online Egypt"
        schema={homeSchema}
        schemaId="home-website-schema"
      />

      {/* Offer Carousel */}
      <OfferCarousel />

      {/* Quiet M20 Brand Ribbon */}
      <BrandMarquee />

      {/* Most Wanted 3-column Grid */}
      <MostWanted products={homeData?.featuredProducts} />

      {/* M20 CRUSH 3D Signature Film */}
      <SignatureFilmSection />

      {/* Special Offers Banner */}
      <OffersSection offers={homeData?.offers} />

      {/* About M20 Banner */}
      <AboutElan />

      {/* 4 Features Bar */}
      <FeaturesBar />
    </div>
  );
};

export default HomePage;
