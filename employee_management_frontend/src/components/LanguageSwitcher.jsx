import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setSelectedLanguage(lang);
    setIsDropdownOpen(false); 
  };

  const getLanguageCode = (lang) => {
    if (lang === 'fr') return 'FR';
    if (lang === 'ar') return 'AR';
    return 'EN'; 
  };

  return (
    <div className="dropdown">
      <button 
        className="langbtn" 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {getLanguageCode(selectedLanguage)}
      </button>
      
      {isDropdownOpen && (
        <div className="dropdown-content">
          <button className="langbtn" onClick={() => changeLanguage('fr')}>FR</button>
          <button className="langbtn" onClick={() => changeLanguage('en')}>EN</button>
          <button className="langbtn" onClick={() => changeLanguage('ar')}>AR</button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
