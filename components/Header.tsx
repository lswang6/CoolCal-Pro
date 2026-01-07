import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';

interface HeaderProps {
    lang: Language;
    isDarkMode: boolean;
    onLanguageChange: (lang: Language) => void;
    onDarkModeToggle: () => void;
}

const LANGUAGE_OPTIONS = [
    { code: Language.EN, label: 'English', flag: '🇬🇧' },
    { code: Language.FR, label: 'Français', flag: '🇫🇷' },
    { code: Language.ZH, label: '中文', flag: '🇨🇳' },
    { code: Language.AR, label: 'العربية', flag: '🇸🇦' }
];

const Header: React.FC<HeaderProps> = ({ lang, isDarkMode, onLanguageChange, onDarkModeToggle }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentLanguage = LANGUAGE_OPTIONS.find(opt => opt.code === lang) || LANGUAGE_OPTIONS[0];

    const getSubtitle = () => {
        switch (lang) {
            case Language.ZH: return 'ASHRAE 标准冷负荷计算器';
            case Language.FR: return 'Estimateur de Capacité de Refroidissement';
            case Language.AR: return 'حاسبة سعة التبريد وفق معايير ASHRAE';
            default: return 'ASHRAE Standard Cooling Capacity Estimator';
        }
    };

    const handleLanguageSelect = (selectedLang: Language) => {
        onLanguageChange(selectedLang);
        setIsDropdownOpen(false);
    };

    // RTL support for Arabic
    const isRTL = lang === Language.AR;

    return (
        <header
            className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b sticky top-0 z-50 transition-colors duration-300`}
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo and Title */}
                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-12 h-12 rounded-xl ${isDarkMode ? 'bg-blue-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'} flex items-center justify-center shadow-lg shadow-blue-500/20`}>
                            <i className="fas fa-snowflake text-white text-xl animate-pulse"></i>
                        </div>
                        <div className={isRTL ? 'text-right' : ''}>
                            <h1 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'} tracking-tight`}>
                                CoolCalc Pro
                            </h1>
                            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-medium`}>
                                {getSubtitle()}
                            </p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={onDarkModeToggle}
                            className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'} transition-all duration-300`}
                            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
                        >
                            <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-lg`}></i>
                        </button>

                        {/* Language Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'} transition-all duration-300 text-sm font-bold`}
                            >
                                <span className="text-lg">{currentLanguage.flag}</span>
                                <span className="hidden sm:inline">{currentLanguage.label}</span>
                                <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div
                                    className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-48 rounded-xl ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'} border shadow-xl overflow-hidden z-50 animate-fadeIn`}
                                >
                                    {LANGUAGE_OPTIONS.map((option) => (
                                        <button
                                            key={option.code}
                                            onClick={() => handleLanguageSelect(option.code)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${lang === option.code
                                                    ? isDarkMode
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-blue-50 text-blue-600'
                                                    : isDarkMode
                                                        ? 'text-slate-300 hover:bg-slate-600'
                                                        : 'text-slate-700 hover:bg-slate-50'
                                                } ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                                        >
                                            <span className="text-lg">{option.flag}</span>
                                            <span>{option.label}</span>
                                            {lang === option.code && (
                                                <i className={`fas fa-check text-xs ${isRTL ? 'mr-auto' : 'ml-auto'}`}></i>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;