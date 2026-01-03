
import React, { useState, useEffect, useCallback } from 'react';
import { Language, RoomType, CalculationResult, EnvironmentalFactors } from './types';
import { TRANSLATIONS, ASHRAE_FACTORS, CONVERSION_BTU_PER_WATT, BTU_PER_HP, ADJUSTMENT_PERCENTAGES } from './constants';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.EN);
  const [area, setArea] = useState<number>(20);
  const [roomType, setRoomType] = useState<RoomType>(RoomType.BEDROOM);
  const [factors, setFactors] = useState<EnvironmentalFactors>({
    highSunExposure: false,
    poorInsulation: false,
    extraOccupants: false,
    highElectronicLoad: false
  });
  const [result, setResult] = useState<CalculationResult | null>(null);

  const t = TRANSLATIONS[lang];

  const calculate = useCallback(() => {
    const baseLoad = ASHRAE_FACTORS[roomType];

    // Calculate total multiplier from checkboxes
    let totalMultiplier = 1;
    if (factors.highSunExposure) totalMultiplier += ADJUSTMENT_PERCENTAGES.highSunExposure;
    if (factors.poorInsulation) totalMultiplier += ADJUSTMENT_PERCENTAGES.poorInsulation;
    if (factors.extraOccupants) totalMultiplier += ADJUSTMENT_PERCENTAGES.extraOccupants;
    if (factors.highElectronicLoad) totalMultiplier += ADJUSTMENT_PERCENTAGES.highElectronicLoad;

    const adjustedWattsPerM2 = baseLoad * totalMultiplier;
    const watts = area * adjustedWattsPerM2;
    const kw = watts / 1000;
    const btu = watts * CONVERSION_BTU_PER_WATT;
    const hp = btu / BTU_PER_HP;

    setResult({
      watts,
      kw,
      btu,
      hp,
      area,
      roomType,
      baseLoad,
      adjustmentMultiplier: totalMultiplier
    });
  }, [area, roomType, factors]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  const toggleFactor = (key: keyof EnvironmentalFactors) => {
    setFactors(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAreaChange = (val: string) => {
    const num = parseFloat(val) || 0;
    // Limit to 1 decimal place
    setArea(Number(num.toFixed(1)));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">


      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Input Section */}
          <div className="lg:col-span-12 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <i className="fas fa-sliders-h text-blue-500"></i>
                  {lang === Language.EN ? 'Configuration' : 'Configuration'}
                </h2>
                <button
                  onClick={() => setLang(lang === Language.EN ? Language.FR : Language.EN)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-bold text-slate-600 shadow-sm"
                >
                  <i className="fas fa-globe text-blue-500"></i>
                  {lang === Language.EN ? 'FR' : 'EN'}
                </button>
              </div>

              <div className="space-y-8">
                {/* Area Input Group with Slider */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t.areaLabel}
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Number Input Box - Small Width */}
                    <div className="relative w-full sm:w-[160px]">
                      <input
                        type="number"
                        value={area}
                        step="0.1"
                        onChange={(e) => handleAreaChange(e.target.value)}
                        className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-bold text-lg"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold select-none pointer-events-none">m²</span>
                    </div>

                    {/* Quick Input Slider */}
                    <div className="flex-1 w-full flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 w-8">2m²</span>
                      <input
                        type="range"
                        min="2"
                        max="1000"
                        step="0.1"
                        value={area}
                        onChange={(e) => handleAreaChange(e.target.value)}
                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <span className="text-[10px] font-bold text-slate-400 w-12 text-right">1000m²</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Room Type */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      {t.roomTypeLabel}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {(Object.keys(ASHRAE_FACTORS) as RoomType[]).map((type) => (
                        <button
                          key={type}
                          onClick={() => setRoomType(type)}
                          className={`px-3 py-3 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-2 ${roomType === type
                              ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                            }`}
                        >
                          <i className={`fas ${type === RoomType.BEDROOM ? 'fa-bed' :
                              type === RoomType.LIVING_ROOM ? 'fa-couch' :
                                type === RoomType.KITCHEN ? 'fa-utensils' :
                                  type === RoomType.OFFICE ? 'fa-briefcase' :
                                    type === RoomType.SERVER_ROOM ? 'fa-server' : 'fa-dumbbell'
                            }`}></i>
                          {t.roomTypes[type]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Environmental Checkboxes */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      {t.factorsTitle}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <label className="flex items-center p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors group">
                        <input
                          type="checkbox"
                          checked={factors.highSunExposure}
                          onChange={() => toggleFactor('highSunExposure')}
                          className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-slate-600 font-medium group-hover:text-slate-900">{t.factors.highSun}</span>
                      </label>
                      <label className="flex items-center p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors group">
                        <input
                          type="checkbox"
                          checked={factors.poorInsulation}
                          onChange={() => toggleFactor('poorInsulation')}
                          className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-slate-600 font-medium group-hover:text-slate-900">{t.factors.poorInsulation}</span>
                      </label>
                      <label className="flex items-center p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors group">
                        <input
                          type="checkbox"
                          checked={factors.extraOccupants}
                          onChange={() => toggleFactor('extraOccupants')}
                          className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-slate-600 font-medium group-hover:text-slate-900">{t.factors.extraOccupants}</span>
                      </label>
                      <label className="flex items-center p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors group">
                        <input
                          type="checkbox"
                          checked={factors.highElectronicLoad}
                          onChange={() => toggleFactor('highElectronicLoad')}
                          className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-slate-600 font-medium group-hover:text-slate-900">{t.factors.electronics}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              {result && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
                  <h2 className="text-lg font-bold mb-8 flex items-center gap-2">
                    <i className="fas fa-chart-line text-blue-500"></i>
                    {t.resultsTitle}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* kW Card */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{t.kwLabel}</span>
                      <span className="text-3xl font-black text-slate-800">{result.kw.toFixed(2)}</span>
                      <div className="mt-3 w-8 h-1 bg-blue-500 rounded-full"></div>
                    </div>

                    {/* BTU Card */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{t.btuLabel}</span>
                      <span className="text-3xl font-black text-slate-800">{Math.round(result.btu).toLocaleString()}</span>
                      <div className="mt-3 w-8 h-1 bg-emerald-500 rounded-full"></div>
                    </div>

                    {/* HP Card */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{t.hpLabel}</span>
                      <span className="text-3xl font-black text-slate-800">{result.hp.toFixed(2)}</span>
                      <div className="mt-3 w-8 h-1 bg-orange-500 rounded-full"></div>
                    </div>
                  </div>

                  {result.adjustmentMultiplier > 1 && (
                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-orange-800 text-sm flex items-start gap-3">
                      <i className="fas fa-exclamation-triangle mt-0.5"></i>
                      <div>
                        <p className="font-bold">{lang === Language.EN ? 'Capacity Adjustment Applied' : 'Ajustement de Capacité Appliqué'}</p>
                        <p className="opacity-80">
                          {lang === Language.EN
                            ? `We've increased the base requirement by ${Math.round((result.adjustmentMultiplier - 1) * 100)}% to account for your selected environmental factors.`
                            : `Nous avons augmenté le besoin de base de ${Math.round((result.adjustmentMultiplier - 1) * 100)}% pour tenir compte des facteurs environnementaux sélectionnés.`
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="lg:col-span-4 space-y-6">
              {/* Reference Table */}
              <div className="bg-slate-800 p-6 rounded-2xl shadow-xl text-white h-full">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2 opacity-80">
                  <i className="fas fa-book-open"></i>
                  {lang === Language.EN ? 'ASHRAE Reference Data' : 'Données de Référence ASHRAE'}
                </h3>
                <div className="space-y-3">
                  {(Object.keys(ASHRAE_FACTORS) as RoomType[]).map((type) => (
                    <div key={type} className="bg-white/10 p-3 rounded-lg flex justify-between items-center">
                      <span className="text-xs font-medium opacity-80">{t.roomTypes[type]}</span>
                      <span className="text-sm font-black">{ASHRAE_FACTORS[type]} W/m²</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-[10px] text-white/50 leading-relaxed italic">
                    <i className="fas fa-info-circle mr-1"></i>
                    {t.disclaimer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
