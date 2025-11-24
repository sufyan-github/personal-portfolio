import React from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "bn" : "en");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="relative bg-muted hover:bg-primary/20 border border-border hover:border-primary/50 transition-all gap-2"
      aria-label={`Switch to ${language === "en" ? "বাংলা" : "English"}`}
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium">{language === "en" ? "বাংলা" : "EN"}</span>
    </Button>
  );
};
