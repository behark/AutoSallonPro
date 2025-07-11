import { Language } from "./i18n";

interface GeolocationLanguageMap {
  [countryCode: string]: Language;
}

const countryLanguageMap: GeolocationLanguageMap = {
  "XK": "sq", // Kosovo - Albanian
  "AL": "sq", // Albania - Albanian
  "HR": "hr", // Croatia - Croatian
  "RS": "sr", // Serbia - Serbian
  "BA": "sr", // Bosnia and Herzegovina - Serbian (could also be Croatian)
  "ME": "sr", // Montenegro - Serbian
  "MK": "sq", // North Macedonia - Albanian (significant population)
  "GB": "en", // United Kingdom - English
  "US": "en", // United States - English
  "CA": "en", // Canada - English
  "AU": "en", // Australia - English
  "IE": "en", // Ireland - English
  "NZ": "en", // New Zealand - English
};

export async function detectLanguageFromLocation(): Promise<Language> {
  try {
    // First, try to get user's location
    const position = await getCurrentPosition();
    const countryCode = await getCountryFromCoordinates(
      position.coords.latitude,
      position.coords.longitude
    );
    
    return countryLanguageMap[countryCode] || "en";
  } catch (error) {
    console.warn("Geolocation detection failed, trying IP-based detection:", error);
    
    try {
      // Fallback to IP-based detection
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      return countryLanguageMap[data.country_code] || "en";
    } catch (ipError) {
      console.warn("IP-based detection failed:", ipError);
      return "en"; // Default to English
    }
  }
}

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      resolve,
      reject,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000, // 10 minutes
      }
    );
  });
}

async function getCountryFromCoordinates(lat: number, lon: number): Promise<string> {
  try {
    // Using a reverse geocoding service
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    const data = await response.json();
    return data.countryCode || "GB";
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return "GB"; // Default to UK
  }
}

export function getLanguageDisplayName(lang: Language): string {
  const names: Record<Language, string> = {
    en: "English",
    sq: "Shqip",
    hr: "Hrvatski",
    sr: "Srpski",
  };
  return names[lang];
}

export function getLanguageFlag(lang: Language): string {
  const flags: Record<Language, string> = {
    en: "🇬🇧",
    sq: "🇦🇱",
    hr: "🇭🇷",
    sr: "🇷🇸",
  };
  return flags[lang];
}
