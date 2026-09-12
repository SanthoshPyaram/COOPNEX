/**
 * Intelligent Auto-Capitalization and Text Formatting Utilities for COOPNEX
 * Enforces Title Case for names and locations while safely preserving numbers and symbols.
 * 
 * STRICT RULE: Never auto-capitalize Email, Password, OTP, Phone, or PIN.
 */

/**
 * Capitalizes a single word properly: First letter uppercase, rest lowercase.
 * Preserves initials with periods like "A." or "P.".
 */
function capitalizeWord(word: string): string {
  if (!word) return "";
  // Check if it's an initial like "A." or "Dr."
  if (/^[A-Za-z]\.$/.test(word)) {
    return word.toUpperCase();
  }
  // If it contains a dot like "A.Kumar"
  if (word.includes(".") && !word.endsWith(".")) {
    return word
      .split(".")
      .map((part) => capitalizeWord(part))
      .join(".");
  }
  // If hyphenated like "Mary-Jane"
  if (word.includes("-")) {
    return word
      .split("-")
      .map((part) => capitalizeWord(part))
      .join("-");
  }
  // If apostrophe like "O'Connor"
  if (word.includes("'")) {
    return word
      .split("'")
      .map((part, idx) => (idx === 0 ? capitalizeWord(part) : capitalizeWord(part)))
      .join("'");
  }

  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Automatically formats names into proper Title Case.
 * Examples:
 *   "rahul" -> "Rahul"
 *   "rahul kumar" -> "Rahul Kumar"
 *   "RAHUL KUMAR" -> "Rahul Kumar"
 *   "rAhUl KuMaR" -> "Rahul Kumar"
 *   "A. kumar" -> "A. Kumar"
 * 
 * Removes numbers and meaningless special characters.
 * Collapses multiple consecutive spaces into a single space.
 * When isTyping = true, preserves a single trailing space so the user can type their next word smoothly.
 */
export function formatName(raw: string, isTyping = false): string {
  if (!raw) return "";

  // Remove numbers and illegal characters (allow letters, spaces, dots, hyphens, single quotes)
  const sanitized = raw.replace(/[^A-Za-z\s.'-]/g, "");

  // Collapse multiple consecutive spaces to a single space
  const collapsed = sanitized.replace(/\s{2,}/g, " ");

  const hasTrailingSpace = isTyping && collapsed.endsWith(" ");
  const trimmed = collapsed.trim();

  if (!trimmed) {
    return hasTrailingSpace ? " " : "";
  }

  const words = trimmed.split(" ");
  const formattedWords = words.map((w) => capitalizeWord(w));
  const result = formattedWords.join(" ");

  return hasTrailingSpace ? `${result} ` : result;
}

/**
 * Automatically formats human-readable location fields (City, District, State, Area).
 * Examples:
 *   "darbhanga" -> "Darbhanga"
 *   "DARbhanga" -> "Darbhanga"
 *   "new delhi" -> "New Delhi"
 */
export function formatLocation(raw: string, isTyping = false): string {
  if (!raw) return "";

  // Disallow numbers in city/district/state names
  const sanitized = raw.replace(/[^A-Za-z\s.'-]/g, "");
  const collapsed = sanitized.replace(/\s{2,}/g, " ");

  const hasTrailingSpace = isTyping && collapsed.endsWith(" ");
  const trimmed = collapsed.trim();

  if (!trimmed) {
    return hasTrailingSpace ? " " : "";
  }

  const words = trimmed.split(" ");
  const formatted = words.map((w) => capitalizeWord(w)).join(" ");

  return hasTrailingSpace ? `${formatted} ` : formatted;
}

/**
 * Automatically formats human-readable address fields:
 * - Trims and normalizes multiple spaces.
 * - Preserves meaningful numbers (house numbers, flat numbers, pincodes, #, -, /).
 * - Capitalizes standard words appropriately where safe.
 * 
 * Example:
 *   "  12 main road, darbhanga  " -> "12 Main Road, Darbhanga"
 */
export function formatAddress(raw: string, isTyping = false): string {
  if (!raw) return "";

  // Normalize repeated spaces
  const collapsed = raw.replace(/\s{2,}/g, " ");
  const hasTrailingSpace = isTyping && collapsed.endsWith(" ");
  const trimmed = collapsed.trim();

  if (!trimmed) {
    return hasTrailingSpace ? " " : "";
  }

  // Split by whitespace and capitalize normal words while keeping numbers, symbols, commas intact
  const tokens = trimmed.split(" ");
  const formattedTokens = tokens.map((token) => {
    // If token is numeric or contains numbers/symbols (e.g. "12/A", "402,", "#5-1", "520001")
    if (/\d/.test(token) || /^[#/\-,.]+$/.test(token)) {
      return token;
    }

    // If token has punctuation at the end (like "road,")
    const match = token.match(/^([A-Za-z.'-]+)([,;:]*)$/);
    if (match) {
      const wordPart = match[1];
      const punctPart = match[2];
      return capitalizeWord(wordPart) + punctPart;
    }

    return capitalizeWord(token);
  });

  const result = formattedTokens.join(" ");
  return hasTrailingSpace ? `${result} ` : result;
}

/**
 * Normalizes email: trims whitespace, lowercases for comparisons/storage.
 * NEVER capitalizes or transforms into title-case.
 */
export function normalizeEmail(email: string): string {
  return (email || "").trim().toLowerCase();
}

