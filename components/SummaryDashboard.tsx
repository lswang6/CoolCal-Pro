import React from 'react';
import { Language, RoomRecord } from '../types';

interface SummaryDashboardProps {
    lang: Language;
    isDarkMode: boolean;
    records: RoomRecord[];
}

const SummaryDashboard: React.FC<SummaryDashboardProps> = ({ lang, isDarkMode, records }) => {
    if (records.length === 0) return null;

    const totalKw = records.reduce((acc, r) => acc + r.kw, 0);
    const totalBtu = records.reduce((acc, r) => acc + r.btu, 0);
    const totalHp = records.reduce((acc, r) => acc + r.hp, 0);
    const totalArea = records.reduce((acc, r) => acc + r.area, 0);

    // Estimated monthly electricity cost (rough estimate: 8 hours/day, $0.12/kWh)
    const estimatedMonthlyCost = totalKw * 8 * 30 * 0.12;

    // Efficiency rating
    const wattsPerSqm = (totalKw * 1000) / totalArea;
    const efficiencyRating = wattsPerSqm < 120 ? 'A' : wattsPerSqm < 150 ? 'B' : wattsPerSqm < 180 ? 'C' : 'D';

    return (
        <div className={`${isDarkMode ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-700' : 'bg-gradient-to-r from-blue-500 to-purple-600'} p-6 rounded-2xl shadow-xl text-white transition-all duration-300 animate-fadeIn`}>
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2 opacity-90">
                <i className="fas fa-chart-pie"></i>
                {lang === Language.ZH ? '总容量汇总' : lang === Language.FR ? 'Résumé de la Capacité Totale' : 'Total Capacity Summary'}
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {/* Total Rooms */}
                <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/20'} p-4 rounded-xl backdrop-blur-sm`}>
                    <div className="flex items-center gap-2 mb-2">
                        <i className="fas fa-door-open text-lg opacity-80"></i>
                        <span className="text-xs font-medium opacity-80">
                            {lang === Language.ZH ? '房间数' : 'Rooms'}
                        </span>
                    </div>
                    <span className="text-2xl font-black">{records.length}</span>
                </div>

                {/* Total Area */}
                <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/20'} p-4 rounded-xl backdrop-blur-sm`}>
                    <div className="flex items-center gap-2 mb-2">
                        <i className="fas fa-expand text-lg opacity-80"></i>
                        <span className="text-xs font-medium opacity-80">
                            {lang === Language.ZH ? '总面积' : 'Total Area'}
                        </span>
                    </div>
                    <span className="text-2xl font-black">{totalArea.toFixed(0)}</span>
                    <span className="text-sm ml-1 opacity-70">m²</span>
                </div>

                {/* Total kW */}
                <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/20'} p-4 rounded-xl backdrop-blur-sm`}>
                    <div className="flex items-center gap-2 mb-2">
                        <i className="fas fa-bolt text-lg opacity-80"></i>
                        <span className="text-xs font-medium opacity-80">
                            {lang === Language.ZH ? '总功率' : 'Total Power'}
                        </span>
                    </div>
                    <span className="text-2xl font-black">{totalKw.toFixed(2)}</span>
                    <span className="text-sm ml-1 opacity-70">kW</span>
                </div>

                {/* Total BTU */}
                <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/20'} p-4 rounded-xl backdrop-blur-sm`}>
                    <div className="flex items-center gap-2 mb-2">
                        <i className="fas fa-fire text-lg opacity-80"></i>
                        <span className="text-xs font-medium opacity-80">
                            {lang === Language.ZH ? '总BTU' : 'Total BTU'}
                        </span>
                    </div>
                    <span className="text-2xl font-black">{(totalBtu / 1000).toFixed(0)}k</span>
                </div>

                {/* Efficiency Rating */}
                <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/20'} p-4 rounded-xl backdrop-blur-sm`}>
                    <div className="flex items-center gap-2 mb-2">
                        <i className="fas fa-leaf text-lg opacity-80"></i>
                        <span className="text-xs font-medium opacity-80">
                            {lang === Language.ZH ? '效率等级' : 'Efficiency'}
                        </span>
                    </div>
                    <span className={`text-2xl font-black ${efficiencyRating === 'A' ? 'text-green-300' : efficiencyRating === 'B' ? 'text-yellow-300' : 'text-orange-300'}`}>
                        {efficiencyRating}
                    </span>
                    <span className="text-xs ml-2 opacity-60">{wattsPerSqm.toFixed(0)} W/m²</span>
                </div>

                {/* Estimated Cost */}
                <div className={`${isDarkMode ? 'bg-white/10' : 'bg-white/20'} p-4 rounded-xl backdrop-blur-sm`}>
                    <div className="flex items-center gap-2 mb-2">
                        <i className="fas fa-dollar-sign text-lg opacity-80"></i>
                        <span className="text-xs font-medium opacity-80">
                            {lang === Language.ZH ? '预估月费' : 'Est. Monthly'}
                        </span>
                    </div>
                    <span className="text-2xl font-black">${estimatedMonthlyCost.toFixed(0)}</span>
                    <span className="text-[10px] ml-1 opacity-50">*</span>
                </div>
            </div>

            <p className="mt-4 text-[10px] text-white/40 italic text-center">
                <i className="fas fa-info-circle mr-1"></i>
                {lang === Language.ZH
                    ? '* 预估基于每天8小时使用，电价$0.12/kWh。实际费用因地区和使用习惯而异。'
                    : '* Estimate based on 8 hours/day usage at $0.12/kWh. Actual costs vary by region and usage patterns.'}
            </p>
        </div>
    );
};

export default SummaryDashboard;