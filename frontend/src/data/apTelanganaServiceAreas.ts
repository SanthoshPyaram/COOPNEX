export interface CooperativeSocietyOption {
  name: string;
  code: string;
  address: string;
  members: string;
  recommended?: boolean;
}

export interface DistrictServiceConfig {
  district: string;
  state: "Andhra Pradesh" | "Telangana";
  societies: CooperativeSocietyOption[];
  serviceAreas: string[];
}

export const AP_TELANGANA_DISTRICT_CONFIGS: Record<string, DistrictServiceConfig> = {
  // --- ANDHRA PRADESH ---
  "Tirupati": {
    district: "Tirupati",
    state: "Andhra Pradesh",
    societies: [
      {
        name: "Tirupati Urban & Temple Municipal Artisan Cooperative (PACS-TPT-01)",
        code: "PACS-TPT-01",
        address: "Alipiri Road, Tirupati",
        members: "385 active artisans",
        recommended: true
      },
      {
        name: "Tirupati District Construction & Technical Trades Federation",
        code: "FED-TPT-02",
        address: "Bairagipatteda, Tirupati",
        members: "260 active artisans",
        recommended: false
      },
      {
        name: "Chandragiri & Renigunta Cooperative Labour Union",
        code: "UNION-TPT-03",
        address: "Renigunta Station Road, Tirupati",
        members: "195 active artisans",
        recommended: false
      }
    ],
    serviceAreas: [
      "Tirupati Central & Gandhi Road",
      "Alipiri & Kapilatheertham Foot",
      "Renigunta Hub & Airport Zone",
      "Chandragiri Town & Fort Area",
      "Tiruchanur & Padmavathi Nagar",
      "MR Palli & New Balaji Colony",
      "SVU Campus & University Enclave",
      "Karakambadi Road & Industrial Area",
      "Bairagipatteda & Korlagunta",
      "Akkarampalli & Leela Mahal"
    ]
  },

  "NTR District (Vijayawada)": {
    district: "NTR District (Vijayawada)",
    state: "Andhra Pradesh",
    societies: [
      {
        name: "Vijayawada Central Labour Co-op Society (PACS-VJA-01)",
        code: "PACS-VJA-01",
        address: "Benz Circle, Vijayawada",
        members: "420 active artisans",
        recommended: true
      },
      {
        name: "Krishna & NTR District Technical Trades Union",
        code: "FED-NTR-02",
        address: "Governorpet, Vijayawada",
        members: "290 active artisans",
        recommended: false
      },
      {
        name: "Auto Nagar Artisan & Maintenance Cooperative",
        code: "UNION-NTR-03",
        address: "Auto Nagar Industrial Belt, Vijayawada",
        members: "210 active artisans",
        recommended: false
      }
    ],
    serviceAreas: [
      "Benz Circle & MG Road",
      "Governorpet & One Town",
      "Auto Nagar & Patamata",
      "Bhavanipuram & Gollapudi",
      "Gunadala & Ramavarappadu",
      "Moghalrajpuram & Jammi Chettu",
      "Poranki & Penamaluru",
      "Kankipadu & Enikepadu",
      "Ibrahimpatnam & Ferry Zone"
    ]
  },

  "Visakhapatnam": {
    district: "Visakhapatnam",
    state: "Andhra Pradesh",
    societies: [
      {
        name: "Visakhapatnam Port City Labour Cooperative (PACS-VSP-01)",
        code: "PACS-VSP-01",
        address: "Dwaraka Nagar, Visakhapatnam",
        members: "390 active artisans",
        recommended: true
      },
      {
        name: "Vizag Coastal Technical Trades & Marine Guild",
        code: "FED-VSP-02",
        address: "MVP Colony, Visakhapatnam",
        members: "310 active artisans",
        recommended: false
      },
      {
        name: "Gajuwaka Industrial Labour Cooperative Society",
        code: "UNION-VSP-03",
        address: "Gajuwaka Junction, Visakhapatnam",
        members: "240 active artisans",
        recommended: false
      }
    ],
    serviceAreas: [
      "Dwaraka Nagar & Complex Zone",
      "MVP Colony & Sector 1-12",
      "Gajuwaka & Steel Plant Township",
      "Madhurawada & IT SEZ",
      "Siripuram & Waltair Uplands",
      "Rushikonda Beach & Sagar Nagar",
      "Pendurthi & Gopalapatnam",
      "Seethammadhara & HB Colony",
      "Kommadi & Anandapuram"
    ]
  },

  "Guntur": {
    district: "Guntur",
    state: "Andhra Pradesh",
    societies: [
      {
        name: "Guntur Commercial & Agri-Trade Cooperative Society (PACS-GNT-01)",
        code: "PACS-GNT-01",
        address: "Brodipet, Guntur",
        members: "340 active artisans",
        recommended: true
      },
      {
        name: "Guntur District Construction & Service Workers Federation",
        code: "FED-GNT-02",
        address: "Arundelpet, Guntur",
        members: "270 active artisans",
        recommended: false
      },
      {
        name: "Amaravati Capital Border Labour Guild",
        code: "UNION-GNT-03",
        address: "Amaravathi Road, Guntur",
        members: "180 active artisans",
        recommended: false
      }
    ],
    serviceAreas: [
      "Brodipet & Main Commercial Road",
      "Arundelpet & Collectorate Zone",
      "Pattabhipuram & Syamala Nagar",
      "Amaravathi Road & Gorantla",
      "Nallapadu & Industrial Area",
      "Tenali Gateway & Old Guntur",
      "Mangalagiri Border & Tadepalli",
      "Koretipadu & Gujanagundla"
    ]
  },

  "Kurnool": {
    district: "Kurnool",
    state: "Andhra Pradesh",
    societies: [
      {
        name: "Kurnool Tungabhadra Labour Cooperative Society (PACS-KNL-01)",
        code: "PACS-KNL-01",
        address: "Collectorate Road, Kurnool",
        members: "290 active artisans",
        recommended: true
      },
      {
        name: "Rayalaseema Artisan & Trade Workers Union",
        code: "UNION-KNL-02",
        address: "Nandyal Checkpost, Kurnool",
        members: "220 active artisans",
        recommended: false
      }
    ],
    serviceAreas: [
      "Kurnool Old City & Fort",
      "Collectorate & Nandyal Checkpost",
      "B-Camp & A-Camp Residential",
      "Santosh Nagar & Budhawarpet",
      "Joharapuram & Abbas Nagar",
      "Kallur & Industrial Estate"
    ]
  },

  // --- TELANGANA ---
  "Hyderabad": {
    district: "Hyderabad",
    state: "Telangana",
    societies: [
      {
        name: "Hyderabad Cyber Workforce Cooperative Guild (PACS-HYD-01)",
        code: "PACS-HYD-01",
        address: "Madhapur, Hyderabad",
        members: "520 active artisans",
        recommended: true
      },
      {
        name: "Greater Hyderabad Multi-Trade Cooperative Society",
        code: "FED-HYD-02",
        address: "Banjara Hills, Hyderabad",
        members: "410 active artisans",
        recommended: false
      },
      {
        name: "Charminar & Old City Labour Welfare Union",
        code: "UNION-HYD-03",
        address: "Nayapul, Hyderabad",
        members: "330 active artisans",
        recommended: false
      }
    ],
    serviceAreas: [
      "Hitec City & Mindspace IT Corridor",
      "Madhapur & Kavuri Hills",
      "Gachibowli & Financial District",
      "Kukatpally & KPHB Colony",
      "Banjara Hills & Jubilee Hills",
      "Kondapur & Hafeezpet",
      "Ameerpet & SR Nagar",
      "Begumpet & Somajiguda",
      "Charminar & Old City Central",
      "Mehdipatnam & Tolichowki",
      "Dilsukhnagar & LB Nagar",
      "Miyapur & Nizampet"
    ]
  },

  "Medchal-Malkajgiri (Secunderabad)": {
    district: "Medchal-Malkajgiri (Secunderabad)",
    state: "Telangana",
    societies: [
      {
        name: "Secunderabad Cantonment Labour Cooperative (PACS-SEC-01)",
        code: "PACS-SEC-01",
        address: "RP Road, Secunderabad",
        members: "360 active artisans",
        recommended: true
      },
      {
        name: "Medchal Industrial & Artisan Workers Federation",
        code: "FED-MDL-02",
        address: "Kompally Highway, Secunderabad",
        members: "250 active artisans",
        recommended: false
      }
    ],
    serviceAreas: [
      "Secunderabad Station & RP Road",
      "Alwal & Bolarum Cantonment",
      "Malkajgiri & Safilguda",
      "Kompally & Medchal Highway",
      "ECIL & Kapra Zone",
      "Bowenpally & Tadbund",
      "Marredpally & West Marredpally"
    ]
  },

  "Warangal": {
    district: "Warangal",
    state: "Telangana",
    societies: [
      {
        name: "Warangal Kakatiya Labour Cooperative Society (PACS-WGL-01)",
        code: "PACS-WGL-01",
        address: "Hanamkonda Central, Warangal",
        members: "310 active artisans",
        recommended: true
      },
      {
        name: "Kazipet Railway & Industrial Artisan Guild",
        code: "UNION-WGL-02",
        address: "Kazipet Junction, Warangal",
        members: "230 active artisans",
        recommended: false
      }
    ],
    serviceAreas: [
      "Hanamkonda Chowrasta & Subedari",
      "Kazipet Junction & Diesel Colony",
      "Warangal Fort & Station Road",
      "KU Campus & Naimnagar",
      "Waddepally & Hunter Road",
      "Mulg Road & Industrial Estate"
    ]
  },

  "Karimnagar": {
    district: "Karimnagar",
    state: "Telangana",
    societies: [
      {
        name: "Karimnagar Smart City Cooperative Society (PACS-KRM-01)",
        code: "PACS-KRM-01",
        address: "Tower Circle, Karimnagar",
        members: "260 active artisans",
        recommended: true
      },
      {
        name: "Karimnagar & Godavari Valley Trades Union",
        code: "UNION-KRM-02",
        address: "Collectorate Road, Karimnagar",
        members: "190 active artisans",
        recommended: false
      }
    ],
    serviceAreas: [
      "Tower Circle & Collectorate",
      "Kashmirgadda & Mankammathota",
      "Vidyanagar & Bhagyanagar",
      "Kothapalli & bypass Road",
      "Alugunoor & Housing Board"
    ]
  },

  "Nizamabad": {
    district: "Nizamabad",
    state: "Telangana",
    societies: [
      {
        name: "Nizamabad Agro-Industrial Labour Guild (PACS-NZB-01)",
        code: "PACS-NZB-01",
        address: "Bodhan Road, Nizamabad",
        members: "240 active artisans",
        recommended: true
      }
    ],
    serviceAreas: [
      "Nizamabad Town & Khaleelwadi",
      "Bodhan Road & Subhash Nagar",
      "Barkatpura & Shivaji Nagar",
      "Vinayak Nagar & Bypass Road"
    ]
  }
};

