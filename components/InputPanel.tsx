import React from 'react';
import { Language, RoomType, EnvironmentalFactors, Translation } from '../types';
import { ASHRAE_FACTORS } from '../constants';

interface InputPanelProps {
    lang: Language;
    t: Translation;
    isDarkMode: boolean;
    area: number;
    roomType: RoomType;
    factors: EnvironmentalFactors;
    onAreaChange: (val: string) => void;
    onRoomTypeChange: (type: RoomType) => void;
    onFactorToggle: (key: keyof EnvironmentalFactors) => void;
}

const InputPanel: React.FC<InputPanelProps> = ({
    lang,
    t,
    isDarkMode,
    area,
    roomType,
    factors,
    onAreaChange,
    onRoomTypeChange,
    onFactorToggle
}) => {
    const getRoomIcon = (type: RoomType) => {
        switch (type) {
            case RoomType.BEDROOM: return 'fa-bed';
            case RoomType.LIVING_ROOM: return 'fa-couch';
            case RoomType.KITCHEN: return 'fa-utensils';
            case RoomType.OFFICE: return 'fa-briefcase';
            case RoomType.SERVER_ROOM: return 'fa-server';
            case RoomType.GYM: return 'fa-dumbbell';
        }
    };

    const isRTL = lang === Language.AR;

    const getConfigTitle = () => {
        switch (lang) {
            case Language.ZH: return '配置';
            case Language.AR: return 'الإعدادات';
            case Language.FR: return 'Configuration';
            default: return 'Configuration';
        }
    };

    return (
        <div
            className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-6 rounded-2xl shadow-sm border transition-all duration-300 animate-fadeIn`}
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    <i className="fas fa-sliders-h text-blue-500"></i>
                    {getConfigTitle()}
                </h2>
            </div>

            <div className="space-y-8">
                {/* Area Input */}
                <div>
                    <label className={`block text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                        {t.areaLabel}
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative w-full sm:w-[160px]">
                            <input
                                type="number"
                                value={area}
                                step="0.1"
                                onChange={(e) => onAreaChange(e.target.value)}
                                className={`w-full pl-4 pr-12 py-3 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'} border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-bold text-lg`}
                            />
                            <span className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-400' : 'text-slate-400'} font-bold select-none pointer-events-none`}>m²</span>
                        </div>
                        <div className={`flex-1 w-full flex items-center gap-4 ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-100'} p-4 rounded-xl border`}>
                            <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} w-8`}>2m²</span>
                            <input
                                type="range"
                                min="2"
                                max="1000"
                                step="0.1"
                                value={area}
                                onChange={(e) => onAreaChange(e.target.value)}
                                className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} w-12 text-right`}>1000m²</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Room Type Selection */}
                    <div>
                        <label className={`block text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                            {t.roomTypeLabel}
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {(Object.keys(ASHRAE_FACTORS) as RoomType[]).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => onRoomTypeChange(type)}
                                    className={`px-3 py-3 rounded-xl text-xs font-bold border transition-all duration-200 flex flex-col items-center gap-2 transform hover:scale-105 ${roomType === type
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                                        : isDarkMode
                                            ? 'bg-slate-700 border-slate-600 text-slate-300 hover:border-blue-400'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                                        }`}
                                >
                                    <i className={`fas ${getRoomIcon(type)}`}></i>
                                    {t.roomTypes[type]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Environmental Factors */}
                    <div>
                        <label className={`block text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-3`}>
                            {t.factorsTitle}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {[
                                { key: 'highSunExposure' as const, label: t.factors.highSun, icon: 'fa-sun' },
                                { key: 'poorInsulation' as const, label: t.factors.poorInsulation, icon: 'fa-house-crack' },
                                { key: 'extraOccupants' as const, label: t.factors.extraOccupants, icon: 'fa-users' },
                                { key: 'highElectronicLoad' as const, label: t.factors.electronics, icon: 'fa-plug' }
                            ].map(({ key, label, icon }) => (
                                <label
                                    key={key}
                                    className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all duration-200 group ${factors[key]
                                        ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700'
                                        : isDarkMode
                                            ? 'border-slate-700 hover:bg-slate-700'
                                            : 'border-slate-100 hover:bg-slate-50'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={factors[key]}
                                        onChange={() => onFactorToggle(key)}
                                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <i className={`fas ${icon} ml-3 mr-2 text-xs ${factors[key] ? 'text-blue-500' : isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}></i>
                                    <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                        {label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InputPanel;