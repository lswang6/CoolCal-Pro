import React from 'react';
import { Language, RoomType, Translation } from '../types';
import { ASHRAE_FACTORS } from '../constants';

interface ReferenceDataProps {
    lang: Language;
    t: Translation;
    isDarkMode: boolean;
}

const ReferenceData: React.FC<ReferenceDataProps> = ({ lang, t, isDarkMode }) => {
    return (
        <div className={`${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-800'} p-6 rounded-2xl shadow-xl text-white transition-all duration-300 animate-fadeIn`}>
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2 opacity-80">
                <i className="fas fa-book-open"></i>
                {lang === Language.ZH ? 'ASHRAE 参考数据' : lang === Language.EN ? 'ASHRAE Reference Data' : 'Données de Référence ASHRAE'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {(Object.keys(ASHRAE_FACTORS) as RoomType[]).map((type) => (
                    <div
                        key={type}
                        className="bg-white/10 p-3 rounded-lg flex flex-col items-center text-center hover:bg-white/20 transition-all duration-200 cursor-default"
                    >
                        <span className="text-[10px] font-medium opacity-60 mb-1 truncate w-full">
                            {t.roomTypes[type].split(' / ')[0]}
                        </span>
                        <span className="text-xs font-black">{ASHRAE_FACTORS[type]} W/m²</span>
                    </div>
                ))}
            </div>
            <p className="mt-4 text-[10px] text-white/40 italic text-center">
                <i className="fas fa-info-circle mr-1"></i>
                {t.disclaimer}
            </p>
        </div>
    );
};

export default ReferenceData;