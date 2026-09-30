import React, { useEffect, useState } from 'react';
import OfferCarousel from '../components/OfferCarousel';
import MostWanted from '../components/MostWanted';
import OffersSection from '../components/OffersSection';
import AboutElan from '../components/AboutElan';
import FeaturesBar from '../components/FeaturesBar';
import { getHomepageData } from '../services/api';

const HomePage = () => {
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getHomepageData();
      setHomeData(data);
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white">
      {/* Offer Carousel - image-only slides */}
      <OfferCarousel />

      {/* Most Wanted 3-column Grid */}
      <MostWanted products={homeData?.featuredProducts} />

      {/* Special Offers Banner */}
      <OffersSection offers={homeData?.offers} />

      {/* About ÉLAN Banner */}
      <AboutElan />

      {/* 4 Features Bar (Concentration, Ingredients, Packaging, Shipping) */}
      <FeaturesBar />
    </div>
  );
};

export default HomePage;