// Generic resolver for any district name (handles synonyms, AP/TG fallbacks)
export function getDistrictSocietiesAndAreas(districtInput: string): {
  district: string;
  state: "Andhra Pradesh" | "Telangana";
  societies: CooperativeSocietyOption[];
  serviceAreas: string[];
} {
  const clean = (districtInput || "").trim().toLowerCase();

  // Check direct matches
  for (const [key, cfg] of Object.entries(AP_TELANGANA_DISTRICT_CONFIGS)) {
    if (clean.includes(key.toLowerCase()) || key.toLowerCase().includes(clean)) {
      return cfg;
    }
  }

  // Check synonyms
  if (clean.includes("vijayawada") || clean.includes("ntr") || clean.includes("krishna")) {
    return AP_TELANGANA_DISTRICT_CONFIGS["NTR District (Vijayawada)"];
  }
  if (clean.includes("tirupati") || clean.includes("chittoor") || clean.includes("tirumala")) {
    return AP_TELANGANA_DISTRICT_CONFIGS["Tirupati"];
  }
  if (clean.includes("vizag") || clean.includes("visakha")) {
    return AP_TELANGANA_DISTRICT_CONFIGS["Visakhapatnam"];
  }
  if (clean.includes("guntur") || clean.includes("amaravati") || clean.includes("tenali")) {
    return AP_TELANGANA_DISTRICT_CONFIGS["Guntur"];
  }
  if (clean.includes("kurnool") || clean.includes("nandyal")) {
    return AP_TELANGANA_DISTRICT_CONFIGS["Kurnool"];
  }
  if (clean.includes("hyderabad") || clean.includes("cyberabad")) {
    return AP_TELANGANA_DISTRICT_CONFIGS["Hyderabad"];
  }
  if (clean.includes("secunderabad") || clean.includes("medchal") || clean.includes("malkajgiri")) {
    return AP_TELANGANA_DISTRICT_CONFIGS["Medchal-Malkajgiri (Secunderabad)"];
  }
  if (clean.includes("warangal") || clean.includes("hanamkonda") || clean.includes("kazipet")) {
    return AP_TELANGANA_DISTRICT_CONFIGS["Warangal"];
  }
  if (clean.includes("karimnagar")) {
    return AP_TELANGANA_DISTRICT_CONFIGS["Karimnagar"];
  }
  if (clean.includes("nizamabad")) {
    return AP_TELANGANA_DISTRICT_CONFIGS["Nizamabad"];
  }

  // Fallback dynamic config for other AP/Telangana districts
  const fallbackDistrict = districtInput ? districtInput.trim() : "Tirupati";
  const isTelangana = /telangana|hyderabad|warangal|nizamabad|karimnagar|khammam|nalgonda|mahabubnagar|medak|adilabad/i.test(clean);
  const resolvedState = isTelangana ? "Telangana" : "Andhra Pradesh";

  return {
    district: fallbackDistrict,
    state: resolvedState,
    societies: [
      {
        name: `${fallbackDistrict} Central Cooperative Labour Society (PACS-${fallbackDistrict.slice(0, 3).toUpperCase()}-01)`,
        code: `PACS-${fallbackDistrict.slice(0, 3).toUpperCase()}-01`,
        address: `${fallbackDistrict} District Headquarters, ${resolvedState}`,
        members: "310 active members",
        recommended: true
      },
      {
        name: `${fallbackDistrict} District Technical Trades Cooperative Union`,
        code: `FED-${fallbackDistrict.slice(0, 3).toUpperCase()}-02`,
        address: `Main Bazaar Road, ${fallbackDistrict}`,
        members: "185 active members",
        recommended: false
      }
    ],
    serviceAreas: [
      `${fallbackDistrict} Central Zone`,
      `${fallbackDistrict} North Ward`,
      `${fallbackDistrict} South Urban Extension`,
      `${fallbackDistrict} Market & Bus Station Belt`,
      `${fallbackDistrict} Industrial Estate Zone`,
      `${fallbackDistrict} Suburbs & Mandals`
    ]
  };
}

