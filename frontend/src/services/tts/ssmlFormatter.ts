import { Language } from "../../i18n/languages";

/**
 * Converts numbers into English words (up to crores)
 */
function numberToEnglishWords(num: number): string {
  if (num === 0) return "zero";
  const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
    "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

  const formatBelowThousand = (n: number): string => {
    let str = "";
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + " hundred ";
      n %= 100;
      if (n > 0) str += "and ";
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
    } else if (n > 0) {
      str += ones[n];
    }
    return str.trim();
  };

  let result = "";
  if (num >= 10000000) {
    result += formatBelowThousand(Math.floor(num / 10000000)) + " crore ";
    num %= 10000000;
  }
  if (num >= 100000) {
    result += formatBelowThousand(Math.floor(num / 100000)) + " lakh ";
    num %= 100000;
  }
  if (num >= 1000) {
    result += formatBelowThousand(Math.floor(num / 1000)) + " thousand ";
    num %= 1000;
  }
  if (num > 0) {
    result += formatBelowThousand(num);
  }
  return result.trim();
}

/**
 * Converts numbers into Hindi words
 */
function numberToHindiWords(num: number): string {
  const map: Record<number, string> = {
    0: "शून्य", 1: "एक", 2: "दो", 3: "तीन", 4: "चार", 5: "पांच", 6: "छह", 7: "सात", 8: "आठ", 9: "नौ",
    10: "दस", 20: "बीस", 30: "तीस", 40: "चालीस", 50: "पचास", 60: "साठ", 70: "सत्तर", 80: "अस्सी", 90: "नब्बे",
    100: "सौ", 200: "दो सौ", 300: "तीन सौ", 400: "चार सौ", 500: "पांच सौ", 600: "छह सौ", 700: "सात सौ", 800: "आठ सौ", 900: "नौ सौ",
    1000: "एक हज़ार", 100000: "एक लाख"
  };
  if (map[num]) return map[num];
  if (num < 100) {
    const t = Math.floor(num / 10) * 10;
    const o = num % 10;
    return `${map[t] || ""} ${map[o] || ""}`.trim();
  }
  if (num < 1000) {
    const h = Math.floor(num / 100);
    const rem = num % 100;
    return `${map[h] || h} सौ ${rem > 0 ? numberToHindiWords(rem) : ""}`.trim();
  }
  if (num < 100000) {
    const th = Math.floor(num / 1000);
    const rem = num % 1000;
    return `${numberToHindiWords(th)} हज़ार ${rem > 0 ? numberToHindiWords(rem) : ""}`.trim();
  }
  return num.toString();
}

/**
 * Converts numbers into Telugu words
 */
function numberToTeluguWords(num: number): string {
  const map: Record<number, string> = {
    0: "సున్నా", 1: "ఒకటి", 2: "రెండు", 3: "మూడు", 4: "నాలుగు", 5: "ఐదు", 6: "ఆరు", 7: "ఏడు", 8: "ఎనిమిది", 9: "తొమ్మిది",
    10: "పది", 20: "ఇరవై", 30: "ముప్పై", 40: "నలభై", 50: "యాభై", 60: "అరవై", 70: "డెబ్బై", 80: "ఎనభై", 90: "తొంభై",
    100: "వంద", 200: "రెండు వందలు", 300: "మూడు వందలు", 400: "నాలుగు వందలు", 500: "ఐదు వందలు", 600: "ఆరు వందలు", 700: "ఏడు వందలు", 800: "ఎనిమిది వందలు", 900: "తొమ్మిది వందలు",
    1000: "వెయ్యి", 100000: "ఒక లక్ష"
  };
  if (map[num]) return map[num];
  if (num < 100) {
    const t = Math.floor(num / 10) * 10;
    const o = num % 10;
    return `${map[t] || ""} ${map[o] || ""}`.trim();
  }
  if (num < 1000) {
    const h = Math.floor(num / 100);
    const rem = num % 100;
    const hWord = h === 1 ? "వంద" : `${map[h]} వందల`;
    return `${hWord} ${rem > 0 ? numberToTeluguWords(rem) : ""}`.trim();
  }
  if (num < 100000) {
    const th = Math.floor(num / 1000);
    const rem = num % 1000;
    const thWord = th === 1 ? "వెయ్యి" : `${numberToTeluguWords(th)} వేల`;
    return `${thWord} ${rem > 0 ? numberToTeluguWords(rem) : ""}`.trim();
  }
  return num.toString();
}

