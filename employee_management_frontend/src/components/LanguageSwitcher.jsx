import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setSelectedLanguage(lang);
    setIsDropdownOpen(false); 
  };

  return (
    <div className="dropdown">
      <button 
        className="langbtn" 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {selectedLanguage === 'fr' ? 'FR' : selectedLanguage === 'ar' ? 'AR' : 'EN'}
      </button>
      
      {isDropdownOpen && (
        <div className="dropdown-content">
          <button className="langbtn" onClick={() => changeLanguage('en')}>{t("english")}</button> 
          <button className="langbtn" onClick={() => changeLanguage('fr')}>{t("french")}</button> 
          <button className="langbtn" onClick={() => changeLanguage('ar')}>{t("arabic")}</button> 
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
