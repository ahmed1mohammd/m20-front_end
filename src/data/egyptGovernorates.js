export const EGYPT_GOVERNORATES = [
  // Tier 1 (Greater Cairo / Origin: Giza) - 65 EGP
  { id: 'cairo', nameEn: 'Cairo', nameAr: 'القاهرة', tier: 1, defaultRate: 65 },
  { id: 'giza', nameEn: 'Giza', nameAr: 'الجيزة', tier: 1, defaultRate: 65 },
  { id: 'qalyubia', nameEn: 'Qalyubia', nameAr: 'القليوبية', tier: 1, defaultRate: 65 },

  // Tier 2 (Alexandria & Nile Delta) - 75 EGP
  { id: 'alexandria', nameEn: 'Alexandria', nameAr: 'الإسكندرية', tier: 2, defaultRate: 75 },
  { id: 'beheira', nameEn: 'Beheira', nameAr: 'البحيرة', tier: 2, defaultRate: 75 },
  { id: 'gharbia', nameEn: 'Gharbia', nameAr: 'الغربية', tier: 2, defaultRate: 75 },
  { id: 'monufia', nameEn: 'Monufia', nameAr: 'المنوفية', tier: 2, defaultRate: 75 },
  { id: 'damietta', nameEn: 'Damietta', nameAr: 'دمياط', tier: 2, defaultRate: 75 },
  { id: 'dakahlia', nameEn: 'Dakahlia', nameAr: 'الدقهلية', tier: 2, defaultRate: 75 },
  { id: 'kafr_el_sheikh', nameEn: 'Kafr El Sheikh', nameAr: 'كفر الشيخ', tier: 2, defaultRate: 75 },
  { id: 'sharqia', nameEn: 'Sharqia', nameAr: 'الشرقية', tier: 2, defaultRate: 75 },

  // Tier 3 (Canal Zone) - 80 EGP
  { id: 'ismailia', nameEn: 'Ismailia', nameAr: 'الإسماعيلية', tier: 3, defaultRate: 80 },
  { id: 'suez', nameEn: 'Suez', nameAr: 'السويس', tier: 3, defaultRate: 80 },
  { id: 'port_said', nameEn: 'Port Said', nameAr: 'بورسعيد', tier: 3, defaultRate: 80 },

  // Tier 4 (Northern Upper Egypt) - 85 EGP
  { id: 'faiyum', nameEn: 'Faiyum', nameAr: 'الفيوم', tier: 4, defaultRate: 85 },
  { id: 'beni_suef', nameEn: 'Beni Suef', nameAr: 'بني سويف', tier: 4, defaultRate: 85 },
  { id: 'minya', nameEn: 'Minya', nameAr: 'المنيا', tier: 4, defaultRate: 85 },
  { id: 'assiut', nameEn: 'Assiut', nameAr: 'أسيوط', tier: 4, defaultRate: 85 },

  // Tier 5 (Southern Upper Egypt & Red Sea) - 115 EGP
  { id: 'sohag', nameEn: 'Sohag', nameAr: 'سوهاج', tier: 5, defaultRate: 115 },
  { id: 'qena', nameEn: 'Qena', nameAr: 'قنا', tier: 5, defaultRate: 115 },
  { id: 'aswan', nameEn: 'Aswan', nameAr: 'أسوان', tier: 5, defaultRate: 115 },
  { id: 'luxor', nameEn: 'Luxor', nameAr: 'الأقصر', tier: 5, defaultRate: 115 },
  { id: 'red_sea', nameEn: 'Red Sea', nameAr: 'البحر الأحمر', tier: 5, defaultRate: 115 },

  // Tier 6 (Frontier & Remote Governorates) - 125 EGP
  { id: 'matrouh', nameEn: 'Matrouh', nameAr: 'مطروح', tier: 6, defaultRate: 125 },
  { id: 'new_valley', nameEn: 'New Valley', nameAr: 'الوادي الجديد', tier: 6, defaultRate: 125 },
  { id: 'north_sinai', nameEn: 'North Sinai', nameAr: 'شمال سيناء', tier: 6, defaultRate: 125 },
  { id: 'south_sinai', nameEn: 'South Sinai', nameAr: 'جنوب سيناء', tier: 6, defaultRate: 125 }
];

export const getGovernorateRate = (govNameOrId, customRates = {}) => {
  if (!govNameOrId) return 75; // Default Tier 2
  const query = String(govNameOrId).trim().toLowerCase();

  // 1. Direct match in custom rates if present
  if (customRates && typeof customRates === 'object') {
    for (const [key, val] of Object.entries(customRates)) {
      if (key.trim().toLowerCase() === query && typeof val === 'number') {
        return Math.round(val);
      }
    }
  }

  // 2. Find in standardized list
  const match = EGYPT_GOVERNORATES.find(
    (g) =>
      g.id.toLowerCase() === query ||
      g.nameEn.toLowerCase() === query ||
      g.nameAr.toLowerCase() === query
  );

  if (match) {
    if (customRates && customRates[match.nameEn] !== undefined) {
      return Math.round(Number(customRates[match.nameEn]));
    }
    if (customRates && customRates[match.nameAr] !== undefined) {
      return Math.round(Number(customRates[match.nameAr]));
    }
    return match.defaultRate;
  }

  return 75;
};

export const getGovernorateObject = (govNameOrId) => {
  if (!govNameOrId) return null;
  const query = String(govNameOrId).trim().toLowerCase();
  return (
    EGYPT_GOVERNORATES.find(
      (g) =>
        g.id.toLowerCase() === query ||
        g.nameEn.toLowerCase() === query ||
        g.nameAr.toLowerCase() === query ||
        query.includes(g.nameEn.toLowerCase()) ||
        query.includes(g.nameAr.toLowerCase())
    ) || null
  );
};