/**
 * Replaces Indian Rupee currency notations (₹450, Rs. 1200) with language-natural spoken text
 */
export function formatCurrencyForSpeech(text: string, lang: Language): string {
  const currencyRegex = /(?:₹|Rs\.?\s*|INR\s*)([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?)/gi;

  return text.replace(currencyRegex, (_match, rawAmount) => {
    const cleanNum = parseFloat(rawAmount.replace(/,/g, ""));
    if (isNaN(cleanNum)) return rawAmount;

    switch (lang) {
      case "hi":
        return `${numberToHindiWords(Math.round(cleanNum))} रुपये`;
      case "te":
        return `${numberToTeluguWords(Math.round(cleanNum))} రూపాయలు`;
      case "ta":
        return `${cleanNum} ரூபாய்`;
      case "kn":
        return `${cleanNum} ರೂಪಾಯಿಗಳು`;
      case "bn":
        return `${cleanNum} টাকা`;
      case "mr":
        return `${cleanNum} रुपये`;
      default:
        return `${numberToEnglishWords(Math.round(cleanNum))} rupees`;
    }
  });
}

/**
 * Formats 6-digit Pincodes (e.g. 500001, 520001) so they are spoken digit-by-digit
 */
export function formatPincodeForSpeech(text: string, lang: Language): string {
  // Matches standalone 6 digit numbers (often preceded by PIN or postal code)
  const pinRegex = /\b([1-9][0-9]{5})\b/g;

  return text.replace(pinRegex, (_match, digits: string) => {
    if (lang === "te") {
      const teDigits: Record<string, string> = {
        "0": "సున్నా", "1": "ఒకటి", "2": "రెండు", "3": "మూడు", "4": "నాలుగు",
        "5": "ఐదు", "6": "ఆరు", "7": "ఏడు", "8": "ఎనిమిది", "9": "తొమ్మిది"
      };
      return digits.split("").map((d) => teDigits[d] || d).join(" ");
    }
    if (lang === "hi") {
      const hiDigits: Record<string, string> = {
        "0": "शून्य", "1": "एक", "2": "दो", "3": "तीन", "4": "चार",
        "5": "पांच", "6": "छह", "7": "सात", "8": "आठ", "9": "नौ"
      };
      return digits.split("").map((d) => hiDigits[d] || d).join(" ");
    }
    // Default English digit-by-digit
    return digits.split("").join(" ");
  });
}

/**
 * Formats 10-digit phone numbers and toll-free helpline numbers
 */
export function formatPhoneNumberForSpeech(text: string): string {
  // Format standard 10 digit Indian phone numbers: 9876543210 -> "9 8 7 6 5, 4 3 2 1 0"
  return text.replace(/\b([6-9]\d{4})(\d{5})\b/g, (_m, p1, p2) => {
    return `${p1.split("").join(" ")}, ${p2.split("").join(" ")}`;
  });
}

/**
 * Protects technical IDs (BK-8921, WKR-4029) from unnatural speech concatenation
 */
export function formatTechnicalIdsForSpeech(text: string): string {
  return text.replace(/\b([A-Z]{2,4})-([0-9]{3,6})\b/g, (_m, prefix, num) => {
    return `${prefix.split("").join(" ")} dash ${num.split("").join(" ")}`;
  });
}

/**
 * Full pre-processing pipeline for text before speech synthesis
 */
export function prepareTextForSpeech(rawText: string, lang: Language): string {
  let processed = rawText;
  processed = formatCurrencyForSpeech(processed, lang);
  processed = formatPincodeForSpeech(processed, lang);
  processed = formatPhoneNumberForSpeech(processed);
  processed = formatTechnicalIdsForSpeech(processed);

  // Common distance and time expansions
  processed = processed.replace(/\b([0-9]+)\s*km\b/gi, "$1 kilometers");
  processed = processed.replace(/\b([0-9]+)\s*mins?\b/gi, "$1 minutes");
  processed = processed.replace(/\b([0-9.]+)\s*\/\s*5\s*(?:stars?|rating)?\b/gi, "$1 out of 5 stars");

  return processed.trim();
}

/**
 * Wraps clean text into valid SSML with natural breathing pauses between sentences
 */
export function buildSsml(text: string, _lang: Language): string {
  // Split on sentence boundaries and insert a subtle 320ms natural cadence break
  const sentences = text
    .split(/(?<=[.?!।])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const inner = sentences.join(' <break time="320ms"/> ');
  return `<speak>${inner}</speak>`;
}

