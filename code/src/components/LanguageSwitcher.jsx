import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n, t } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 mr-2">Language:</span>
            <div className="flex space-x-1">
                <button
                    onClick={() => changeLanguage('en')}
                    className={`flex items-center px-3 py-1 rounded-md transition-colors ${i18n.language === 'en'
                        ? 'bg-primary-100 text-primary-800 border border-primary-300'
                        : 'bg-white hover:bg-gray-50 border border-gray-300'
                        }`}
                    title={t('language.english')}
                >
                    {/* <span className="text-lg mr-1">🇺🇸</span> */}
                    <span className="text-sm font-medium">EN</span>
                </button>

                <button
                    onClick={() => changeLanguage('vi')}
                    className={`flex items-center px-3 py-1 rounded-md transition-colors ${i18n.language === 'vi'
                        ? 'bg-primary-100 text-primary-800 border border-primary-300'
                        : 'bg-white hover:bg-gray-50 border border-gray-300'
                        }`}
                    title={t('language.vietnamese')}
                >
                    {/* <span className="text-lg mr-1">🇻🇳</span> */}
                    <span className="text-sm font-medium">VI</span>
                </button>
            </div>
        </div>
    );
};

export default LanguageSwitcher;