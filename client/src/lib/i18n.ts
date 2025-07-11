import { useState, useEffect } from "react";

export type Language = "en" | "sq" | "hr" | "sr";

export interface Translation {
  [key: string]: string | Translation;
}

export interface Translations {
  [key: string]: Translation;
}

let currentLanguage: Language = "en";
let translations: Translations = {};

export function getCurrentLanguage(): Language {
  return currentLanguage;
}

export function setLanguage(lang: Language) {
  currentLanguage = lang;
  localStorage.setItem("language", lang);
}

export function getTranslation(key: string, lang?: Language): string {
  const targetLang = lang || currentLanguage;
  const keys = key.split(".");
  let result: any = translations[targetLang];
  
  for (const k of keys) {
    if (result && typeof result === "object") {
      result = result[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  return typeof result === "string" ? result : key;
}

export function t(key: string, lang?: Language): string {
  return getTranslation(key, lang);
}

export function setTranslations(newTranslations: Translations) {
  translations = newTranslations;
}

export function useTranslation() {
  const [language, setCurrentLanguage] = useState<Language>(currentLanguage);
  
  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && ["en", "sq", "hr", "sr"].includes(savedLang)) {
      setCurrentLanguage(savedLang);
      currentLanguage = savedLang;
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    setLanguage(lang);
  };

  return {
    language,
    t: (key: string) => getTranslation(key, language),
    changeLanguage,
  };
}
