// Structured Indian Location Dataset: States, Union Territories, Districts, Major Cities & Pincode Prefixes

export interface DistrictInfo {
  name: string;
  headquarters: string;
  majorCities: string[];
  pincodePrefixes: string[]; // 3-digit prefixes
  cooperativeActive: boolean;
  servicesAvailable: string[];
}

export interface StateInfo {
  name: string;
  code: string;
  isUnionTerritory: boolean;
  capital: string;
  districts: DistrictInfo[];
}

export const ALL_SERVICES = [
  "Electrician",
  "Plumber",
  "Carpenter",
  "Painter",
  "Cleaner",
  "Caregiver",
  "Driver",
  "Gardener",
  "Technician",
  "Domestic Helper"
];

export const INDIA_STATES_DATA: StateInfo[] = [
  {
    name: "Andhra Pradesh",
    code: "AP",
    isUnionTerritory: false,
    capital: "Amaravati",
    districts: [
      {
        name: "NTR District (Vijayawada)",
        headquarters: "Vijayawada",
        majorCities: ["Vijayawada", "Ibrahimpatnam", "Nandigama", "Jaggayyapeta"],
        pincodePrefixes: ["520", "521"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      },
      {
        name: "Guntur",
        headquarters: "Guntur",
        majorCities: ["Guntur", "Tenali", "Mangalagiri", "Ponnur"],
        pincodePrefixes: ["522"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      },
      {
        name: "Visakhapatnam",
        headquarters: "Visakhapatnam",
        majorCities: ["Visakhapatnam", "Gajuwaka", "Bheemunipatnam", "Anakapalle"],
        pincodePrefixes: ["530", "531"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      },
      {
        name: "Tirupati",
        headquarters: "Tirupati",
        majorCities: ["Tirupati", "Srikalahasti", "Chandragiri", "Venkatagiri"],
        pincodePrefixes: ["517"],
        cooperativeActive: true,
        servicesAvailable: ["Electrician", "Plumber", "Carpenter", "Cleaner", "Domestic Helper"]
      },
      {
        name: "Kurnool",
        headquarters: "Kurnool",
        majorCities: ["Kurnool", "Nandyal", "Adoni", "Yemmiganur"],
        pincodePrefixes: ["518"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      }
    ]
  },
  {
    name: "Telangana",
    code: "TG",
    isUnionTerritory: false,
    capital: "Hyderabad",
    districts: [
      {
        name: "Hyderabad",
        headquarters: "Hyderabad",
        majorCities: ["Hyderabad", "Secunderabad", "Cyberabad", "Begumpet"],
        pincodePrefixes: ["500", "501"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      },
      {
        name: "Warangal",
        headquarters: "Warangal",
        majorCities: ["Warangal", "Hanamkonda", "Kazipet"],
        pincodePrefixes: ["506"],
        cooperativeActive: true,
        servicesAvailable: ["Electrician", "Plumber", "Carpenter", "Painter", "Cleaner"]
      },
      {
        name: "Karimnagar",
        headquarters: "Karimnagar",
        majorCities: ["Karimnagar", "Ramagundam"],
        pincodePrefixes: ["505"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      }
    ]
  },
  {
    name: "Karnataka",
    code: "KA",
    isUnionTerritory: false,
    capital: "Bengaluru",
    districts: [
      {
        name: "Bengaluru Urban",
        headquarters: "Bengaluru",
        majorCities: ["Bengaluru", "Electronic City", "Whitefield", "Yelahanka"],
        pincodePrefixes: ["560", "562"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      },
      {
        name: "Mysuru",
        headquarters: "Mysuru",
        majorCities: ["Mysuru", "Nanjangud", "Hunsur"],
        pincodePrefixes: ["570", "571"],
        cooperativeActive: true,
        servicesAvailable: ["Electrician", "Plumber", "Carpenter", "Cleaner", "Gardener"]
      },
      {
        name: "Mangaluru (Dakshina Kannada)",
        headquarters: "Mangaluru",
        majorCities: ["Mangaluru", "Bantwal", "Puttur"],
        pincodePrefixes: ["575"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      }
    ]
  },
  {
    name: "Tamil Nadu",
    code: "TN",
    isUnionTerritory: false,
    capital: "Chennai",
    districts: [
      {
        name: "Chennai",
        headquarters: "Chennai",
        majorCities: ["Chennai", "Tambaram", "Avadi", "Ambattur"],
        pincodePrefixes: ["600"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      },
      {
        name: "Coimbatore",
        headquarters: "Coimbatore",
        majorCities: ["Coimbatore", "Pollachi", "Mettupalayam"],
        pincodePrefixes: ["641"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      },
      {
        name: "Madurai",
        headquarters: "Madurai",
        majorCities: ["Madurai", "Melur", "Thirumangalam"],
        pincodePrefixes: ["625"],
        cooperativeActive: true,
        servicesAvailable: ["Electrician", "Plumber", "Painter", "Carpenter"]
      }
    ]
  },
  {
    name: "Maharashtra",
    code: "MH",
    isUnionTerritory: false,
    capital: "Mumbai",
    districts: [
      {
        name: "Mumbai & Suburban",
        headquarters: "Mumbai",
        majorCities: ["Mumbai", "Bandra", "Andheri", "Borivali", "Thane", "Navi Mumbai"],
        pincodePrefixes: ["400"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      },
      {
        name: "Pune",
        headquarters: "Pune",
        majorCities: ["Pune", "Pimpri-Chinchwad", "Khadki"],
        pincodePrefixes: ["411", "412"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      },
      {
        name: "Nagpur",
        headquarters: "Nagpur",
        majorCities: ["Nagpur", "Kamthi", "Umred"],
        pincodePrefixes: ["440", "441"],
        cooperativeActive: true,
        servicesAvailable: ["Electrician", "Plumber", "Carpenter", "Technician"]
      }
    ]
  },
  {
    name: "Delhi (NCT)",
    code: "DL",
    isUnionTerritory: true,
    capital: "New Delhi",
    districts: [
      {
        name: "National Capital Territory",
        headquarters: "New Delhi",
        majorCities: ["New Delhi", "North Delhi", "South Delhi", "West Delhi", "East Delhi", "Dwarka"],
        pincodePrefixes: ["110"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      }
    ]
  },
  {
    name: "Uttar Pradesh",
    code: "UP",
    isUnionTerritory: false,
    capital: "Lucknow",
    districts: [
      {
        name: "Lucknow",
        headquarters: "Lucknow",
        majorCities: ["Lucknow", "Gomti Nagar", "Alambagh"],
        pincodePrefixes: ["226"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      },
      {
        name: "Gautam Buddha Nagar (Noida)",
        headquarters: "Noida",
        majorCities: ["Noida", "Greater Noida", "Dadri"],
        pincodePrefixes: ["201"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      },
      {
        name: "Varanasi",
        headquarters: "Varanasi",
        majorCities: ["Varanasi", "Ramnagar"],
        pincodePrefixes: ["221"],
        cooperativeActive: true,
        servicesAvailable: ["Electrician", "Plumber", "Painter", "Domestic Helper"]
      }
    ]
  },
  {
    name: "Gujarat",
    code: "GJ",
    isUnionTerritory: false,
    capital: "Gandhinagar",
    districts: [
      {
        name: "Ahmedabad",
        headquarters: "Ahmedabad",
        majorCities: ["Ahmedabad", "Sanand", "Dholka"],
        pincodePrefixes: ["380", "382"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      },
      {
        name: "Surat",
        headquarters: "Surat",
        majorCities: ["Surat", "Bardoli", "Navsari"],
        pincodePrefixes: ["394", "395"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      }
    ]
  },
  {
    name: "West Bengal",
    code: "WB",
    isUnionTerritory: false,
    capital: "Kolkata",
    districts: [
      {
        name: "Kolkata",
        headquarters: "Kolkata",
        majorCities: ["Kolkata", "Howrah", "Bidhannagar", "Salt Lake"],
        pincodePrefixes: ["700", "711"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      }
    ]
  },
  {
    name: "Kerala",
    code: "KL",
    isUnionTerritory: false,
    capital: "Thiruvananthapuram",
    districts: [
      {
        name: "Thiruvananthapuram",
        headquarters: "Thiruvananthapuram",
        majorCities: ["Thiruvananthapuram", "Neyyattinkara", "Attingal"],
        pincodePrefixes: ["695"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      },
      {
        name: "Ernakulam (Kochi)",
        headquarters: "Kochi",
        majorCities: ["Kochi", "Ernakulam", "Aluva"],
        pincodePrefixes: ["682"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      }
    ]
  },
  {
    name: "Rajasthan",
    code: "RJ",
    isUnionTerritory: false,
    capital: "Jaipur",
    districts: [
      {
        name: "Jaipur",
        headquarters: "Jaipur",
        majorCities: ["Jaipur", "Amer", "Sanganer"],
        pincodePrefixes: ["302"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      }
    ]
  },
  {
    name: "Madhya Pradesh",
    code: "MP",
    isUnionTerritory: false,
    capital: "Bhopal",
    districts: [
      {
        name: "Bhopal",
        headquarters: "Bhopal",
        majorCities: ["Bhopal", "Berasia"],
        pincodePrefixes: ["462"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      },
      {
        name: "Indore",
        headquarters: "Indore",
        majorCities: ["Indore", "Mhow"],
        pincodePrefixes: ["452"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      }
    ]
  },
  {
    name: "Punjab",
    code: "PB",
    isUnionTerritory: false,
    capital: "Chandigarh",
    districts: [
      {
        name: "Ludhiana",
        headquarters: "Ludhiana",
        majorCities: ["Ludhiana", "Khanna", "Jagraon"],
        pincodePrefixes: ["141"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      }
    ]
  },
  {
    name: "Haryana",
    code: "HR",
    isUnionTerritory: false,
    capital: "Chandigarh",
    districts: [
      {
        name: "Gurugram",
        headquarters: "Gurugram",
        majorCities: ["Gurugram", "Sohna", "Manesar"],
        pincodePrefixes: ["122"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      }
    ]
  },
  {
    name: "Odisha",
    code: "OD",
    isUnionTerritory: false,
    capital: "Bhubaneswar",
    districts: [
      {
        name: "Khurda (Bhubaneswar)",
        headquarters: "Bhubaneswar",
        majorCities: ["Bhubaneswar", "Khurda", "Jatani"],
        pincodePrefixes: ["751"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      }
    ]
  },
  {
    name: "Bihar",
    code: "BR",
    isUnionTerritory: false,
    capital: "Patna",
    districts: [
      {
        name: "Patna",
        headquarters: "Patna",
        majorCities: ["Patna", "Danapur", "Phulwari Sharif"],
        pincodePrefixes: ["800"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      }
    ]
  },
  {
    name: "Assam",
    code: "AS",
    isUnionTerritory: false,
    capital: "Dispur",
    districts: [
      {
        name: "Kamrup Metropolitan (Guwahati)",
        headquarters: "Guwahati",
        majorCities: ["Guwahati", "Dispur", "North Guwahati"],
        pincodePrefixes: ["781"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      }
    ]
  },
  {
    name: "Jharkhand",
    code: "JH",
    isUnionTerritory: false,
    capital: "Ranchi",
    districts: [
      {
        name: "Ranchi",
        headquarters: "Ranchi",
        majorCities: ["Ranchi", "Kanke", "Hatia"],
        pincodePrefixes: ["834"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      }
    ]
  },
  {
    name: "Chhattisgarh",
    code: "CG",
    isUnionTerritory: false,
    capital: "Raipur",
    districts: [
      {
        name: "Raipur",
        headquarters: "Raipur",
        majorCities: ["Raipur", "Nava Raipur", "Birgaon"],
        pincodePrefixes: ["492"],
        cooperativeActive: true,
        servicesAvailable: ALL_SERVICES
      }
    ]
  }
];

