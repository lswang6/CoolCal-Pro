import React from 'react';
import { Language, CalculationResult, Translation } from '../types';

interface ResultsPanelProps {
    lang: Language;
    t: Translation;
    isDarkMode: boolean;
    result: CalculationResult | null;
    isTropical: boolean;
    recordsCount: number;
    onTropicalToggle: (checked: boolean) => void;
    onConfirm: () => void;
}

// AC Unit size recommendations based on capacity
const getACRecommendation = (hp: number, lang: Language): { size: string; units: string; tip: string } => {
    if (hp <= 0.75) {
        return {
            size: '0.75 HP / 9000 BTU',
            units: lang === Language.ZH ? '1台小型分体机' : '1x Small Split Unit',
            tip: lang === Language.ZH ? '适合小卧室' : 'Suitable for small bedroom'
        };
    } else if (hp <= 1) {
        return {
            size: '1 HP / 12000 BTU',
            units: lang === Language.ZH ? '1台标准分体机' : '1x Standard Split Unit',
            tip: lang === Language.ZH ? '适合标准卧室' : 'Suitable for standard bedroom'
        };
    } else if (hp <= 1.5) {
        return {
            size: '1.5 HP / 18000 BTU',
            units: lang === Language.ZH ? '1台中型分体机' : '1x Medium Split Unit',
            tip: lang === Language.ZH ? '适合客厅或大卧室' : 'Suitable for living room or large bedroom'
        };
    } else if (hp <= 2) {
        return {
            size: '2 HP / 24000 BTU',
            units: lang === Language.ZH ? '1台大型分体机' : '1x Large Split Unit',
            tip: lang === Language.ZH ? '适合大客厅' : 'Suitable for large living room'
        };
    } else if (hp <= 3) {
        return {
            size: '3 HP / 36000 BTU',
            units: lang === Language.ZH ? '1台柜机或2台1.5HP分体机' : '1x Floor Unit or 2x 1.5HP Splits',
            tip: lang === Language.ZH ? '适合开放式空间' : 'Suitable for open spaces'
        };
    } else if (hp <= 5) {
        return {
            size: '5 HP / 60000 BTU',
            units: lang === Language.ZH ? '1台大柜机或多联机' : '1x Large Floor Unit or Multi-Split',
            tip: lang === Language.ZH ? '商业级别制冷' : 'Commercial-grade cooling'
        };
    } else {
        const unitCount = Math.ceil(hp / 3);
        return {
            size: `${hp.toFixed(1)} HP / ${Math.round(hp * 12000)} BTU`,
            units: lang === Language.ZH ? `建议 ${unitCount} 台3HP设备` : `Recommend ${unitCount}x 3HP Units`,
            tip: lang === Language.ZH ? '需要专业HVAC设计' : 'Requires professional HVAC design'
        };
    }
};

