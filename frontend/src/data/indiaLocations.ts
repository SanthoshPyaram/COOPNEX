// Frontend Indian Location Dataset: States, Union Territories, Districts, Major Cities & Pincode Prefixes
import { WorkerProfile } from "../types";

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

export interface PincodeCheckResult {
  pincode: string;
  isValidFormat: boolean;
  state?: string;
  district?: string;
  city?: string;
  isCovered: boolean;
  activeCooperative: boolean;
  servicesAvailable: string[];
  cooperativeName?: string;
  slaMinutes?: number;
  nearestHub?: string;
  message: string;
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

// Comprehensive prefix mapping for active cooperative hubs and expansion areas across India
interface PincodeMeta {
  city: string;
  district: string;
  state: string;
  active: boolean;
}

const PINCODE_PREFIX_LOOKUP: Record<string, PincodeMeta> = {
  // Andhra Pradesh
  "520": { city: "Vijayawada", district: "NTR District (Vijayawada)", state: "Andhra Pradesh", active: true },
  "521": { city: "Machilipatnam", district: "Krishna District", state: "Andhra Pradesh", active: true },
  "522": { city: "Guntur", district: "Guntur District", state: "Andhra Pradesh", active: true },
  "523": { city: "Ongole", district: "Prakasam District", state: "Andhra Pradesh", active: true },
  "524": { city: "Nellore", district: "SPSR Nellore District", state: "Andhra Pradesh", active: true },
  "530": { city: "Visakhapatnam", district: "Visakhapatnam District", state: "Andhra Pradesh", active: true },
  "531": { city: "Anakapalle", district: "Anakapalle District", state: "Andhra Pradesh", active: true },
  "532": { city: "Srikakulam", district: "Srikakulam District", state: "Andhra Pradesh", active: true },
  "533": { city: "Kakinada", district: "Kakinada District", state: "Andhra Pradesh", active: true },
  "534": { city: "Eluru", district: "Eluru District", state: "Andhra Pradesh", active: true },
  "517": { city: "Tirupati", district: "Tirupati District", state: "Andhra Pradesh", active: true },
  "518": { city: "Kurnool", district: "Kurnool District", state: "Andhra Pradesh", active: true },
  "515": { city: "Anantapur", district: "Anantapur District", state: "Andhra Pradesh", active: true },
  "516": { city: "Kadapa", district: "YSR Kadapa District", state: "Andhra Pradesh", active: true },

  // Telangana
  "500": { city: "Hyderabad", district: "Hyderabad District", state: "Telangana", active: true },
  "501": { city: "Secunderabad", district: "Ranga Reddy District", state: "Telangana", active: true },
  "506": { city: "Warangal", district: "Warangal District", state: "Telangana", active: true },
  "505": { city: "Karimnagar", district: "Karimnagar District", state: "Telangana", active: true },
  "502": { city: "Sangareddy", district: "Medak District", state: "Telangana", active: true },
  "503": { city: "Nizamabad", district: "Nizamabad District", state: "Telangana", active: true },
  "504": { city: "Adilabad", district: "Adilabad District", state: "Telangana", active: true },
  "507": { city: "Khammam", district: "Khammam District", state: "Telangana", active: true },
  "508": { city: "Nalgonda", district: "Nalgonda District", state: "Telangana", active: true },
  "509": { city: "Mahabubnagar", district: "Mahabubnagar District", state: "Telangana", active: true },

  // Karnataka
  "560": { city: "Bengaluru", district: "Bengaluru Urban", state: "Karnataka", active: true },
  "561": { city: "Kolar", district: "Kolar District", state: "Karnataka", active: true },
  "562": { city: "Bengaluru Rural", district: "Bengaluru Rural", state: "Karnataka", active: true },
  "570": { city: "Mysuru", district: "Mysuru District", state: "Karnataka", active: true },
  "571": { city: "Nanjangud", district: "Mysuru District", state: "Karnataka", active: true },
  "572": { city: "Tumakuru", district: "Tumakuru District", state: "Karnataka", active: true },
  "573": { city: "Hassan", district: "Hassan District", state: "Karnataka", active: true },
  "575": { city: "Mangaluru", district: "Dakshina Kannada", state: "Karnataka", active: true },
  "576": { city: "Udupi", district: "Udupi District", state: "Karnataka", active: true },
  "577": { city: "Shivamogga", district: "Shivamogga District", state: "Karnataka", active: true },
  "580": { city: "Hubballi-Dharwad", district: "Dharwad District", state: "Karnataka", active: true },
  "581": { city: "Sirsi", district: "Uttara Kannada", state: "Karnataka", active: true },
  "583": { city: "Ballari", district: "Ballari District", state: "Karnataka", active: true },
  "585": { city: "Kalaburagi", district: "Kalaburagi District", state: "Karnataka", active: true },
  "590": { city: "Belagavi", district: "Belagavi District", state: "Karnataka", active: true },

  // Tamil Nadu & Puducherry
  "600": { city: "Chennai", district: "Chennai District", state: "Tamil Nadu", active: true },
  "601": { city: "Tiruvallur", district: "Tiruvallur District", state: "Tamil Nadu", active: true },
  "602": { city: "Kanchipuram", district: "Kanchipuram District", state: "Tamil Nadu", active: true },
  "603": { city: "Chengalpattu", district: "Chengalpattu District", state: "Tamil Nadu", active: true },
  "605": { city: "Puducherry", district: "Puducherry UT", state: "Puducherry", active: true },
  "606": { city: "Viluppuram", district: "Viluppuram District", state: "Tamil Nadu", active: true },
  "620": { city: "Tiruchirappalli", district: "Tiruchirappalli District", state: "Tamil Nadu", active: true },
  "621": { city: "Perambalur", district: "Perambalur District", state: "Tamil Nadu", active: true },
  "625": { city: "Madurai", district: "Madurai District", state: "Tamil Nadu", active: true },
  "626": { city: "Virudhunagar", district: "Virudhunagar District", state: "Tamil Nadu", active: true },
  "627": { city: "Tirunelveli", district: "Tirunelveli District", state: "Tamil Nadu", active: true },
  "628": { city: "Thoothukudi", district: "Thoothukudi District", state: "Tamil Nadu", active: true },
  "629": { city: "Kanyakumari", district: "Kanyakumari District", state: "Tamil Nadu", active: true },
  "632": { city: "Vellore", district: "Vellore District", state: "Tamil Nadu", active: true },
  "636": { city: "Salem", district: "Salem District", state: "Tamil Nadu", active: true },
  "638": { city: "Erode", district: "Erode District", state: "Tamil Nadu", active: true },
  "641": { city: "Coimbatore", district: "Coimbatore District", state: "Tamil Nadu", active: true },
  "642": { city: "Pollachi", district: "Coimbatore District", state: "Tamil Nadu", active: true },
  "643": { city: "Udhagamandalam (Ooty)", district: "Nilgiris District", state: "Tamil Nadu", active: true },

  // Kerala
  "670": { city: "Kannur", district: "Kannur District", state: "Kerala", active: true },
  "671": { city: "Kasaragod", district: "Kasaragod District", state: "Kerala", active: true },
  "673": { city: "Kozhikode", district: "Kozhikode District", state: "Kerala", active: true },
  "676": { city: "Malappuram", district: "Malappuram District", state: "Kerala", active: true },
  "678": { city: "Palakkad", district: "Palakkad District", state: "Kerala", active: true },
  "680": { city: "Thrissur", district: "Thrissur District", state: "Kerala", active: true },
  "682": { city: "Kochi", district: "Ernakulam District", state: "Kerala", active: true },
  "683": { city: "Aluva", district: "Ernakulam District", state: "Kerala", active: true },
  "685": { city: "Idukki", district: "Idukki District", state: "Kerala", active: true },
  "686": { city: "Kottayam", district: "Kottayam District", state: "Kerala", active: true },
  "688": { city: "Alappuzha", district: "Alappuzha District", state: "Kerala", active: true },
  "689": { city: "Pathanamthitta", district: "Pathanamthitta District", state: "Kerala", active: true },
  "691": { city: "Kollam", district: "Kollam District", state: "Kerala", active: true },
  "695": { city: "Thiruvananthapuram", district: "Thiruvananthapuram District", state: "Kerala", active: true },

  // Maharashtra & Goa
  "400": { city: "Mumbai", district: "Mumbai City & Suburban", state: "Maharashtra", active: true },
  "401": { city: "Thane", district: "Thane District", state: "Maharashtra", active: true },
  "402": { city: "Raigad (Alibag)", district: "Raigad District", state: "Maharashtra", active: true },
  "403": { city: "Panaji", district: "North Goa", state: "Goa", active: true },
  "410": { city: "Lonavala / Khopoli", district: "Pune District", state: "Maharashtra", active: true },
  "411": { city: "Pune", district: "Pune District", state: "Maharashtra", active: true },
  "412": { city: "Pune Rural (Pimpri)", district: "Pune District", state: "Maharashtra", active: true },
  "413": { city: "Solapur", district: "Solapur District", state: "Maharashtra", active: true },
  "414": { city: "Ahmednagar", district: "Ahmednagar District", state: "Maharashtra", active: true },
  "415": { city: "Satara", district: "Satara District", state: "Maharashtra", active: true },
  "416": { city: "Kolhapur", district: "Kolhapur District", state: "Maharashtra", active: true },
  "421": { city: "Kalyan / Dombivli", district: "Thane District", state: "Maharashtra", active: true },
  "422": { city: "Nashik", district: "Nashik District", state: "Maharashtra", active: true },
  "424": { city: "Dhule", district: "Dhule District", state: "Maharashtra", active: true },
  "425": { city: "Jalgaon", district: "Jalgaon District", state: "Maharashtra", active: true },
  "431": { city: "Chhatrapati Sambhaji Nagar", district: "Aurangabad District", state: "Maharashtra", active: true },
  "440": { city: "Nagpur", district: "Nagpur District", state: "Maharashtra", active: true },
  "441": { city: "Nagpur Rural", district: "Nagpur District", state: "Maharashtra", active: true },
  "444": { city: "Amravati", district: "Amravati District", state: "Maharashtra", active: true },

  // Delhi NCR & Northern India
  "110": { city: "New Delhi", district: "New Delhi / Central Delhi", state: "Delhi", active: true },
  "121": { city: "Faridabad", district: "Faridabad District", state: "Haryana", active: true },
  "122": { city: "Gurugram", district: "Gurugram District", state: "Haryana", active: true },
  "124": { city: "Rohtak", district: "Rohtak District", state: "Haryana", active: true },
  "125": { city: "Hisar", district: "Hisar District", state: "Haryana", active: true },
  "131": { city: "Sonipat", district: "Sonipat District", state: "Haryana", active: true },
  "132": { city: "Panipat", district: "Panipat District", state: "Haryana", active: true },
  "133": { city: "Ambala", district: "Ambala District", state: "Haryana", active: true },
  "134": { city: "Panchkula", district: "Panchkula District", state: "Haryana", active: true },
  "140": { city: "Mohali (SAS Nagar)", district: "Mohali District", state: "Punjab", active: true },
  "141": { city: "Ludhiana", district: "Ludhiana District", state: "Punjab", active: true },
  "143": { city: "Amritsar", district: "Amritsar District", state: "Punjab", active: true },
  "144": { city: "Jalandhar", district: "Jalandhar District", state: "Punjab", active: true },
  "147": { city: "Patiala", district: "Patiala District", state: "Punjab", active: true },
  "151": { city: "Bathinda", district: "Bathinda District", state: "Punjab", active: true },
  "160": { city: "Chandigarh", district: "Chandigarh Capital Complex", state: "Chandigarh", active: true },
  "171": { city: "Shimla", district: "Shimla District", state: "Himachal Pradesh", active: true },
  "173": { city: "Solan", district: "Solan District", state: "Himachal Pradesh", active: true },
  "176": { city: "Dharamshala", district: "Kangra District", state: "Himachal Pradesh", active: true },
  "180": { city: "Jammu", district: "Jammu District", state: "Jammu & Kashmir", active: true },
  "190": { city: "Srinagar", district: "Srinagar District", state: "Jammu & Kashmir", active: true },
  "194": { city: "Leh", district: "Leh Ladakh", state: "Ladakh", active: true },

  // Uttar Pradesh & Uttarakhand
  "201": { city: "Noida / Ghaziabad", district: "Gautam Buddha Nagar", state: "Uttar Pradesh", active: true },
  "202": { city: "Aligarh", district: "Aligarh District", state: "Uttar Pradesh", active: true },
  "203": { city: "Bulandshahr", district: "Bulandshahr District", state: "Uttar Pradesh", active: true },
  "208": { city: "Kanpur", district: "Kanpur Nagar", state: "Uttar Pradesh", active: true },
  "211": { city: "Prayagraj (Allahabad)", district: "Prayagraj District", state: "Uttar Pradesh", active: true },
  "221": { city: "Varanasi", district: "Varanasi District", state: "Uttar Pradesh", active: true },
  "224": { city: "Ayodhya (Faizabad)", district: "Ayodhya District", state: "Uttar Pradesh", active: true },
  "226": { city: "Lucknow", district: "Lucknow District", state: "Uttar Pradesh", active: true },
  "241": { city: "Hardoi", district: "Hardoi District", state: "Uttar Pradesh", active: true },
  "243": { city: "Bareilly", district: "Bareilly District", state: "Uttar Pradesh", active: true },
  "244": { city: "Moradabad", district: "Moradabad District", state: "Uttar Pradesh", active: true },
  "248": { city: "Dehradun", district: "Dehradun District", state: "Uttarakhand", active: true },
  "249": { city: "Haridwar / Rishikesh", district: "Haridwar District", state: "Uttarakhand", active: true },
  "250": { city: "Meerut", district: "Meerut District", state: "Uttar Pradesh", active: true },
  "263": { city: "Nainital / Haldwani", district: "Nainital District", state: "Uttarakhand", active: true },
  "273": { city: "Gorakhpur", district: "Gorakhpur District", state: "Uttar Pradesh", active: true },
  "281": { city: "Mathura", district: "Mathura District", state: "Uttar Pradesh", active: true },
  "282": { city: "Agra", district: "Agra District", state: "Uttar Pradesh", active: true },
  "284": { city: "Jhansi", district: "Jhansi District", state: "Uttar Pradesh", active: true },

  // Gujarat
  "360": { city: "Rajkot", district: "Rajkot District", state: "Gujarat", active: true },
  "361": { city: "Jamnagar", district: "Jamnagar District", state: "Gujarat", active: true },
  "364": { city: "Bhavnagar", district: "Bhavnagar District", state: "Gujarat", active: true },
  "370": { city: "Bhuj", district: "Kutch District", state: "Gujarat", active: true },
  "380": { city: "Ahmedabad", district: "Ahmedabad District", state: "Gujarat", active: true },
  "382": { city: "Gandhinagar", district: "Gandhinagar District", state: "Gujarat", active: true },
  "388": { city: "Anand", district: "Anand District", state: "Gujarat", active: true },
  "390": { city: "Vadodara", district: "Vadodara District", state: "Gujarat", active: true },
  "392": { city: "Bharuch", district: "Bharuch District", state: "Gujarat", active: true },
  "395": { city: "Surat", district: "Surat District", state: "Gujarat", active: true },
  "396": { city: "Navsari / Vapi", district: "Valsad District", state: "Gujarat", active: true },

  // Rajasthan
  "301": { city: "Alwar", district: "Alwar District", state: "Rajasthan", active: true },
  "302": { city: "Jaipur", district: "Jaipur District", state: "Rajasthan", active: true },
  "305": { city: "Ajmer", district: "Ajmer District", state: "Rajasthan", active: true },
  "311": { city: "Bhilwara", district: "Bhilwara District", state: "Rajasthan", active: true },
  "313": { city: "Udaipur", district: "Udaipur District", state: "Rajasthan", active: true },
  "324": { city: "Kota", district: "Kota District", state: "Rajasthan", active: true },
  "334": { city: "Bikaner", district: "Bikaner District", state: "Rajasthan", active: true },
  "342": { city: "Jodhpur", district: "Jodhpur District", state: "Rajasthan", active: true },

  // Madhya Pradesh & Chhattisgarh
  "450": { city: "Khandwa", district: "East Nimar", state: "Madhya Pradesh", active: true },
  "452": { city: "Indore", district: "Indore District", state: "Madhya Pradesh", active: true },
  "456": { city: "Ujjain", district: "Ujjain District", state: "Madhya Pradesh", active: true },
  "462": { city: "Bhopal", district: "Bhopal District", state: "Madhya Pradesh", active: true },
  "474": { city: "Gwalior", district: "Gwalior District", state: "Madhya Pradesh", active: true },
  "482": { city: "Jabalpur", district: "Jabalpur District", state: "Madhya Pradesh", active: true },
  "490": { city: "Bhilai / Durg", district: "Durg District", state: "Chhattisgarh", active: true },
  "492": { city: "Raipur", district: "Raipur District", state: "Chhattisgarh", active: true },
  "495": { city: "Bilaspur", district: "Bilaspur District", state: "Chhattisgarh", active: true },

  // West Bengal, Odisha & North East
  "700": { city: "Kolkata", district: "Kolkata District", state: "West Bengal", active: true },
  "711": { city: "Howrah", district: "Howrah District", state: "West Bengal", active: true },
  "713": { city: "Asansol / Durgapur", district: "Paschim Bardhaman", state: "West Bengal", active: true },
  "721": { city: "Kharagpur", district: "Paschim Medinipur", state: "West Bengal", active: true },
  "734": { city: "Siliguri", district: "Darjeeling District", state: "West Bengal", active: true },
  "737": { city: "Gangtok", district: "East Sikkim", state: "Sikkim", active: true },
  "751": { city: "Bhubaneswar", district: "Khurda District", state: "Odisha", active: true },
  "753": { city: "Cuttack", district: "Cuttack District", state: "Odisha", active: true },
  "756": { city: "Balasore", district: "Balasore District", state: "Odisha", active: true },
  "769": { city: "Rourkela", district: "Sundargarh District", state: "Odisha", active: true },
  "781": { city: "Guwahati", district: "Kamrup Metropolitan", state: "Assam", active: true },
  "786": { city: "Dibrugarh", district: "Dibrugarh District", state: "Assam", active: true },
  "793": { city: "Shillong", district: "East Khasi Hills", state: "Meghalaya", active: true },
  "795": { city: "Imphal", district: "Imphal West", state: "Manipur", active: true },
  "796": { city: "Aizawl", district: "Aizawl District", state: "Mizoram", active: true },
  "797": { city: "Kohima / Dimapur", district: "Kohima District", state: "Nagaland", active: true },
  "799": { city: "Agartala", district: "West Tripura", state: "Tripura", active: true },

  // Bihar & Jharkhand
  "800": { city: "Patna", district: "Patna District", state: "Bihar", active: true },
  "823": { city: "Gaya", district: "Gaya District", state: "Bihar", active: true },
  "826": { city: "Dhanbad", district: "Dhanbad District", state: "Jharkhand", active: true },
  "827": { city: "Bokaro", district: "Bokaro District", state: "Jharkhand", active: true },
  "831": { city: "Jamshedpur", district: "East Singhbhum", state: "Jharkhand", active: true },
  "834": { city: "Ranchi", district: "Ranchi District", state: "Jharkhand", active: true },
  "842": { city: "Muzaffarpur", district: "Muzaffarpur District", state: "Bihar", active: true },
  "846": { city: "Darbhanga", district: "Darbhanga District", state: "Bihar", active: true },
  "854": { city: "Purnia", district: "Purnia District", state: "Bihar", active: true }
};

export function checkLocalPincode(pincode: string, requestedService?: string): PincodeCheckResult {
  const cleanPin = (pincode || "").replace(/\D/g, "").trim();
  const effectivePin = /^[1-9][0-9]{5}$/.test(cleanPin)
    ? cleanPin
    : (cleanPin.length >= 2 ? cleanPin.padEnd(6, "0") : "520001");

  const prefix3 = effectivePin.substring(0, 3);
  const prefix2 = effectivePin.substring(0, 2);

  // 1. Direct 3-digit prefix lookup
  const matched = PINCODE_PREFIX_LOOKUP[prefix3];

  if (matched) {
    return {
      pincode: effectivePin,
      isValidFormat: true,
      city: matched.city,
      district: matched.district,
      state: matched.state,
      isCovered: true,
      activeCooperative: true,
      servicesAvailable: ALL_SERVICES,
      cooperativeName: `${matched.city} Central Primary Labour Cooperative Society (PLCS)`,
      slaMinutes: 16,
      nearestHub: `${matched.city} Cooperative Seva Kendra`,
      message: `Cooperative Service Available in ${matched.city}, ${matched.state}! Verified cooperative artisans ready for immediate dispatch.`
    };
  }

  // 2. Comprehensive 2-digit Circle Matching for Pan-India Coverage (All 28 States & 8 UTs)
  const stateByPrefix2: Record<string, { state: string; sampleCity: string; district: string }> = {
    "11": { state: "Delhi", sampleCity: "New Delhi", district: "Central Delhi" },
    "12": { state: "Haryana", sampleCity: "Faridabad", district: "Faridabad District" },
    "13": { state: "Haryana", sampleCity: "Ambala", district: "Ambala District" },
    "14": { state: "Punjab", sampleCity: "Jalandhar", district: "Jalandhar District" },
    "15": { state: "Punjab", sampleCity: "Bathinda", district: "Bathinda District" },
    "16": { state: "Chandigarh", sampleCity: "Chandigarh", district: "Chandigarh Capital Complex" },
    "17": { state: "Himachal Pradesh", sampleCity: "Shimla", district: "Shimla District" },
    "18": { state: "Jammu & Kashmir", sampleCity: "Jammu", district: "Jammu District" },
    "19": { state: "Jammu & Kashmir", sampleCity: "Srinagar", district: "Srinagar District" },
    "20": { state: "Uttar Pradesh", sampleCity: "Aligarh", district: "Aligarh District" },
    "21": { state: "Uttar Pradesh", sampleCity: "Prayagraj", district: "Prayagraj District" },
    "22": { state: "Uttar Pradesh", sampleCity: "Lucknow", district: "Lucknow District" },
    "23": { state: "Uttar Pradesh", sampleCity: "Mirzapur", district: "Mirzapur District" },
    "24": { state: "Uttarakhand", sampleCity: "Dehradun", district: "Dehradun District" },
    "25": { state: "Uttar Pradesh", sampleCity: "Meerut", district: "Meerut District" },
    "26": { state: "Uttarakhand", sampleCity: "Nainital", district: "Nainital District" },
    "27": { state: "Uttar Pradesh", sampleCity: "Gorakhpur", district: "Gorakhpur District" },
    "28": { state: "Uttar Pradesh", sampleCity: "Agra", district: "Agra District" },
    "30": { state: "Rajasthan", sampleCity: "Jaipur", district: "Jaipur District" },
    "31": { state: "Rajasthan", sampleCity: "Udaipur", district: "Udaipur District" },
    "32": { state: "Rajasthan", sampleCity: "Kota", district: "Kota District" },
    "33": { state: "Rajasthan", sampleCity: "Bikaner", district: "Bikaner District" },
    "34": { state: "Rajasthan", sampleCity: "Jodhpur", district: "Jodhpur District" },
    "36": { state: "Gujarat", sampleCity: "Rajkot", district: "Rajkot District" },
    "37": { state: "Gujarat", sampleCity: "Kutch", district: "Kutch District" },
    "38": { state: "Gujarat", sampleCity: "Ahmedabad", district: "Ahmedabad District" },
    "39": { state: "Gujarat", sampleCity: "Surat", district: "Surat District" },
    "40": { state: "Maharashtra", sampleCity: "Mumbai", district: "Mumbai Metropolitan" },
    "41": { state: "Maharashtra", sampleCity: "Pune", district: "Pune District" },
    "42": { state: "Maharashtra", sampleCity: "Nashik", district: "Nashik District" },
    "43": { state: "Maharashtra", sampleCity: "Chhatrapati Sambhaji Nagar", district: "Aurangabad District" },
    "44": { state: "Maharashtra", sampleCity: "Nagpur", district: "Nagpur District" },
    "45": { state: "Madhya Pradesh", sampleCity: "Indore", district: "Indore District" },
    "46": { state: "Madhya Pradesh", sampleCity: "Bhopal", district: "Bhopal District" },
    "47": { state: "Madhya Pradesh", sampleCity: "Gwalior", district: "Gwalior District" },
    "48": { state: "Madhya Pradesh", sampleCity: "Jabalpur", district: "Jabalpur District" },
    "49": { state: "Chhattisgarh", sampleCity: "Raipur", district: "Raipur District" },
    "50": { state: "Telangana", sampleCity: "Hyderabad", district: "Hyderabad District" },
    "51": { state: "Andhra Pradesh", sampleCity: "Tirupati", district: "Tirupati District" },
    "52": { state: "Andhra Pradesh", sampleCity: "Vijayawada", district: "NTR District" },
    "53": { state: "Andhra Pradesh", sampleCity: "Visakhapatnam", district: "Visakhapatnam District" },
    "56": { state: "Karnataka", sampleCity: "Bengaluru", district: "Bengaluru Urban" },
    "57": { state: "Karnataka", sampleCity: "Mysuru", district: "Mysuru District" },
    "58": { state: "Karnataka", sampleCity: "Hubballi-Dharwad", district: "Dharwad District" },
    "59": { state: "Karnataka", sampleCity: "Belagavi", district: "Belagavi District" },
    "60": { state: "Tamil Nadu", sampleCity: "Chennai", district: "Chennai District" },
    "61": { state: "Tamil Nadu", sampleCity: "Thanjavur", district: "Thanjavur District" },
    "62": { state: "Tamil Nadu", sampleCity: "Madurai", district: "Madurai District" },
    "63": { state: "Tamil Nadu", sampleCity: "Salem", district: "Salem District" },
    "64": { state: "Tamil Nadu", sampleCity: "Coimbatore", district: "Coimbatore District" },
    "67": { state: "Kerala", sampleCity: "Kozhikode", district: "Kozhikode District" },
    "68": { state: "Kerala", sampleCity: "Kochi", district: "Ernakulam District" },
    "69": { state: "Kerala", sampleCity: "Thiruvananthapuram", district: "Thiruvananthapuram District" },
    "70": { state: "West Bengal", sampleCity: "Kolkata", district: "Kolkata District" },
    "71": { state: "West Bengal", sampleCity: "Howrah", district: "Howrah District" },
    "72": { state: "West Bengal", sampleCity: "Medinipur", district: "Paschim Medinipur" },
    "73": { state: "West Bengal", sampleCity: "Siliguri", district: "Darjeeling District" },
    "74": { state: "West Bengal", sampleCity: "Murshidabad", district: "Murshidabad District" },
    "75": { state: "Odisha", sampleCity: "Bhubaneswar", district: "Khurda District" },
    "76": { state: "Odisha", sampleCity: "Berhampur", district: "Ganjam District" },
    "77": { state: "Odisha", sampleCity: "Rourkela", district: "Sundargarh District" },
    "78": { state: "Assam", sampleCity: "Guwahati", district: "Kamrup Metropolitan" },
    "79": { state: "North East Region", sampleCity: "Shillong", district: "East Khasi Hills" },
    "80": { state: "Bihar", sampleCity: "Patna", district: "Patna District" },
    "81": { state: "Bihar", sampleCity: "Bhagalpur", district: "Bhagalpur District" },
    "82": { state: "Jharkhand", sampleCity: "Dhanbad", district: "Dhanbad District" },
    "83": { state: "Jharkhand", sampleCity: "Ranchi", district: "Ranchi District" },
    "84": { state: "Bihar", sampleCity: "Muzaffarpur", district: "Muzaffarpur District" },
    "85": { state: "Bihar", sampleCity: "Purnia", district: "Purnia District" }
  };

  const broadMatch = stateByPrefix2[prefix2];
  const detectedState = broadMatch ? broadMatch.state : "National Postal Circle";
  const detectedCity = broadMatch ? broadMatch.sampleCity : `City Hub ${prefix3}`;
  const detectedDistrict = broadMatch ? broadMatch.district : `${detectedCity} District`;

  return {
    pincode: effectivePin,
    isValidFormat: true,
    city: detectedCity,
    district: detectedDistrict,
    state: detectedState,
    isCovered: true,
    activeCooperative: true,
    servicesAvailable: ALL_SERVICES,
    cooperativeName: `${detectedCity} Primary Labour Cooperative Society (PLCS)`,
    slaMinutes: 18,
    nearestHub: `${detectedCity} Cooperative Seva Kendra`,
    message: `Cooperative Service Available in ${detectedCity}, ${detectedState}! Verified cooperative artisans ready for immediate dispatch.`
  };
}

export interface PanIndiaWorker {
  _id: string;
  name: string;
  gender: "Male" | "Female";
  skills: string[];
  societyName: string;
  district: string;
  pincode: string;
  rating: number;
  reviewCount: number;
  jobsCompletedCount: number;
  baseHourlyRate: number;
  experienceYears: number;
  verificationLevel: number;
  avatarUrl: string;
  isAvailable: boolean;
  emergencyReady: boolean;
  distanceKm: number;
  etaMinutes: number;
}

/**
 * Returns a dynamically adapted pool of verified cooperative workers for ANY Indian pincode/district/city.
 */
export function getPanIndiaWorkers(
  city: string,
  district: string,
  state: string,
  pincode: string,
  filterTrade: string = "ALL"
): PanIndiaWorker[] {
  const cleanCity = city || "Local";
  const cleanDistrict = district || `${cleanCity} District`;
  const cleanPin = pincode || "520001";
  const coopName = `${cleanCity} Labour Cooperative Society`;

  // Diverse, high-grade base worker roster representing India's skilled artisan workforce
  const masterWorkers: PanIndiaWorker[] = [
    {
      _id: `worker-${cleanPin}-1`,
      name: "Raj Kumar",
      gender: "Male",
      skills: ["Electrician", "Technician"],
      societyName: coopName,
      district: cleanDistrict,
      pincode: cleanPin,
      rating: 4.9,
      reviewCount: 94,
      jobsCompletedCount: 268,
      baseHourlyRate: 380,
      experienceYears: 7,
      verificationLevel: 5,
      avatarUrl: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80",
      isAvailable: true,
      emergencyReady: true,
      distanceKm: 1.1,
      etaMinutes: 10
    },
    {
      _id: `worker-${cleanPin}-2`,
      name: "Sarada Devi",
      gender: "Female",
      skills: ["Electrician", "Domestic Helper"],
      societyName: coopName,
      district: cleanDistrict,
      pincode: cleanPin,
      rating: 4.9,
      reviewCount: 82,
      jobsCompletedCount: 215,
      baseHourlyRate: 400,
      experienceYears: 6,
      verificationLevel: 4,
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
      isAvailable: true,
      emergencyReady: false,
      distanceKm: 1.6,
      etaMinutes: 14
    },
    {
      _id: `worker-${cleanPin}-3`,
      name: "Ramesh Babu",
      gender: "Male",
      skills: ["Plumber"],
      societyName: coopName,
      district: cleanDistrict,
      pincode: cleanPin,
      rating: 4.8,
      reviewCount: 124,
      jobsCompletedCount: 340,
      baseHourlyRate: 350,
      experienceYears: 9,
      verificationLevel: 4,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      isAvailable: true,
      emergencyReady: true,
      distanceKm: 1.8,
      etaMinutes: 15
    },
    {
      _id: `worker-${cleanPin}-4`,
      name: "K. Padma",
      gender: "Female",
      skills: ["Cleaner", "Domestic Helper"],
      societyName: coopName,
      district: cleanDistrict,
      pincode: cleanPin,
      rating: 4.9,
      reviewCount: 110,
      jobsCompletedCount: 310,
      baseHourlyRate: 450,
      experienceYears: 7,
      verificationLevel: 5,
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
      isAvailable: true,
      emergencyReady: false,
      distanceKm: 0.8,
      etaMinutes: 8
    },
    {
      _id: `worker-${cleanPin}-5`,
      name: "Ch. Lakshmi Narayana",
      gender: "Male",
      skills: ["Carpenter"],
      societyName: coopName,
      district: cleanDistrict,
      pincode: cleanPin,
      rating: 4.9,
      reviewCount: 156,
      jobsCompletedCount: 440,
      baseHourlyRate: 480,
      experienceYears: 11,
      verificationLevel: 5,
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
      isAvailable: true,
      emergencyReady: false,
      distanceKm: 2.2,
      etaMinutes: 18
    },
    {
      _id: `worker-${cleanPin}-6`,
      name: "M. Anasuya",
      gender: "Female",
      skills: ["Caregiver", "Domestic Helper"],
      societyName: coopName,
      district: cleanDistrict,
      pincode: cleanPin,
      rating: 5.0,
      reviewCount: 78,
      jobsCompletedCount: 195,
      baseHourlyRate: 700,
      experienceYears: 9,
      verificationLevel: 5,
      avatarUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80",
      isAvailable: true,
      emergencyReady: true,
      distanceKm: 1.4,
      etaMinutes: 12
    },
    {
      _id: `worker-${cleanPin}-7`,
      name: "Anjali Sharma",
      gender: "Female",
      skills: ["Painter"],
      societyName: coopName,
      district: cleanDistrict,
      pincode: cleanPin,
      rating: 4.8,
      reviewCount: 88,
      jobsCompletedCount: 230,
      baseHourlyRate: 520,
      experienceYears: 7,
      verificationLevel: 4,
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
      isAvailable: true,
      emergencyReady: false,
      distanceKm: 2.5,
      etaMinutes: 19
    },
    {
      _id: `worker-${cleanPin}-8`,
      name: "Gopal Das",
      gender: "Male",
      skills: ["Gardener", "Cleaner"],
      societyName: coopName,
      district: cleanDistrict,
      pincode: cleanPin,
      rating: 4.7,
      reviewCount: 92,
      jobsCompletedCount: 260,
      baseHourlyRate: 380,
      experienceYears: 6,
      verificationLevel: 4,
      avatarUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&q=80",
      isAvailable: true,
      emergencyReady: false,
      distanceKm: 1.5,
      etaMinutes: 13
    },
    {
      _id: `worker-${cleanPin}-9`,
      name: "Suresh Reddy",
      gender: "Male",
      skills: ["Driver", "Technician"],
      societyName: coopName,
      district: cleanDistrict,
      pincode: cleanPin,
      rating: 4.9,
      reviewCount: 145,
      jobsCompletedCount: 390,
      baseHourlyRate: 400,
      experienceYears: 8,
      verificationLevel: 5,
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
      isAvailable: true,
      emergencyReady: true,
      distanceKm: 1.2,
      etaMinutes: 9
    },
    {
      _id: `worker-${cleanPin}-10`,
      name: "Sunita Rao",
      gender: "Female",
      skills: ["Driver"],
      societyName: coopName,
      district: cleanDistrict,
      pincode: cleanPin,
      rating: 4.9,
      reviewCount: 98,
      jobsCompletedCount: 275,
      baseHourlyRate: 420,
      experienceYears: 7,
      verificationLevel: 4,
      avatarUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&q=80",
      isAvailable: true,
      emergencyReady: false,
      distanceKm: 1.7,
      etaMinutes: 14
    },
    {
      _id: `worker-${cleanPin}-11`,
      name: "Meena Kumari",
      gender: "Female",
      skills: ["Plumber", "Technician"],
      societyName: coopName,
      district: cleanDistrict,
      pincode: cleanPin,
      rating: 4.8,
      reviewCount: 76,
      jobsCompletedCount: 185,
      baseHourlyRate: 360,
      experienceYears: 6,
      verificationLevel: 4,
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
      isAvailable: true,
      emergencyReady: true,
      distanceKm: 2.0,
      etaMinutes: 16
    },
    {
      _id: `worker-${cleanPin}-12`,
      name: "Vikram Singh",
      gender: "Male",
      skills: ["Painter", "Carpenter"],
      societyName: coopName,
      district: cleanDistrict,
      pincode: cleanPin,
      rating: 4.8,
      reviewCount: 112,
      jobsCompletedCount: 310,
      baseHourlyRate: 460,
      experienceYears: 9,
      verificationLevel: 5,
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
      isAvailable: true,
      emergencyReady: false,
      distanceKm: 2.3,
      etaMinutes: 18
    },
    {
      _id: `worker-${cleanPin}-13`,
      name: "Devendra Verma",
      gender: "Male",
      skills: ["Caregiver", "Domestic Helper"],
      societyName: coopName,
      district: cleanDistrict,
      pincode: cleanPin,
      rating: 4.9,
      reviewCount: 84,
      jobsCompletedCount: 220,
      baseHourlyRate: 650,
      experienceYears: 8,
      verificationLevel: 4,
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
      isAvailable: true,
      emergencyReady: true,
      distanceKm: 1.6,
      etaMinutes: 13
    },
    {
      _id: `worker-${cleanPin}-14`,
      name: "Radhika Patel",
      gender: "Female",
      skills: ["Gardener", "Cleaner"],
      societyName: coopName,
      district: cleanDistrict,
      pincode: cleanPin,
      rating: 4.8,
      reviewCount: 65,
      jobsCompletedCount: 170,
      baseHourlyRate: 390,
      experienceYears: 5,
      verificationLevel: 4,
      avatarUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
      isAvailable: true,
      emergencyReady: false,
      distanceKm: 1.9,
      etaMinutes: 15
    }
  ];

  if (filterTrade === "ALL" || !filterTrade) {
    return masterWorkers;
  }

  const filtered = masterWorkers.filter((w) =>
    w.skills.some((s) => s.toLowerCase().includes(filterTrade.toLowerCase()))
  );

  return filtered.length > 0 ? filtered : masterWorkers;
}

/**
 * Converts a lightweight PanIndiaWorker record into a full WorkerProfile object
 * compatible with CustomerPage, CustomerDashboardPage, and ServicesPage.
 */
export function toWorkerProfile(w: PanIndiaWorker): WorkerProfile {
  return {
    _id: w._id,
    id: w._id,
    workerIdNumber: `SS-COOP-${w.pincode}-${w._id.slice(-4)}`,
    name: w.name,
    gender: w.gender,
    phone: "+91 98480 22338",
    email: `${w.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@coopnex.org`,
    avatarUrl: w.avatarUrl,
    societyId: `soc-${w.pincode}`,
    societyName: w.societyName,
    district: w.district,
    location: {
      type: "Point",
      coordinates: [80.6480, 16.5062]
    },
    serviceRadiusKm: 15,
    skills: w.skills,
    experienceYears: w.experienceYears,
    languages: ["Telugu", "Hindi", "English"],
    verificationLevel: w.verificationLevel,
    verificationStatus: "VERIFIED",
    verificationTimeline: [
      { level: 1, title: "Aadhaar & KYC Verified", verified: true },
      { level: 2, title: "Police Clearance Record Verified", verified: true },
      { level: 3, title: "Trade Competency Assessment", verified: true },
      { level: 4, title: "Primary Labour Cooperative Enrollment", verified: true },
      { level: 5, title: "State Federation Star Certification", verified: w.verificationLevel >= 5 }
    ],
    certificates: [
      {
        title: `${w.skills[0]} National Skill Qualification Framework (NSQF Level 5)`,
        issuer: "National Skill Development Corporation (NSDC)",
        issueDate: "2023-04-10",
        expiryDate: "2028-04-10",
        credentialId: `NSDC-IN-${w.pincode}-8821`
      }
    ],
    rating: w.rating,
    reviewCount: w.reviewCount,
    jobsCompletedCount: w.jobsCompletedCount,
    isAvailable: w.isAvailable,
    emergencyReady: w.emergencyReady,
    activeJobsToday: 1,
    baseHourlyRate: w.baseHourlyRate,
    walletBalance: 3200,
    totalEarnings: 45600,
    insuranceInfo: {
      policyNumber: `PRADHAN-MANTRI-JJBY-${w.pincode}-99`,
      provider: "Life Insurance Corporation of India (LIC)",
      planType: "Pradhan Mantri Suraksha Bima Yojana",
      coverageAmount: 200000,
      isActive: true,
      validUntil: "2027-12-31"
    }
  };
}

/**
 * Returns full WorkerProfile[] list for any city, district, state, pincode, and trade filter.
 */
export function getPanIndiaWorkerProfiles(
  city: string,
  district: string,
  state: string,
  pincode: string,
  filterTrade: string = "ALL"
): WorkerProfile[] {
  return getPanIndiaWorkers(city, district, state, pincode, filterTrade).map(toWorkerProfile);
}


