import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "../lib/i18n";
import { getLanguageDisplayName, getLanguageFlag } from "../lib/geolocation";

export function LanguageSwitcher() {
  const { language, changeLanguage } = useTranslation();

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "sq", name: "Shqip", flag: "🇦🇱" },
    { code: "hr", name: "Hrvatski", flag: "🇭🇷" },
    { code: "sr", name: "Srpski", flag: "🇷🇸" },
  ] as const;

  return (
    <Select value={language} onValueChange={changeLanguage}>
      <SelectTrigger className="w-[140px] bg-light-gray border-gray-300">
        <SelectValue>
          <div className="flex items-center gap-2">
            <span>{getLanguageFlag(language)}</span>
            <span className="text-sm">{getLanguageDisplayName(language)}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <div className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