const ResultsPanel: React.FC<ResultsPanelProps> = ({
    lang,
    t,
    isDarkMode,
    result,
    isTropical,
    recordsCount,
    onTropicalToggle,
    onConfirm
}) => {
    const recommendation = result ? getACRecommendation(result.hp, lang) : null;

    return (
        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-6 rounded-2xl shadow-sm border flex flex-col h-full transition-all duration-300 animate-fadeIn`}>
            <h2 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                <i className="fas fa-chart-line text-blue-500"></i>
                {t.resultsTitle}
            </h2>

            {/* Tropical Toggle */}
            <div className={`mb-6 p-4 ${isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-blue-50/50 border-blue-100'} rounded-xl border flex items-center justify-between transition-all duration-200`}>
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isTropical ? 'bg-orange-100 text-orange-600' : isDarkMode ? 'bg-slate-600 text-slate-400' : 'bg-blue-100 text-blue-600'}`}>
                        <i className={`fas ${isTropical ? 'fa-sun' : 'fa-check'}`}></i>
                    </div>
                    <div>
                        <span className={`block text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{t.tropicalAreaLabel}</span>
                        <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-medium`}>
                            {isTropical
                                ? (lang === Language.ZH ? '已应用 +30% 调整' : 'Applied +30% Adjustment')
                                : (lang === Language.ZH ? '标准计算' : 'Standard Calculation')}
                        </span>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isTropical}
                        onChange={(e) => onTropicalToggle(e.target.checked)}
                        className="sr-only peer"
                    />
                    <div className={`w-11 h-6 ${isDarkMode ? 'bg-slate-600' : 'bg-slate-200'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
                </label>
            </div>

            {result && (
                <>
                    {/* Capacity Results */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {[
                            { label: t.kwLabel, value: result.kw.toFixed(2), color: 'blue' },
                            { label: t.btuLabel, value: Math.round(result.btu).toLocaleString(), color: 'green' },
                            { label: t.hpLabel, value: result.hp.toFixed(2), color: 'purple' }
                        ].map(({ label, value, color }) => (
                            <div
                                key={label}
                                className={`${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-100'} p-4 rounded-xl border flex flex-col items-center text-center transition-all duration-200 hover:scale-105`}
                            >
                                <span className={`text-[10px] font-black uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-400'} mb-1`}>{label}</span>
                                <span className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{value}</span>
                            </div>
                        ))}
                    </div>

                    {/* AC Recommendation */}
                    {recommendation && (
                        <div className={`mb-4 p-4 ${isDarkMode ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-700' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'} rounded-xl border transition-all duration-300 animate-slideIn`}>
                            <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-green-800' : 'bg-green-100'} flex items-center justify-center flex-shrink-0`}>
                                    <i className={`fas fa-fan ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}></i>
                                </div>
                                <div className="flex-1">
                                    <h4 className={`text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'} mb-1`}>
                                        {lang === Language.ZH ? '推荐空调配置' : 'Recommended AC Configuration'}
                                    </h4>
                                    <p className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{recommendation.size}</p>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{recommendation.units}</p>
                                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mt-1`}>
                                        <i className="fas fa-lightbulb mr-1"></i>
                                        {recommendation.tip}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Confirm Button */}
                    <button
                        onClick={onConfirm}
                        disabled={recordsCount >= 20}
                        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed mb-4 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <i className="fas fa-check-circle"></i>
                        {t.confirmBtn} {recordsCount >= 20 && `(${lang === Language.ZH ? '已达上限' : 'Limit'} 20)`}
                    </button>

                    {/* Info Messages */}
                    <div className="mt-auto space-y-2">
                        {result.isTropical && (
                            <div className={`p-3 ${isDarkMode ? 'bg-blue-900/30 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-100 text-blue-800'} rounded-xl text-xs flex items-start gap-2 transition-all duration-300`}>
                                <i className="fas fa-info-circle mt-0.5"></i>
                                <p>
                                    {lang === Language.ZH ? '热带地区调整 (+30%) 已启用。' : 'Tropical area adjustment (+30%) is active.'}
                                </p>
                            </div>
                        )}
                        {result.adjustmentMultiplier > 1 && (
                            <div className={`p-3 ${isDarkMode ? 'bg-orange-900/30 border-orange-700 text-orange-300' : 'bg-orange-50 border-orange-100 text-orange-800'} rounded-xl text-xs flex items-start gap-2 transition-all duration-300`}>
                                <i className="fas fa-exclamation-triangle mt-0.5"></i>
                                <p>
                                    {lang === Language.ZH
                                        ? `已应用 ${Math.round((result.adjustmentMultiplier - 1) * 100)}% 环境因素调整。`
                                        : lang === Language.EN
                                            ? `Applied ${Math.round((result.adjustmentMultiplier - 1) * 100)}% adjustment for environmental factors.`
                                            : `Adapté de ${Math.round((result.adjustmentMultiplier - 1) * 100)}% pour les facteurs environnementaux.`
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ResultsPanel;